<template>
    <Header/>
    <main class="grid-container gap-y-14 md:gap-y-20 xl:gap-y-28 grow my-10">
        <slot/>        
    </main>
   <!--  <Footer/> -->
</template>

<script setup>
// Предзагрузка в фоне — при переходах данные уже в памяти
onMounted(() => {
    useCatalogStore().fetchAll().catch(() => {})
    useNewsStore().fetchAll().catch(() => {})
})
</script>