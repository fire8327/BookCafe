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

    /* группировка позиций корзины по минутам для определения заказов */
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

    /* расчет основных показателей пользователя */
    const computeUserAggregates = (items) => {
        const orders = groupItemsByMinute(items)
        const ordersCount = orders.length
        const totalSpent = items.reduce((acc, r) => acc + Number(r.price || 0) * Number(r.count || 0), 0)
        const lastOrderAt = orders.length ? orders[orders.length - 1][0].created_at : null
        const firstOrderAt = orders.length ? orders[0][0].created_at : null
        
        /* P2: частота покупок - среднее число дней между покупками */
        let purchaseFrequency = 0
        if (orders.length > 1) {
            const dateDiffs = []
            for (let i = 1; i < orders.length; i++) {
                const prevDate = new Date(orders[i-1][0].created_at)
                const currDate = new Date(orders[i][0].created_at)
                const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24))
                dateDiffs.push(diffDays)
            }
            purchaseFrequency = dateDiffs.reduce((sum, diff) => sum + diff, 0) / dateDiffs.length
        }
        
        /* P3: свежесть - дни с последней покупки */
        const daysSinceLastOrder = lastOrderAt 
            ? Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
            : 0

        return { ordersCount, totalSpent, lastOrderAt, firstOrderAt, purchaseFrequency, daysSinceLastOrder }
    }

    /* расчет максимальных значений для нормализации по всем пользователям */
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
                    purchaseFrequency: agg.purchaseFrequency,
                    daysSinceLastOrder: agg.daysSinceLastOrder
                })
            }

            return allStats
        } catch (e) {
            console.error('Ошибка получения статистики всех пользователей:', e)
            return []
        }
    }

    /* расчет ИПЛ (K) с новой формулой P1, P2, P3 */
    const computeKAndLevel = (userStats) => {
        /* P1: сумма всех покупок пользователя */
        const P1 = userStats.totalSpent
        
        /* P2: частота - среднее число дней между покупками */
        const P2 = userStats.purchaseFrequency
        
        /* P3: свежесть - дни с последней покупки */
        const P3 = userStats.daysSinceLastOrder

        /* веса параметров: P1=50%, P2=30%, P3=20% */
            const w1 = 0.5, w2 = 0.3, w3 = 0.2
        /* расчет K напрямую с P1, P2, P3 без нормализации */
        const K = (w1 * P1) + (w2 * P2) + (w3 * P3)

        /* определение уровня и скидки по K */
            let discountPercent = 5
            let clientLevel = 'Стандартный'
            if (K >= 0.6) { discountPercent = 15; clientLevel = 'Золотой' }
            else if (K >= 0.3) { discountPercent = 10; clientLevel = 'Серебряный' }

        return {
            loyalty_score: Math.round(K * 100) / 100,
                discount_percent: discountPercent,
                client_level: clientLevel,
                loyalty_parameters: {
                total_spent: P1,
                frequency: P2,
                freshness: P3
            },
            raw_parameters: {
                total_spent: P1,
                purchase_frequency: P2,
                days_since_last_order: P3
            }
        }
    }

    /* расчет статистики пользователя для сохранения в БД */
    const calculateUserStats = async (userId) => {
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
            
            /* рассчитываем K, уровень и параметры напрямую с P1, P2, P3 */
            const loyaltyData = computeKAndLevel(agg)

            const daysInService = userRow?.created_at
                ? Math.max(0, Math.floor((Date.now() - new Date(userRow.created_at).getTime()) / (1000 * 60 * 60 * 24)))
                : 0

            return {
                user_id: userId,
                total_spent: agg.totalSpent,
                orders_count: agg.ordersCount,
                last_order_at: agg.lastOrderAt,
                purchase_frequency: agg.purchaseFrequency,
                discount_percent: loyaltyData.discount_percent,
                client_level: loyaltyData.client_level,
                days_in_service: daysInService,
                loyalty_score: loyaltyData.loyalty_score,
                days_since_last_order: agg.daysSinceLastOrder,
                loyalty_parameters: loyaltyData.loyalty_parameters,
                raw_parameters: loyaltyData.raw_parameters
            }
        } catch (e) {
            console.error('Ошибка расчета статистики пользователя:', e)
            return null
        }
    }

    /* сохранение статистики пользователя в БД */
    const saveUserStatsToDB = async (userId) => {
        try {
            const userStats = await calculateUserStats(userId)
            if (!userStats) return null

            const statsData = {
                user_id: userId,
                total_spent: userStats.total_spent,
                purchase_frequency: userStats.raw_parameters.purchase_frequency,
                freshness_days: userStats.raw_parameters.days_since_last_order,
                p1_display: userStats.loyalty_parameters.total_spent,
                p2_display: userStats.loyalty_parameters.frequency,
                p3_display: userStats.loyalty_parameters.freshness,
                loyalty_score: userStats.loyalty_score,
                client_level: userStats.client_level,
                discount_percent: userStats.discount_percent,
                orders_count: userStats.orders_count,
                last_order_date: userStats.last_order_at,
                days_in_service: userStats.days_in_service
            }

            const { data, error } = await supabase
                .from('stats')
                .upsert(statsData, { onConflict: 'user_id' })
                .select()

            if (error) throw error
            return data?.[0]
        } catch (e) {
            console.error('Ошибка сохранения статистики в БД:', e)
            return null
        }
    }

    /* получение статистики пользователя из БД */
    const getUserStatsFromDB = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('stats')
                .select('*')
                .eq('user_id', userId)
                .single()

            if (error && error.code !== 'PGRST116') throw error
            return data
        } catch (e) {
            console.error('Ошибка получения статистики из БД:', e)
            return null
        }
    }

    /* получение статистики всех пользователей из БД */
    const getAllUsersStatsFromDB = async () => {
        try {
            const { data, error } = await supabase
                .from('stats')
                .select('*')
                .order('loyalty_score', { ascending: false })

            if (error) throw error
            return data || []
        } catch (e) {
            console.error('Ошибка получения статистики всех пользователей из БД:', e)
            return []
        }
    }

    return { 
        stats, 
        loading, 
        error, 
        reset, 
        saveUserStatsToDB,
        getUserStatsFromDB,
        getAllUsersStatsFromDB
    }
})