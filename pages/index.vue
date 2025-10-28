<template>    
    <div class="relative w-full overflow-hidden rounded-xl">
        <img src="/images/hero/main.jpg" alt="" class="w-full h-full object-cover object-center max-md:aspect-[7/11]">
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
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">Библиотека 📚</p>
                <p>Уютные залы с диванами и полками книг, которые можно читать бесплатно.</p>
            </div>
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">Авторский кофе ☕️</p>
                <p>Эксклюзивные смеси от местных обжарщиков и сезонные напитки с литературными названиями.</p>
            </div>
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">Ивенты 📖</p>
                <p>Еженедельные чтения, встречи с авторами и тематические вечера.</p>
            </div>
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-300 shadow-md transition-all duration-500 hover:-translate-y-2">
                <p class="text-2xl font-mono font-semibold text-[#131313]/80">Коворкинг 💻</p>
                <p>Тихие уголки с розетками и быстрым Wi-Fi для продуктивной работы.</p>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Пространство, где хочется остаться</p>
        <div ref="container" class="flex w-full overflow-hidden group gap-4 lg:h-96 max-lg:flex-col max-lg:h-80">
            <div v-for="(image, index) in images" :key="index" :ref="el => { if (el) items[index] = el }"
                class="w-full lg:w-1/4 transition-all duration-500 lg:group-hover:w-[15%] lg:hover:!w-[50%] max-lg:h-40 rounded-xl overflow-hidden"
                :class="{ '!h-[500px]': activeIndex === index }" @click="handleClick(index)">
                <img :src="image" class="w-full h-full object-cover">
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Команда Book Café</p>
        <p>Мы не просто подаём кофе — мы создаём место, где рождаются идеи, а книги обретают новых друзей</p>
        <div class="flex flex-col gap-6">
            <div class="flex max-md:flex-col items-center gap-6">
                <img src="/images/team/1.jpg" alt="" class="object-cover object-top aspect-square w-full md:w-1/2 rounded-xl">
                <div class="flex flex-col gap-4 w-full md:w-1/2">
                    <p class="text-2xl font-mono font-semibold text-[#131313]/80">Анна — Основатель и Главный Бариста</p>
                    <p>10 лет в кофейной индустрии, автор уникальных рецептов и ценитель классической литературы.</p>
                    <div class="p-2 border-l-4 border-sky-400 bg-sky-50">
                        <p class="italic font-semibold text-[#131313]/80">
                            "Кофе — это искусство, а книги — вдохновение"
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex max-md:flex-col items-center gap-6">
                <img src="/images/team/2.jpg" alt="" class="object-cover object-top aspect-square w-full md:w-1/2 md:order-last rounded-xl">
                <div class="flex flex-col gap-4 w-full md:w-1/2">
                    <p class="text-2xl font-mono font-semibold text-[#131313]/80">Максим — Шеф-Кондитер</p>
                    <p>Создаёт тематические сладости по мотивам книг. Обожает Булгакова и кулинарные эксперименты.</p>
                    <div class="p-2 border-l-4 border-sky-400 bg-sky-50">
                        <p class="italic font-semibold text-[#131313]/80">
                            "Десерты должны быть такими же увлекательными, как хороший роман"
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex max-md:flex-col items-center gap-6">
                <img src="/images/team/3.jpg" alt="" class="object-cover object-top aspect-square w-full md:w-1/2 rounded-xl">
                <div class="flex flex-col gap-4 w-full md:w-1/2">
                    <p class="text-2xl font-mono font-semibold text-[#131313]/80">Иван — Литературный Куратор</p>
                    <p>Филолог, организатор книжных клубов и мастер-классов. Знает всё о современных авторах.</p>
                    <div class="p-2 border-l-4 border-sky-400 bg-sky-50">
                        <p class="italic font-semibold text-[#131313]/80">
                            "Каждая книга на нашей полке проходит строгий отбор"
                        </p>
                    </div>
                </div>
            </div>
            <div class="flex max-md:flex-col items-center gap-6">
                <img src="/images/team/4.jpg" alt="" class="object-cover object-top aspect-square w-full md:w-1/2 md:order-last rounded-xl">
                <div class="flex flex-col gap-4 w-full md:w-1/2">
                    <p class="text-2xl font-mono font-semibold text-[#131313]/80">Мария — Менеджер Мероприятий</p>
                    <p>Организует встречи с писателями, поэтические вечера и детские чтения.</p>
                    <div class="p-2 border-l-4 border-sky-400 bg-sky-50">
                        <p class="italic font-semibold text-[#131313]/80">
                            "Кофе + книги + люди = магия"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Последние новости</p>
        <div v-if="isLoadingNews" class="flex justify-center items-center min-h-[300px]">
            <Loader />
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink v-for="newCard in news" :to="`/news/new-${newCard.id}`" class="flex flex-col gap-6 rounded-xl overflow-hidden shadow-md border border-gray-300 group">
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
    title: 'Главная',
    lang: 'ru'
})


/* логика для блока галереи */
const images = [
  '/images/gallery/1.jpeg',
  '/images/gallery/2.jpeg',
  '/images/gallery/3.jpeg',
  '/images/gallery/4.jpeg'
]

const items = ref([])
const activeIndex = ref(null)
const container = ref(null)

const handleClick = (index) => {
  if (window.innerWidth >= 1024) return // Не обрабатываем клики на десктопе
  
  if (activeIndex.value === index) {
    // Если кликаем на уже активный элемент - закрываем
    activeIndex.value = null
  } else {
    // Иначе открываем новый
    activeIndex.value = index
    
    // Прокручиваем контейнер к активному элементу
    nextTick(() => {
      items.value[index]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
      })
    })
  }
}

// Закрываем при клике вне области
const onClickOutside = (event) => {
  if (window.innerWidth >= 1024) return
  
  if (container.value && !container.value.contains(event.target)) {
    activeIndex.value = null
  }
}

onMounted(() => {
  window.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onClickOutside)
})


/* подключение БД и вывод данных */
const supabase = useSupabaseClient()

const news = ref([])
const isLoadingNews = ref(true)

const loadNews = async () => {
  try {
    const { data, error } = await supabase
    .from('news')
    .select("*")
    .order('id', {ascending: false})
    .limit(3)
    
    if (error) throw error
    news.value = data || []
  } finally {
    isLoadingNews.value = false
  }
}

onMounted(() => {
  loadNews()
})
</script>