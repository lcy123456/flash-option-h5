import { defineStore } from 'pinia'
import Datafeeds from '@/datafeed/swaptrade'
import WebSocketService from '@/request/WebSocketService'
import { useSwapStore } from '@/store/modules/swap/index'
import { useUserStore } from '@/store/useUserStore'
import { reactive } from 'vue'
import { useTradingView } from '@/hooks/useTradingView'
import { BOTTOM_STUDIES } from '@/constants/config'
import { useRoute } from 'vue-router'

let wsService = null

export const useSwapWsStore = defineStore('swap-ws-store', () => {
	const { createChart, switchCurrency } = useTradingView()
	const route = useRoute()
	let config: any
	const swapStore = useSwapStore()
	const userStore = useUserStore()
	let widget: any = ''
	const state = reactive({
		symbol: 'BTC/USDT',
		skin: 'light',
		list: [],
		min: 0,
		max: 0,
		startingData: {},
		updateTime: 0,
		turnOptionRes: null,
		amount: 0,
		orderRefreshTime: 0,
		time1: 0,
		time2: 0,

		resolution: localStorage.getItem('swap_proid') || '60min'
	})
	async function createTradeWs(
		symbol?: string,
		_config?: { baseCoinScale: number; skin: 'light' | 'day'; [key: string]: any }
	) {
		if (!symbol) {
			symbol = state.symbol
		}
		if (symbol) {
			swapStore.reseteWsData()
		}
		wsService?.disconnect()
		wsService = new WebSocketService(
			`${import.meta.env.VITE_FOLLOW_MARKET_WS}/contract-market/swap-ws`
		)
		wsService.connect()

		config = {
			..._config,
			hide_top_toolbar: true,
			user_id: 'user_swap', // 为实例2配置唯一的用户标识符
			charts_storage_id: 'chart_swap', // 设置唯一的图表存储ID tvxwevents.settings tradingview.chartproperties
			container_id: 'kline_swap_container',
			theme: 'light'
		}
		symbol = swapStore.state.currentSymboy || symbol || state.symbol

		// 订阅24小时行情
		wsService.subscribe('/topic/swap/thumb', (msg: any) => {
			const resp = JSON.parse(msg.body)
			swapStore.updateWsSymboy(resp)
		})
		if (route.name === 'swap') {
			//订阅实时成交信息
			wsService.subscribe(`/topic/swap/trade/${symbol}`, (msg: any) => {
				const resp = JSON.parse(msg.body)
				swapStore.updateWsTrades(resp)
			})
			//订阅盘口消息
			wsService.subscribe('/topic/swap/trade-plate/' + symbol, (msg: any) => {
				const resp = JSON.parse(msg.body)
				swapStore.updateWsOrderBook(resp)
			})
			if (userStore.loginToken) {
				//订阅委托取消信息
				wsService.subscribe(
					`/topic/swap/order-canceled/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						const resp = JSON.parse(msg.body)
						console.log(resp, '订阅委托取消信息')
						swapStore.debounceRefreshAccount()
					}
				)
				//订阅委托交易完成
				wsService.subscribe(
					`/topic/swap/order-completed/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						const resp = JSON.parse(msg.body)
						console.log(resp, '订阅委托交易完成')
						swapStore.debounceRefreshAccount()
					}
				)
				//订阅委托部分交易
				wsService.subscribe(
					`/topic/swap/order-trade/${symbol}/${userStore.userInfo.id}`,

					(msg: any) => {
						const resp = JSON.parse(msg.body)
						console.log(resp, '订阅委托部分交易')
						swapStore.debounceRefreshAccount()
					}
				)
				// 创建订单
				wsService.subscribe(
					`/topic/swap/order-created/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						console.log(msg, '创建订单')
						swapStore.fetchCurrentOrder()
					}
				)
				// 推送持仓
				wsService.subscribe(
					`/topic/swap/position/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						console.log(msg, '推送持仓')
						swapStore.debounceRefreshAccount()
					}
				)
			}
		}
		// 	}
		// )

		const baseCoinScale = swapStore.state.currentCoinInfo.baseCoinScale
		const skin = 'light'
		const datafeed = new Datafeeds(
			`${import.meta.env.VITE_FOLLOW_MARKET_WS}/contract-market`,
			symbol,
			wsService,
			baseCoinScale
		)
		widget = createChart(datafeed, {
			symbol,
			skin,
			...config
		})
	}
	/**
	 * 币种切换
	 * @param symbol 切换币种
	 */
	const setSymbol = async (symbol: string) => {
		switchCurrency(symbol)
		createTradeWs(symbol, config)
	}
	// 时间切换
	function setKLineResolution(row: any) {
		if (row.key === 'line') {
			state.resolution = row.proid
			setKlineTime(row)
		} else {
			state.resolution = row.proid
			widget.chart().setChartType(1) // 切换k线
			widget.chart().setResolution(row.value)
		}
	}
	function setKlineTime(row: any) {
		widget.chart().setChartType(3) // 切换图形
		widget.chart().setResolution(row.value)
	}
	//  设置副图
	function setSubAction(type: any) {
		// console.log(widget.chart().getAllStudies())
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
				// widget.chart().createStudy("Relative Strength Index", !1, !1, [12], null, {});
				// widget.chart().createStudy("Relative Strength Index", !1, !1, [24], null, {});
				break
			default:
				widget.chart().createStudy(type.value, !1, !1, [20], null, {}, null, {
					'plot.color': '#00adff'
				})
				break
		}
	}
	function showTVSetting() {
		widget?.activeChart()?.executeActionById('insertIndicator')
	}
	function fullscreen() {
		widget?.startFullscreen()
	}
	return {
		fullscreen,
		showTVSetting,
		createTradeWs,
		setSymbol,
		setSubAction,
		setKLineResolution
	}
})
