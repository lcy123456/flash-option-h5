<script setup lang="ts">
import { ref, onMounted, watch, shallowRef, PropType, computed } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'

const chartRef = ref<HTMLElement | null>(null)
const myChart = shallowRef()

const props = defineProps({
	data: {
		type: Array,
		default: () => []
	},
	hideAsset: {
		type: Boolean as PropType<boolean>,
		default: false
	}
})

onMounted(() => {
	initChart()
})

watch(
	() => [props.data, props.hideAsset],
	() => {
		setOption()
	},
	{
		deep: true
	}
)
const max_min = computed(() => {
	const obj = {
		max: 0,
		min: 0
	}
	const values = props.data.map((item: any) => Number(item.todayProfit))
	if (values.length) {
		obj.max = Math.max(...values)
		obj.min = Math.min(...values)
	}
	return obj
})

const setOption = () => {
	if (!props.data.length) return

	const values = props.data.map((item: any) => Number(item.todayProfit))

	const option: EChartsOption = {
		grid: {
			top: 0,
			left: 0,
			right: 0,
			bottom: 0
		},
		xAxis: {
			type: 'category',
			show: false,
			axisTick: {
				show: false
			},
			axisLine: {
				show: false
			},
			axisLabel: {
				color: '#B9C3DF'
				// interval: 1
			},
			boundaryGap: false,
			data: values
		},
		yAxis: {
			show: false,
			// max: max,
			// min: min,
			type: 'value'
		},
		series: [
			{
				data: values,
				zlevel: 2,
				type: 'line',
				lineStyle: {
					color: '#2ebd85'
				},
				areaStyle: {
					color: new echarts.graphic.LinearGradient(
						0,
						0,
						0,
						1, // 控制渐变方向
						[
							{ offset: 0, color: 'rgba(0,176,118,.2)' },
							{ offset: 1, color: 'rgba(0,176,118,0.01)' }
						]
					)
				},
				symbol: 'none'
			}
		]
	}

	option && myChart.value.setOption(option)
}

const initChart = () => {
	myChart.value = echarts.init(chartRef.value, null, { renderer: 'svg' })
	setOption()
}
</script>

<template>
	<div class="w-[120px] h-full relative">
		<div class="absolute top-[-6px] right-[100%] text-text-tips text-style-web-xxsmall-regular">
			{{ max_min.max }}%
		</div>
		<div
			ref="chartRef"
			class="w-[100%] relative h-[100%] border-t border-b border-dashed border-border-strong"></div>
		<div class="absolute bottom-[-6px] right-[100%] text-text-tips text-style-web-xxsmall-regular">
			{{ max_min.min }}%
		</div>
	</div>
</template>
