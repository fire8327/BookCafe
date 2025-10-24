<template>
    <!-- Компонент расчета ИПЛ для пользователя с id = 1 -->
    <div class="flex flex-col gap-6 mb-8">
        <p class="mainHeading">Расчет ИПЛ (Интегрального Показателя Лояльности)</p>
        <div v-if="isLoadingStats" class="flex justify-center items-center min-h-[200px]">
            <div class="text-center">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-500 mx-auto mb-4"></div>
                <p class="text-gray-600">Загрузка данных пользователя...</p>
            </div>
        </div>
        <div v-else-if="userStats" class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
            <div class="flex items-center gap-3 mb-6">
                <div class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    ID: 1
                </div>
                <div>
                    <h3 class="text-xl font-semibold text-gray-800">Пользователь #1</h3>
                    <p class="text-gray-600">Детальный расчет ИПЛ</p>
                </div>
            </div>
            
            <!-- Основные показатели P1, P2, P3 -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">💰</span>
                        <span class="font-semibold text-gray-800">P1: Сумма покупок</span>
                    </div>
                    <p class="text-2xl font-bold text-green-600">{{ Number(userStats.total_spent || 0).toLocaleString() }} ₽</p>
                    <p class="text-sm text-gray-600 mt-1">Общая сумма всех покупок пользователя</p>
                </div>
                
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">📅</span>
                        <span class="font-semibold text-gray-800">P2: Частота покупок</span>
                    </div>
                    <p class="text-2xl font-bold text-blue-600">{{ Math.round(userStats.purchase_frequency || 0) }} дней</p>
                    <p class="text-sm text-gray-600 mt-1">Среднее количество дней между покупками</p>
                </div>
                
                <div class="bg-white rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-2">
                        <span class="text-2xl">⏰</span>
                        <span class="font-semibold text-gray-800">P3: Свежесть</span>
                    </div>
                    <p class="text-2xl font-bold text-purple-600">{{ userStats.freshness_days || 0 }} дней</p>
                    <p class="text-sm text-gray-600 mt-1">Дней с последней покупки</p>
                </div>
            </div>
            
            <!-- Расчет ИПЛ -->
            <div class="bg-white rounded-lg p-6 border border-gray-200">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="text-2xl">🧮</span>
                    Расчет ИПЛ (K)
                </h4>
                
                <div class="space-y-3">
                    <div class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span class="font-medium">Формула:</span>
                        <span class="font-mono text-sm">K = w1 × P1 + w2 × P2 + w3 × P3</span>
                    </div>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div class="p-3 bg-green-50 rounded-lg border border-green-200">
                            <div class="text-sm text-gray-600">w1 × P1</div>
                            <div class="font-mono text-lg font-bold text-green-600">
                                0.5 × {{ Number(userStats.total_spent || 0).toLocaleString() }} = {{ (0.5 * (userStats.total_spent || 0)).toLocaleString() }}
                            </div>
                            <div class="text-xs text-gray-500">50% от суммы покупок</div>
                        </div>
                        
                        <div class="p-3 bg-blue-50 rounded-lg border border-blue-200">
                            <div class="text-sm text-gray-600">w2 × P2</div>
                            <div class="font-mono text-lg font-bold text-blue-600">
                                0.3 × {{ Math.round(userStats.purchase_frequency || 0) }} = {{ (0.3 * (userStats.purchase_frequency || 0)).toFixed(1) }}
                            </div>
                            <div class="text-xs text-gray-500">30% от частоты покупок</div>
                        </div>
                        
                        <div class="p-3 bg-purple-50 rounded-lg border border-purple-200">
                            <div class="text-sm text-gray-600">w3 × P3</div>
                            <div class="font-mono text-lg font-bold text-purple-600">
                                0.2 × {{ userStats.freshness_days || 0 }} = {{ (0.2 * (userStats.freshness_days || 0)).toFixed(1) }}
                            </div>
                            <div class="text-xs text-gray-500">20% от свежести</div>
                        </div>
                    </div>
                    
                    <div class="p-4 bg-gradient-to-r from-sky-50 to-blue-50 rounded-lg border border-sky-200">
                        <div class="flex items-center justify-between">
                            <span class="font-semibold text-gray-800">Итоговый ИПЛ (K):</span>
                            <span class="text-2xl font-bold text-sky-600">{{ userStats.loyalty_score || 0 }}</span>
                        </div>
                        <div class="text-sm text-gray-600 mt-1">
                            = {{ (0.5 * (userStats.total_spent || 0)).toLocaleString() }} + {{ (0.3 * (userStats.purchase_frequency || 0)).toFixed(1) }} + {{ (0.2 * (userStats.freshness_days || 0)).toFixed(1) }}
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Результат -->
            <div class="mt-6 bg-white rounded-lg p-6 border border-gray-200">
                <h4 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span class="text-2xl">🏆</span>
                    Результат
                </h4>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                        <div class="text-sm text-gray-600 mb-1">Уровень клиента</div>
                        <div class="text-xl font-bold" :class="getLevelColor(userStats.client_level)">
                            {{ userStats.client_level || 'Стандартный' }}
                        </div>
                    </div>
                    
                    <div class="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                        <div class="text-sm text-gray-600 mb-1">Скидка</div>
                        <div class="text-xl font-bold text-green-600">
                            {{ userStats.discount_percent || 5 }}%
                        </div>
                    </div>
                </div>
                
                <div class="mt-4 p-3 bg-gray-50 rounded-lg">
                    <div class="text-sm text-gray-600 mb-2">Пороговые значения уровней:</div>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs">
                        <div class="flex justify-between">
                            <span>Стандартный:</span>
                            <span class="font-mono">K < 0.3</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Серебряный:</span>
                            <span class="font-mono">0.3 ≤ K < 0.6</span>
                        </div>
                        <div class="flex justify-between">
                            <span>Золотой:</span>
                            <span class="font-mono">K ≥ 0.6</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="text-center py-8 text-gray-600">
            <p>Данные пользователя не найдены</p>
        </div>
    </div>
    
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

/* логика для расчета ИПЛ пользователя с id = 1 */
const statsStore = useStatsStore()
const userStats = ref(null)
const isLoadingStats = ref(true)

const loadUserStats = async () => {
    try {
        isLoadingStats.value = true
        // Загружаем статистику пользователя с id = 1 из БД
        const stats = await statsStore.getUserStatsFromDB(1)
        if (stats) {
            userStats.value = stats
        } else {
            // Если статистики нет в БД, рассчитываем и сохраняем
            await statsStore.saveUserStatsToDB(1)
            const newStats = await statsStore.getUserStatsFromDB(1)
            userStats.value = newStats
        }
    } catch (e) {
        console.error('Ошибка загрузки статистики пользователя:', e)
    } finally {
        isLoadingStats.value = false
    }
}

/* функция для определения цвета уровня клиента */
const getLevelColor = (level) => {
    switch (level) {
        case 'Золотой':
            return 'text-yellow-600'
        case 'Серебряный':
            return 'text-gray-600'
        default:
            return 'text-blue-600'
    }
}

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
  loadUserStats()
})
</script>