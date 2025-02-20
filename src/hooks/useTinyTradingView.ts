import { watch } from 'vue'
import { getTimeZone } from '@/utils/date'
import { getTVLang, getTVInterval } from '@/utils'
import { useDevice } from '@/hooks/useDevice'

const { isWeb } = useDevice()
import { useThemeStore } from '@/store/useThemeStore'
import { getThemeClass } from '@/utils/theme'

/**
 * 简化版本的TradingView只展示K线图
 * @returns
 */
export function useTinyTradingView() {
	const themeStore = useThemeStore()
	let widget: any
	let klineId: string
	const createChart = (
		datafeed: any,
		data: { symbol: string; skin: 'night' | 'day'; [key: string]: any }
	) => {
		const config = createConfig(datafeed, data)
		config.container = config.container_id
		klineId = config.container_id
		widget = new TradingView.widget(config)
        console.log('widget---widget', widget)
		// widget.onChartReady(function () {
		// 	if (!isWeb.value) {
		// 		// 获取所有研究的列表
		// 		widget.chart().removeAllStudies()
		// 	}
		// })
        // if (!isWeb.value) {
        //     // 获取所有研究的列表
        //     widget.chart().removeAllStudies()
        // }
		return widget
	}

	const switchCurrency = (newSymbol: string) => {
		console.log('switchCurrency:', newSymbol)
		widget.setSymbol(newSymbol)
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
		switchCurrency
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
		allow_symbol_change: true,
		symbol: data.symbol,
		interval: getDefaultInterval(), // 默认K线周期
		timezone: getTimeZone(),
		// toolbar_bg: '#121212',
		container_id: 'kline_container',
		datafeed: datafeed,
		library_path: 'http://43.208.173.171:8801/charting_library/', // 静态文件路径
		// library_path: '/tradingview2/charting_library/', // 静态文件路径
		// locale: this.getLang4K(),
		locale: getTVLang(),
		debug: false,
		drawings_access: {
			type: 'black',
			tools: [{ name: 'Regression Trend' }]
		},
		overrides: {
			'scalesProperties.textColor': '#8E8E92', // 'var(--color-border-strong)'
			'scalesProperties.showLeftScale': false,
			'scalesProperties.showRightScale': true,
			'mainSeriesProperties.showPriceLine': true,
			'timeScale.rightOffset': -100,

			'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)', // 隐藏水印
			'paneProperties.legendProperties.showLegend': false, // 隐藏图表上的币种名称及价格

			'paneProperties.backgroundType': 'solid',
			'paneProperties.background': getThemeClass('#0f0f0f', '#ffffff')
			// 'grid.color': getThemeClass('#1C1D1F', '#f7f7fa')
		},
		studies_overrides: {},

		disabled_features: [
			'header_resolutions',
			'timeframes_toolbar',
			'header_symbol_search',
			'header_chart_type',
			'header_compare',
			'header_undo_redo',
			'header_screenshot',
			'header_saveload',
			'use_localstorage_for_settings',
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
			'border_around_the_chart',
			'control_bar',
			'left_toolbar',
			'settings_control'
		],
		enabled_features: [
			'disable_resolution_rebuild',
			'hide_last_na_study_output',
			'move_logo_to_main_pane',
			'dont_show_boolean_study_arguments',
			'remove_library_container_border',
			'save_chart_properties_to_local_storage',
			'side_toolbar_in_fullscreen_mode',
			'constraint_dialogs_movement',
			'same_data_requery',
			'header_in_fullscreen_mode',
			'hide_left_toolbar'
		],
		custom_css_url: isWeb.value ? '' : 'style/tiny.css',
		supported_resolutions: ['1', '5', '15', '30', '60', '4H', '1D', '1W', '1M'],
		charts_storage_api_version: '1.1',
		client_id: 'tradingview.com',
		user_id: 'public_user_id',
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
		hide_top_toolbar: true,
		...data,
		theme: themeStore.theme // 设置主题
	}
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
	const currentPeriod = localStorage.getItem('flash_option_resolution')
	if (!currentPeriod) {
		localStorage.setItem('flash_option_resolution', '1min')
		return '1'
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
