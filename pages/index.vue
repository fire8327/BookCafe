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
        <p class="mainHeading">Как работает система лояльности</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="p-4 rounded-xl bg-blue-50 border border-blue-200">
                <h3 class="text-lg font-semibold text-blue-800 mb-2">💰 Сумма покупок (P1)</h3>
                <p class="text-sm text-blue-700 mb-2">Вес: 50%</p>
                <p class="text-sm text-gray-600">Общая сумма всех покупок пользователя, нормализованная относительно максимальной суммы среди всех клиентов</p>
            </div>
            <div class="p-4 rounded-xl bg-green-50 border border-green-200">
                <h3 class="text-lg font-semibold text-green-800 mb-2">📅 Частота покупок (P2)</h3>
                <p class="text-sm text-green-700 mb-2">Вес: 30%</p>
                <p class="text-sm text-gray-600">Среднее количество заказов в месяц. Заказы группируются по минутам оформления. Формула: количество_заказов ÷ месяцы_с_первой_покупки</p>
            </div>
            <div class="p-4 rounded-xl bg-purple-50 border border-purple-200">
                <h3 class="text-lg font-semibold text-purple-800 mb-2">⏰ Свежесть клиента (P3)</h3>
                <p class="text-sm text-purple-700 mb-2">Вес: 20%</p>
                <p class="text-sm text-gray-600">Время с последней покупки в днях. Чем меньше дней, тем лучше. Формула: 1 - (дни_с_последней_покупки ÷ максимум_среди_всех)</p>
            </div>
        </div>
        <div class="p-4 rounded-xl bg-yellow-50 border border-yellow-200">
            <h3 class="text-lg font-semibold text-yellow-800 mb-2">🎯 Интегральный показатель лояльности (ИПЛ)</h3>
            <p class="text-sm text-gray-600 mb-2">ИПЛ = (0.5 × P1) + (0.3 × P2) + (0.2 × P3)</p>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div><strong>Стандартный:</strong> ИПЛ < 0.3 → скидка 5%</div>
                <div><strong>Серебряный:</strong> 0.3 ≤ ИПЛ < 0.6 → скидка 10%</div>
                <div><strong>Золотой:</strong> ИПЛ ≥ 0.6 → скидка 15%</div>
            </div>
        </div>
    </div>
    <div class="flex flex-col gap-6">
        <p class="mainHeading">Проверка расчётов системы лояльности</p>
        <div class="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <div class="flex flex-col md:flex-row gap-4 items-start md:items-center mb-4">
                <label class="text-sm font-semibold text-gray-700">ID пользователя:</label>
                <input 
                    v-model="checkUserId" 
                    @input="loadUserCalculation"
                    type="number" 
                    placeholder="Введите ID пользователя"
                    class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-500 w-full md:w-48"
                >
                <button 
                    @click="loadUserCalculation"
                    :disabled="isLoadingCalculation"
                    class="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 disabled:opacity-50 transition-colors"
                >
                    {{ isLoadingCalculation ? 'Загрузка...' : 'Рассчитать' }}
                </button>
            </div>
            
            <div v-if="userCalculation" class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <!-- Базовые данные -->
                    <div class="p-3 rounded-lg bg-white border">
                        <h4 class="font-semibold text-gray-800 mb-2">📊 Базовые данные</h4>
                        <div class="space-y-1 text-sm">
                            <div><span class="font-medium">ID:</span> {{ userCalculation.user_id }}</div>
                            <div><span class="font-medium">Имя:</span> {{ userCalculation.name }}</div>
                            <div><span class="font-medium">Заказов:</span> {{ userCalculation.orders_count }}</div>
                            <div><span class="font-medium">Сумма покупок:</span> {{ userCalculation.total_spent.toLocaleString() }} ₽</div>
                            <div><span class="font-medium">Месяцев с первой покупки:</span> {{ userCalculation.months_between }}</div>
                            <div><span class="font-medium">Заказов в месяц:</span> {{ userCalculation.avg_purchases_per_month }}</div>
                            <div><span class="font-medium">Дней с последней покупки:</span> {{ userCalculation.days_since_last_order }}</div>
                        </div>
                    </div>

                    <!-- Максимумы для нормализации -->
                    <div class="p-3 rounded-lg bg-white border">
                        <h4 class="font-semibold text-gray-800 mb-2">📈 Максимумы среди всех клиентов</h4>
                        <div class="space-y-1 text-sm">
                            <div><span class="font-medium">Макс. сумма:</span> {{ userCalculation.max_total_spent.toLocaleString() }} ₽</div>
                            <div><span class="font-medium">Макс. частота:</span> {{ userCalculation.max_avg_per_month }}</div>
                            <div><span class="font-medium">Макс. дней без покупки:</span> {{ userCalculation.max_days_since_last }}</div>
                        </div>
                    </div>

                    <!-- Нормализованные параметры -->
                    <div class="p-3 rounded-lg bg-white border">
                        <h4 class="font-semibold text-gray-800 mb-2">🎯 Нормализованные параметры</h4>
                        <div class="space-y-1 text-sm">
                            <div><span class="font-medium">P1 (сумма):</span> {{ userCalculation.p1_norm }}</div>
                            <div><span class="font-medium">P2 (частота):</span> {{ userCalculation.p2_norm }}</div>
                            <div><span class="font-medium">P3 (свежесть):</span> {{ userCalculation.p3_norm }}</div>
                        </div>
                    </div>
                </div>

                <!-- Итоговый расчёт -->
                <div class="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
                    <h4 class="font-semibold text-yellow-800 mb-2">🧮 Итоговый расчёт ИПЛ</h4>
                    <div class="text-sm space-y-1">
                        <div><span class="font-medium">Формула:</span> K = (0.5 × P1) + (0.3 × P2) + (0.2 × P3)</div>
                        <div><span class="font-medium">Расчёт:</span> K = (0.5 × {{ userCalculation.p1_norm }}) + (0.3 × {{ userCalculation.p2_norm }}) + (0.2 × {{ userCalculation.p3_norm }})</div>
                        <div><span class="font-medium">ИПЛ (K):</span> <span class="font-bold text-lg">{{ userCalculation.k }}</span></div>
                        <div><span class="font-medium">Уровень:</span> <span class="font-bold text-lg" :class="getLevelColor(userCalculation.client_level)">{{ userCalculation.client_level }}</span></div>
                        <div><span class="font-medium">Скидка:</span> <span class="font-bold text-lg text-green-600">{{ userCalculation.discount_percent }}%</span></div>
                    </div>
                </div>
            </div>

            <div v-else-if="!isLoadingCalculation && checkUserId" class="text-center text-gray-500 py-4">
                Пользователь с ID {{ checkUserId }} не найден или у него нет заказов
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
const checkUserId = ref(1) /* 1 */
const userCalculation = ref(null) /* 2 */
const isLoadingCalculation = ref(false) /* 3 */

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
  loadUserCalculation() /* 4 */
})

