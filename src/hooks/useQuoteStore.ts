import { chgTextColor } from '@/utils/trade'
import { reactive } from 'vue'
import { favorFind, favorAdd, favorDelete } from '@/apis/swap'
import { marketSearchEnum, findTypeEnum } from '@/enums/trade'
import { showSuccessToast } from '@/components/base/toast'
import { getFlashOptionCoins } from '@/apis/option'
import i18n from '@/i18n/index'
import { getItem } from '@/utils/storage'
import { StorageKeyEnum } from '@/enums'

const state = reactive({
	isInit: false,
	searchValue: '',
	marketTab: [
		// 行情搜索tab
		{ title: i18n.global.t(`trade.txt147`), id: marketSearchEnum.own },
		{ title: i18n.global.t(`trade.txt148`), id: marketSearchEnum.trade },
		{ title: i18n.global.t(`text129`), id: marketSearchEnum.swap },
		// { title: i18n.global.t(`trade.txt150`), id: marketSearchEnum.option },
		{ title: i18n.global.t('text130'), id: marketSearchEnum.dcontract }
	],
	marketActive: marketSearchEnum.own as any, // 当前行情tab
	marketList: [
		{ label: i18n.global.t(`trade.txt148`), value: marketSearchEnum.trade },
		{ label: i18n.global.t(`text129`), value: marketSearchEnum.swap },
		// { label: i18n.global.t(`trade.txt150`), value: marketSearchEnum.option }
		{ label: i18n.global.t(`text130`), value: marketSearchEnum.dcontract }
	],
	optActive: marketSearchEnum.trade as any,
	optionFavor: [], // 期权自选
	optionCoinList: [] as any,
	pageFrom: '', // 打开弹窗的页面来源,
	showSymbol: true // 是否打开侧边的币对刷选
})
export default function useQuoteStore() {
	const loginToken = getItem(StorageKeyEnum.token)

	function handleOptional(item: any) {
		state.optActive = item.value
	}

	// 期权自选列表
	async function findOptionFavor() {
		if (!loginToken) return
		const res = await favorFind({
			type: findTypeEnum.option
		})
		state.optionFavor = res.data
		const symbolThumbList = state.optionCoinList
		symbolThumbList.forEach((item) => {
			const isFavor = state.optionFavor?.findIndex((favor) => favor.symbol === item.symbol)
			item.isFavor = isFavor >= 0
		})
		state.optionCoinList = symbolThumbList
	}

	// 自选操作
	async function favorOptionAction(symbol: any, status: any) {
		const favorAction = !status ? favorAdd : favorDelete
		const res = await favorAction({ symbol: symbol, type: findTypeEnum.option })
		if (res.code === 0) {
			findOptionFavor()
			showSuccessToast(!status ? i18n.global.t(`trade.txt138`) : i18n.global.t(`trade.txt139`))
		}
	}
	// 更新期权的24ws
	function updateWsSymboy(data: any) {
		const symboys = state.optionCoinList
		const macthIdx = symboys.length && symboys.findIndex((item) => item.symbol === data.symbol)
		const cuItem = state.optionCoinList[macthIdx]
		state.optionCoinList[macthIdx] = {
			...state.optionCoinList[macthIdx],
			...data,
			textColor: chgTextColor(cuItem?.close, data?.close)
		}
	}
	return {
		state,
		updateWsSymboy,
		favorOptionAction,
		findOptionFavor,
		handleOptional
	}
}
