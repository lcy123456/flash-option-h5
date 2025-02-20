import { watch } from 'vue'
import { getTimeZone } from '@/utils/date'
import { getTVLang, getTVInterval } from '@/utils'
import { mainIndicators } from '@/constants'
import { useThemeStore } from '@/store/useThemeStore'
import { getThemeClass } from '@/utils/theme'

let widget: any

export function useTradingView() {
	const themeStore = useThemeStore()
	let klineId: string

	const createChart = (
		datafeed: any,
		data: { symbol: string; skin: 'night' | 'day'; [key: string]: any }
	) => {
		const config = createConfig(datafeed, data)
		console.log('data----data', data)
		const ele = document.getElementById(config.container_id)
		if (!ele) return
		config.container = config.container_id
		klineId = config.container_id
		console.log('config----config', config)
		widget = new TradingView.widget(config)
		console.log('widget---widget', widget)

		// widget.onChartReady(function () {
		// 	setActive(mainIndicators[0])
		// })
		// setActive(mainIndicators[0])

		return widget
	}

	const switchCurrency = (newSymbol: string) => {
		console.log('switchCurrency:', newSymbol)
		console.log('widget----widget', widget)
		// widget?.setSymbol(newSymbol, getDefaultInterval())
	}

	watch(
		() => themeStore.theme,
		(value: string) => {
			if (!widget || !klineId) return
			const ele = document.getElementById(klineId)
			if (!ele) return
			widget.changeTheme(value)
			setTimeout(() => {
				setOverrides(widget)
			}, 100)
		}
	)

	return {
		createChart,
		switchCurrency,
		removeActive,
		setActive
	}
}

