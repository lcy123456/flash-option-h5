import WebSocketService from '@/request/WebSocketService'
import { getCoinInfo, startList, optionList, getOptionThumbs } from '@/apis/dcontract'
import { reactive } from 'vue'
import Datafeeds from '@/datafeed/dcontract.ts'
// import { useTradingView } from '@/hooks/useTradingView'
// import useQuoteStore from '@/hooks/useQuoteStore'
import { useTinyTradingView } from '@/hooks/useTinyTradingView'
import { useTradingView } from '@/hooks/useTradingView'

import { BOTTOM_STUDIES } from '@/constants/config'
import { favorFind, favorDelete, favorAdd } from '@/apis/swap'
import { useUserStore } from '@/store/useUserStore'
import { findTypeEnum } from '@/enums/trade'
import i18n from '@/i18n/index'
import { showNotify } from 'vant'
// import { getTVInterval } from '@/utils/index'
import { chgTextColor } from '@/utils/trade'
import { formatTime } from '@/utils/date'
import { useDevice } from '@/hooks/useDevice'

// const quoteStore = useQuoteStore()
const { createChart } = useTinyTradingView()
const { isWeb } = useDevice()

const state = reactive({
	symbol: 'BTC/USDT',
	timeResolution: {},
	openPrice: 0,
	optionData: { openTime: 0, downTime: { val: 0 } },
	list: [],
	times: [], // 交割周期列表
	currentTimesOption: null,
	amount: undefined,
	amountPercent: undefined,
	orderRefreshTime: 0,
	resolution: localStorage.getItem('flash_option_resolution') || '15min',
	newPoint: { y: -1 },

	addOrderInfo: {},

	symbolThumbInfo: {},
	baseCoinScale: 2,
	minAmount: 50, // 最小下单金额
	focusInput: 0, // 输入框光标激活

	isFavor: false,
	symbolThumbList: [], // 币种列表

	visible: false, // 订单弹窗
	direction: '',
	time: 0,

	filterOrderType: '0'
})

const tvConfig = {
	header_widget: {
		enabled: false // 隐藏头部
	},
	theme: 'light',
	hide_top_toolbar: true,
	overrides: {
		'scalesProperties.textColor': '#8E8E92', //  'var(--color-border-strong)'
		'scalesProperties.lineColor': '#F0F0F0',
		'scalesProperties.showLeftScale': false,
		'scalesProperties.showRightScale': true,
		'mainSeriesProperties.showPriceLine': true,
		'timeScale.rightOffset': -100,

		'paneProperties.borderVisible': isWeb.value,
		'timeScale.borderColor': 'transparent',
		'paneProperties.vertGridProperties.color': 'transparent',
		'paneProperties.horzGridProperties.color': 'transparent'
	},
	container_id: 'kline_dcontract_container'
}

