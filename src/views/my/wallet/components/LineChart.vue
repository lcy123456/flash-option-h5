<script setup lang="ts">
import { ref, onMounted, watch, shallowRef, PropType } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { toFixed } from '@/utils'
import { useWalletStore } from '@/store/modules/wallet'

const chartRef = ref<HTMLElement | null>(null)
const myChart = shallowRef()

const walletStore = useWalletStore()
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

const setOption = () => {
	if (!props.data.length) return

	const values = props.data.map((item: any) => item.asset)

	const height = myChart.value.getHeight() - 16.5
	const maxValue = Math.max(...values)
	const minValue = Math.min(...values)
	const processMaxMin = (max: number, min: number) => {
		if (max < 0 || min < 0) {
			return Math.abs(max) + Math.abs(min)
		} else {
			return max - min
		}
	}
	const section = processMaxMin(maxValue, minValue)
	const valuePx = height / section
	const max = maxValue + 30 / valuePx
	const min = minValue - 30 / valuePx
	const show = !(maxValue === 0 && minValue === 0)

	const option: EChartsOption = {
		grid: {
			top: 0,
			left: 1,
			right: 0,
			bottom: 20
		},
		xAxis: {
			type: 'category',
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
			// boundaryGap: false,
			data: props.data.map((item: any) => ({
				value: item.time
			}))
		},
		yAxis: {
			show: false,
			max: max,
			min: min,
			type: 'value'
		},
		visualMap: {
			type: 'piecewise',
			show: false,
			dimension: 1,
			seriesIndex: [0, 1],
			pieces: [
				{
					gte: 1,
					color: '#28AD76'
				},
				{
					lt: 0,
					color: 'red'
				}
			]
		},
		series: [
			{
				data: values,
				zlevel: 2,
				type: 'line',
				markLine: {
					symbol: 'none',
					silent: false,
					data: [
						{
							yAxis: 0, // 警戒线位置，这个赋值为纵轴50
							name: 'cordon',
							lineStyle: {
								cap: 'round',
								width: 1,
								type: 'solid',
								color: '#F4F5F7'
							}
						}
					]
				},
				markPoint: {
					symbolSize: 20,
					itemStyle: {
						color: 'rgba(0,0,0,0)'
					},
					data: [
						{
							type: 'max',
							name: 'Max',
							label: {
								fontSize: 12,
								show: show && !props.hideAsset,
								color: '#A4ACC1',
								position: 'insideRight',
								formatter: (params: any) => {
									return toFixed(params.value, 2) + walletStore.getCurrencyInfo().code
								}
							}
						},
						{
							type: 'min',
							name: 'Min',
							label: {
								offset: [0, 20],
								fontSize: 12,
								show: show && !props.hideAsset,
								color: '#A4ACC1',
								position: 'insideLeft',
								formatter: (params: any) => {
									return toFixed(params.value, 2) + walletStore.getCurrencyInfo().code
								}
							}
						}
					]
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
	<div ref="chartRef" class="h-[100%]"></div>
</template>
