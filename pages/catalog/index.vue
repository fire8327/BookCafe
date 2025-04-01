<template>
    <div class="flex flex-col gap-6 grow">
        <p class="mainHeading">Меню</p>
        <div v-if="isLoading" class="flex justify-center items-center grow">
            <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
        </div>
        <div class="w-full" v-else>
            <div v-if="searchQuery" class="mb-4">
                <p>Результаты поиска: <span class="font-semibold">"{{ searchQuery }}"</span></p>
                <button @click="clearSearchQuery" class="text-sky-600 hover:text-sky-800 text-sm mt-1">Сбросить поиск</button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" v-if="products">
                <div v-for="product in products"
                    class="w-full flex flex-col rounded-xl bg-white overflow-hidden transition-all duration-500 shadow-md group hover:shadow-lg hover:-translate-y-2">
                    <div class="relative">
                        <img :src="`https://hsstubxrevlevagsvktq.supabase.co/storage/v1/object/public/images/products/${product.image}`" alt=""
                            class="aspect-[3/4] object-cover w-full transition-all duration-500 group-hover:scale-105">
                        <p v-if="product.is_bestseller"
                            class="absolute top-2 left-2 bg-sky-500 text-white text-xs font-semibold py-1 px-4 rounded-full">
                            Хит сезона</p>
                        <div class="absolute top-2 right-2 flex items-center gap-1 p-1 rounded-lg bg-gray-800">
                            <Icon class="text-lg text-white" name="material-symbols:book-2-rounded" />
                            <p class="text-xs font-medium text-white">{{ product.book_pair.title }}</p>
                        </div>
                        <NuxtLink :to="`/catalog/product-${product.id}`"
                            class="absolute bottom-2 right-2 text-white transition-all duration-500 hover:opacity-70">
                            <Icon class="text-3xl" name="material-symbols:eye-tracking-rounded" />
                        </NuxtLink>
                    </div>
                    <div class="flex flex-col gap-4 p-4 grow">
                        <p class="text-xl font-mono font-semibold text-[#131313]/80">{{ product.name }}</p>
                        <p class="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-md w-fit mt-auto">{{ product.category }}</p>
                        <p class="line-clamp-2">{{ product.description }}</p>
                        <div class="flex items-center gap-2">
                            <button v-for="priceOption in product.prices" :key="priceOption.volume"
                                @click="changeVolume(product, priceOption.volume)"
                                class="px-4 py-1 text-xs border border-sky-300 rounded-full hover:bg-sky-50 transition-all duration-500"
                                :class="{
                                    'bg-sky-100 text-sky-800 font-medium': product.selectedVolume === priceOption.volume,
                                    'hover:bg-sky-50': product.selectedVolume !== priceOption.volume
                                }">{{ priceOption.volume }}</button>
                        </div>
                        <div class="flex flex-col gap-2">
                            <p class="text-sky-800 font-semibold text-xl font-mono">{{ product.selectedPrice.toLocaleString() }} ₽</p>
                            <button @click="addCart(product)" v-if="authenticated"
                                class="cursor-pointer flex items-center gap-2 rounded-xl py-1.5 px-4 transition-all duration-500 bg-sky-600 hover:bg-sky-800 text-white w-fit">
                                <Icon class="text-2xl" name="material-symbols:add" />
                                <span>Добавить</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div v-if="products.length === 0" class="text-center">
                <p v-if="searchQuery">Ничего не найдено по запросу "{{ searchQuery }}"</p>
                <p v-else>Товары отсутствуют</p>
            </div>
        </div>
    </div>
    
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Меню',
    lang: 'ru'
})


/* создание сообщений */
const { showMessage } = useMessagesStore()


/* подключение БД и храниилища */
const { searchQuery } = storeToRefs(useSearchStore())
const { clearSearchQuery } = useSearchStore()


const supabase = useSupabaseClient()

const products = ref([])
const isLoading = ref(false)

// загрузка товаров
const loadProducts = async () => {
    isLoading.value = true   

    let query = supabase.from('products').select('*').order('id', { ascending: true })

    if (searchQuery.value) {
      query = query.ilike('name', `%${searchQuery.value}%`)
    }

    const { data } = await query
    
    products.value = data.map(product => ({
        ...product,
        prices: typeof product.prices === 'string' ? JSON.parse(product.prices) : product.prices,
        selectedVolume: product.prices[0]?.volume || '',
        selectedPrice: product.prices[0]?.price || 0
    }))

    isLoading.value = false
}

// реакция на изменение поискового запроса
watch(searchQuery, () => {
  loadProducts()
})

// первоначальная загрузка
onMounted(() => {
  loadProducts()
})

// сброс поиска при уходе со страницы
onBeforeUnmount(clearSearchQuery)


/* изменение объема */
const changeVolume = (product, volume) => {
  const productIndex = products.value.findIndex(p => p.id === product.id)
  if (productIndex === -1) return
  
  const priceOption = products.value[productIndex].prices.find(opt => opt.volume === volume)
  if (!priceOption) return
  
  products.value[productIndex].selectedVolume = volume
  products.value[productIndex].selectedPrice = priceOption.price
}


/* добавление в корзину и проверка входа */
const { id, authenticated } = storeToRefs(useUserStore())
const addCart = async (product) => {
    const { data: carts } = await supabase
    .from('cart')
    .select(`*`)
    .eq('status', 'В корзине')
    .eq('userId', id.value)
    .eq('productId', product.id)
    .eq('volume', product.selectedVolume)

    if (carts && carts.length > 0) {
        await supabase
        .from('cart')
        .update({ count: `${Number(carts[0].count) + 1}` })
        .eq('id', carts[0].id)
        .select()

        showMessage("Количество обновлено!", true)
    } else {
        const { data, error } = await supabase
        .from('cart')
        .insert([
            { userId: id.value, productId: product.id, status: 'В корзине', count: 1, price: product.selectedPrice, volume: product.selectedVolume},
        ])
        .select()

        if (error) {
            showMessage("Произошла ошибка!", false)
        } else {
            showMessage("Добавлено в корзину!", true)
        }
    }
}
</script>