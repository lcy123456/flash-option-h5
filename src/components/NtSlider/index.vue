<template>
	<div class="mx-auto w-[96%]" id="counm">
		<el-slider
			class="w-full"
			v-model="modelValue"
			:min="0"
			:marks="brandWidthMarks"
			:show-stops="false"
			@input="handleINput"
			:format-tooltip="randWidthFormatterTooltip"></el-slider>
	</div>
</template>
<script setup lang="ts">
import { ref, onMounted, computed,watch } from 'vue'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
import { useVModel } from '@vueuse/core'
const props = defineProps({
	modelValue: {
		type: [Number, String],
		default: 0
	},
	data: {
		type: Array<any>,
		default: () => []
	},
	showLabels: {
		type: Boolean,
		default: false
	},
	min: {
		type: Number,
		default: 0
	}
})
const brandWidthMarks = computed(() => {
	const info = {} as any
	props.data &&
		props.data.forEach((item) => {
			info[item.id] = item.id + ''
		})
	return info
})
const randWidthFormatterTooltip = (value) => {
	// 滑动快hover时上方显示文字
	return `${value}%`
}

const emits = defineEmits(['update:modelValue', 'select', 'update:show'])
const modelValue = useVModel(props, 'modelValue', emits)

const selectDiv = ref()
const handleINput = () => {
	const finDIV = selectDiv.value || document.querySelectorAll('#counm .el-slider__stop ')
	Object.entries(brandWidthMarks.value).forEach(([key], index) => {
		const className = themeStore.theme === 'light' ? 'slider-full' : 'slider-dark-full'
		if (key <= Number(modelValue.value)) {
		
			finDIV[index].classList.add(className)
		} else {
			finDIV[index].classList.remove(className)
		}
	})
}

watch(
	() => modelValue.value,
	() => {
		handleINput()
	}
)
onMounted(() => {
	setTimeout(() => {
		selectDiv.value = document.querySelectorAll('#counm .el-slider__stop ')
	})
})
</script>
<style lang="scss" scoped>
::v-deep .el-slider__runway {
	background-color: var(--color-background-tertiary);
	height: 4px;
}
::v-deep .el-slider__marks-stop {
	background: var(--color-background-tertiary);
	border: 4px solid white;
	height: 12px;
	width: 12px;
	top: -2px;
}
::v-deep .slider-full {
	background: white !important;
	background: var(--color-background-tertiary);
	border: 2px solid var(--color-background-inverse-primary);
	height: 10px;
	width: 10px;
}
::v-deep .slider-dark-full {
	background: white !important;
	background: var(--color-background-tertiary);
	border: 2px solid var(--color-border-gutter);
	height: 10px;
	width: 10px;
}

::v-deep .el-slider__bar {
	background-color: var(--color-background-inverse-primary);
	height: 4px;
}
::v-deep .el-slider__button {
	background: url(/imgs/common/slider.svg) no-repeat;
	height: 16px;
	width: 16px;
	background-size: 100% 100%;
	border: none;
}
::v-deep .el-slider__marks {
	display: none;
}
</style>
