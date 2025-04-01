<template>
    <!-- Добавление нового товара -->
    <FormKit @submit="addProduct()" type="form" :actions="false" messages-class="hidden" form-class="flex flex-col gap-6 items-center justify-center">
        <p class="mainHeading w-full">Добавление нового товара</p>
        <FormKit v-model="productsForm.name" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Наименование" name="Наименование" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        <FormKit validation="required" accept="image/*" @change="(e) => {mainImg = e.target.files[0]; console.log('Выбрано main:', mainImg);}" messages-class="text-[#E9556D] font-mono" type="file" :validation-messages="{required: 'Изображение обязательно'}" label="Изображение" name="mainImg" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        <FormKit v-model="productsForm.description" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Описание" name="Описание" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        <FormKit v-model="productsForm.category" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Категория" name="Категория" outer-class="w-full md:w-2/3 lg:w-1/2" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        <div class="flex items-center gap-2 w-full md:w-2/3 lg:w-1/2">
            <label class="flex items-center cursor-pointer gap-2">
                <input type="checkbox" class="sr-only peer" v-model="productsForm.is_bestseller"> 
                <div class="flex items-center p-1 border border-gray-400 rounded-full w-10 peer-checked:border-sky-500 peer-checked:[&>div]:translate-x-[18px] peer-checked:[&>div]:bg-sky-500">
                    <div class="w-3 h-3 rounded-full bg-gray-400 transition-all duration-500 "></div>
                </div>                
                <span class="text-xl font-semibold font-mono text-[#131313]/80">Является бестселлером</span>
            </label>
        </div>
        <div class="flex gap-6 flex-col w-full md:w-2/3 lg:w-1/2 rounded-xl border p-4" v-for="(price, index) in productsForm.prices" :key="index">
            <div class="flex items-center justify-between gap-4">
                <p>Объём и цена № {{ index+1 }}</p>
                <button @click="removePrice(index)" type="button">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-forever-rounded"/>
                </button>
            </div>
            <FormKit :name="`Объём  ${index+1}`" v-model="productsForm.prices[index].volume" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Объём" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <FormKit :name="`Цена ${index+1}`" v-model="productsForm.prices[index].price" validation="required|number" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Цена" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        </div>
        <button @click="addPrice()" type="button" class="px-4 py-2 border border-sky-500 hover:bg-sky-500 hover:text-white rounded-full w-fit text-center transition-all duration-500 text-sky-500 bg-transparent">Добавить объём</button>
        <div class="flex flex-col gap-6 p-4 rounded-xl border w-full md:w-2/3 lg:w-1/2">
            <p class="text-xl font-semibold font-mono text-[#131313]/80">Книжная пара</p>
            <FormKit v-model="productsForm.book_pair.title" validation="required" messages-class="text-[#E9556D] font-mono" type="text" placeholder="Наименование пары" name="Наименование пары" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
            <FormKit v-model="productsForm.book_pair.description" validation="required" messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Описание пары" name="Описание пары" outer-class="w-full" input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md"/>
        </div>
        <button :disabled="isSubmitting" :class="isSubmitting ? 'opacity-50' : 'hover:text-sky-500 hover:bg-transparent'" type="submit" class="px-4 py-2 mt-10 border border-sky-500 bg-sky-500 text-white rounded-full w-fit text-center transition-all duration-500">
            <span v-if="!isSubmitting">Добавить товар</span>
            <span v-else>Добавление...</span>
        </button>
    </FormKit>

     <!-- Редактирование товаров -->
     <div class="flex flex-col gap-6">
        <p class="mainHeading">Редактирование товаров</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="flex flex-col bg-white rounded-xl overflow-hidden shadow-md p-4 transition-all duration-500 hover:-translate-y-4 text-lg" v-for="product in products">
                <div class="flex items-center gap-4 self-end">
                    <NuxtLink :to="`/admin/edit-${product.id}`">
                        <Icon class="text-3xl text-amber-500" name="material-symbols:edit-outline" />
                    </NuxtLink>
                    <button :disables="isDeleting" :class="{isDeleting : 'opacity-50'}" @click="deleteProduct(product.id)" class="transition-all duration-500">
                        <Icon class="text-3xl text-red-500" name="material-symbols:delete-forever"/>
                    </button>
                </div>
                <p><span class="font-semibold font-mono text-[#131313]/80">ID:</span> {{ product.id }}</p>            
                <p><span class="font-semibold font-mono text-[#131313]/80">Товар:</span> {{ product.name }}</p>            
            </div>            
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Админ панель',
    lang: 'ru'
})


/* создание сообщений и роутера */
const { showMessage } = useMessagesStore()