function createConfig(datafeed: any, data: any) {
	localStorage.removeItem('tradingview.chartproperties')
	localStorage.removeItem('tvxwevents.settings')
	const themeStore = useThemeStore()

	const config = {
		autosize: true,
		height: '600px',
		// fullscreen: true,
		leftToolbar: false,
		allow_symbol_change: true,
		symbol: data.symbol,
		interval: getDefaultInterval(), // 默认K线周期
		timezone: getTimeZone(),
		// toolbar_bg: '#ff0000',
		container_id: 'kline_container',
		datafeed: datafeed,
		// library_path: 'https://cdn.gscgl.com/tradingview2/charting_library/', // 静态文件路径
		library_path: 'http://43.208.173.171:8801/charting_library/', // 静态文件路径
		// library_path: 'https://cdn.gscgl.com/public/charting_library/',
		// locale: this.getLang4K(),
		locale: getTVLang(),
		debug: false,
		drawings_access: {
			type: 'black',
			tools: [{ name: 'Regression Trend' }]
		},
		branding: {
			showLogo: false // 隐藏 TradingView 官方 logo
		},
		disabled_features: [
			'header_resolutions',
			'timeframes_toolbar',
			'header_symbol_search',
			'header_chart_type',
			'header_compare',
			'header_undo_redo',
			'header_screenshot',
			'header_saveload',
			// 'use_localstorage_for_settings', // 默认隐藏工具栏
			'left_toolbar',

			'volume_force_overlay',
			'widget_logo',
			'compare_symbol',
			'display_market_status',
			'go_to_date',
			'header_interval_dialog_button',
			'legend_context_menu',

			'show_hide_button_in_legend',
			'show_interval_dialog_on_key_press',
			'snapshot_trading_drawings',
			'symbol_info',
			'header_widget',
			'edit_buttons_in_legend',
			'context_menus',
			'border_around_the_chart'
		],
		enabled_features: [
			'move_logo_to_main_pane',
			'hide_left_toolbar_by_default',

			'show_chart_property_page',
			'custom_resolutions',
			'tick_resolution',
			'hide_last_na_study_output', //显示最后的 N/A指示器输出数据。
			'side_toolbar_in_fullscreen_mode', // 在全屏模式下启用绘图工具栏。
			'constraint_dialogs_movement', // 将对话框保留在图表内。
			'left_toolbar', // 在左侧面板上显示绘图工具栏。
			'header_in_fullscreen_mode' // 在全屏模式下启用标题小部件 DOM 元素
		],
		//成交量样式
		studies_overrides: {
			'volume.volume.color.0': '#f6465d',
			'volume.volume.color.1': '#2EBD85',
			'volume.show ma': false
		},
		// overrides: {
		// 	'scalesProperties.textColor': '#8E8E92', // 'var(--color-border-strong)'
		// 	'scalesProperties.lineColor': '#F0F0F0',
		// 	'scalesProperties.showLeftScale': false,
		// 	'scalesProperties.showRightScale': true,
		// 	'mainSeriesProperties.showPriceLine': true,
		// 	'timeScale.rightOffset': -100
		// },
		overrides: {
			'scalesProperties.textColor': '#8E8E92', // 'var(--color-border-strong)'
			'scalesProperties.showLeftScale': false,
			'scalesProperties.showRightScale': true,
			'mainSeriesProperties.showPriceLine': true,
			'timeScale.rightOffset': -100,

			// 'paneProperties.backgroundType': 'solid',
			// 'paneProperties.background': '#ffffff',
			// 'paneProperties.vertGridProperties.color': '#f3f3f5',
			// 'paneProperties.horzGridProperties.color': '#f3f3f5',
			// 'scalesProperties.lineColor': '#f3f3f5',
			'scalesProperties.showStudyLastValue': false,
			// 'paneProperties.separatorColor': '#f3f3f5', // 窗格分隔符颜色
			// 'mainSeriesProperties.candleStyle.upColor': '#2ebd85', // K线上涨时的颜色
			// 'mainSeriesProperties.candleStyle.borderUpColor': '#2ebd85', // K线上涨时的边框颜色
			// 'mainSeriesProperties.candleStyle.wickUpColor': '#2ebd85', // K线上涨时的影线颜色
			// 'mainSeriesProperties.candleStyle.downColor': '#f6465d', // K线下跌时的颜色
			// 'mainSeriesProperties.candleStyle.borderDownColor': '#f6465d', // K线下跌时的边框颜色
			// 'mainSeriesProperties.candleStyle.wickDownColor': '#f6465d' // K线下跌时的影线颜色

			toolbar_bg: getThemeClass('#0f0f0f', '#ffffff'),
			'paneProperties.backgroundType': 'solid',
			'paneProperties.background': getThemeClass('#0f0f0f', '#ffffff'),
			'grid.color': getThemeClass('#1C1D1F', '#f7f7fa')
		},
		custom_css_url: 'bundles/common.css',
		supported_resolutions: ['1', '5', '15', '30', '60', '4H', '1D', '1W', '1M'],
		save_chart_state: false,
		charts_storage_api_version: '1.1',
		client_id: 'common.com',
		user_id: 'common_public_user_id',
		time_frames: [
			{
				text: '1min',
				resolution: '1',
				description: 'realtime',
				title: 'swap.realtime'
			},
			{ text: '1min', resolution: '1', description: '1min' },
			{ text: '5min', resolution: '5', description: '5min' },
			{ text: '15min', resolution: '15', description: '15min' },
			{ text: '30min', resolution: '30', description: '30min' },
			{
				text: '1hour',
				resolution: '60',
				description: '1hour',
				title: '1hour'
			},
			{
				text: '4hour',
				resolution: '240',
				description: '4hour',
				title: '4hour'
			},
			{
				text: '1day',
				resolution: '1D',
				description: '1day',
				title: '1day'
			},
			{
				text: '1week',
				resolution: '1W',
				description: '1week',
				title: '1week'
			},
			{ text: '1mon', resolution: '1M', description: '1mon' }
		],
		...data,
		theme: themeStore.theme // 设置主题
	}
	// config.toolbar_bg = '#fff'
	return config
}

