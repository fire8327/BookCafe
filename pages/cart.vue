<template>
     <div class="flex max-lg:flex-col gap-10" v-if="carts && carts.length>0">
        <div class="flex flex-col gap-6 lg:w-1/2">
            <div class="flex items-center gap-4">
                <Icon class="text-3xl text-sky-500" name="material-symbols:coffee"/>
                <p class="mainHeading">Список товаров</p>
            </div>
            <div class="flex flex-col gap-8">
                <div class="flex flex-col gap-4 rounded-xl p-4 border border-gray-200 bg-white" v-for="cart in carts">
                    <p class="text-2xl font-mono font-semibold">{{ cart.products.name }}, {{ cart.volume }}</p>
                    <div class="text-2xl text-sky-500 font-semibold font-mono">{{ cart.price.toLocaleString() }} ₽</div>
                    <img :src="`https://sojfmnpdhftqapdircew.supabase.co/storage/v1/object/public/images/products/${cart.products.image}`" alt="Изображение товара" class="w-full rounded-xl aspect-[11/12] object-cover">
                    <div class="flex items-center gap-2 md:w-1/2">
                        <div class="flex items-center justify-center gap-4 h-full px-4 rounded-xl border border-sky-500 w-1/2">
                            <button :disabled="cart.count<2" @click="minusCard(cart.count, cart.id), cart.count--" :class="{'text-gray-300' : cart.count<2}" class="text-xl">-</button>
                            <p>{{ cart.count }}</p>
                            <button @click="plusCard(cart.count, cart.id), cart.count++" class="text-xl">+</button>
                        </div>  
                        <button @click="deleteProduct(cart.id, carts.indexOf(cart))" class="w-1/2 text-center py-0.5 px-4 rounded-full bg-sky-500 border border-sky-500 text-white transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Удалить</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex flex-col gap-6 lg:w-1/2">
            <div class="flex items-center gap-4">
                <Icon class="text-3xl text-sky-500" name="streamline:shopping-bag-hand-bag-2-shopping-bag-purse-goods-item-products"/>
                <p class="mainHeading">Ваш заказ</p>
            </div>
            <div class="flex flex-col gap-2 font-medium p-4 rounded-xl bg-white shadow-md">
                <p v-for="cart in carts">{{ cart.products.name }}</p>
                <p class="text-xl w-full font-semibold"><span class="font-mono">Итого: </span> {{ total.toLocaleString() }} ₽</p>
                <p v-if="discountPercent > 0" class="text-sm text-emerald-600">
                    Скидка {{ discountPercent }}%
                </p>
                <p class="text-xl w-full font-semibold" v-if="discountPercent > 0">
                    <span class="font-mono">К оплате:</span> {{ totalWithDiscount.toLocaleString() }} ₽
                </p>
            </div>
            <FormKit type="form" @submit="makeOrder" :actions="false" messages-class="hidden" form-class="flex flex-col gap-4 w-full items-center">
                <div class="flex items-start gap-2 w-full">
                    <FormKit type="text" validation="required|number" messages-class="text-[#E9556D] font-mono" name="Номер карты" outer-class="max-md:w-full md:w-2/4" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" placeholder="Номер карты"/>
                    <FormKit type="text" validation="required" messages-class="text-[#E9556D] font-mono" name="Срок действия" outer-class="max-md:w-full md:w-1/4" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" placeholder="YY/YY"/>
                    <FormKit type="text" validation="required|number" messages-class="text-[#E9556D] font-mono" name="CVC" outer-class="max-md:w-full md:w-1/4" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" placeholder="CVC"/>
                </div>
                <button type="submit" class="px-4 py-1.5 bg-sky-500 text-white rounded-full shrink-0 w-[160px] transition-all duration-500 hover:bg-sky-700">Оформить</button>
            </FormKit>
        </div>
    </div>
    <div v-else class="flex flex-col gap-6 p-4 rounded-xl bg-white shadow-md w-full h-fit self-center text-center items-center grow">
        <p class="mainHeading text-center">Ваша корзина пуста</p>
        <p class="tracking-widest max-w-xl font-mono">Кажется, вы еще не добавили товары в корзину. Не упустите шанс найти что-то особенное!</p>
        <NuxtLink to="/catalog" class="mx-auto px-4 py-2 border border-sky-500 text-sky-500 rounded-full w-[160px] text-center transition-all duration-500 hover:text-white hover:bg-sky-500">В каталог</NuxtLink>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Корзина',
    lang: 'ru'
})


/* проверка входа */
const { id } = storeToRefs(useUserStore())

/* скидка / статистика */
const statsStore = useStatsStore()
onMounted(() => {
    statsStore.fetchStatsByUserId(id.value)
})
const discountPercent = computed(() => statsStore.stats?.discount_percent ?? 0)


/* создание сообщений */
const { showMessage } = useMessagesStore()


/* подключение к БД */
const supabase = useSupabaseClient()     
const { data:cart, error:cartError } = await supabase
.from('cart')
.select(`*, products (*)`)
.eq('status', 'В корзине')
.eq('userId', id.value)

const carts = ref(cart)


/* управление количеством и суммой */  
const calculateTotal = () => {
    return carts.value.reduce((acc, { count, price }) => acc + count * price, 0)
}
const total = ref(calculateTotal())
const totalWithDiscount = computed(() => {
    const d = Number(discountPercent.value || 0)
    const t = Number(total.value || 0)
    return Math.max(0, Math.round(t * (1 - d / 100)))
})

const updateCount = async (newCount, id) => {
    const { data, error } = await supabase
    .from('cart')
    .update({ count: newCount })
    .eq('id', id)
    .select()

    if(error) {
        showMessage("Произошла ошибка!", false)             
    } else {
        total.value = calculateTotal()
        showMessage("Количество обновлено!", true)  
    }
}
const plusCard = async (count, id) => {
    count++
    await updateCount(count, id)
}
const minusCard = async (count, id) => {
    if (count > 1) {
        count--
        await updateCount(count, id)
    }
}


/* удаление товара */
const deleteProduct = async (idBase, idArray) => {
    const { error } = await supabase
    .from('cart')
    .delete()
    .eq('id', idBase)

    carts.value.splice(idArray, 1)

    if(error) {
        showMessage("Произошла ошибка!", false)             
    } else {
        showMessage("Удалено!", true)  
    }
}


/* оформление заказа и роутер */
const router = useRouter()
const makeOrder = async () => {
    // применяем скидку к цене позиции, чтобы сумма в истории была уже со скидкой
    if (discountPercent.value > 0) {
        for (const row of carts.value) {
            const newPrice = Math.round(Number(row.price) * (1 - discountPercent.value / 100))
            await supabase
            .from('cart')
            .update({ price: newPrice })
            .eq('id', row.id)
        }
    }

    const { data, error } = await supabase
    .from('cart')
    .update({ status: 'Оформлен' })
    .eq('status', 'В корзине')
    .eq('userId', id.value)
    .select() 

    if(error) {
        showMessage("Произошла ошибка!", false)             
    } else {
        showMessage("Заказ успешно оформлен!", true)  
        router.push("/")
    }     
} 
</script>