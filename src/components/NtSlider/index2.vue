<template>
	<div class="slider-demo-block">
		<el-slider
			v-model="val"
			:step="25"
			show-stops
			:format-tooltip="formatTooltip"
			@change="handleChange" />
	</div>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'

const props = defineProps({
	modelValue: {
		type: Number,
		default: 0
	}
})
const emits = defineEmits(['update:modelValue', 'update:drag-start'])
const val = ref(0)

const formatTooltip = (val: number) => {
	return `${val}%`
}

const handleChange = (value: number) => {
	emits('update:modelValue', value / 100)
}

watch(
	() => val.value,
	(v: number) => {
		console.log('v:', v)
	}
)
</script>
<style lang="scss" scoped>
/* 修改滑块的颜色 */
::v-deep .el-slider__bar {
	background-color: var(--color-background-inverse-primary); /* 滑块已填充部分的颜色 */
}

::v-deep .el-slider__button {
	border-color: var(--color-background-inverse-primary); /* 滑块按钮的边框颜色 */
	box-shadow: 0 0 2px rgba(76, 175, 80, 0.5); /* 滑块按钮的阴影 */
}

::v-deep .el-slider__button:hover {
	border-color: var(--color-background-inverse-primary); /* 滑块按钮悬停时的边框颜色 */
}

::v-deep .el-slider__button:active {
	border-color: var(--color-background-inverse-primary); /* 滑块按钮激活时的边框颜色 */
}
</style>
