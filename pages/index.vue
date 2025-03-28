<template>
    <div class="relative w-full overflow-hidden rounded-xl">
        <img src="/images/hero/main.jpg" alt="" class="w-full h-full object-cover object-center">
        <div class="absolute inset-0 bg-black/30"></div>
        <div class="absolute inset-0 py-10 px-4 flex justify-center items-center text-center text-white">
            <div class="flex flex-col items-center relative gap-6 w-fit p-4 lg:p-6 max-w-2xl">
                <div class="absolute inset-0 backdrop-blur-md rounded-xl"></div>
                <p class="text-4xl font-mono font-semibold z-[1]">Книги. Кофе. Вдохновение.</p>
                <p class="opacity-70 text-lg tracking-wide z-[1]">
                    Уютное пространство, где страницы оживают вместе с ароматом свежего кофе.
                    Здесь можно провести время за любимой книгой, открыть для себя новые истории.
                </p>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Причины выбрать Book Café</p>
        <p>Здесь время течет иначе: минуты за книгой кажутся часами, а часы за кофе — мгновениями</p>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Библиотека 📚</p>
                <p>Уютные залы с диванами и полками книг, которые можно читать бесплатно.</p>
            </div>
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Авторский кофе ☕️</p>
                <p>Эксклюзивные смеси от местных обжарщиков и сезонные напитки с литературными названиями.</p>
            </div>
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Ивенты 📖</p>
                <p>Еженедельные чтения, встречи с авторами и тематические вечера.</p>
            </div>
            <div class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Коворкинг 💻</p>
                <p>Тихие уголки с розетками и быстрым Wi-Fi для продуктивной работы.</p>
            </div>
        </div>
    </div>
</template>

<script setup>

</script>