<script lang="ts" setup>
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
</script>

<template>
	<div>
		<img v-if="themeStore.theme === 'light'" src="/src/assets/logo.jpg"/>
		<img v-else src="/src/assets/logo.jpg" />
	</div>
</template>
<style scoped>
img{
	width: 120px !important;
}
</style>