import { defineStore } from 'pinia'
import Datafeeds from '@/datafeed/bitrade'
import WebSocketService from '@/request/WebSocketService'
import { useTradeStore } from '@/store/modules/trade/index'
import { useUserStore } from '@/store/useUserStore'
import { reactive } from 'vue'
import { useTradingView } from '@/hooks/useTradingView'
import { BOTTOM_STUDIES } from '@/constants/config'
import { useRoute } from 'vue-router'
import { useWalletStore } from '@/store/modules/wallet'

let wsService = null

export const useTradeWsStore = defineStore('Trade-ws-store', () => {
	const { createChart, switchCurrency } = useTradingView()
	const route = useRoute()
	let config: any
	const tradeStore = useTradeStore()
	const userStore = useUserStore()
	let widget: any = ''
	const walletStore = useWalletStore()

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
		if (symbol) {
			tradeStore.reseteWsData()
		}
		symbol = tradeStore.state.currentSymboy || symbol || state.symbol
		console.log(symbol, 'symbol====createTradeWs')
		config = {
			..._config,
			user_id: 'user_2', //  为实例2配置唯一的用户标识符
			charts_storage_id: 'chart_2', // 设置唯一的图表存储ID tvxwevents.settings tradingview.chartproperties
			container_id: 'kline_trade_container',
			symbol: symbol,
			hide_top_toolbar: true,
			theme: 'light'
		}
		wsService?.disconnect()
		wsService = new WebSocketService(`${import.meta.env.VITE_FOLLOW_MARKET_WS}/market/market-ws`)
		wsService.connect()

		const baseCoinScale = tradeStore.state.currentCoinInfo.baseCoinScale
		const skin = 'light'
		// 订阅24小时行情
		wsService.subscribe('/topic/market/thumb', (msg: any) => {
			const resp = JSON.parse(msg.body)
			console.log(resp, '订阅24小时行情');
			tradeStore.updateWsSymboy(resp)
		})

		// 获取汇率
		wsService.subscribe('/topic/market/rate', (msg: any) => {
			const resp = JSON.parse(msg.body)
			console.log(resp);
			if (Array.isArray(resp)) {
				resp.forEach((item) => {
					for (const k in item) {
						// console.log('k :', k, item[k])
						walletStore.setRate(k, item[k])
					}
				})
			}
			// tradeStore.updateWsSymboy(resp)
		})

		if (route.name === 'trade') {
			const datafeed = new Datafeeds(
				`${import.meta.env.VITE_FOLLOW_MARKET_WS}/market`,
				symbol,
				wsService,
				baseCoinScale
			)
			widget = createChart(datafeed, {
				symbol,
				skin,
				...config
			})
			//订阅实时成交信息
			wsService.subscribe(`/topic/market/trade/${symbol}`, (msg: any) => {
				const resp = JSON.parse(msg.body)
				console.log(resp,'订阅实时成交信息');
				
				tradeStore.updateWsTrades(resp)
			})
			//订阅盘口消息
			wsService.subscribe('/topic/market/trade-plate/' + symbol, (msg: any) => {
				const resp = JSON.parse(msg.body)
				console.log(resp,'订阅盘口消息')
				tradeStore.updateWsOrderBook(resp)
			})
			if (userStore.loginToken) {
				console.log(userStore.userInfo);
				
				//订阅委托取消信息
				wsService.subscribe(
					`/topic/market/order-canceled/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						const resp = JSON.parse(msg.body)
						console.log(resp, '订阅委托取消信息')
						tradeStore.debounceRefreshAccount()
					}
				)
				//订阅委托交易完成
				wsService.subscribe(
					`/topic/market/order-completed/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						const resp = JSON.parse(msg.body)
						console.log(resp, '订阅委托交易完成')
						tradeStore.debounceRefreshAccount()
					}
				)
				//订阅委托部分交易
				wsService.subscribe(
					`/topic/market/order-trade/${symbol}/${userStore.userInfo.id}`,

					(msg: any) => {
						const resp = JSON.parse(msg.body)
						console.log(resp, '订阅委托部分交易')
						tradeStore.debounceRefreshAccount()
					}
				)
				// 创建订单
				wsService.subscribe(
					`/topic/market/order-created/${symbol}/${userStore.userInfo.id}`,
					(msg: any) => {
						console.log(msg, '创建订单')
						tradeStore.fetchCurrentOrder()
					}
				)
			}
		}
		// 	}
		// )
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
		// const chart = widget.chart()
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
		const hasIndicator = getIndicator.filter((item: any) => {
			return item.name === type.value
		})
		if (hasIndicator.length > 0) {
			hasIndicator.forEach((indicator: any) => {
				widget.chart().removeEntity(indicator.id)
			})
			return
		}
		console.log('type :', type)
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
				widget.chart().createStudy(type.value)
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
