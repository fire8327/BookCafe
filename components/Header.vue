<template>
    <header class="w-full grid-container py-4 font-medium text-xl">
        <div class="flex items-center justify-between w-full rounded-xl shadow-[0px_0px_20px_-13px_black] py-2 bg-white px-4 border border-gray-200">
            <NuxtLink to="/" class="flex items-center gap-2 transition-all duration-500 hover:opacity-70">
                <Icon class="text-3xl text-sky-500" name="material-symbols:book"/>
                <span class="font-semibold text-2xl font-mono text-[#131313]/80">BookCafe</span>
            </NuxtLink>
            <div class="flex items-center gap-6 max-lg:hidden">
                <form class="relative">
                    <input type="text" class="py-1.5 pl-4 pr-10 rounded-lg border border-gray-200 focus:outline-none">
                    <button class="cursor-pointer absolute top-1/2 -translate-y-1/2 right-2 flex">
                        <Icon class="text-3xl text-sky-500" name="material-symbols-light:search"/>
                    </button>
                </form>
                <NuxtLink to="/" class="flex flex-col after:w-0 after:h-px after:bg-sky-500 after:transition-all after:duration-500 hover:after:w-full">Меню</NuxtLink>
                <NuxtLink to="/about" class="flex flex-col after:w-0 after:h-px after:bg-sky-500 after:transition-all after:duration-500 hover:after:w-full">О нас</NuxtLink>
                <NuxtLink to="/news" class="flex flex-col after:w-0 after:h-px after:bg-sky-500 after:transition-all after:duration-500 hover:after:w-full">Новости</NuxtLink>
                <div class="flex items-center gap-2">
                    <NuxtLink to="/auth" class="transition-all duration-500 hover:opacity-70 flex">
                        <Icon class="text-3xl text-sky-500" name="material-symbols:person"/>
                    </NuxtLink>
                    <NuxtLink to="/" class="transition-all duration-500 hover:opacity-70 flex">
                        <Icon class="text-3xl text-sky-500" name="ic:baseline-shopping-basket"/>
                    </NuxtLink>
                </div>
            </div>
            <button class="cursor-pointer flex lg:hidden">
                <Icon class="text-3xl text-sky-500" name="ic:round-menu"/>
            </button>
        </div>
        <button type="button" @click="messageTitle = null" class="fixed top-10 right-10 z-[11] cursor-pointer flex items-center gap-2 px-6 py-2 text-lg rounded-xl w-fit font-medium font-mono bg-white border border-[#131313]/10 shadow-[0px_0px_13px_-7px_#131313]" :class="messageType ? ' text-[#131313]/80' : 'text-red-500'" v-if="messageTitle">
            <Icon class="text-3xl" name="material-symbols:close-small-rounded"/>
            <span>{{messageTitle}}</span>
        </button>
    </header>
</template>

<script setup>
/* создание сообщений */
const { messageTitle, messageType } = storeToRefs(useMessagesStore())
</script>