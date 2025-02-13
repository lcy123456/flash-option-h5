<template>
  <div class="p-[24px] bg-bg-1">
    <h1 class="text-4xl font-bold underline">Hello, Tailwind CSS!</h1>
    <p class="text-text-success text-style-large-2-700">Hellxzzxzxsddsds</p>
    <div class="text-center">
      <van-button type="primary" @click="toggleTheme">切换主题</van-button>
    </div>
  </div>
</template>

<script setup>
const toggleTheme = () => {
  const htmlElem = document.querySelector("html");
  if (htmlElem.classList.contains("light")) {
    htmlElem.classList.remove("light");
    htmlElem.classList.add("dark");
  } else {
    htmlElem.classList.remove("dark");
    htmlElem.classList.add("light");
  }
};
</script>

<style scoped></style>
