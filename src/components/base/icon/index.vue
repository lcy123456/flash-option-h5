<template>
	<svg class="base-icon cursor-pointer" aria-hidden="true" :style="{ fontSize: size + 'px' }">
		<use :class="fillClass" :xlink:href="symbolId" :fill="color" />
	</svg>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const props = defineProps({
	// 显示的 svg 图标名称（剔除 icon-）
	name: {
		type: String,
		required: true
	},
	darkName: {
		type: String,
		default: ''
	},
	// 直接指定 svg 图标的颜色
	color: {
		type: String
	},
	// 直接指定 svg 图标的大小
	size: {
		size: Number,
		default: 14
	},
	// 通过 tailwind 指定 svg 颜色的类名
	fillClass: {
		type: String
	}
})
// 真实显示的 svg 图标名（拼接 #icon-）
const symbolId = computed(() => {
	if (themeStore.theme === 'dark') {
		if (props.darkName) {
			return `#icon-${props.darkName}`
		}
	}
	return `#icon-${props.name}`
})
</script>

<style scoped>
.base-icon {
	width: 1em;
	height: 1em;
	vertical-align: middle;
	fill: currentColor;
	overflow: hidden;
}
</style>