let wsService = null
let widget
export function useDeliveryContract() {
	const userStore = useUserStore()

	/**
	 * 初始化加载全部数据
	 */
	const initData = async () => {
		tvConfig.symbol = state.symbol
		createWsConnect(tvConfig)
		loadCoinInfo()
		getStartInfo()
		loadOptionThumbs()

		if (state.timeResolution.period) {
			loadOptionList()
		}
	}

	/**
	 * 初始化加载行情数据
	 */
	const initThumb = async () => {
		createWsConnect()
		loadOptionThumbs()
	}

	const updateTimeOption = () => {
		getStartInfo()
		loadOptionList()
	}

	async function getStartInfo() {
		const params = { symbol: state.symbol }
		if (state.timeResolution.period) {
			params.period = state.timeResolution.period
		}
		const res = await startList(params)
		if (res.code === 0) {
			const data = res.data
			state.openPrice = data.openPrice
			state.optionData.openTime = data.openTime
			state.optionData.optionNo = data.id

			state.optionData.sTime = formatTime(data.startTime, 'mm:ss')
			state.optionData.oTime = formatTime(data.openTime, 'mm:ss')

			const time = Math.floor((Number(data.openTime) - Date.now()) / 1000)
			if (time >= 0) {
				state.optionData.downTime = { val: time }
			} else {
				state.optionData.downTime = { val: 0 }
			}
		}
	}

	/**
	 * 加载交割周期列表
	 */
	async function loadOptionList() {
		const res = await optionList({ symbol: state.symbol, period: state.timeResolution.period })
		if (res.code === 0) {
			state.times = res.data.map((item: any) => {
				const newItem = { ...item }
				// newItem.name = formatTime(newItem.openTime, 'MM-DD HH:mm:ss')
				newItem.name = `${formatTime(item.openTime, 'HH:mm')}~${formatTime(item.closeTime, 'HH:mm')}`
				newItem.sTime = formatTime(item.openTime, 'HH:mm')
				newItem.oTime = formatTime(item.closeTime, 'HH:mm')
				return newItem
			})
			state.currentTimesOption = state.times[0]
		}
	}

	async function changeSymbol(symbolObj: any) {
		if (state.symbol === symbolObj.symbol) return
		state.symbol = symbolObj.symbol
		state.isFavor = symbolObj.isFavor
		tvConfig.symbol = state.symbol
		await initData()
		state.orderRefreshTime = Date.now()
	}
	/**
	 * 获取币对信息
	 */
	async function loadCoinInfo() {
		const res = await getCoinInfo({ symbol: state.symbol })
		if (res.code === 0) {
			state.baseCoinScale = res.data.baseCoinScale || 2
			state.minAmount = res.data.minAmount || 100
		}
	}

	async function createWsConnect(config?: any) {
		if (isWeb.value && config?.overrides) {
			delete config.overrides['paneProperties.vertGridProperties.color']
			delete config.overrides['paneProperties.horzGridProperties.color']
		}
		wsService?.disconnect()
		wsService = new WebSocketService(
			`${import.meta.env.VITE_API_BASE_URL}/delivery-contract/delivery-contract-ws`
		)
		wsService.connect()

		wsService.subscribe('/topic/flash-option/thumb', (msgObj) => {
			const data = JSON.parse(msgObj.body)
			const macthIdx = state.symbolThumbList.findIndex((item) => item.symbol === data.symbol)
			const cuItem = state.symbolThumbList[macthIdx]
			state.symbolThumbList[macthIdx] = {
				...cuItem,
				...data,
				textColor: chgTextColor(cuItem?.close, data?.close)
			}
		})
		if (!config) return
		const datafeed = new Datafeeds(
			`${import.meta.env.VITE_API_BASE_URL}/delivery-contract/option/kline`,
			{ symbol: state.symbol },
			wsService,
			4,
			(res: any) => {
				if (res.closePrice) {
					state.openPrice = res.closePrice
				}
			}
		)
		if (isWeb.value) {
			const { createChart } = useTradingView()
			delete config.overrides
			widget = createChart(datafeed, {
				symbol: 'BINANCE:' + state.symbol.replace('/', ''),
				...config,
				resolution: state.resolution
			})
		} else {
			widget = createChart(datafeed, {
				symbol: 'BINANCE:' + state.symbol.replace('/', ''),
				...config,
				resolution: state.resolution
			})
		}

		wsService.subscribe(
			`/topic/flash-option/line/${state.symbol}/${state.timeResolution.period}`,
			(msgObj) => {
				if (state.list.length < 1) return
				if (msgObj.body) {
					const res = JSON.parse(msgObj.body)
					const newItem: any = { ...res }
					newItem.t = Number(res.t)
					newItem.x = newItem.t
					newItem.y = res.p
					state.newPoint = newItem
				}
			}
		)
		wsService.subscribe('/topic/flash-option/turn-option/' + state.symbol, (msgObj) => {
			const res = JSON.parse(msgObj.body)
			if (state.orderRefreshTime > 0 && Date.now() - state.orderRefreshTime > 5000) {
				state.orderRefreshTime = Date.now()
			}
			console.log('收到新交割合约推送：', res)
			if (res.period !== state.timeResolution.period) {
				return
			}
			loadOptionList()

			state.optionData.optionNo = res.id

			state.optionData.sTime = formatTime(res.startTime, 'mm:ss')
			state.optionData.oTime = formatTime(res.openTime, 'mm:ss')

			const time = Math.floor((Number(res.openTime) - Date.now()) / 1000)
			if (time >= 0) {
				state.optionData.downTime = { val: time }
			} else {
				state.optionData.downTime = { val: 0 }
			}
		})
	}

	// 时间切换
	function setKLineResolution(type: string) {
		widget.chart().setResolution(type)
	}
	function setKlineTime(row: any) {
		widget.chart().setChartType(3) // 切换图形
		widget.chart().setResolution(row.value)
	}
	//  设置副图
	function setSubAction(type: any) {
		// 存在删除 ，不存在添加
		const getIndicator = widget.chart().getAllStudies()

		const isBottomStudy = BOTTOM_STUDIES.indexOf(type.value) !== -1
		if (isBottomStudy) {
			const hasIndicator = getIndicator.filter((item: any) => {
				return isBottomStudy && BOTTOM_STUDIES.indexOf(item.name) !== -1
			})
			if (hasIndicator.length > 0) {
				hasIndicator.forEach((indicator: any) => {
					widget.chart().removeEntity(indicator.id)
				})
			}
		}

		const hasIndicator = getIndicator.filter((item) => item.name === type.value)
		if (hasIndicator.length > 0) {
			hasIndicator.forEach((indicator: any) => {
				widget.chart().removeEntity(indicator.id)
			})
			return
		}
		switch (type.label) {
			case 'MA':
				widget.chart().createStudy(type.value, !1, !1, [1], null, {})
				widget.chart().createStudy(type.value, !1, !1, [7], null, {})
				widget.chart().createStudy(type.value, !1, !1, [99], null, {})
				break
			case 'EMA':
				widget.chart().createStudy(type.value, !1, !1, [7], null, {})
				widget.chart().createStudy(type.value, !1, !1, [25], null, {})
				widget.chart().createStudy(type.value, !1, !1, [99], null, {})
				break
			case 'BOLL':
				widget
					.chart()
					.createStudy(type.value, !1, !1, [7], null, { 'plot.color': 'rgb(118,32,99)' })
				break
			case 'KDJ':
				widget
					.chart()
					.createStudy(type.value, !1, !1, [7], null, { 'plot.color': 'rgb(118,32,99)' })
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

	const updatePeriod = (obj: any) => {
		state.timeResolution = obj
		// loadOptionList()
		updateTimeOption()
	}

	async function loadOptionThumbs() {
		const res = await getOptionThumbs()
		if (res.code === 0) {
			state.symbolThumbList = res.data
			fetchFavorFind()
		}
	}

	// 获取自选列表
	async function fetchFavorFind() {
		if (!userStore.loginToken) return
		const res = await favorFind({ type: findTypeEnum.dcontract })
		if (res.code === 0) {
			const favorList = (Array.isArray(res.data) && res.data) || []

			const symbolThumbList = state.symbolThumbList
			symbolThumbList.forEach((item) => {
				const isFavor = favorList?.findIndex((favor) => favor.symbol === item.symbol)
				item.isFavor = isFavor >= 0
				if (item.symbol === state.symbol) {
					state.isFavor = item.isFavor
				}
			})
		}
	}
	//  自选操作
	async function favorStatusAction(symbol: any, status: any) {
		const favorAction = !status ? favorAdd : favorDelete
		const res = await favorAction({ symbol: symbol, type: findTypeEnum.dcontract })
		if (res.code === 0) {
			fetchFavorFind()
			showNotify({
				type: 'primary',
				message: !status ? i18n.global.t(`trade.txt138`) : i18n.global.t(`trade.txt139`)
			})
		}
	}

	return {
		state,
		initData,
		setKLineResolution,
		updatePeriod,
		changeSymbol,
		initThumb,
		setSubAction,
		loadOptionList,
		favorStatusAction,
		updateTimeOption
	}
}