/* 5 */
const getLevelColor = (level) => {
  switch(level) {
    case 'Золотой': return 'text-yellow-600'
    case 'Серебряный': return 'text-gray-600'
    case 'Стандартный': return 'text-blue-600'
    default: return 'text-gray-600'
  }
}

const loadUserCalculation = async () => {
  if (!checkUserId.value) {
    userCalculation.value = null
    return
  }

  isLoadingCalculation.value = true
  try {
    // Получаем данные пользователя
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('id, name, surname, patronymic')
      .eq('id', checkUserId.value)
      .single()

    if (userError || !user) {
      userCalculation.value = null
      return
    }

    // Получаем все оплаченные позиции пользователя
    const { data: cartRows, error: cartError } = await supabase
      .from('cart')
      .select('id, created_at, count, price, status')
      .eq('userId', checkUserId.value)
      .eq('status', 'Оформлен')
      .order('created_at', { ascending: true })

    if (cartError) {
      userCalculation.value = null
      return
    }

    const paidItems = Array.isArray(cartRows) ? cartRows : []
    
    if (paidItems.length === 0) {
      userCalculation.value = null
      return
    }

    // Группируем по минутам (заказы)
    const orderGroups = new Map()
    paidItems.forEach(item => {
      const t = new Date(item.created_at)
      const key = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes()).getTime()
      if (!orderGroups.has(key)) orderGroups.set(key, [])
      orderGroups.get(key).push(item)
    })

    const orders = Array.from(orderGroups.values())
    const ordersCount = orders.length
    const totalSpent = paidItems.reduce((acc, r) => acc + Number(r.price || 0) * Number(r.count || 0), 0)
    const lastOrderAt = orders.length ? orders[orders.length - 1][0].created_at : null
    const firstOrderAt = orders.length ? orders[0][0].created_at : null

    // Расчёт месяцев
    const monthsBetween = (start, end) => {
      const s = new Date(start)
      const e = new Date(end)
      const years = e.getFullYear() - s.getFullYear()
      const months = e.getMonth() - s.getMonth()
      const total = years * 12 + months + (e.getDate() >= s.getDate() ? 0 : -1)
      return Math.max(1, total)
    }

    const months_between = monthsBetween(firstOrderAt, new Date())
    const avgPurchasesPerMonth = ordersCount === 0 || !firstOrderAt
      ? 0
      : Math.round((ordersCount / months_between) * 100) / 100

    const daysSinceLastOrder = lastOrderAt 
      ? Math.floor((Date.now() - new Date(lastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
      : 0

    // Получаем максимумы среди всех пользователей
    const { data: allUsers, error: allUsersError } = await supabase
      .from('users')
      .select('id')
      .neq('role', 'admin')

    if (allUsersError) {
      userCalculation.value = null
      return
    }

    const allStats = []
    for (const u of allUsers) {
      const { data: userCartRows, error: userCartErr } = await supabase
        .from('cart')
        .select('id, created_at, count, price, status')
        .eq('userId', u.id)
        .eq('status', 'Оформлен')
        .order('created_at', { ascending: true })

      if (userCartErr) continue

      const userPaidItems = Array.isArray(userCartRows) ? userCartRows : []
      
      const userOrderGroups = new Map()
      userPaidItems.forEach(item => {
        const t = new Date(item.created_at)
        const key = new Date(t.getFullYear(), t.getMonth(), t.getDate(), t.getHours(), t.getMinutes()).getTime()
        if (!userOrderGroups.has(key)) userOrderGroups.set(key, [])
        userOrderGroups.get(key).push(item)
      })

      const userOrders = Array.from(userOrderGroups.values())
      const userTotalSpent = userPaidItems.reduce((acc, r) => acc + Number(r.price || 0) * Number(r.count || 0), 0)
      const userFirstOrderAt = userOrders.length ? userOrders[0][0].created_at : null
      const userLastOrderAt = userOrders.length ? userOrders[userOrders.length - 1][0].created_at : null

      const userMonthsBetween = userFirstOrderAt ? monthsBetween(userFirstOrderAt, new Date()) : 1
      const userAvgPurchasesPerMonth = userOrders.length === 0 || !userFirstOrderAt
        ? 0
        : Math.round((userOrders.length / userMonthsBetween) * 100) / 100

      const userDaysSinceLastOrder = userLastOrderAt 
        ? Math.floor((Date.now() - new Date(userLastOrderAt).getTime()) / (1000 * 60 * 60 * 24))
        : 0

      allStats.push({
        totalSpent: userTotalSpent,
        avgPurchasesPerMonth: userAvgPurchasesPerMonth,
        daysSinceLastOrder: userDaysSinceLastOrder
      })
    }

    // Максимумы (только среди пользователей с заказами)
    const maxTotalSpent = Math.max(1, ...allStats.map(s => s.totalSpent), totalSpent)
    const maxAvgPurchasesPerMonth = Math.max(1, ...allStats.map(s => s.avgPurchasesPerMonth), avgPurchasesPerMonth)
    const maxDaysSinceLastOrder = Math.max(1, ...allStats.filter(s => s.daysSinceLastOrder > 0).map(s => s.daysSinceLastOrder))

    // Нормализация
    const P1_norm = maxTotalSpent > 0 ? totalSpent / maxTotalSpent : 0
    const P2_norm = maxAvgPurchasesPerMonth > 0 ? avgPurchasesPerMonth / maxAvgPurchasesPerMonth : 0
    // P3: для пользователей без заказов (daysSinceLastOrder = 0) ставим максимальный балл (1.0)
    // для остальных: 1 - (дни_с_последней_покупки / максимум_среди_всех_с_заказами)
    const P3_norm = daysSinceLastOrder === 0 ? 1 : (maxDaysSinceLastOrder > 0 ? 1 - (daysSinceLastOrder / maxDaysSinceLastOrder) : 1)

    // ИПЛ
    const w1 = 0.5, w2 = 0.3, w3 = 0.2
    const K = (w1 * P1_norm) + (w2 * P2_norm) + (w3 * P3_norm)

    // Уровень
    let discountPercent = 5
    let clientLevel = 'Стандартный'
    if (K >= 0.6) { discountPercent = 15; clientLevel = 'Золотой' }
    else if (K >= 0.3) { discountPercent = 10; clientLevel = 'Серебряный' }

    userCalculation.value = {
      user_id: checkUserId.value,
      name: `${user.surname} ${user.name} ${user.patronymic}`.trim(),
      orders_count: ordersCount,
      total_spent: totalSpent,
      months_between: months_between,
      avg_purchases_per_month: avgPurchasesPerMonth,
      days_since_last_order: daysSinceLastOrder,
      max_total_spent: maxTotalSpent,
      max_avg_per_month: maxAvgPurchasesPerMonth,
      max_days_since_last: maxDaysSinceLastOrder,
      p1_norm: Math.round(P1_norm * 100) / 100,
      p2_norm: Math.round(P2_norm * 100) / 100,
      p3_norm: Math.round(P3_norm * 100) / 100,
      k: Math.round(K * 1000) / 1000,
      client_level: clientLevel,
      discount_percent: discountPercent
    }

  } catch (error) {
    console.error('Ошибка расчёта:', error)
    userCalculation.value = null
  } finally {
    isLoadingCalculation.value = false
  }
}
</script>