function setOverrides(data: any) {
	if (data) {
		data.activeChart().applyOverrides({
			'paneProperties.backgroundType': 'solid',
			'paneProperties.background': getThemeClass('#0F0F0F', '#ffffff'),
			// 'paneProperties.vertGridProperties.color': getThemeClass('#252629', '#f3f3f5'),
			// 'paneProperties.horzGridProperties.color': getThemeClass('#252629', '#f3f3f5'),
			'scalesProperties.lineColor': getThemeClass('#252629', '#f3f3f5'),
			'scalesProperties.showStudyLastValue': false,
			'paneProperties.separatorColor': getThemeClass('#252629', '#f3f3f5'), // 窗格分隔符颜色
			'mainSeriesProperties.candleStyle.upColor': '#2ebd85', // K线上涨时的颜色
			'mainSeriesProperties.candleStyle.borderUpColor': '#2ebd85', // K线上涨时的边框颜色
			'mainSeriesProperties.candleStyle.wickUpColor': '#2ebd85', // K线上涨时的影线颜色
			'mainSeriesProperties.candleStyle.downColor': '#f6465d', // K线下跌时的颜色
			'mainSeriesProperties.candleStyle.borderDownColor': '#f6465d', // K线下跌时的边框颜色
			'mainSeriesProperties.candleStyle.wickDownColor': '#f6465d' // K线下跌时的影线颜色
		})
		data.chart().getSeries().setChartStyleProperties(2, {
			color: '#2ebd85'
		})
	}
}

function getDefaultInterval() {
	const currentPeriod = localStorage.getItem('swap_proid')
	if (!currentPeriod) {
		localStorage.setItem('swap_proid', '15min')
		return '15'
	}
	return getTVInterval(currentPeriod)
	// switch (currentPeriod) {
	// 	case '1min': {
	// 		return '1'
	// 	}
	// 	case '5min': {
	// 		return '5'
	// 	}
	// 	case '15min': {
	// 		return '15'
	// 	}
	// 	case '30min': {
	// 		return '30'
	// 	}
	// 	case '60min': {
	// 		return '60'
	// 	}
	// 	case '4hour': {
	// 		return '240'
	// 	}
	// 	case '1day': {
	// 		return '1D'
	// 	}
	// 	case '1week': {
	// 		return '1W'
	// 	}
	// 	case '1month': {
	// 		return '1M'
	// 	}
	// 	default:
	// 		return '15'
	// }
}

// 移除技术指标
function removeActive(type: any) {
	const getIndicator = widget.chart().getAllStudies()
	const hasIndicator = getIndicator.filter((item: any) => item.name === type.value)

	if (hasIndicator.length > 0) {
		hasIndicator.forEach((indicator: any) => {
			widget.chart().removeEntity(indicator.id)
		})
		return
	}
}
// 设置技术指标
function setActive(type: any) {
	switch (type.label) {
		case 'MA':
			widget.chart().createStudy(
				'Moving Average',
				false,
				false,
				{ length: 7 },
				{
					'plot.color': '#F5CB89'
				}
			)
			widget.chart().createStudy(
				'Moving Average',
				false,
				false,
				{ length: 25 },
				{
					'plot.color': '#5FCFBF'
				}
			)
			widget.chart().createStudy(
				'Moving Average',
				false,
				false,
				{ length: 99 },
				{
					'plot.color': '#DD89F5'
				}
			)
			break
		case 'EMA':
			widget.chart().createStudy(type.value, !1, !1, [7], null, {})
			widget.chart().createStudy(type.value, !1, !1, [25], null, {})
			widget.chart().createStudy(type.value, !1, !1, [99], null, {})
			break
		case 'BOLL':
			widget.chart().createStudy(type.value, !1, !1, [7], null, { 'plot.color': 'rgb(118,32,99)' })
			break
		case 'KDJ':
			widget.chart().createStudy(type.value, !1, !1, [7], null, { 'plot.color': 'rgb(118,32,99)' })
			break
		case 'WR':
			widget.chart().createStudy(type.value, !1, !1, [14], null, {})
			break
		case 'RSI':
			widget.chart().createStudy(type.value, !1, !1, [6], null, {})
			break
		default:
			widget.chart().createStudy(type.value, !1, !1, [20], null, {}, null, {
				'plot.color': '#00adff'
			})
			break
	}
}
