import { defineStore } from 'pinia'
import {
	getSymbolThumb,
	favorFind,
	favorDelete,
	favorAdd,
	getSymboyInfo,
	getCurrentOrder,
	cancelCurrentOrder,
	getHistoryOrder,
	getAssetList,
	getPlatefull
} from '@/apis/trade'
import { computed, reactive } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { chgSuccessColor, replaceToName } from '@/utils/trade'
import {
	HandicapKeyEnum,
	directionTypeEnum,
	tradeOrderEnum,
	orderStatusEnum,
	orderTabActiveEnum,
	klineTypeEnum,
	findTypeEnum
} from '@/enums/trade'
// import { debounce } from '@/utils'
import i18n from '@/i18n/index'
import { useUserStore } from '@/store/useUserStore'
import { routeTo } from '@/utils/routeTo'
import { useTradeWsStore } from '@/store/modules/trade/trade-ws'

export const useTradeStore = defineStore('Trade-store', () => {
	const userStore = useUserStore()
	const state = reactive({
		typeList: [
			{
				label: i18n.global.t(`trade.txt129`),
				value: tradeOrderEnum.LIMIT_PRICE
			},
			{
				label: i18n.global.t(`trade.txt130`),
				value: tradeOrderEnum.MARKET_PRICE
			}
		],
		directionType: {
			[directionTypeEnum.BUY]: i18n.global.t(`trade.txt133`),
			[directionTypeEnum.SELL]: i18n.global.t(`trade.txt135`)
		} as any,
		orderStatusType: {
			[orderStatusEnum.COMPLETED]: i18n.global.t(`trade.txt136`),
			[orderStatusEnum.CANCELED]: i18n.global.t(`trade.txt137`)
		} as any,
		symbolThumbList: [] as any, // 币币列表[币种ws在内]
		currentSymboy: '', // 当前币种
		favorList: [] as any, // 自选列表
		baseCoinScale: 6, // 价格精度？【】
		currentCoinInfo: {
			// 当前币种信息
			coinScale: 6, // 价格精度
			baseCoinScale: 6, // 币种精度
			symbolFee: 0.001,
			enableMarketBuy: 1, // 0:禁用  1:启用
			enableMarketSell: 1,
			exchangeable: 1, // 0:可交易   1:不可交易
			publishType: 'NONE',
			currentTime: 0,
			publishAmount: 0,
			publishPrice: 0,
			coinSymbol: '',
			baseSymbol: '',

			fee: 0 // 费用
		},
		lastTrades: [] as any, // 最新成交
		orderBooks: {
			askList: [], //
			buyList: [],
			askTotal: 0,
			buyTotal: 0
		} as any,
		useDiscount: '0', // //是否试用手续费抵扣,0 不使用 1使用
		maxPostion: 6,
		handicapType: HandicapKeyEnum.ALL, //盘口类型
		currentOrderList: [], // 当前委托列表
		historyInfo: {
			pageSize: 10,
			pageNo: 1,
			finished: false,
			loading: false,
			total: 0
		},
		historyOrderList: [], //历史委托
		assetList: [], //资产列表
		currentParams: {
			// 当前委托
			pageSize: 100,
			pageNo: 1,
			type: tradeOrderEnum.LIMIT_PRICE
		},
		orderTabActive: orderTabActiveEnum.current, // 底部切换tab
		KlineAction: klineTypeEnum.kline, // 操作是深度还是tv
		echartsData: {
			ask: {},
			bid: {}
		} as any,
		echoPrice: null // 点击盘口，回显价格
	})
	// 获取币币列表
	async function fetchSymThumb() {
		const res = await getSymbolThumb()
		if (res?.code === 0) {
			state.symbolThumbList = res.data || []
		}
	}
	// 获取自选列表
	async function fetchFavorFind() {
		if (!userStore.loginToken) return
		const res = await favorFind({ type: findTypeEnum.trade })
		state.favorList = (Array.isArray(res.data) && res.data) || []
		const symbolThumbList = state.symbolThumbList
		symbolThumbList.forEach((item) => {
			const isFavor = state.favorList?.findIndex((favor) => favor.symbol === item.symbol)
			item.isFavor = isFavor >= 0
		})
		state.symbolThumbList = symbolThumbList
	}
	// 自选操作
	async function favorStatusAction(symbol: any, status: any) {
		const favorApi = !status ? favorAdd : favorDelete
		const res = await favorApi({ symbol: symbol, type: findTypeEnum.trade })
		if (res.code === 0) {
			fetchFavorFind()
			showSuccessToast(!status ? i18n.global.t(`trade.txt138`) : i18n.global.t(`trade.txt139`))
		}
	}
	// 设置当前自选列表
	function setFavorStatus(symbol: any, status: any) {
		const symbolIndex = state.symbolThumbList.findIndex((item) => item.symbol === symbol)
		state.symbolThumbList = state.symbolThumbList[symbolIndex].isFavor = status
	}
	// 当前币种ws
	const currentWsSymboy = computed(() => {
		if (state?.currentSymboy && state.symbolThumbList.length) {
			return state.symbolThumbList.find((item) => item.symbol === state.currentSymboy)
		}
		return {}
	})
	// 获取当前币种信息
	const fetchSymboyInfo = async () => {
		const res: any = await getSymboyInfo({ symbol: state.currentSymboy })
		state.baseCoinScale = res && res.data.baseCoinScale
		state.currentCoinInfo = res.data
	}
	// 更新24小时行情
	const updateWsSymboy = (data: any) => {
		const symboys = state.symbolThumbList
		const macthIdx = symboys.length && symboys.findIndex((item) => item.symbol === data.symbol)
		const cuItem = state.symbolThumbList[macthIdx]
		state.symbolThumbList[macthIdx] = {
			...state.symbolThumbList[macthIdx],
			...data,
			textColor: chgSuccessColor(cuItem?.close, data?.close)
		}
	}
	//
	function reseteWsData() {
		state.lastTrades = []
		state.orderBooks = {
			askList: [],
			buyList: [],
			askTotal: 0,
			buyTotal: 0
		}
	}
	//  更新最新订单
	function updateWsTrades(data: any) {
		const array = []
		if (data.length && Array.isArray(data)) {
			array.push(...data)
		}
		array.sort((a, b) => b.time - a.time)
		state.lastTrades = array.slice(0, 20)
	}
	// 更新订单簿信息
	function updateWsOrderBook(resp: any) {
		if (resp.direction == 'SELL') {
			const asks = resp.items
			state.orderBooks.askList = []
			let total = 0
			for (let i = state.maxPostion - 1; i >= 0; i--) {
				let ask: any = {}
				if (i < asks.length) {
					ask = asks[i]
				} else {
					ask['price'] = 0
					ask['amount'] = 0
				}
				ask.direction = 'SELL'
				ask.position = i + 1
				state.orderBooks.askList.push(ask)
			}
			for (let i = state.orderBooks.askList.length - 1; i >= 0; i--) {
				if (i == state.orderBooks.askList.length - 1 || state.orderBooks.askList[i].price == 0) {
					state.orderBooks.askList[i].totalAmount = state.orderBooks.askList[i].amount
				} else {
					state.orderBooks.askList[i].totalAmount =
						state.orderBooks.askList[i + 1].totalAmount + state.orderBooks.askList[i].amount
				}
				total += state.orderBooks.askList[i].amount
			}
			state.orderBooks.askTotal = total
		} else {
			const bids: any = resp.items
			state.orderBooks.buyList = []
			let total = 0
			for (let i = 0; i < state.maxPostion; i++) {
				let bid: any = {}
				if (i < bids.length) {
					bid = bids[i]
				} else {
					bid['price'] = 0
					bid['amount'] = 0
				}
				bid.direction = 'BUY'
				bid.position = i + 1
				state.orderBooks.buyList.push(bid)
			}
			for (let i = 0; i < state.orderBooks.buyList.length; i++) {
				if (i == 0 || state.orderBooks.buyList[i].amount == 0) {
					state.orderBooks.buyList[i].totalAmount = state.orderBooks.buyList[i].amount
				} else {
					state.orderBooks.buyList[i].totalAmount =
						state.orderBooks.buyList[i - 1].totalAmount + state.orderBooks.buyList[i].amount
				}
				total += state.orderBooks.buyList[i].amount
			}
			state.orderBooks.buyTotal = total
		}
		if (state.KlineAction == 'dept') {
			fetchExchangePlateFull()
		}
	}
	async function fetchExchangePlateFull() {
		const res: any = await getPlatefull({ symbol: state.currentSymboy })
		if (res.code === 0) {
			state.echartsData = res.data
		}
	}
	async function fetchCurrentOrder() {
		if (!userStore.loginToken) return
		const params = {
			...state.currentParams,
			symbol: state.currentSymboy
		}
		const res: any = await getCurrentOrder(params)
		state.currentOrderList = res && res?.data.content
	}
	// 撤销当前委托
	async function fetchCancelOrder(params: any) {
		const res: any = await cancelCurrentOrder(params)
		const isSuccess = res.code === 0
		isSuccess
			? showSuccessToast(i18n.global.t(`trade.txt140`))
			: showFailToast(i18n.global.t(`trade.txt86`))
		return res
	}
	// 获取历史订单  isInit 是否清空数据
	async function fetchHistoryOrder(isInit?: any) {
		if (!userStore.loginToken) return
		const params = {
			pageSize: state.historyInfo.pageSize,
			pageNo: state.historyInfo.pageNo
		}
		if (isInit) {
			state.historyOrderList = []
			params.pageNo = 1
		}
		state.historyInfo.loading = true
		const res: any = await getHistoryOrder(params)
		console.log(res, 'res===')
		state.historyInfo.total = res.data && res.data.totalElements
		state.historyInfo.pageNo++
		state.historyInfo.loading = false
		const result = res.data && res?.data.content
		state.historyOrderList = state.historyOrderList.concat(result)
		if (state.historyOrderList.length >= state.historyInfo.total) {
			state.historyInfo.finished = true
		}
	}
	// 获取资产
	async function fetchAssetList(params: any) {
		if (!userStore.loginToken) return
		const res: any = await getAssetList(params)
		state.assetList = res && res?.data
	}
	// 判断当前tab 刷新对应的数据
	function refreshAccount() {
		if (!userStore.loginToken) return
		switch (state.orderTabActive) {
			case orderTabActiveEnum.current:
				fetchCurrentOrder()
				break
			case orderTabActiveEnum.history:
				fetchHistoryOrder(true)
				break
			case orderTabActiveEnum.assets:
				fetchAssetList({})
				break
		}
	}
	// 刷新数据
	function debounceRefreshAccount() {
		// debounce(refreshAccount, 1000 * 5)
		refreshAccount()
	}
	/**
	 * 切换当前币种
	 * @param symbol 切换币种
	 */
	function switchSymbol(symbol: string) {
		console.log('symbol---333---symbol', symbol)
		if (!location.hash.includes('/trade/')) {
			state.currentSymboy = symbol
			routeTo('trade', { params: { symbol: replaceToName(symbol) } })
			return
		}
		if (state.currentSymboy === symbol) return
		const tradeWsStore = useTradeWsStore()
		state.currentSymboy = symbol
		routeTo('trade', { params: { symbol: replaceToName(symbol) } })
		fetchSymboyInfo()
		tradeWsStore.setSymbol(symbol)
	}
	return {
		state,
		currentWsSymboy,
		switchSymbol,
		reseteWsData,
		updateWsSymboy,
		updateWsTrades,
		updateWsOrderBook,
		favorStatusAction,
		setFavorStatus,
		fetchSymThumb,
		fetchFavorFind,
		fetchSymboyInfo,
		fetchCurrentOrder,
		fetchCancelOrder,
		fetchHistoryOrder,
		debounceRefreshAccount,
		fetchAssetList
	}
})
