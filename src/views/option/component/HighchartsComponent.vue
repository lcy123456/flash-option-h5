<template>
	<div class="relative" :class="isWeb ? 'py-0' : 'py-[12px]'">
		<div ref="chartContainer" :style="{ height: isWeb ? '322px' : '400px' }"></div>
		<div class="absolute left-0 bottom-[60px] transform">
			<progressbar v-if="state.sellPercent !== -1" :sellPercent="state.sellPercent" />
		</div>
		<div
			class="absolute right-0 top-0 w-[1px] yline"
			:class="isWeb ? 'h-[322px]' : 'h-[400px]'"></div>
	</div>
</template>
<script lang="ts" setup>
import { ref, onMounted, watch, onBeforeUnmount } from 'vue'
import Highcharts from 'highcharts'
import { useFlashOption } from '@/hooks/useFlashOption'
import progressbar from './progressbar.vue'
import { formatTime } from '@/utils/date'
import { useDevice } from '@/hooks/useDevice'
import { blackHighChartTheme, whiteHighChartTheme } from '@/constants/theme'
import { useThemeStore } from '@/store/useThemeStore'

const chartContainer = ref(null)
let chart, series
const { isWeb } = useDevice()
let chartRef: Highcharts.Chart | null = null
const xMaxPadding = 0.3
const xMinPadding = 0.2

const { state } = useFlashOption()
let length = 90
let PAD_VALUE = 20
let resizeTimeout = null
const themeStore = useThemeStore()

function handleResize() {
	// 清除之前的定时器
	if (resizeTimeout) {
		clearTimeout(resizeTimeout)
	}

	// // 设置新的定时器，3秒后如果没有新的窗口大小变化，刷新页面
	resizeTimeout = setTimeout(() => {
		const pad = isWeb.value ? 0.25 : 0.4
		chartRef?.update({
			xAxis: {
				maxPadding: pad // 新的 maxPadding 值
			}
		})
		createPlotBand()
		createYLine()
	}, 1000)
}
onMounted(() => {
	const theme = themeStore.theme === 'light' ? whiteHighChartTheme : blackHighChartTheme
	Highcharts.setOptions(theme)
	initChart()
	window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
	window.removeEventListener('resize', () => {
		if (resizeTimeout) {
			clearTimeout(resizeTimeout)
		}
	})
})
function initChart() {
	Highcharts.addEvent(Highcharts.Series, 'addPoint', (e) => {
		const point = e.point,
			series = e.target
		if (!series.pulse) {
			series.pulse = series.chart.renderer.circle().add(series.markerGroup)
		}
		setTimeout(() => {
			series.pulse
				.attr({
					x: series.xAxis.toPixels(point.x, true),
					y: series.yAxis.toPixels(point.y, true),
					r: series.options.marker.radius,
					opacity: 1,
					fill: series.color
				})
				.animate(
					{
						r: 20,
						opacity: 0
					},
					{
						duration: 1000
					}
				)
		}, 1)
	})

	const getPad = () => {
		if (state.version === 2) {
			return isWeb.value ? 0.25 : 0.4
		}
		return 0
	}
	const chartOptions = {
		credits: {
			enabled: false // 禁用logo和链接
		},
		title: {
			text: ''
		},
		chart: {
			type: 'area',
			spacing: [0, 0, 0, 0], // 上、右、下、左的间距设为 0

			events: {
				load: onChartLoad,
				click: function () {
					return false
				}
			}
		},
		time: {
			useUTC: false
		},
		tooltip: {
			enabled: false // 禁用 tooltip
		},
		xAxis: {
			tickWidth: 0, // 取消刻度线的宽度
			tickLength: 0, // 取消刻度线的长度
			lineColor: '#DBDBDB', // 设置Y轴线颜色
			lineWidth: isWeb ? 0 : 1, // 设置Y轴线宽度
			type: 'datetime',
			tickPixelInterval: 150,
			// tickInterval: state.timeResolution,
			maxPadding: getPad(),
			gridLineWidth: 1,
			gridLineColor: 'var(--color-border-strong)',
			gridLineDashStyle: 'solid',
			labels: {
				style: {
					color: 'var(--color-text-description)' // 设置 X 轴标签颜色为红色
				}
			}
		},
		yAxis: {
			lineColor: '#f00', // 设置Y轴线颜色
			lineWidth: 1, // 设置Y轴线宽度
			title: {
				text: null
			},
			gridLineDashStyle: 'solid',
			gridLineWidth: 1,
			gridLineColor: 'var(--color-border-strong)',
			labels: {
				style: {
					color: 'var(--color-text-description)' // 设置 X 轴标签颜色
				},
				align: 'right', // 将文字对齐到右侧
				x: -16, // 向左移动文字（使其接近Y轴内侧）
				y: isWeb ? 0 : -10 // 调整文字的垂直对齐，默认是 0
			},
			opposite: true // Y轴靠右边显示
		},
		legend: {
			enabled: false
		},
		exporting: {
			enabled: false
		},
		plotOptions: {
			series: {
				marker: {
					states: {
						hover: {
							enabled: false
						},
						select: {
							enabled: false
						}
					}
				}
			}
		},
		series: [
			{
				name: '',
				lineWidth: 2,
				// color: 'var(--color-brand-blue)',
				data: [],
				marker: {
					enabled: false
				},
				fillColor: {
					linearGradient: {
						x1: 0,
						y1: 0,
						x2: 0,
						y2: 1
					},
					stops: [
						[0, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0.2).get('rgba')], // 渐变开始颜色
						[1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')] // 渐变结束颜色
					]
				}, // 面积区域颜色定义
				events: {
					click: function () {
						return false
					}
				}
			}
		]
	}
	chartRef = Highcharts.chart(chartContainer.value, chartOptions)
}
function onChartLoad() {
	chart = this
	series = chart.series[0]

	createYLine()
}

