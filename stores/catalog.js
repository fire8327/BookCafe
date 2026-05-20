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

    const invalidate = () => {
        allProducts.value = null
    }

    return {
        allProducts,
        loading,
        hasCache,
        fetchAll,
        filterBySearch,
        invalidate
    }
})
