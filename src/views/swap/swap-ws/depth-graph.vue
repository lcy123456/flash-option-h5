<script setup lang="ts">
import { reactive, ref, nextTick, watch } from 'vue'
import { onMounted } from 'vue'
import * as echarts from 'echarts'
const myEcharts = ref(null)
import { useSwapStore } from '@/store/modules/swap/index'
const swapStore = useSwapStore()
const state = reactive({
	isshowLoading: true,
	loading: true,
	destory: false,
	echartsData: {
		buysArr: [],
		asksArr: [],
		yMin: 0,
		yMax: null
	},
	styleObject: {
		height: '450px'
	},
	interval: 100,
	intervalData: null as any,
	deptValue: 8
})

const echartDept = ref('' as any)
const initEachart = () => {
	echartDept.value = echarts.init(document.getElementById('myChart'))
	// 绘制图表
	echartDept.value.setOption(option)
}

// 监听深度数据
watch(
	[() => swapStore.state.echartsData],
	() => {
		const eData = swapStore.state.echartsData
		const asksArr = eData.ask
			?.sort((a: any, b: any) => parseFloat(a.amount) - parseFloat(b.amount))
			.map((item) => {
				return [item.price, item.amount]
			})
		state.echartsData.asksArr = asksArr
		const buysArr = eData.bid
			?.sort((a: any, b: any) => parseFloat(b.amount) - parseFloat(a.amount))
			.map((item) => {
				return [item.price, item.amount]
			})
		state.echartsData.buysArr = buysArr
		eachart()
	},
	{ deep: true }
)
const clearData = () => {
	state.echartsData.buysArr = []
	state.echartsData.asksArr = []
	eachart()
}

const eachart = () => {
	option.series[0].data = state.echartsData.buysArr
	option.series[1].data = state.echartsData.asksArr
	echartDept.value.setOption(option)
}

const option: any = reactive({
	animation: false,
	tooltip: {
		show: true,
		trigger: 'axis',
		showContent: true,
		axisPointer: {
			type: 'cross',
			lineStyle: {
				color: 'rgba(0, 0, 0, 0.1)'
			}
		}
	},
	grid: {
		containLabel: true,
		left: '0%',
		right: '0%',
		bottom: '3%'
	},
	xAxis: {
		type: 'category',
		boundaryGap: false,
		axisLine: {
			show: false
		},
		axisTick: { show: false },
		axisLabel: {
			// showMinLabel: true,
			// showMaxLabel: true,
			formatter: function (val: any) {
				return val // x轴显示
			},
			textStyle: {
				color: '#999', // x轴 字体颜色
				fontSize: 10 //字体大小
			}
		}
	},
	yAxis: [
		{
			type: 'value',
			position: 'right', // y轴 在右边显示
			splitNumber: 5,
			axisTick: {
				inside: true
			},
			axisLabel: {
				inside: true,
				showMinLabel: false,
				textStyle: {
					color: '#999999', // y轴 字体颜色
					fontSize: 12 //字体大小
				}
			},
			splitLine: {
				show: false
			}
		}
	],
	series: [
		{
			data: state.echartsData.asksArr,
			type: 'line',
			symbol: 'circle',
			showSymbol: false,
			symbolSize: 10,
			itemStyle: {
				color: '#2EBD87', // 折线上的圆
				borderColor: 'yellow',
				shadowColor: 'rgba(0, 0, 0, 0.5)',
				shadowBlur: 10
			},
			label: {
				show: true,
				position: 'right',
				distance: 10,
				padding: 10,
				fontSize: 12,
				backgroundColor: 'rgba(0, 0, 0, .6)',
				formatter: function (params: any) {
					return params
				},
				rich: {
					a: {
						color: '#f00',
						fontSize: '12',
						fontWeight: 'bold',
						lineHeight: '20'
					}
				}
			},
			lineStyle: {
				color: '#2EBD87'
			},
			areaStyle: {
				// 面积颜色
				color: '#2EBD87',
				opacity: 0.1
			}
		},
		{
			data: state.echartsData.buysArr,
			type: 'line',
			symbol: 'circle',
			showSymbol: false,
			symbolSize: 10,
			itemStyle: {
				// 折线上的圆
				color: '#F54058',
				borderColor: 'yellow',
				shadowColor: 'rgba(0, 0, 0, 0.5)',
				shadowBlur: 10
			},
			label: {
				show: true,
				position: 'left',
				distance: 10,
				padding: 10,
				fontSize: 12,
				color: '#fff',
				backgroundColor: 'rgba(0, 0, 0, .6)',
				formatter: function (params: any) {
					return params
				},
				rich: {
					a: {
						color: '#fff',
						fontSize: '12',
						fontWeight: 'bold',
						lineHeight: '20'
					}
				}
			},
			lineStyle: {
				color: '#ee3523'
			},
			areaStyle: {
				color: '#F54058',
				opacity: 0.1
			}
		}
	]
})
const init = () => {
	nextTick(() => {
		initEachart()
	})
}

onMounted(() => {
	init()
})
</script>
<template>
	<div id="myChart" ref="myEcharts" style="width: 100%; height: 450px" />
</template>
