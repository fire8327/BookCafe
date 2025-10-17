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

            // Новая логика скидки по уровням клиента
            let discountPercent = 5 // Стандартный
            let clientLevel = 'Стандартный'
            
            if (totalSpent >= 50001) {
                discountPercent = 15
                clientLevel = 'Золотой'
            } else if (totalSpent >= 20001) {
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
                days_in_service: daysInService
            }

            return stats.value
        } catch (e) {
            error.value = e?.message || 'Unknown error'
            return null
        } finally {
            loading.value = false
        }
    }

    return { stats, loading, error, reset, fetchStatsByUserId }
})


