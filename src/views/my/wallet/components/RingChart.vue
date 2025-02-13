<script setup lang="ts">
import { ref, onMounted, PropType, watch, computed, shallowRef } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { plus, div, mul, minus, toFixed } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useDevice } from '@/hooks/useDevice'

const chartRef = ref<HTMLElement | null>(null)
const myChart = shallowRef()
const chartRefWeb = shallowRef()
const { t } = useI18n()
const { isPh } = useDevice()

const props = defineProps({
	data: {
		type: Array as PropType<Array<any>>,
		default: () => []
	},
	hideAsset: {
		type: Boolean as PropType<boolean>,
		default: false
	}
})

watch(
	() => props.data,
	() => {
		setOption()
	},
	{ deep: true }
)

const setOption = () => {
	if (!props.data.length) return
	const option: EChartsOption = {
		tooltip: {
			show: false
		},
		legend: {
			show: false
		},
		series: [
			{
				name: 'Access From',
				type: 'pie',
				radius: ['80%', '100%'],
				avoidLabelOverlap: false,
				label: {
					show: false,
					position: 'center'
				},
				labelLine: {
					show: false
				},
				emphasis: {
					scale: false, // 禁止放大
					focus: 'none' // 禁止高亮
				},
				data: props.data.map((item: any) => ({
					...item,
					itemStyle: {
						color: item.color
					}
				}))
			}
		]
	}

	option && myChart.value.setOption(option)
}

const legend = computed(() => {
	const total = props.data.reduce((prev, curr) => plus(prev, curr.value).toNumber(), 0)
	const lastItem = props.data[2]
	let num = 0
	return props.data.map((item, index) => {
		const obj: any = { ...item }
		if (index === 2) {
			if (num === 0) {
				obj.ratio = item.value ? 100 : 0
			} else {
				obj.ratio = minus(100, num).toNumber()
			}
		} else {
			if (lastItem.value === 0) {
				obj.ratio = Number(mul(div(item.value, total).toNumber(), 100).toNumber().toFixed(2))
			} else {
				obj.ratio = toFixed(mul(div(item.value, total).toNumber(), 100).toNumber(), 2)
			}
			num = plus(num, obj.ratio).toNumber()
		}
		return obj
	})
})

onMounted(() => {
	initChart()
})
const initChart = () => {
	myChart.value = echarts.init(isPh.value ? chartRef.value : chartRefWeb.value)
	setOption()
}
</script>

<template>
	<div class="web:hidden py-6 px-[61px]">
		<div class="relative flex justify-center">
			<div
				ref="chartRef"
				class="w-[136px] h-[136px] mx-auto flex items-center justify-center"></div>
			<div
				class="text-text-secondary text-style-web-base-medium w-[100%] absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-center">
				{{ t('my.txt11') }}
			</div>
		</div>
		<div
			v-for="(item, index) in legend"
			:key="index"
			class="mb-4 mt-5 flex items-center justify-between">
			<div class="flex items-center">
				<div class="rounded-full w-[10px] h-[10px] mr-2" :style="{ background: item.color }"></div>
				<div class="text-text-tertiary text-style-web-base-medium">{{ item.name }}</div>
			</div>
			<div class="text-text-primary text-style-web-base-bold">
				<div v-if="hideAsset">***</div>
				<div v-else>{{ toFixed(item.ratio, 2) }}%</div>
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex items-center" style="align-self: flex-start">
		<div class="relative">
			<div ref="chartRefWeb" class="w-[136px] h-[136px] flex items-center justify-center"></div>
			<div
				class="text-text-secondary absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-style-web-base-medium">
				{{ t('my.txt11') }}
			</div>
		</div>
		<div class="ml-[32px] flex-1">
			<div
				v-for="(item, index) in legend"
				:key="index"
				class="mb-4 flex h-[16px] items-center justify-between last:mb-0">
				<div class="flex items-center">
					<div
						class="rounded-full w-[10px] h-[10px] mr-2"
						:style="{ background: item.color }"></div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ item.name }}</div>
				</div>
				<div class="text-text-primary text-style-web-base-bold">
					<div v-if="hideAsset">***</div>
					<div v-else>{{ toFixed(item.ratio, 2) }}%</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped></style>
