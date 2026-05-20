// Полный select: колонка date — зарезервированное слово в PostgREST, список полей ломал запрос
const NEWS_SELECT = '*'

export const useNewsStore = defineStore('news', () => {
    const allNews = ref(null)
    const loading = ref(false)
    const error = ref(null)
    let fetchPromise = null

    const hasCache = computed(() => Array.isArray(allNews.value) && allNews.value.length > 0)

    const fetchAll = async (force = false) => {
        if (!import.meta.client) {
            return allNews.value ?? []
        }

        if (!force && hasCache.value) {
            return allNews.value
        }
        if (fetchPromise) {
            return fetchPromise
        }

        const supabase = useSupabaseClient()
        loading.value = true
        error.value = null

        fetchPromise = (async () => {
            const { data, error: err } = await supabase
                .from('news')
                .select(NEWS_SELECT)
                .order('id', { ascending: false })

            if (err) {
                error.value = err
                console.error('[news] fetchAll:', err)
                return allNews.value ?? []
            }

            allNews.value = data ?? []
            return allNews.value
        })()

        try {
            return await fetchPromise
        } finally {
            loading.value = false
            fetchPromise = null
        }
    }

    const sameId = (a, b) => String(a) === String(b)

    const findById = (id) => (allNews.value ?? []).find((n) => sameId(n.id, id)) ?? null

    const getLatest = (count = 3) => (allNews.value ?? []).slice(0, count)

    const fetchOne = async (id) => {
        if (!import.meta.client) return null

        const supabase = useSupabaseClient()
        const { data, error: err } = await supabase
            .from('news')
            .select(NEWS_SELECT)
            .eq('id', id)

        if (err) {
            console.error('[news] fetchOne:', err)
            return null
        }
        if (!data?.length) return null

        const item = data[0]
        const list = [...(allNews.value ?? [])]
        const index = list.findIndex((n) => sameId(n.id, id))
        if (index === -1) {
            list.push(item)
            list.sort((a, b) => Number(b.id) - Number(a.id))
            allNews.value = list
        } else {
            list[index] = item
            allNews.value = list
        }
        return item
    }

    const ensureItem = async (id) => {
        const cached = findById(id)
        if (cached) return cached

        await fetchAll()
        const fromList = findById(id)
        if (fromList) return fromList

        return fetchOne(id)
    }

    const prefetchItem = (id) => {
        if (findById(id)) return Promise.resolve(findById(id))
        return ensureItem(id).catch((e) => {
            console.error('[news] prefetchItem:', e)
            return null
        })
    }

    const invalidate = () => {
        allNews.value = null
        error.value = null
    }

    return {
        allNews,
        loading,
        error,
        hasCache,
        fetchAll,
        getLatest,
        findById,
        ensureItem,
        prefetchItem,
        invalidate
    }
})
