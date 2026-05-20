<template>
    <Loader v-if="showLoader"/>
    <div v-else-if="newsItem" class="flex flex-col gap-6 grow justify-center">
        <div class="flex items-center justify-between">
            <NuxtLink to="/news" class="peer py-1.5 px-4 w-fit rounded-lg bg-sky-500 border border-sky-500 text-white transition-all duration-500 hover:text-sky-400 hover:bg-transparent">Назад</NuxtLink>
            <p><span class="text-[#131313]/80 font-mono font-semibold">{{ newsItem.author }}</span>, {{ new Date(newsItem.date).toLocaleDateString() }}</p>
        </div>
        <p class="mainHeading">{{ newsItem.title }}</p>
        <p class="tracking-wide">{{ newsItem.description }}</p>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Страница новости',
    lang: 'ru'
})


const route = useRoute()
const newsStore = useNewsStore()
const { loading } = storeToRefs(newsStore)

const newsId = computed(() => route.params.id)

const newsItem = computed(() => newsStore.findById(newsId.value))

const showLoader = computed(() => !newsItem.value && loading.value)

const loadNewsItem = () => newsStore.ensureItem(newsId.value).catch(() => {})

watch(newsId, loadNewsItem)

onMounted(loadNewsItem)
</script>
