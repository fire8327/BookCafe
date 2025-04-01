<template>
    <NuxtLink to="/admin" class="px-4 py-1.5 border border-sky-500 bg-sky-500 text-white rounded-full w-fit text-center transition-all duration-500 hover:text-sky-500 hover:bg-transparent">Вернуться назад</NuxtLink>   


    <FormKit @submit="updateProduct()" type="form" :actions="false" messages-class="hidden"
        form-class="flex flex-col gap-6 items-center justify-center">
        <p class="mainHeading w-full">Редактирование товара</p>

        <!-- Основные поля -->
        <FormKit v-model="product.name" validation="required" messages-class="text-[#E9556D] font-mono" type="text"
            placeholder="Наименование" outer-class="w-full md:w-2/3 lg:w-1/2"
            input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />

        <!-- Изображение -->
        <FormKit :validation="imageValidation" accept="image/*" @change="(e) => { file.image = e.target.files[0] }"
            messages-class="text-[#E9556D] font-mono" type="file"
            :validation-messages="{ required: 'Изображение обязательно' }" label="Изображение"
            outer-class="w-full md:w-2/3 lg:w-1/2"
            input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
        <div v-if="product.image"
            class="relative w-full md:w-2/3 lg:w-1/2 rounded-xl border border-white/15 overflow-hidden">
            <img :src="getImageUrl('products', product.image)">
            <button type="button" @click="product.image = ''" class="absolute top-2 right-2">
                <Icon class="text-3xl text-red-500" name="material-symbols:delete-forever" />
            </button>
        </div>

        <!-- Описание и категория -->
        <FormKit v-model="product.description" validation="required" messages-class="text-[#E9556D] font-mono"
            type="textarea" placeholder="Описание" outer-class="w-full md:w-2/3 lg:w-1/2"
            input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />

        <FormKit v-model="product.category" validation="required" messages-class="text-[#E9556D] font-mono" type="text"
            placeholder="Категория" outer-class="w-full md:w-2/3 lg:w-1/2"
            input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />

        <!-- Бестселлер -->
        <div class="flex items-center gap-2 w-full md:w-2/3 lg:w-1/2">
            <label class="flex items-center cursor-pointer gap-2">
                <input type="checkbox" class="sr-only peer" v-model="product.is_bestseller">
                <div
                    class="flex items-center p-1 border border-gray-400 rounded-full w-10 peer-checked:border-sky-500 peer-checked:[&>div]:translate-x-[18px] peer-checked:[&>div]:bg-sky-500">
                    <div class="w-3 h-3 rounded-full bg-gray-400 transition-all duration-500"></div>
                </div>
                <span class="text-xl font-semibold font-mono text-[#131313]/80">Является бестселлером</span>
            </label>
        </div>

        <!-- Цены и объемы -->
        <div class="flex gap-6 flex-col w-full md:w-2/3 lg:w-1/2 rounded-xl border p-4"
            v-for="(price, index) in product.prices" :key="index">
            <div class="flex items-center justify-between gap-4">
                <p>Объём и цена № {{ index + 1 }}</p>
                <button @click="removePrice(index)" type="button">
                    <Icon class="text-3xl text-red-500" name="material-symbols:delete-forever-rounded" />
                </button>
            </div>
            <FormKit :name="`Объём ${index}`" v-model="product.prices[index].volume" validation="required"
                messages-class="text-[#E9556D] font-mono" type="text" placeholder="Объём" outer-class="w-full"
                input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
            <FormKit :name="`Цена ${index}`" v-model="product.prices[index].price" validation="required|number"
                messages-class="text-[#E9556D] font-mono" type="text" placeholder="Цена" outer-class="w-full"
                input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
        </div>
        <button @click="addPrice()" type="button"
            class="px-4 py-2 border border-sky-500 hover:bg-sky-500 hover:text-white rounded-full w-fit text-center transition-all duration-500 text-sky-500 bg-transparent">
            Добавить объём
        </button>

        <!-- Книжная пара -->
        <div class="flex flex-col gap-6 p-4 rounded-xl border w-full md:w-2/3 lg:w-1/2">
            <p class="text-xl font-semibold font-mono text-[#131313]/80">Книжная пара</p>
            <FormKit v-model="product.book_pair.title" validation="required" messages-class="text-[#E9556D] font-mono"
                type="text" placeholder="Наименование пары" outer-class="w-full"
                input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
            <FormKit v-model="product.book_pair.description" validation="required"
                messages-class="text-[#E9556D] font-mono" type="textarea" placeholder="Описание пары"
                outer-class="w-full"
                input-class="focus:outline-none px-4 py-2 bg-white rounded-xl border border-transparent w-full transition-all duration-500 focus:border-sky-500 shadow-md" />
        </div>

        <button :disabled="isSubmitting"
            :class="isSubmitting ? 'opacity-50' : 'hover:text-sky-500 hover:bg-transparent'" type="submit"
            class="px-4 py-2 mt-10 border border-sky-500 bg-sky-500 text-white rounded-full w-fit text-center transition-all duration-500">
            <span v-if="!isSubmitting">Сохранить</span>
            <span v-else>Сохранение...</span>
        </button>
    </FormKit>
</template>

<script setup>
useSeoMeta({
    title: 'Редактирование товара',
    lang: 'ru'
})

const { showMessage } = useMessagesStore()
const supabase = useSupabaseClient()
const route = useRoute()

const loadProduct = async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', route.params.id)
            .single()

        if (error) throw error

        product.value = {
            ...data,
            prices: data.prices || [{ volume: "", price: "" }],
            book_pair: data.book_pair || { title: "", description: "" }
        }

    } catch (error) {
        console.error('Ошибка загрузки:', error)
        showMessage('Не удалось загрузить данные товара', false)
    }
}

const imageValidation = computed(() => {
    return !product.value.image ? 'required' : ''
})

const file = ref({ image: null })
const product = ref({
    id: '',
    name: '',
    description: '',
    category: '',
    book_pair: { title: '', description: '' },
    prices: [{ volume: '', price: '' }],
    is_bestseller: false,
    image: ''
})

const addPrice = () => {
    product.value.prices.push({ volume: "", price: "" })
}

const removePrice = (index) => {
    if (product.value.prices.length > 1) {
        product.value.prices.splice(index, 1)
    }
}

const isSubmitting = ref(false)

const getImageUrl = (folder, filename) => {
    const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(`${folder}/${filename}`)
    return publicUrl
}

const updateProduct = async () => {
    try {
        isSubmitting.value = true
        const updates = { ...product.value }

        // Обновление изображения
        if (file.value.image) {
            const extension = file.value.image.name.split('.').pop()
            const newFilename = `product_${Date.now()}.${extension}`

            // Удаляем старое изображение
            if (product.value.image) {
                await supabase.storage
                    .from('images')
                    .remove([`products/${product.value.image}`])
            }

            // Загружаем новое
            const { error: uploadError } = await supabase.storage
                .from('images')
                .upload(`products/${newFilename}`, file.value.image)

            if (uploadError) throw uploadError
            updates.image = newFilename
        }

        // Обновление данных
        const { error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', route.params.id)

        if (error) throw error

        showMessage('Товар успешно обновлен!', true)
        await loadProduct()

    } catch (error) {
        console.error('Ошибка обновления:', error)
        showMessage(error.message || 'Ошибка при обновлении товара', false)
    } finally {
        isSubmitting.value = false
    }
}

onMounted(() => {
    loadProduct()
})
</script>