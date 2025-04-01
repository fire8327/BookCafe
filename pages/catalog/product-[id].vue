<template>
    <div class="flex flex-col gap-6 w-full" v-for="product in processedProducts">
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
                <p class="text-sky-800 font-semibold text-2xl font-mono">{{ product.selectedPrice }} ₽</p>
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
                <button class="cursor-pointer flex items-center gap-2 rounded-xl py-1.5 px-10 transition-all duration-500 bg-sky-600 hover:bg-sky-800 text-white w-fit">
                    <Icon class="text-2xl" name="material-symbols:add"/>
                    <span>В корзину</span>
                </button>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Рекомендуем также</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="flex flex-col rounded-xl overflow-hidden shadow-md" v-for="product in randomProducts">
                <img :src="`https://hsstubxrevlevagsvktq.supabase.co/storage/v1/object/public/images/products/${product.image}`" alt="" class="w-full aspect-[7/8] object-cover">
                <div class="flex flex-col gap-2 p-4">
                    <p class="font-semibold font-mono text-[#131313]/80">{{ product.name }}</p>
                    <p class="line-clamp-2 mt-auto">{{ product.description }}</p>
                    <div class="flex items-center justify-between">
                        <p class="text-sky-800 font-semibold text-xl font-mono">320 ₽</p>
                        <button class="cursor-pointer flex text-sky-800 transition-all duration-500 hover:opacity-50">
                            <Icon class="text-2xl" name="material-symbols:add"/>
                        </button>
                    </div>
                </div>
            </div>
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


/* подключение БД и роут */
const route = useRoute()
const supabase = useSupabaseClient()

const { data: products, error } = await supabase
.from('products')
.select("*")
.eq('id', route.params.id)


/* обрабатываем каждый продукт, добавляя реактивные свойства */
const processedProducts = ref(products.map(product => {
  // парсим prices (может быть строкой или массивом)
  const pricesArray = typeof product.prices === 'string' 
    ? JSON.parse(product.prices) 
    : product.prices;
  
  return {
    ...product,
    prices: pricesArray,
    selectedVolume: pricesArray[0]?.volume || '350 мл',
    selectedPrice: pricesArray[0]?.price || 0
  }
}))


/* функция изменения объёма для конкретного продукта */
const changeVolume = (product, volume) => {
  product.selectedVolume = volume
  const selectedOption = product.prices.find(item => item.volume === volume)
  product.selectedPrice = selectedOption?.price
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