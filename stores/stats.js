export const useStatsStore = defineStore('stats', () => {
    const supabase = useSupabaseClient()

    const stats = ref(null)
    const loading = ref(false)
    const error = ref(null)

    const reset = () => {
        stats.value = null
        error.value = null
        loading.value = false
    }

    // ===== Shared helpers (DRY) =====
    // monthsBetween — утилита для расчёта числа месяцев между датами (минимум 1)
    const monthsBetween = (start, end) => {
        const s = new Date(start)
        const e = new Date(end)
        const years = e.getFullYear() - s.getFullYear()
        const months = e.getMonth() - s.getMonth()
        const total = years * 12 + months + (e.getDate() >= s.getDate() ? 0 : -1)
        return Math.max(1, total)
    }

    // groupItemsByMinute — собирает позиции в «заказы» по минуте создания
    const groupItemsByMinute = (rows) => {
        const groups = new Map()
        rows.forEach(item => {
            const t = new Date(item.created_at)
            const key = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes()).getTime()
            if (!groups.has(key)) groups.set(key, [])
            groups.get(key).push(item)
        })
        return Array.from(groups.values())
    }

    // computeUserAggregates — считает базовые агрегаты по позициям пользователя
    const computeUserAggregates = (items) => {
        const orders = groupItemsByMinute(items)
        const ordersCount = orders.length
        const totalSpent = items.reduce((acc, r) => acc + Number(r.price || 0) * Number(r.count || 0), 0)
        const lastOrderAt = orders.length ? orders[orders.length - 1][0].created_at : null
        const firstOrderAt = orders.length ? orders[0][0].created_at : null
        const avgPurchasesPerMonth = ordersCount === 0 || !firstOrderAt
            ? 0
            : Math.round((ordersCount / monthsBetween(firstOrderAt, new Date())) * 100) / 100
        const daysSinceLastOrder = lastOrderAt 
            ? Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
            : 0

        return { ordersCount, totalSpent, lastOrderAt, firstOrderAt, avgPurchasesPerMonth, daysSinceLastOrder }
    }

    // computeKAndLevel — нормализация, расчёт K (ИПЛ), уровня и скидки
    const computeKAndLevel = ({
        totalSpent,
        avgPurchasesPerMonth,
        daysSinceLastOrder
    }, {
        maxTotalSpent,
        maxAvgPurchasesPerMonth,
        maxDaysSinceLastOrder
    }) => {
        const P1_norm = maxTotalSpent > 0 ? totalSpent / maxTotalSpent : 0
        const P2_norm = maxAvgPurchasesPerMonth > 0 ? avgPurchasesPerMonth / maxAvgPurchasesPerMonth : 0
        // P3: для пользователей без заказов (daysSinceLastOrder = 0) ставим максимальный балл (1.0)
        // для остальных: 1 - (дни_с_последней_покупки / максимум_среди_всех_с_заказами)
        const P3_norm = daysSinceLastOrder === 0 ? 1 : (maxDaysSinceLastOrder > 0 ? 1 - (daysSinceLastOrder / maxDaysSinceLastOrder) : 1)

        // Веса параметров (можно настроить)
        const w1 = 0.5, w2 = 0.3, w3 = 0.2
        const K = (w1 * P1_norm) + (w2 * P2_norm) + (w3 * P3_norm)

        let discountPercent = 5
        let clientLevel = 'Стандартный'
        if (K >= 0.6) { discountPercent = 15; clientLevel = 'Золотой' }
        else if (K >= 0.3) { discountPercent = 10; clientLevel = 'Серебряный' }

        return {
            loyalty_score: Math.round(K * 100) / 100,
            discount_percent: discountPercent,
            client_level: clientLevel,
            loyalty_parameters: {
                total_spent_norm: Math.round(P1_norm * 100) / 100,
                frequency_norm: Math.round(P2_norm * 100) / 100,
                freshness_norm: Math.round(P3_norm * 100) / 100
            }
        }
    }

    // Функция для получения базовой статистики по всем пользователям (медленный агрегатор)
    // Назначение: собрать агрегаты, чтобы вычислить глобальные максимумы для нормализации
    const getAllUsersStats = async () => {
        try {
            const { data: allUsers, error: usersErr } = await supabase
                .from('users')
                .select('id, created_at')
                .neq('role', 'admin')

            if (usersErr) throw usersErr

            const allStats = []
            
            for (const user of allUsers) {
                const { data: cartRows, error: cartErr } = await supabase
                    .from('cart')
                    .select('id, created_at, count, price, status')
                    .eq('userId', user.id)
                    .eq('status', 'Оформлен')
                    .order('created_at', { ascending: true })

                if (cartErr) continue

                const paidItems = Array.isArray(cartRows) ? cartRows : []

                const agg = computeUserAggregates(paidItems)
                allStats.push({
                    totalSpent: agg.totalSpent,
                    avgPurchasesPerMonth: agg.avgPurchasesPerMonth,
                    daysSinceLastOrder: agg.daysSinceLastOrder
                })
            }

            return allStats
        } catch (e) {
            console.error('Ошибка получения статистики всех пользователей:', e)
            return []
        }
    }

    // Быстрый расчёт статистики для набора пользователей одной выборкой
    // fetchStatsForUsersBulk(userIds):
    //   1) Одним запросом загружаем все оплаченные позиции для всех userIds
    //   2) Группируем по пользователю и по минуте (как «один заказ»)
    //   3) Считаем агрегаты, нормализуем, считаем ИПЛ и присваиваем уровень/скидку
    const fetchStatsForUsersBulk = async (userIds) => {
        if (!Array.isArray(userIds) || userIds.length === 0) return {}
        // Загружаем все оплаченные позиции сразу по списку пользователей
        const { data: cartRows, error: cartErr } = await supabase
            .from('cart')
            .select('id, userId, created_at, count, price, status')
            .in('userId', userIds)
            .eq('status', 'Оформлен')
            .order('created_at', { ascending: true })

        if (cartErr) throw cartErr

        // byUser — Map<userId, rows[]>: сгруппированные позиции по пользователю
        const byUser = new Map()
        for (const row of (cartRows || [])) {
            if (!byUser.has(row.userId)) byUser.set(row.userId, [])
            byUser.get(row.userId).push(row)
        }

        const perUser = {} // временное хранилище агрегатов по каждому пользователю
        const aggregates = [] // список агрегатов для вычисления максимумов нормализации

        // Счёт по каждому пользователю
        for (const [uid, items] of byUser.entries()) {
            const agg = computeUserAggregates(items)
            perUser[uid] = {
                totalSpent: agg.totalSpent,
                ordersCount: agg.ordersCount,
                lastOrderAt: agg.lastOrderAt,
                firstOrderAt: agg.firstOrderAt,
                avgPurchasesPerMonth: agg.avgPurchasesPerMonth,
                daysSinceLastOrder: agg.daysSinceLastOrder
            }

            aggregates.push({ totalSpent: agg.totalSpent, avgPurchasesPerMonth: agg.avgPurchasesPerMonth, daysSinceLastOrder: agg.daysSinceLastOrder })
        }

        // Нормализация: общие максимумы по набору пользователей
        const allUsersStats = await getAllUsersStats()
        const maxTotalSpent = Math.max(1, ...allUsersStats.map(s => s.totalSpent))
        const maxAvgPurchasesPerMonth = Math.max(1, ...allUsersStats.map(s => s.avgPurchasesPerMonth))
        const maxDaysSinceLastOrder = Math.max(1, ...allUsersStats.filter(s => s.daysSinceLastOrder > 0).map(s => s.daysSinceLastOrder))


        // Добавляем K (ИПЛ), уровень и скидку каждому пользователю
        const result = {}
        for (const uid of Object.keys(perUser)) {
            const u = perUser[uid]
            // Нормализованные параметры: сумма, частота, «свежесть» (меньше дней — лучше)
            const P1_norm = maxTotalSpent > 0 ? u.totalSpent / maxTotalSpent : 0
            const P2_norm = maxAvgPurchasesPerMonth > 0 ? u.avgPurchasesPerMonth / maxAvgPurchasesPerMonth : 0
            // P3: для пользователей без заказов (daysSinceLastOrder = 0) ставим максимальный балл (1.0)
            // для остальных: 1 - (дни_с_последней_покупки / максимум_среди_всех_с_заказами)
            const P3_norm = u.daysSinceLastOrder === 0 ? 1 : (maxDaysSinceLastOrder > 0 ? 1 - (u.daysSinceLastOrder / maxDaysSinceLastOrder) : 1)

            // Веса параметров (можно настроить): сумма 50%, частота 30%, свежесть 20%
            const w1 = 0.5, w2 = 0.3, w3 = 0.2
            // K — интегральный показатель лояльности (ИПЛ)
            const K = (w1 * P1_norm) + (w2 * P2_norm) + (w3 * P3_norm)

            let discountPercent = 5
            let clientLevel = 'Стандартный'
            // Пороговые значения уровней (можно настроить)
            if (K >= 0.6) { discountPercent = 15; clientLevel = 'Золотой' }
            else if (K >= 0.3) { discountPercent = 10; clientLevel = 'Серебряный' }

            result[uid] = {
                user_id: uid,
                total_spent: u.totalSpent,
                orders_count: u.ordersCount,
                last_order_at: u.lastOrderAt,
                avg_purchases_per_month: u.avgPurchasesPerMonth,
                discount_percent: discountPercent,
                client_level: clientLevel,
                // ИПЛ и параметры
                loyalty_score: Math.round(K * 100) / 100,
                days_since_last_order: u.daysSinceLastOrder,
                loyalty_parameters: {
                    total_spent_norm: Math.round(P1_norm * 100) / 100,
                    frequency_norm: Math.round(P2_norm * 100) / 100,
                    freshness_norm: Math.round(P3_norm * 100) / 100
                }
            }
        }

        return result
    }

    // fetchStatsByUserId(userId, precomputedMaxes) — расчёт статистики по одному пользователю
    // Если передать precomputedMaxes (maxTotalSpent, maxAvgPurchasesPerMonth, maxDaysSinceLastOrder),
    //   то функция НЕ будет сканировать всех пользователей повторно — применит переданные максимумы
    const fetchStatsByUserId = async (userId, precomputedMaxes) => {
        if (!userId) {
            error.value = 'userId is required'
            return null
        }

        loading.value = true
        error.value = null

        try {
            const { data: userRow, error: userErr } = await supabase
            .from('users')
            .select('id, created_at')
            .eq('id', userId)
            .maybeSingle()

            if (userErr) throw userErr

            const { data: cartRows, error: cartErr } = await supabase
            .from('cart')
            .select('id, created_at, count, price, status')
            .eq('userId', userId)
            .eq('status', 'Оформлен')
            .order('created_at', { ascending: true })

            if (cartErr) throw cartErr

            const paidItems = Array.isArray(cartRows) ? cartRows : []

            const agg = computeUserAggregates(paidItems)
            const ordersCount = agg.ordersCount
            const totalSpent = agg.totalSpent
            const lastOrderAt = agg.lastOrderAt
            const firstOrderAt = agg.firstOrderAt
            const avgPurchasesPerMonth = agg.avgPurchasesPerMonth

            // Получаем максимальные значения для нормализации
            let maxTotalSpent
            let maxAvgPurchasesPerMonth
            let maxDaysSinceLastOrder

            if (precomputedMaxes && typeof precomputedMaxes === 'object') {
                maxTotalSpent = Math.max(1, Number(precomputedMaxes.maxTotalSpent ?? totalSpent))
                maxAvgPurchasesPerMonth = Math.max(1, Number(precomputedMaxes.maxAvgPurchasesPerMonth ?? avgPurchasesPerMonth))
                maxDaysSinceLastOrder = Math.max(1, Number(precomputedMaxes.maxDaysSinceLastOrder ?? 1))
            } else {
                const allUsersStats = await getAllUsersStats()
                maxTotalSpent = Math.max(1, ...allUsersStats.map(s => s.totalSpent), totalSpent)
                maxAvgPurchasesPerMonth = Math.max(1, ...allUsersStats.map(s => s.avgPurchasesPerMonth), avgPurchasesPerMonth)
                // Максимум только среди пользователей с заказами (daysSinceLastOrder > 0)
                maxDaysSinceLastOrder = Math.max(1, ...allUsersStats.filter(s => s.daysSinceLastOrder > 0).map(s => s.daysSinceLastOrder))
            }

            // Рассчитываем дни с последней покупки
            const daysSinceLastOrder = lastOrderAt 
                ? Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
                : 0

            // Рассчитываем K, уровень и параметры (через общую функцию)
            const { loyalty_score, discount_percent, client_level, loyalty_parameters } = computeKAndLevel(
                { totalSpent, avgPurchasesPerMonth, daysSinceLastOrder },
                { maxTotalSpent, maxAvgPurchasesPerMonth, maxDaysSinceLastOrder }
            )

            const daysInService = userRow?.created_at
                ? Math.max(0, Math.floor((Date.now() - new Date(userRow.created_at).getTime()) / (1000 * 60 * 60 * 24)))
                : 0

            stats.value = {
                user_id: userId,
                total_spent: totalSpent,
                orders_count: ordersCount,
                last_order_at: lastOrderAt,
                avg_purchases_per_month: avgPurchasesPerMonth,
                discount_percent,
                client_level,
                days_in_service: daysInService,
                // ИПЛ и нормализованные параметры
                loyalty_score,
                days_since_last_order: daysSinceLastOrder,
                loyalty_parameters
            }

            return stats.value
        } catch (e) {
            error.value = e?.message || 'Unknown error'
            return null
        } finally {
            loading.value = false
        }
    }

    return { stats, loading, error, reset, fetchStatsByUserId, getAllUsersStats, fetchStatsForUsersBulk }
})


