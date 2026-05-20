const CATALOG_COLUMNS = 'id,name,description,category,image,is_bestseller,prices,book_pair'

export const normalizeCatalogProducts = (rows) => (rows ?? []).map((product) => {
    const prices = typeof product.prices === 'string' ? JSON.parse(product.prices) : product.prices
    return {
        ...product,
        prices,
        selectedVolume: prices[0]?.volume || '',
        selectedPrice: prices[0]?.price || 0
    }
})

export const useCatalogStore = defineStore('catalog', () => {
    const allProducts = ref(null)
    const loading = ref(false)
    let fetchPromise = null

    const hasCache = computed(() => Array.isArray(allProducts.value) && allProducts.value.length > 0)

    const fetchAll = async (force = false) => {
        if (!force && hasCache.value) {
            return allProducts.value
        }
        if (fetchPromise) {
            return fetchPromise
        }

        const supabase = useSupabaseClient()
        loading.value = true

        fetchPromise = (async () => {
            const { data, error } = await supabase
                .from('products')
                .select(CATALOG_COLUMNS)
                .order('id', { ascending: true })

            if (error) throw error
            allProducts.value = normalizeCatalogProducts(data)
            return allProducts.value
        })()

        try {
            return await fetchPromise
        } finally {
            loading.value = false
            fetchPromise = null
        }
    }

    const filterBySearch = (query) => {
        const list = allProducts.value ?? []
        const q = query?.trim().toLowerCase()
        if (!q) return list
        return list.filter((p) => p.name?.toLowerCase().includes(q))
    }

    const sameId = (a, b) => String(a) === String(b)

    const findById = (id) => (allProducts.value ?? []).find((p) => sameId(p.id, id)) ?? null

    const fetchOne = async (id) => {
        const supabase = useSupabaseClient()
        const { data, error } = await supabase
            .from('products')
            .select(CATALOG_COLUMNS)
            .eq('id', id)

        if (error) throw error
        const normalized = normalizeCatalogProducts(data)
        if (!normalized.length) return null

        const product = normalized[0]
        const list = allProducts.value ?? []
        const index = list.findIndex((p) => sameId(p.id, id))
        if (index === -1) {
            allProducts.value = [...list, product]
        } else {
            list[index] = product
        }
        return product
    }

    const ensureProduct = async (id) => {
        const cached = findById(id)
        if (cached) return cached

        await fetchAll()
        const fromList = findById(id)
        if (fromList) return fromList

        return fetchOne(id)
    }

    const getRecommendations = (excludeId, count = 4) => {
        const list = (allProducts.value ?? []).filter((p) => !sameId(p.id, excludeId))
        return [...list].sort(() => Math.random() - 0.5).slice(0, count)
    }

    const prefetchProduct = (id) => {
        if (findById(id)) return Promise.resolve(findById(id))
        return ensureProduct(id)
    }

    const invalidate = () => {
        allProducts.value = null
    }

    return {
        allProducts,
        loading,
        hasCache,
        fetchAll,
        filterBySearch,
        findById,
        ensureProduct,
        getRecommendations,
        prefetchProduct,
        invalidate
    }
})
