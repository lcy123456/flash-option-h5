import { reactive, ref } from 'vue'
import { getPositionList } from '@/apis/swap'
import { useTransfer } from './useTransfer'
import { toFixed } from '@/utils/index'
import { useUserStore } from '@/store/useUserStore'
type Item = {
	logo: string
	coin: string
	balance: number
	frozenBalance: number
	frozenMargin: number
	currentCapital: number
}

type DataObject = {
	amount: number
	items: Item[]
}

export default function useSwapAccount() {
const userStore = useUserStore()
	const loading = ref(true)
	const data: DataObject = reactive({
		amount: 0,
		items: [],
		hideAsset: false,
		profitAndLossAsset: 1,
		profitAndLossRatio: 2.5
	})
	const { state, refreshSwapAndFollowAmount } = useTransfer()

	const loadData = async () => {
		if ( !userStore.loginToken) return
		await refreshSwapAndFollowAmount()
		data.amount = toFixed(state.amountObj.SWAP, 2)
		const res = await getPositionList()
		if (res.code === 0) {
			data.items = [
				{
					logo: '/imgs/common/usdt.svg',
					coin: 'USDT',
					balance: toFixed(res.data.balance, 2), // 可用保证金
					frozenBalance: toFixed(res.data.frozenBalance, 2), // 已用保证金
					frozenMargin: toFixed(res.data.frozenMargin, 2), // 冻结保证金
					currentCapital: toFixed(res.data.currentCapital, 2) //    账户权益
				}
			]
		}
		loading.value = false
	}

	loadData()
	return {
		data,
		loading,
		loadData
	}
}
