<template>
    <div class="flex flex-col gap-6 w-full" v-for="product in products">
        <div class="flex items-center text-sm gap-2 font-medium">
            <NuxtLink to="/catalog" class="transition-all duration-500 hover:text-sky-600">Меню</NuxtLink>
            <p>/</p>
            <p class="text-sky-800">{{ product.name }}</p>
        </div>
        <div class="flex max-lg:flex-col lg:items-start gap-8 w-full">
            <img :src="`https://hsstubxrevlevagsvktq.supabase.co/storage/v1/object/public/images/products/${product.image}`" alt="" class="w-full lg:w-1/2 aspect-[7/8] object-cover rounded-xl">
            <div class="flex flex-col gap-4 w-full lg:w-1/2">
                <div class="flex items-center justify-between gap-4">
                    <p class="mainHeading">{{ product.name }}</p>
                    <p v-if="product.is_bestseller" class="bg-sky-100 text-sky-800 text-sm px-4 py-1 rounded-full">Хит сезона</p>
                </div>
                <p class="text-sky-800 font-semibold text-2xl font-mono">{{ product.selectedPrice.toLocaleString() }} ₽</p>
                <div class="flex flex-col gap-2">
                    <p class="font-semibold text-2xl font-mono text-[#131313]/80">Описание</p>
                    <p>{{ product.description }}</p>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="font-semibold text-2xl font-mono text-[#131313]/80">Объём</p>
                    <div class="flex items-center gap-2">
                        <button v-for="priceOption in product.prices" :key="priceOption.volume"
                            @click="changeVolume(product, priceOption.volume)"
                            class="px-4 py-1 text-xs border border-sky-300 rounded-full hover:bg-sky-50 transition-all duration-500"
                            :class="{
                                'bg-sky-100 text-sky-800 font-medium': product.selectedVolume === priceOption.volume,
                                'hover:bg-sky-50': product.selectedVolume !== priceOption.volume
                            }">{{ priceOption.volume }}</button>
                    </div>
                </div>
                <div class="flex flex-col gap-2 p-4 bg-sky-50 border border-sky-200 rounded-lg">
                    <p class="font-semibold font-mono text-[#131313]/80">Книжная пара</p>
                    <p>{{ product.book_pair.description }}</p>   
                </div>
                <button v-if="authenticated && role === 'user'" @click="addCart(product)" class="cursor-pointer flex items-center gap-2 rounded-xl py-1.5 px-10 transition-all duration-500 bg-sky-600 hover:bg-sky-800 text-white w-fit">
                    <Icon class="text-2xl" name="material-symbols:add"/>
                    <span>В корзину</span>
                </button>
                <p v-else class="text-sm font-medium">*Пожалуйста, войдите в аккаунт для оформления заказа</p>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Рекомендуем также</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <NuxtLink :to="`/catalog/product-${product.id}`" class="flex flex-col rounded-xl overflow-hidden shadow-md transition-all duration-500 group hover:-translate-y-2" v-for="product in randomProducts">
                <img :src="`https://hsstubxrevlevagsvktq.supabase.co/storage/v1/object/public/images/products/${product.image}`" alt="" class="w-full aspect-[7/8] object-cover">
                <div class="flex flex-col gap-2 p-4 grow">
                    <span class="font-semibold font-mono text-[#131313]/80">{{ product.name }}</span>
                    <span class="line-clamp-2 mt-auto">{{ product.description }}</span>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Страница товара',
    lang: 'ru'
})


/* создание сообщений */
const { showMessage } = useMessagesStore()


/* подключение БД и роутер */
const route = useRoute()
const supabase = useSupabaseClient()

const products = ref([])

// загрузка товаров
const loadProducts = async () => {
  const { data } = await supabase.from('products').select('*').eq('id', route.params.id)
  
  products.value = data.map(product => ({
    ...product,
    prices: typeof product.prices === 'string' ? JSON.parse(product.prices) : product.prices,
    selectedVolume: product.prices[0]?.volume || '',
    selectedPrice: product.prices[0]?.price || 0
  }))
}

onMounted(() => {
  loadProducts()
})

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
const { id, authenticated, role } = storeToRefs(useUserStore())
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


/* рекомендации */
const { data: allProducts, error:randomProductsError } = await supabase
.from('products')
.select('*')
.neq('id', route.params.id)

// Перемешиваем массив на клиенте
const randomProducts = [...allProducts]
.sort(() => Math.random() - 0.5)
.slice(0, 4);
</script>