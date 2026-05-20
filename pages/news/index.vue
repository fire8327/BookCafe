<template>
    <Loader v-if="showLoader"/>
    <div v-else class="flex flex-col gap-6">
        <p class="mainHeading">Новости</p>
        <p v-if="loadError" class="text-center text-red-500">Не удалось загрузить новости. Попробуйте обновить страницу.</p>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink
                v-for="newCard in newsList"
                :key="newCard.id"
                :to="`/news/new-${newCard.id}`"
                @mouseenter="newsStore.prefetchItem(newCard.id)"
                @focus="newsStore.prefetchItem(newCard.id)"
                class="flex flex-col gap-6 rounded-xl overflow-hidden shadow-md border border-gray-300 group"
            >
                <img src="/images/news/main.jpg" alt="" class="transition-all duration-500 group-hover:scale-110">
                <div class="flex flex-col gap-4 p-6 grow">
                    <span class="text-2xl font-mono font-semibold text-[#131313]/80">{{ newCard.title }}</span>
                    <span class="line-clamp-3 mt-auto">{{ newCard.description }}</span>
                    <span class="peer py-1.5 px-4 w-fit rounded-lg bg-sky-500 border border-sky-500 text-white transition-all duration-500 group-hover:text-sky-400 group-hover:bg-transparent">Читать Новость</span>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>
/* название и язык страницы */
useSeoMeta({
    title: 'Новости',
    lang: 'ru'
})


const newsStore = useNewsStore()
const { loading, hasCache, error: loadError } = storeToRefs(newsStore)

const newsList = computed(() => newsStore.allNews ?? [])

const showLoader = computed(() => loading.value && !hasCache.value)

onMounted(() => {
    newsStore.fetchAll().catch(() => {})
})
</script>
