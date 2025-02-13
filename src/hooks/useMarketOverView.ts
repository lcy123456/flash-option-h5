import { getOverview } from '@/apis'
import { reactive } from 'vue'
import { formatChange, toFixed } from '@/utils'
import WebSocketService from '@/request/WebSocketService'
import { getAdvertise, getNotices } from '@/apis/market'

const state = reactive({
	data: { changeRank: [], recommend: [] },
	banners: [],
	notices: [],
	lang: ''
})
let wsService = null

const imgCoin: any = {}
export function useMarketOverView() {
	const loadData = async () => {
		const res: any = await getOverview()
		if (res.code === 0) {
			const changeRank = res.data.changeRank || []
			state.data.changeRank = parseRankData(changeRank)
			const recommend = res.data.recommend || []
			state.data.recommend = parseRecommend(recommend)
		}
	}
	// if (state.data.recommend.length === 0) {
	// 	loadData()
	// }

	// onBeforeMount(() => {
	const createWs = () => {
		wsService?.disconnect()
		wsService = new WebSocketService(import.meta.env.VITE_MARKET_WS)
		wsService.connect()

		wsService?.subscribe('/topic/market/overview', (msgObj) => {
			// if (Date.now() - lastUpdateTime > UPDATE_TIME && msgObj.body) {
			// 	lastUpdateTime = Date.now()
			const res = JSON.parse(msgObj.body)
			res.changeRank = res.changeRank || []
			state.data.changeRank = parseRankData(res.changeRank)
			res.recommend = res.recommend || []
			state.data.recommend = parseRecommend(res.recommend)
			// }
		})
	}
	// })

	const initData = (type: number) => {
		loadData()
		createWs()
		loadNoticeAndBanner(type)
	}

	const closeWs = () => {
		wsService?.disconnect()
	}
	// onBeforeUnmount(() => {
	// 	wsService?.disconnect()
	// })
	return {
		state,
		loadNoticeAndBanner,
		initData,
		closeWs
	}
}

async function loadNoticeAndBanner(type = 1) {
	const res: any = await getAdvertise({ sysAdvertiseLocation: type })
	if (res.code === 0) {
		state.banners = res.data
	}
	const res1: any = await getNotices({ pageNo: 1, pageSize: 10 })
	if (res1.code === 0) {
		state.notices = res1.data.content
	}
}

/**
 * 排行榜数据转换
 * @param array
 * @returns
 */
function parseRankData(array = []) {
	return array.map((item: any) => {
		const newItem = { ...item }
		if (newItem.symbol) {
			newItem.symbol0 = newItem.symbol.split('/')[0]
			newItem.symbol1 = newItem.symbol.split('/')[1]
		}

		if (newItem.iconUrl || newItem.logo) {
			imgCoin[newItem.symbol] = newItem.iconUrl || newItem.logo
			newItem.iconUrl = newItem.iconUrl || newItem.logo
		} else if (imgCoin[newItem.symbol]) {
			newItem.iconUrl = imgCoin[newItem.symbol]
		} else if (newItem.symbol0) {
			newItem.iconUrl = `https://uptx-prod.s3.ap-northeast-1.amazonaws.com/icon/coin/${newItem.symbol0}.png`
		}
		newItem.chgDesc = formatChange(newItem.chg)
		newItem.volume = toFixed(newItem.volume, 2)

		return newItem
	})
}

/**
 * 推荐数据转换
 * @param array
 * @returns
 */
function parseRecommend(array = []) {
	return array.map((item: any) => {
		const newItem = { ...item }

		if (newItem.symbol) {
			newItem.symbol0 = newItem.symbol.split('/')[0]
			newItem.symbol1 = newItem.symbol.split('/')[1]
		}

		if (newItem.iconUrl || newItem.logo) {
			imgCoin[newItem.symbol] = newItem.iconUrl || newItem.logo
			newItem.iconUrl = newItem.iconUrl || newItem.logo
		} else if (imgCoin[newItem.symbol]) {
			newItem.iconUrl = imgCoin[newItem.symbol]
		} else if (newItem.symbol0) {
			newItem.iconUrl = `https://uptx-prod.s3.ap-northeast-1.amazonaws.com/icon/coin/${newItem.symbol0}.png`
		}
		newItem.chgDesc = formatChange(newItem.chg)
		newItem.volume = toFixed(newItem.volume, 2)

		return newItem
	})
}
