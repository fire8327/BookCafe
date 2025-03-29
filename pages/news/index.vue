<template>
   <div class="flex flex-col gap-6">
        <p class="mainHeading">Новости</p>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <NuxtLink to="/" class="flex flex-col gap-6 rounded-xl overflow-hidden shadow-md border border-gray-300 group">
                <img src="/images/hero/main.jpg" alt="" class="transition-all duration-500 group-hover:scale-110">
                <div class="flex flex-col gap-4 p-6">
                    <span class="text-2xl font-mono font-semibold text-[#131313]/80">Новость 1</span>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores eum animi, saepe odit distinctio minus excepturi nulla eius aliquam rem cumque blanditiis, pariatur consequatur numquam. Amet enim tenetur possimus dolorum?</span>
                    <span class="peer py-1.5 px-4 w-fit rounded-lg bg-sky-500 border border-sky-500 text-white transition-all duration-500 group-hover:text-sky-400 group-hover:bg-transparent">Читать Новость</span>
                </div>
            </NuxtLink>
            <NuxtLink to="/" class="flex flex-col gap-6 rounded-xl overflow-hidden shadow-md border border-gray-300 group">
                <img src="/images/hero/main.jpg" alt="" class="transition-all duration-500 group-hover:scale-110">
                <div class="flex flex-col gap-4 p-6">
                    <span class="text-2xl font-mono font-semibold text-[#131313]/80">Новость 2</span>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores eum animi, saepe odit distinctio minus excepturi nulla eius aliquam rem cumque blanditiis, pariatur consequatur numquam. Amet enim tenetur possimus dolorum?</span>
                    <span class="peer py-1.5 px-4 w-fit rounded-lg bg-sky-500 border border-sky-500 text-white transition-all duration-500 group-hover:text-sky-400 group-hover:bg-transparent">Читать Новость</span>
                </div>
            </NuxtLink>
            <NuxtLink to="/" class="flex flex-col gap-6 rounded-xl overflow-hidden shadow-md border border-gray-300 group">
                <img src="/images/hero/main.jpg" alt="" class="transition-all duration-500 group-hover:scale-110">
                <div class="flex flex-col gap-4 p-6">
                    <span class="text-2xl font-mono font-semibold text-[#131313]/80">Новость 3</span>
                    <span>Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores eum animi, saepe odit distinctio minus excepturi nulla eius aliquam rem cumque blanditiis, pariatur consequatur numquam. Amet enim tenetur possimus dolorum?</span>
                    <span class="peer py-1.5 px-4 w-fit rounded-lg bg-sky-500 border border-sky-500 text-white transition-all duration-500 group-hover:text-sky-400 group-hover:bg-transparent">Читать Новость</span>
                </div>
            </NuxtLink>
        </div>
    </div>
</template>

<script setup>

</script>