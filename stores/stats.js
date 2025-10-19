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

    // Функция для получения статистики всех пользователей для расчета максимальных значений
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
                
                // Группируем позиции по заказам
                const orderGroups = new Map()
                paidItems.forEach(item => {
                    const orderTime = new Date(item.created_at)
                    const orderKey = new Date(orderTime.getFullYear(), orderTime.getMonth(), orderTime.getDate(), orderTime.getHours(), orderTime.getMinutes())
                    
                    if (!orderGroups.has(orderKey.getTime())) {
                        orderGroups.set(orderKey.getTime(), [])
                    }
                    orderGroups.get(orderKey.getTime()).push(item)
                })

                const orders = Array.from(orderGroups.values())
                const totalSpent = paidItems.reduce((acc, row) => {
                    const price = Number(row?.price ?? 0)
                    const count = Number(row?.count ?? 0)
                    return acc + price * count
                }, 0)

                const lastOrderAt = orders.length ? orders[orders.length - 1][0].created_at : null
                const firstOrderAt = orders.length ? orders[0][0].created_at : null

                const monthsBetween = (start, end) => {
                    const s = new Date(start)
                    const e = new Date(end)
                    const years = e.getFullYear() - s.getFullYear()
                    const months = e.getMonth() - s.getMonth()
                    const total = years * 12 + months + (e.getDate() >= s.getDate() ? 0 : -1)
                    return Math.max(1, total)
                }

                const avgPurchasesPerMonth = orders.length === 0 || !firstOrderAt
                    ? 0
                    : Math.round((orders.length / monthsBetween(firstOrderAt, new Date())) * 100) / 100

                const daysSinceLastOrder = lastOrderAt 
                    ? Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
                    : 999 // Если нет заказов, считаем очень большим числом

                allStats.push({
                    totalSpent,
                    avgPurchasesPerMonth,
                    daysSinceLastOrder
                })
            }

            return allStats
        } catch (e) {
            console.error('Ошибка получения статистики всех пользователей:', e)
            return []
        }
    }

    const fetchStatsByUserId = async (userId) => {
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

            // Группируем позиции по заказам (по времени создания с точностью до минуты)
            const orderGroups = new Map()
            
            paidItems.forEach(item => {
                const orderTime = new Date(item.created_at)
                // Округляем до минуты для группировки заказов
                const orderKey = new Date(orderTime.getFullYear(), orderTime.getMonth(), orderTime.getDate(), orderTime.getHours(), orderTime.getMinutes())
                
                if (!orderGroups.has(orderKey.getTime())) {
                    orderGroups.set(orderKey.getTime(), [])
                }
                orderGroups.get(orderKey.getTime()).push(item)
            })

            const orders = Array.from(orderGroups.values())
            const ordersCount = orders.length

            const totalSpent = paidItems.reduce((acc, row) => {
                const price = Number(row?.price ?? 0)
                const count = Number(row?.count ?? 0)
                return acc + price * count
            }, 0)

            const lastOrderAt = orders.length
                ? orders[orders.length - 1][0].created_at
                : null

            const firstOrderAt = orders.length
                ? orders[0][0].created_at
                : null

            const monthsBetween = (start, end) => {
                const s = new Date(start)
                const e = new Date(end)
                const years = e.getFullYear() - s.getFullYear()
                const months = e.getMonth() - s.getMonth()
                const total = years * 12 + months + (e.getDate() >= s.getDate() ? 0 : -1)
                return Math.max(1, total)
            }

            const avgPurchasesPerMonth = ordersCount === 0 || !firstOrderAt
                ? 0
                : Math.round((ordersCount / monthsBetween(firstOrderAt, new Date())) * 100) / 100

            // Получаем статистику всех пользователей для расчета максимальных значений
            const allUsersStats = await getAllUsersStats()
            
            // Рассчитываем максимальные значения для нормализации
            const maxTotalSpent = Math.max(...allUsersStats.map(s => s.totalSpent), totalSpent)
            const maxAvgPurchasesPerMonth = Math.max(...allUsersStats.map(s => s.avgPurchasesPerMonth), avgPurchasesPerMonth)
            const maxDaysSinceLastOrder = Math.max(...allUsersStats.map(s => s.daysSinceLastOrder), 999)

            // Рассчитываем дни с последней покупки
            const daysSinceLastOrder = lastOrderAt 
                ? Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
                : 999

            // Нормализация параметров (от 0 до 1)
            const P1_norm = maxTotalSpent > 0 ? totalSpent / maxTotalSpent : 0
            const P2_norm = maxAvgPurchasesPerMonth > 0 ? avgPurchasesPerMonth / maxAvgPurchasesPerMonth : 0
            const P3_norm = maxDaysSinceLastOrder > 0 ? 1 - (daysSinceLastOrder / maxDaysSinceLastOrder) : 1

            // Веса параметров
            const w1 = 0.5 // Общая сумма покупок
            const w2 = 0.3 // Частота покупок
            const w3 = 0.2 // Свежесть клиента

            // Рассчитываем интегральный показатель лояльности (ИПЛ)
            const K = (w1 * P1_norm) + (w2 * P2_norm) + (w3 * P3_norm)

            // Определяем уровень и скидку на основе ИПЛ
            let discountPercent = 5 // Стандартный
            let clientLevel = 'Стандартный'
            
            if (K >= 0.6) {
                discountPercent = 15
                clientLevel = 'Золотой'
            } else if (K >= 0.3) {
                discountPercent = 10
                clientLevel = 'Серебряный'
            }

            const daysInService = userRow?.created_at
                ? Math.max(0, Math.floor((Date.now() - new Date(userRow.created_at).getTime()) / (1000 * 60 * 60 * 24)))
                : 0

            stats.value = {
                user_id: userId,
                total_spent: totalSpent,
                orders_count: ordersCount,
                last_order_at: lastOrderAt,
                avg_purchases_per_month: avgPurchasesPerMonth,
                discount_percent: discountPercent,
                client_level: clientLevel,
                days_in_service: daysInService,
                // Новые поля для ИПЛ
                loyalty_score: Math.round(K * 100) / 100, // ИПЛ округленный до 2 знаков
                days_since_last_order: daysSinceLastOrder,
                loyalty_parameters: {
                    total_spent_norm: Math.round(P1_norm * 100) / 100,
                    frequency_norm: Math.round(P2_norm * 100) / 100,
                    freshness_norm: Math.round(P3_norm * 100) / 100
                }
            }

            return stats.value
        } catch (e) {
            error.value = e?.message || 'Unknown error'
            return null
        } finally {
            loading.value = false
        }
    }

    return { stats, loading, error, reset, fetchStatsByUserId, getAllUsersStats }
})


