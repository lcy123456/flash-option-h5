<template>
	<div
		class="flex flex-col items-center w-[30px] h-[214px] rounded-tr-[6px] rounded-br-[6px] py-[8px] px-[4px] bg-background-primary"
		style="box-shadow: 0px 0px 8px 0px #0000001a">
		<img src="/imgs/flashoption/down.svg" class="w-[12px] h-[12px]" />
		<span class="mt-[4px] text-style-web-xsmall-medium text-text-primary">{{ sellPercent }}%</span>
		<div class="mt-[4px] w-[8px] h-[130px] rounded-[4px] overflow-hidden" id="progress-bar">
			<div class="sell w-[full] bg-function-sell" :style="{ height: `${sellPercent}%` }"></div>
			<div class="buy w-[full] bg-function-buy" :style="{ height: `${100 - sellPercent}%` }"></div>
		</div>
		<span class="mt-[4px] text-style-web-xsmall-medium text-text-primary">
			{{ 100 - sellPercent }}%
		</span>
		<img src="/imgs/flashoption/up.svg" class="w-[12px] h-[12px]" />
	</div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const props = defineProps({
	sellPercent: {
		type: Number,
		default: 50
	}
})

const sellHeightClass = computed(() => {
	console.log('计算高度 ：', props.sellPercent)
	return `h-[20%]`
})
const buyHeightClass = computed(() => {
	return `h-[${100 - 20}%]`
})
</script>
