<script setup lang="ts">
import { shallowRef, onMounted, watch } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useI18n } from 'vue-i18n'
import { isMobile } from '@/utils'

const chartDom = shallowRef()
const chartDom2 = shallowRef()
const myChart = shallowRef()
const { t } = useI18n()

const props = defineProps({
	data: {
		type: Array,
		default: () => []
	}
})

onMounted(() => {
	initChart()
})

watch(
	() => props.data,
	() => {
		setOption()
	}
)

const initChart = () => {
	myChart.value = echarts.init(isMobile() ? chartDom.value : chartDom2.value, null, {
		renderer: 'svg'
	})
	setOption()
}

const setOption = () => {
	if (!(props.data && props.data.length)) return

	const values = props.data.map((item: any) => item.value)
	const names = props.data.map((item: any) => item.name)

	const height = myChart.value.getHeight() - 15
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
	const max = Math.ceil(maxValue + 30 / valuePx)
	const min = Math.ceil(minValue - 30 / valuePx)

	function roundUp(number: number) {
		let remainder = number % 100
		if (remainder > 0) {
			return Math.ceil(number / 100) * 100
		} else {
			return number
		}
	}
	function roundDown(number: number) {
		if (number >= 0) {
			let remainder = number % 100
			if (remainder > 50) {
				return Math.ceil(number / 100) * 100
			} else {
				return Math.floor(number / 100) * 100
			}
		} else {
			let absNumber = Math.abs(number)
			let remainder = absNumber % 50
			let roundedValue = Math.floor(absNumber / 50) * 50
			if (remainder > 0) {
				roundedValue += 50
			}
			return -roundedValue
		}
	}

	// let roundedMax = roundUp(max)
	// let roundedMin = roundDown(min)
	// console.log(`输入的最大值为：${max}，向上取整后为：${roundedMax}`)
	// console.log(`输入的最小值为：${min}，向下取整后为：${roundedMin}`)

	const show = !(maxValue === 0 && minValue === 0)
	const option: EChartsOption = {
		grid: {
			top: 8,
			left: 43,
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
				color: '#A4ACC1',
				fontSize: 10
				// interval: 1
			},
			// boundaryGap: false,
			data: names
		},
		yAxis: {
			show: true,
			// min: min,
			// max: max,
			max: roundUp(max),
			min: roundDown(min),
			splitNumber: 4,
			axisLabel: {
				color: '#A4ACC1',
				fontSize: 10
			},
			axisLine: {
				show: false
			},
			splitLine: {
				lineStyle: {
					color: '#EEE'
				}
			},
			type: 'value'
		},
		series: [
			{
				data: values,
				zlevel: 2,
				type: 'line',
				lineStyle: {
					color: '#2EBD87'
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
				markPoint: {
					symbolSize: 20,
					itemStyle: {
						color: 'rgba(0,0,0,0)'
					},
					label: {
						fontSize: 12,
						show: show,
						color: '#00B076',
						formatter: (params) => {
							return '' + params.value
						}
					},
					data: [
						{
							type: 'max',
							name: 'Max'
						},
						{
							type: 'min',
							name: 'Min',
							label: {
								offset: [0, 20]
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
</script>

<template>
	<div class="web:hidden mb-10 px-4 py-5">
		<div class="text-text-primary text-style-web-h4-medium">{{ t('flw.txt110') }}</div>
		<div class="flex justify-between py-3 relative z-11">
			<div class="text-function-buy text-style-web-h2-medium"></div>
			<div class="relative">
				<div
					class="py-1 px-[6px] flex items-center text-text-tips text-style-web-small-medium border border-border-subtle rounded-[6px]">
					{{ t('flw.txt101') }}
					<!-- <base-icon class="ml-[2px]" name="follow/icon10" :size="10" /> -->
				</div>
				<!-- <div
					class="w-[100%] z10 absolute top-[30px] text-text-tips text-style-web-small-medium border border-border-subtle rounded-[6px] bg-always-white py-1 px-[6px]">
					<div class="mb-1">近30日</div>
					<div class="mb-1">近14日</div>
					<div>近7日</div>
				</div> -->
			</div>
		</div>
		<div ref="chartDom" class="h-[156px] z-1"></div>
	</div>

	<div class="ph:hidden pd:hidden">
		<div class="text-text-primary text-style-web-h3-medium">{{ t('flw.txt110') }}</div>
		<div class="flex justify-between py-6 relative z-11">
			<div class="text-function-buy text-style-web-h2-medium"></div>
			<div class="relative">
				<div
					class="py-1 px-[6px] flex items-center text-text-tips text-style-web-small-medium border border-border-subtle rounded-[6px]">
					{{ t('flw.txt101') }}
					<!-- <base-icon class="ml-[2px]" name="follow/icon10" :size="10" /> -->
				</div>
			</div>
		</div>
		<div ref="chartDom2" class="h-[156px] z-1"></div>
	</div>
</template>
