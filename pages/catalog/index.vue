<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Меню</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="w-full flex flex-col rounded-xl bg-white overflow-hidden transition-all duration-500 shadow-md group hover:shadow-lg hover:-translate-y-2">
                <div class="relative">
                    <img src="/images/about/main.jpg" alt="" class="aspect-video object-cover w-full transition-all duration-500 group-hover:scale-110">
                    <p class="absolute top-2 left-2 bg-sky-500 text-white text-xs font-semibold py-1 px-4 rounded-full">Хит сезона</p>
                    <div class="absolute top-2 right-2 flex items-center gap-1 p-1 rounded-lg bg-gray-800">
                        <Icon class="text-lg text-white" name="material-symbols:book-2-rounded"/>
                        <p class="text-xs font-medium text-white">Вишнёвый сад</p>
                    </div>
                    <NuxtLink to="/" class="absolute bottom-2 right-2 text-white transition-all duration-500 hover:opacity-70">
                        <Icon class="text-3xl" name="material-symbols:eye-tracking-rounded"/>
                    </NuxtLink>
                </div>
                <div class="flex flex-col gap-4 p-4">
                  <div class="flex flex-col">
                    <p class="text-2xl font-mono font-semibold text-[#131313]/80">Вишнёвый латте</p>
                    <p class="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-md w-fit">Кофейные напитки</p>
                  </div>
                  <p class="line-clamp-2">Нежный латте с домашним вишнёвым сиропом, взбитым молоком и нотками миндаля. Подаётся с долькой тёмного шоколада.</p>
                  <div class="flex items-center gap-2">
                    <button class="px-4 py-1 text-xs border border-sky-300 rounded-full hover:bg-sky-50 transition-colors">250 мл</button>
                    <button class="px-4 py-1 text-xs bg-sky-100 text-sky-800 border border-sky-300 rounded-full font-medium">350 мл</button>
                    <button class="px-4 py-1 text-xs border border-sky-300 rounded-full hover:bg-sky-50 transition-colors">450 мл</button>
                  </div>
                  <div class="flex items-center justify-between">
                    <p class="text-sky-800 font-semibold text-xl font-mono">320 ₽</p>
                    <button class="cursor-pointer flex items-center gap-2 rounded-xl py-1.5 px-4 transition-all duration-500 bg-sky-600 hover:bg-sky-800 text-white">
                      <span>Добавить</span>
                    </button>
                  </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>