/**
 * 计算Y轴最大值、最小值
 */
function getYMinAndMax() {
	let array = series.yData
	if (array.length > 0) {
		if (array[0] < 1000) {
			PAD_VALUE = Math.ceil(array[0] * 0.01)
		}
	}
	if (array.length >= length) {
		array = array.slice(-length)
	} else {
		let yNums = chart.yAxis[0].getExtremes(),
			min = yNums.min - PAD_VALUE,
			max = yNums.max + PAD_VALUE
		return { min, max }
	}

	const min = Math.min(...array) - PAD_VALUE
	const max = Math.max(...array) + PAD_VALUE
	return { min, max }
}
function updatePoint() {
	const newPoint = state.newPoint
	const y = newPoint.y
	const x = newPoint.x

	// let yNums = chart.yAxis[0].getExtremes(),
	// 	min = yNums.min,
	// 	max = yNums.max
	const obj = getYMinAndMax()
	const min = obj.min
	const max = obj.max

	// const padding = getYPadding(y)
	// const minY = Math.floor(y * (1 - padding))
	if (y < min) {
		chart.yAxis[0].setExtremes(y - PAD_VALUE, max)
	} else if (y > max) {
		chart.yAxis[0].setExtremes(min, y + PAD_VALUE)
	} else {
		chart.yAxis[0].setExtremes(min, max)
	}
	if (newPoint.result) {
		let customDiv = ''
		if (newPoint.r == 1) {
			// 赢
			customDiv = `
		<div class="flex flex-col items-center absolute z-10" style="left: -24px;top: -50px">
			<div class="p-[4px] min-w-[37px] box-border flex items-center justify-center text-text-brand text-style-web-xsmall-medium rounded-[10px] bg-[#E5F7F1]">${newPoint.ra.toFixed(2)}</div>
			<img class=" mt-[4px] object-contain rounded-full box-border w-[24px] h-[24px] border-[2px] border-function-buy" src="${newPoint.ic}" />
		</div>
		`
		} else {
			// 输
			customDiv = `
		<div class="flex flex-col items-center absolute z-10" style="left: -24px;top: -50px">
			<div class="p-[4px] min-w-[37px] box-border flex items-center justify-center text-text-primary text-style-web-xsmall-medium rounded-[10px] bg-[#FFECED]">${newPoint.ra.toFixed(2)}</div>
			<img class=" mt-[4px] object-contain rounded-full box-border w-[24px] h-[24px] border-[2px] border-function-sell" src="${newPoint.ic}" />
		</div>
		`
		}
		series.addPoint(
			{
				x,
				y,
				marker: {
					// 设置新点的标记样式
					enabled: true,
					symbol: 'circle',
					radius: 4,
					fillColor: newPoint.d == 0 ? '#2ebd85' : '#FD3D49' // 颜色
				},
				dataLabels: {
					enabled: true,
					useHTML: true,
					formatter: function () {
						return customDiv
					}
					// y: -50,
				}
			},
			true,
			false
		)
	} else if (newPoint.ic) {
		let customDiv = ''
		if (newPoint.d == 0) {
			// 买入
			customDiv = `
		<div class="flex flex-col items-center absolute z-10" style="left: -24px;top: -50px">
			<div class="p-[4px] min-w-[37px] box-border flex items-center justify-center text-function-buy text-style-web-xsmall-medium rounded-[10px] bg-[#E5F7F1]">${newPoint.a.toFixed(2)}</div>
			<img class=" mt-[4px] object-contain rounded-full box-border w-[24px] h-[24px] border-[2px] border-function-buy" src="${newPoint.ic}" />
		</div>
		`
		} else {
			// 卖出
			customDiv = `
		<div class="flex flex-col items-center absolute z-10" style="left: -24px;top: -50px">
			<div class="p-[4px] min-w-[37px] box-border flex items-center justify-center text-function-sell text-style-web-xsmall-medium rounded-[10px] bg-[#FFECED]">${newPoint.a.toFixed(2)}</div>
			<img class=" mt-[4px] object-contain rounded-full box-border w-[24px] h-[24px] border-[2px] border-function-sell" src="${newPoint.ic}" />
		</div>
		`
		}
		series.addPoint(
			{
				x,
				y,
				marker: {
					// 设置新点的标记样式
					enabled: true,
					symbol: 'circle',
					radius: 4,
					fillColor: newPoint.d == 0 ? '#2ebd85' : '#FD3D49' // 颜色
				},
				dataLabels: {
					enabled: true,
					useHTML: true,
					formatter: function () {
						return customDiv
					}
					// y: -50,
				}
			},
			true,
			false
		)
	} else {
		series.addPoint([x, y], true, true)
	}

	// 获取最后一个点
	const point = series.points[series.points.length - 1]

	// 获取坐标
	const coordinates = getCoordinates(point)
	createPriceLine(coordinates.y, coordinates.x, point.y)
}

