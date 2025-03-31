<template>
    <div class="flex flex-col gap-6 grow justify-center">
        <div class="flex items-center justify-between">
            <NuxtLink to="/news" class="peer py-1.5 px-4 w-fit rounded-lg bg-sky-500 border border-sky-500 text-white transition-all duration-500 hover:text-sky-400 hover:bg-transparent">Назад</NuxtLink>
            <p><span class="text-[#131313]/80 font-mono font-semibold">{{ data[0].author }}</span>, {{ new Date (data[0].date).toLocaleDateString() }}</p>
        </div>
        <p class="mainHeading">{{ data[0].title }}</p>
        <p class="tracking-wide">{{ data[0].description }}</p>
    </div>
</template>

<script setup>

/* название и язык страницы */
useSeoMeta({
    title: 'Страница новости',
    lang: 'ru'
})


/* роут и получение данных */

const route = useRoute()
const supabase = useSupabaseClient()

const { data, error } = await supabase
.from('news')
.select("*")
.eq('id', route.params.id)

</script>