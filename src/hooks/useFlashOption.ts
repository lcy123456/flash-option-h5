import WebSocketService from '@/request/WebSocketService'
import { getOptionsHistory, getOptionStarting, getCoinInfo } from '@/apis/option'
import { reactive } from 'vue'
import Datafeeds from '@/datafeed/FlashOptionDataFeed.ts'
import { useTinyTradingView } from '@/hooks/useTinyTradingView'
import { formatTimestamp, formatTime } from '@/utils/date'
import { useRoute, useRouter } from 'vue-router'
import useQuoteStore from '@/hooks/useQuoteStore'

const { createChart } = useTinyTradingView()
const quoteStore = useQuoteStore()

const tvConfig = {
	header_widget: {
		enabled: false // 隐藏头部
	},
	theme: 'light',
	hide_top_toolbar: true,
	fullscreen: false,
	autosize: true,
	hide_side_toolbar: false,
	container_id: 'kline_option_container',
	left_toolbar: false // Hide left toolbar
}
let orderPoint = { t: 0 }
const state = reactive({
	symbol: 'BTC/USDT',
	skin: 'light',
	times: [], // 时间周期
	timeResolution: { label: '30sec', value: 'PERIOD_030', time: 30 * 1000 },
	tickInterval: 1000, // 单位毫秒
	list: [],
	min: 0,
	max: 0,
	startingData: { startTime: 0, downTime: { val: 0 } },
	amount: undefined,
	orderRefreshTime: 0,
	resolution: localStorage.getItem('flash_option_resolution') || '1min',
	newPoint: { y: -1 },

	addOrderInfo: {},

	symbolThumbInfo: {},
	baseCoinScale: 2,
	minAmount: 100, // 最小下单金额
	focusInput: 0, // 输入框光标激活

	version: 2, // 版本号

	orderCountDownTime: 0,
	orderDirection: '',
	showResVisible: false, // 显示下单结果弹窗

	totalBuy: 0,
	totalSell: 0,
	sellPercent: 0
})
let wsService = null
let widget
export function useFlashOption() {
	const router = useRouter()
	const route = useRoute()

	const initData = async (_symbol?: string) => {
		const symbol = _symbol || route.params?.symbol
		if (symbol && symbol.includes('-')) {
			state.symbol = symbol.replace('-', '/')
		}
		initHighchart()
		createWsConnect(tvConfig)
		loadCoinInfo()
	}

	const initHighchart = async () => {
		state.list = []
		state.min = 0
		state.max = 0
		await getStartingTime()
		await loadHistory()
	}

	const updateHighchart = async () => {
		state.list = []
		state.min = 0
		state.max = 0
		await loadHistory()
	}

	async function changeSymbol(symbol: string) {
		if (state.symbol === symbol) return
		const symbolParam = symbol.replace('/', '-')
		router.push({ name: 'option', params: { symbol: symbolParam } })
		// console.log('changeSymbol(symbol: string) :', symbol)
		state.symbol = symbol
		tvConfig.symbol = symbol
		initData(symbolParam)

		state.orderRefreshTime = Date.now()
	}
	async function loadCoinInfo() {
		const res = await getCoinInfo({ symbol: state.symbol })
		if (res.code === 0) {
			state.baseCoinScale = res.data.baseCoinScale || 2
			state.minAmount = res.data.minAmount || 100
		}
	}
	function createWsConnect(config?: any) {
		wsService?.disconnect()
		wsService = new WebSocketService(import.meta.env.VITE_FLASH_OPTION_WS)
		wsService.connect()
		wsService?.subscribe('/topic/flash-option/thumb', (msgObj) => {
			const res = JSON.parse(msgObj.body)
			state.symbolThumbInfo = res
			quoteStore.updateWsSymboy(res)
		})
		if (!config) return
		const datafeed = new Datafeeds(
			`${import.meta.env.VITE_API_BASE_URL}/flash-option/option/kline`,
			{ symbol: state.symbol },
			wsService,
			4
		)
		widget = createChart(datafeed, {
			symbol: 'BINANCE:' + state.symbol.replace('/', ''),
			skin: state.skin,
			...config
		})
		wsService?.subscribe(
			`/topic/flash-option/line/${state.symbol}/${state.timeResolution.value}`,
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
		wsService?.subscribe('/topic/flash-option/turn-option/' + state.symbol, (msgObj) => {
			const res = JSON.parse(msgObj.body)
			if (res.period !== state.timeResolution.value) {
				return
			}
			if (state.orderRefreshTime > 0 && Date.now() - state.orderRefreshTime > 3000) {
				state.orderRefreshTime = Date.now()
			}
			parseStartingRes(res)
			// updateHighchart()
		})

		/**
		 * 订单数据
		 */
		wsService?.subscribe('/topic/flash-option/order/' + state.symbol, (msgObj) => {
			if (state.list.length < 1) return
			if (state.newPoint.y < 0) return
			const res = JSON.parse(msgObj.body)
			if (res.period !== state.timeResolution.value) {
				return
			}
			res.t = Number(res.o.t)
			const newItem: any = { ...res.o }
			newItem.t = Number(res.t)
			newItem.x = newItem.t
			newItem.y = state.newPoint.y
			if (newItem.t - orderPoint.t > 1000) {
				orderPoint = newItem
				// orderPoint.used = false
				// console.log('orderPoint :', orderPoint)
				state.newPoint = newItem

				if (newItem.d == 0) {
					// 买入
					state.totalBuy += newItem.a
				} else {
					// 卖出
					state.totalSell += newItem.a
				}
				state.sellPercent = calculatePercentage(state.totalSell, state.totalBuy)

				// console.log('state.sellPercent :', state.sellPercent, state.totalSell, state.totalBuy)
			}
		})

		if (state.version === 2) {
			/**
			 * 订单结果数据
			 */
			// wsService?.subscribe(
			// 	`/topic/flash-option/order/result/${state.symbol}/${state.timeResolution.value}`,
			// 	(msgObj) => {
			// 		if (state.list.length < 1) return
			// 		if (state.newPoint.y < 0) return
			// 		const res = JSON.parse(msgObj.body)
			// 		if (res.period !== state.timeResolution.value) {
			// 			return
			// 		}
			// 		// res.t = Number(res.t)
			// 		res.t = Date.now()
			// 		const newItem: any = { ...res }
			// 		newItem.t = res.t
			// 		newItem.x = newItem.t
			// 		newItem.y = state.newPoint.y
			// 		newItem.ic = res.ic
			// 		newItem.result = true
			// 		if (newItem.t - orderPoint.t > 1000) {
			// 			orderPoint = newItem
			// 			orderPoint.used = false
			// 			state.newPoint = newItem
			// 		}
			// 	}
			// )
		}
	}

	function setKLineResolution(type: string, resolution: string) {
		state.resolution = resolution
		widget.chart().setResolution(type)
	}

	const updateTimeResolution = (obj: any) => {
		// let time = 1000 * 60
		// switch (obj.value) {
		// 	case 'PERIOD_030':
		// 		state.tickInterval = 500
		// 		time = 30 * 1000
		// 		break
		// 	case 'PERIOD_1':
		// 		state.tickInterval = 1000
		// 		time = 1000 * 60
		// 		break
		// 	case 'PERIOD_2':
		// 		state.tickInterval = 20 * 1000
		// 		time = 1000 * 60 * 2
		// 		break
		// 	case 'PERIOD_3':
		// 		state.tickInterval = 30 * 1000
		// 		time = 1000 * 60 * 3
		// 		break
		// 	case 'PERIOD_5':
		// 		state.tickInterval = 50 * 1000
		// 		time = 1000 * 60 * 5
		// 		break
		// 	case 'PERIOD_10':
		// 		state.tickInterval = 100 * 1000
		// 		time = 1000 * 60 * 10
		// 		break
		// 	case 'PERIOD_30':
		// 		time = 1000 * 60 * 30
		// 		break
		// }
		// obj.time = time
		state.timeResolution = obj
		initHighchart()
	}
	return {
		state,
		initData,
		setKLineResolution,
		updateTimeResolution,
		changeSymbol,
		createWsConnect,
		initHighchart,
		getStartingTime
	}
}
async function getStartingTime() {
	const res = await getOptionStarting({
		symbol: '' + state.symbol,
		period: state.timeResolution.value
	})
	if (res.code === 0) {
		const data = res.data
		parseStartingRes(data)
	}
}
async function loadHistory() {
	const res = await getOptionsHistory({
		symbol: '' + state.symbol,
		period: state.timeResolution.value
	})
	if (res.code === 0) {
		const { max, min } = findExtremes(res.data)
		state.min = min.p
		state.max = max.p

		state.list = res.data
			.map((item: any) => {
				const newItem = { ...item }
				newItem.t = Number(newItem.t)
				newItem.x = newItem.t
				newItem.y = newItem.p
				return newItem
			})
			.reverse()
	}
}

const findExtremes = (arr: any[]) => {
	const extremes = arr.reduce(
		(acc, obj) => {
			if (obj.p > acc.max.p) {
				acc.max = obj
			}
			if (obj.p < acc.min.p) {
				acc.min = obj
			}
			return acc
		},
		{ max: arr[0], min: arr[0] }
	)

	return extremes
}

function parseStartingRes(data: any) {
	data.closeTime = Number(data.closeTime)
	data.openTime = Number(data.openTime)
	data.startTime = Number(data.startTime)
	data.name = formatTimestamp(data.openTime)
	for (const key in data) {
		state.startingData[key] = data[key]
	}
	const downTime = Math.floor((data.openTime - Date.now()) / 1000)
	if (downTime > 0) {
		state.startingData.downTime = {
			val: downTime
		}
		state.startingData.updateXTime = Date.now()

		state.startingData.sTime = formatTime(data.startTime, 'mm:ss')
		state.startingData.oTime = formatTime(data.openTime, 'mm:ss')

		// state.sellPercent = -1
		// state.sellPercent = calculatePercentage(
		// 	state.startingData.totalSell,
		// 	state.startingData.totalBuy
		// )
	}
}

function calculatePercentage(a: number, b: number) {
	if (a === 0 && b === 0) {
		return 50 // 如果a和b都是0，返回50
	} else {
		const total = a + b
		const percentage = (a / total) * 100
		return Math.ceil(percentage) // 向上取整到最近的整数
	}
}
