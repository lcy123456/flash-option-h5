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
	getPositionList,
	getPlatefull,
	getCuFundingRate,
	geLatestTrade
} from '@/apis/swap'
import { computed, reactive } from 'vue'
import { showToast, showSuccessToast } from '@/components/base/toast'
import { chgSuccessColor, replaceToName } from '@/utils/trade'
import { useUserStore } from '@/store/useUserStore'
import {
	HandicapKeyEnum,
	directionTypeEnum,
	tradeOrderEnum,
	marketSearchEnum,
	orderTabActiveEnum,
	klineTypeEnum,
	findTypeEnum
} from '@/enums/trade'
import { entrustTypeEnum, orderStatusEnum } from '@/enums/swap'
import { useSwapWsStore } from '@/store/modules/swap/swap-ws'
import { routeTo } from '@/utils/routeTo'
import i18n from '@/i18n/index'

export const useSwapStore = defineStore('Swap-store', () => {
	const userStore = useUserStore()
	const state = reactive({
		typeList: [
			{
				label: i18n.global.t(`trade.txt131`),
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
		directionTextType: {
			[directionTypeEnum.BUY]: i18n.global.t(`trade.txt132`),
			[directionTypeEnum.SELL]: i18n.global.t(`trade.txt134`)
		} as any,
		entrustTypeTextType: {
			[entrustTypeEnum.OPEN]: i18n.global.t(`trade.txt141`),
			[entrustTypeEnum.CLOSE]: i18n.global.t(`trade.txt142`)
		} as any,
		orderStatusType: {
			[orderStatusEnum.ENTRUST_SUCCESS]: i18n.global.t(`trade.txt143`),
			[orderStatusEnum.ENTRUST_FAILURE]: i18n.global.t(`trade.txt144`),
			[orderStatusEnum.ENTRUST_CANCEL]: i18n.global.t(`trade.txt145`),
			[orderStatusEnum.ENTRUST_ING]: i18n.global.t(`trade.txt146`)
		} as any,
		symbolThumbList: [] as any, // 合约列表[币种ws在内]
		currentSymboy: '', // 当前币种
		favorList: [] as any, // 自选列表
		baseCoinScale: 6, // 价格精度？【】
		currentCoinInfo: {
			// 当前币种信息
			id: '',
			coinScale: 2, // 价格精度
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
			symbol: '',
			fee: 0, // 费用
			coinDecimal: 4, //基础币数量精度
			baseCoinDecimal: 2, // 结算币数量精度
			maxTotalShare: 1 //最大下单金额【调整杠杆用到】
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
		positionInfo: {
			pageSize: 10,
			pageNo: 1,
			finished: false,
			loading: false,
			total: 0,
			isOnlyCurrent: false,
			symbol: ''
		},
		positionData: {
			// 仓位信息
			balance: 0, // 可用余额
			blastMarginRate: 0, // 最低维持保证金率
			frozenBalance: 0, //冻结金额
			frozenMargin: 0 // 冻结保证金
		},
		positionList: [], //当前持仓
		marketTab: [
			// 行情搜索tab
			{ label: i18n.global.t(`trade.txt147`), value: marketSearchEnum.own },
			{ label: i18n.global.t(`trade.txt148`), value: marketSearchEnum.trade },
			{ label: i18n.global.t(`trade.txt149`), value: marketSearchEnum.swap },
			{ label: i18n.global.t(`trade.txt150`), value: marketSearchEnum.option }
		],
		marketActive: marketSearchEnum.own, // 当前行情tab
		currentParams: {
			// 当前委托
			pageSize: 100,
			pageNo: 1,
			isOnlyCurrent: false
		},
		orderTabActive: orderTabActiveEnum.position, // 底部切换tab
		KlineAction: klineTypeEnum.kline, // 操作是深度还是tv
		echartsData: {
			ask: {},
			bid: {}
		} as any,
		rate: 0, // 资金费率
		fundingTime: 0, // 下次资金费率倒计时
		currentUserInfo: {
			// 币种用户相关信息
			positionType: 0, // 仓位类型
			balance: 0, // 可用余额
			leverageList: [] // 可选的杠杆倍数
		},
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
		const res = await favorFind({ type: findTypeEnum.swap })
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
		const favorAction = !status ? favorAdd : favorDelete
		const res = await favorAction({ symbol: symbol, type: findTypeEnum.swap })
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
	// 匹配币种ws
	const mathWsSymboy = computed(() => {
		return function (symboy: any) {
			if (symboy && state.symbolThumbList.length) {
				return state.symbolThumbList.find((item) => item.symbol === symboy)
			}
			return {}
		}
	})
	// 获取当前币种信息
	const fetchSymboyInfo = async () => {
		const res: any = await getSymboyInfo({ symbol: state.currentSymboy })
		state.baseCoinScale = res && res.data.baseCoinScale
		state.currentCoinInfo = res.data
		const lever = res?.data?.leverage.split(',') || []
		state.currentUserInfo.leverageList = lever.map((item) => Number(item))
		fetchFundingRate()
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
		const array = state.lastTrades
		if (data.length && Array.isArray(data)) {
			array.unshift(...data)
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
			fetchExchangePlateFull(resp)
		}
	}
	async function fetchExchangePlateFull(resp: any) {
		const res = await getPlatefull({ symbol: state.currentSymboy })
		state.echartsData = res.data
		// console.log(resp.direction)
		// if (resp.direction  === 'SELL') {
		// 	state.echartsData.ask = resp
		// } else {
		// 	state.echartsData.bid = resp
		// }
	}
	async function fetchCurrentOrder() {
		if (!userStore.loginToken) return
		const params: any = {
			...state.currentParams
		}
		if (state.currentParams.isOnlyCurrent) {
			params.contractCoinId = state.currentCoinInfo.id
		}
		const res: any = await getCurrentOrder(params)
		state.currentOrderList = res && res?.data?.content
	}
	// 撤销当前委托
	async function fetchCancelOrder(params: any) {
		const res: any = await cancelCurrentOrder(params)
		const isSuccess = res.code === 0
		if (isSuccess) {
			fetchCurrentOrder()
		}
		showSuccessToast(i18n.global.t(`trade.txt140`))
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
		state.historyInfo.total = res && res.data.totalElements
		state.historyInfo.pageNo++

		state.historyInfo.loading = false
		const result = res && res?.data.content
		state.historyOrderList = state.historyOrderList.concat(result)
		if (state.historyOrderList.length >= state.historyInfo.total) {
			state.historyInfo.finished = true
		}
	}
	// 获取当前持仓
	async function fetchPostionList(isInit?: any) {
		const params: any = {
			pageSize: state.positionInfo.pageSize,
			pageNo: state.positionInfo.pageNo
		}
		if (state.positionInfo.isOnlyCurrent) {
			params.symbol = state.currentCoinInfo.symbol
		}
		if (isInit) {
			state.historyOrderList = []
			params.pageNo = 1
		}
		if (!userStore.loginToken) return
		const res: any = await getPositionList(params)
		const result = res && res?.data
		console.log(result);
		
		state.positionList = result?.currentPositionWithCutList
		state.positionData = {
			// 仓位信息
			balance: result.balance, // 可用余额
			blastMarginRate: result.blastMarginRate, // 最低维持保证金率
			frozenBalance: result.frozenBalance, //冻结金额
			frozenMargin: result.frozenMargin // 冻结保证金
		}
		state.currentUserInfo.balance = res.data?.balance
		state.currentUserInfo.positionType = res.data.positionType
	}
	// 判断当前tab 刷新对应的数据
	function refreshAccount() {
		switch (state.orderTabActive) {
			case orderTabActiveEnum.current:
				fetchCurrentOrder()
				break
			case orderTabActiveEnum.history:
				fetchHistoryOrder(true)
				break
			case orderTabActiveEnum.position:
				fetchPostionList()
				break
		}
	}
	// 刷新数据
	function debounceRefreshAccount() {
		// debounce(refreshAccount, 1000 * 5)
		refreshAccount()
	}
	async function fetchFundingRate() {
		const res = await getCuFundingRate({ contractCoinId: state.currentCoinInfo.id })
		state.rate = res.data.fundingRate
		state.fundingTime = res.data.refreshTime
	}
	// 拿合约最新成交
	async function fetchLastTrade() {
		console.log(1111)
		const res: any = await geLatestTrade({
			symbol: state.currentSymboy,
			size: 20
		})
		if (res.code === 0) {
			state.lastTrades = res.data.slice(0, 20)
		}
	}
	/**
	 * 切换当前币种
	 * @param symbol 切换币种
	 */
	function switchSymbol(symbol: string) {
		if (!location.pathname.includes('/swap/')) {
			state.currentSymboy = symbol
			routeTo('swap', { params: { symbol: replaceToName(symbol) } })
			return
		}

		if (state.currentSymboy === symbol && location.pathname.includes('/swap/')) return
		const swapWsStore = useSwapWsStore()
		state.currentSymboy = symbol
		routeTo('swap', { params: { symbol: replaceToName(symbol) } })
		fetchSymboyInfo()
		swapWsStore.setSymbol(symbol)
	}
	return {
		state,
		mathWsSymboy,
		currentWsSymboy,
		switchSymbol,
		fetchLastTrade,
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
		fetchPostionList
	}
})