// 获取坐标
function getCoordinates(point: any) {
	const xAxis = point.series.xAxis
	const yAxis = point.series.yAxis
	const x = xAxis.toPixels(point.x, false)
	const y = yAxis.toPixels(point.y, false)
	return {
		x: x,
		y: y
	}
}

function updateXLine(chart: any, startTime: number, openTime: number) {
	const endTime = Math.floor(openTime + state.timeResolution.time * xMaxPadding)
	const sTime = Math.floor(startTime - state.timeResolution.time * xMinPadding)
	chart.xAxis[0].setExtremes(sTime, endTime)

	chart.update({ xAxis: { tickPixelInterval: 150 } })

	console.log('开始时间X轴-结束时间:', formatTime(sTime), formatTime(endTime))
	createPlotBand()
}

watch(
	() => state.list,
	(newval: []) => {
		if (newval.length > 0) {
			// 初始化监听
			series.setData(newval, true, true)

			const obj = getYMinAndMax()
			const min = obj.min
			const max = obj.max

			chart.yAxis[0].setExtremes(min, max)
		} else {
			series.setData([], true, true)
		}
		length = series.yData.length || 90
	}
)

watch(
	() => state.newPoint,
	(newObj: any) => {
		if (newObj.y > 0) {
			updatePoint()
		}
	}
)

watch(
	() => state.startingData.updateXTime,
	(newObj) => {
		if (newObj) {
			if (state.version === 2) {
				createPlotBand()
			} else {
				updateXLine(
					chart,
					state.startingData.startTime as number,
					state.startingData.openTime as number
				)
			}
		}
	}
)

/**
 * 创建右侧X轴阴影区域
 */
function createPlotBand() {
	const $parent = $('.highcharts-container')
	$parent.find('#x-plot-band').remove()
	const ph = $parent.height()
	const right = isWeb ? 0 : 8

	// const pw = Math.floor($parent.width() * (xMaxPadding / (1 + xMaxPadding + xMinPadding)))
	const pw = 90
	// 创建自定义 div
	const $customDiv = $(
		`<div id="x-plot-band"
		style="position:absolute;
			top:0px;
			right:${right}px;
			width: ${pw}px;height: ${ph - 30}px">
		</div>`
	)

	// 将自定义 div 添加到父元素
	$customDiv.appendTo($parent)
}
/**
 * 创建Y轴线
 */
function createYLine() {
	const $parent = $('.highcharts-container')
	$parent.find('#yline').remove()
	const ph = $parent.height()

	const right = isWeb ? 0 : 8
	// 创建自定义 div
	const $customDiv = $(
		`<div id="yline"
		    class=""
		style="position:absolute;
			top:0px;
			right:${right}px;
			width: 2px;height: ${ph - 30}px">
		</div>`
	)

	// 将自定义 div 添加到父元素
	$customDiv.appendTo($parent)
}

/***
 * 创建价格指引线
 */
function createPriceLine(top: number, width: number, price: number) {
	// 获取父元素
	const $parent = $('.highcharts-container')
	$parent.find('#line').remove()
	// const pw = $parent.width() - 10
	const pw = $parent.width()
	const right = isWeb ? 0 : 10

	// 创建自定义 div
	const $customDiv = $(
		`<div id="line"
		style="display: flex;
            justify-content: flex-end;
            align-items: center; position:absolute;
			background-color: var(--color-brand-blue);
			top:${top}px;
			right:${right}px;
			width: ${pw - width}px;height: 1px">
			<div class="rounded-tl-[100px] text-style-web-small-medium text-text-primary rounded-bl-[100px] box-border pl-[8px] pr-[6px] py-[4px] min-w-[66px] bg-background-primary border border-brand-blue border-r-0 flex justify-center items-center">${price.toFixed(2)}</div>
		</div>`
	)

	// 将自定义 div 添加到父元素
	$customDiv.appendTo($parent)
}

function getYPadding(y: number) {
	if (y > 10000) {
		return 0.0005
	} else if (y > 1000) {
		return 0.002
	} else if (y > 100) {
		return 0.02
	}
	return 0.1
}
</script>
<style scoped>
.container {
	width: 100vw;
	height: 100vh;
	display: flex;
	align-items: center;
	background-color: #fff;
}
</style>
<style>
#yline {
	background: linear-gradient(to bottom, rgba(23, 84, 248, 0) 0%, rgba(23, 84, 248, 1) 100%);
}
#x-plot-band {
	background: linear-gradient(to bottom, rgba(23, 84, 248, 0) 0%, rgba(23, 84, 248, 0.2) 100%);
}
</style>
