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
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Библиотека 📚</p>
                <p>Уютные залы с диванами и полками книг, которые можно читать бесплатно.</p>
            </div>
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Авторский кофе ☕️</p>
                <p>Эксклюзивные смеси от местных обжарщиков и сезонные напитки с литературными названиями.</p>
            </div>
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Ивенты 📖</p>
                <p>Еженедельные чтения, встречи с авторами и тематические вечера.</p>
            </div>
            <div
                class="flex flex-col gap-4 p-4 rounded-xl bg-white border border-gray-200 shadow-[0px_0px_20px_-15px_black]">
                <p class="text-2xl font-mono font-semibold text-[#131313]">Коворкинг 💻</p>
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
</template>

<script setup>
const images = [
  '/images/hero/main.jpg',
  '/images/hero/main.jpg',
  '/images/hero/main.jpg',
  '/images/hero/main.jpg'
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
</script>