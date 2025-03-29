<template>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">О компании</p>
        <div class="flex items-center gap-6">
            <ul class="flex flex-col gap-4 list-inside list-disc w-full lg:w-1/2">
                <span class="text-2xl font-mono font-semibold text-[#131313]/80">Мы — не просто кофейня, а место для вдохновения, работы и отдыха. Здесь вы можете:</span>
                <li>Насладиться авторским кофе из свежеобжаренных зерен</li>
                <li>Выбрать книгу из нашей библиотеки с curated-подборкой</li>
                <li>Посетить литературные вечера и книжные клубы</li>
                <li>Комфортно поработать в тихой атмосфере</li>
            </ul>
            <img src="/images/about/main.jpg" alt="" class="rounded-xl w-full lg:w-1/2">
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Наша философия</p>
        <div class="flex flex-col gap-4">
            <div class="flex flex-col gap-2 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">☕ Кофе как искусство</p>
                <p>Мы тщательно отбираем зерна и готовим каждый напиток с вниманием к деталям</p>
            </div>
            <div class="flex flex-col gap-2 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">📚 Книги как часть культуры</p>
                <p>Наши полки — это не случайный набор, а продуманная коллекция для ценителей</p>
            </div>
            <div class="flex flex-col gap-2 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">💡 Пространство для идей</p>
                <p>Мы создаем атмосферу, где рождаются новые мысли и знакомства</p>
            </div>
            <div class="flex flex-col gap-2 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">🌿 Экологичный подход</p>
                <p>Используем перерабатываемую упаковку и поддерживаем локальных поставщиков</p>
            </div>
        </div>
    </div>
    <div class="flex gap-6 max-lg:flex-col">
            <div class="lg:w-1/3 flex flex-col gap-4">
                <p class="mainHeading">Контакты</p>
                <div class="flex flex-col gap-2">
                    <p class="text-base">Адрес</p>
                    <p class="text-2xl font-semibold font-mono text-[#131313]/70">улица Пушкина, дом 1</p>
                </div>
                <div>
                    <p class="text-base">Режим работы</p>
                    <p class="mt-2 text-2xl font-semibold font-mono text-[#131313]/70">Пн-Пт: с 9:00 до 21:00</p>
                    <p class="text-2xl font-semibold font-mono text-[#131313]/70">Cб-Вс: с 12:00 до 18:00</p>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-base">Email</p>
                    <NuxtLink to="mailto:bookcafe@mail.ru" class="text-2xl font-semibold font-mono text-[#131313]/70 transition-all duration-500 hover:text-sky-500">bookcafe@mail.ru</NuxtLink>
                </div>
                <div class="flex flex-col gap-2">
                    <p class="text-base">Телефон для связи</p>
                    <NuxtLink to="tel:8 800-555-35-35" class="text-2xl font-semibold font-mono text-[#131313]/70 transition-all duration-500 hover:text-sky-500">8 800-555-35-35</NuxtLink>
                </div>
                <div class="flex items-center gap-2">
                    <NuxtLink to="" target="_blank" class="transition-all duration-500 hover:text-sky-500">
                        <Icon class="text-3xl" name="mdi:vk"/>
                    </NuxtLink>
                    <NuxtLink to="" target="_blank" class="transition-all duration-500 hover:text-sky-500">
                        <Icon class="text-3xl" name="ic:baseline-telegram"/>
                    </NuxtLink>
                    <NuxtLink to="" target="_blank" class="transition-all duration-500 hover:text-sky-500">
                        <Icon class="text-3xl" name="basil:instagram-outline"/>
                    </NuxtLink>
                </div>
            </div>
            <iframe class="w-full h-[400px] lg:w-2/3 lg:h-full rounded-xl border border-gray-300 shadow-md" src="https://yandex.ru/map-widget/v1/?um=constructor%3Ab5b71122d59bf321fa1fb00171146b95ba02bcfc87108b9fa87ff29b94af771d&amp;source=constructor" frameborder="0"></iframe>
        </div>
</template>

<script setup>

</script>