/* подключение БД и получение услуг */
const supabase = useSupabaseClient()

const products = ref([])
const productsNames = ref([])
const loadProducts = async () => {
    try {
        const { data, error } = await supabase
        .from('products')
        .select('*')   
        .order('id', { ascending: true })

        if (error) throw error
        
        products.value = data // Загрузка данных
        productsNames.value = [...products.value.map(product => product.name)] // Наименования услуг

    } catch (error) {
        console.error('Ошибка загрузки:', error)
        showMessage('Не удалось загрузить данные', false)
    }
}


/* инициализация */
onMounted(() => {
    loadProducts()
})


/* создание формы услуги */
const productsForm = ref({
    name: "",
    description: "",
    category: "",
    book_pair: {
        title: "",
        description: ""
    },
    prices: ref([{
        volume: "",
        price: ""
    }]),
    is_bestseller: false,
    image: ""
}) 

//изображения
const mainImg = ref(null)


/* изменение объёма */
const addPrice = () => {
    productsForm.value.prices.push({ volume: "", price: "" })
}

const removePrice = (index) => {
    if (productsForm.value.prices.length > 1) {
        productsForm.value.prices.splice(index, 1)
    }
}


/* добавление данных */
// реактивная переменная для отслеживания состояния отправки
const isSubmitting = ref(false)

// функция очистки формы
const resetForm = () => {
    productsForm.value = {
        name: "",
        description: "",
        category: "",
        book_pair: {
            title: "",
            description: ""
        },
        prices: [{
            volume: "",
            price: ""
        }],
        is_bestseller: false,
        image: ""
    }
    mainImg.value = null
}

// функция отправки
const addProduct = async () => {
    try {
        isSubmitting.value = true
        
        // 1. Сначала загружаем изображение, если оно есть
        let imageName = null
        if (mainImg.value) {
            const extension = mainImg.value.name.split('.').pop()
            imageName = `${Date.now()}_main_${Math.random()
            .toString(36)
            .substring(2, 7)}.${extension}`

            const { error } = await supabase.storage
            .from('images')
            .upload(`products/${imageName}`, mainImg.value)

            if (error) throw error
            
            // Сохраняем имя файла в форме
            productsForm.value.image = imageName
        }

        // 2. Вставка данных в таблицу
        const { data, error } = await supabase
        .from('products') // предположительно таблица называется products
        .insert(productsForm.value)
        .select()

        if (error) throw error

        showMessage("Товар добавлен!", true)
        await loadProducts() // предположительно у вас есть такая функция
        resetForm()

    } catch (error) {
        console.error("Ошибка:", error)
        showMessage(error.message || "Ошибка при сохранении", false)
    } finally {
        isSubmitting.value = false
    }
}


/* удаление товара */
const isDeleting = ref(false)
const deleteProduct = async (productId) => {
    try {
        isDeleting.value = true

        // 1. Получаем данные товара
        const { data: productData, error: fetchError } = await supabase
            .from('products')
            .select('image')
            .eq('id', productId)
            .single()

        if (fetchError) throw fetchError

        // 2. Удаляем изображение (если есть)
        if (productData.image) {
            const { error: storageError } = await supabase.storage
                .from('images')
                .remove([`products/${productData.image}`])

            if (storageError) throw storageError
            console.log('Удален файл:', `products/${productData.image}`)
        }

        // 3. Удаляем запись из БД
        const { error: deleteError } = await supabase
            .from('products')
            .delete()
            .eq('id', productId)

        if (deleteError) throw deleteError

        // 4. Обновляем список
        await loadProducts()
        showMessage('Товар удален!', true)

    } catch (error) {
        console.error('Ошибка:', error)
        showMessage(`Ошибка удаления: ${error.message}`, false)
    } finally {
        isDeleting.value = false
    }
}
</script>