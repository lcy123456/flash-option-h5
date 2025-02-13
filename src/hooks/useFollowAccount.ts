import { reactive, ref } from 'vue'
import { getFollowCurrent } from '@/apis/wallet'
import { useTransfer } from './useTransfer'
import { toFixed } from '@/utils/index'
import { followWallet } from '@/apis/follow'

type Item = {
	logo: string
	coin: string
	balance: number
	frozenBalance: number
}
type Item2 = {
	orderPrice: string
}
type DataObject = {
	amount: number
	items: Item[]
	list: Item2[]
	hideAsset: boolean
}
const data: DataObject = reactive({
	amount: 0,
	items: [],
	list: [],
	hideAsset: false
})

export default function useFollowAccount() {
	const loading = ref(true)
	const { state, refreshSwapAndFollowAmount } = useTransfer()

	const fetchWaUSDT = async () => {
		const res = await followWallet()
		if (res.code === 0) {
			const freeUSDT = toFixed(res?.data.balance, 2)
			data.items = [
				{
					logo: '/imgs/common/usdt.svg',
					coin: 'USDT',
					balance: freeUSDT,
					frozenBalance: toFixed(res?.data.frozenBalance, 2)
				}
			]
		}
	}

	const loadData = async () => {
		loading.value = false
		await refreshSwapAndFollowAmount()
		data.amount = toFixed(state.amountObj.FOLLOW, 2)

		const res = await getFollowCurrent({
			current: 1,
			size: 100
		})
		if (res.code === 0) {
			const list = res.data.list
			if (list.length > 0) {
				data.list = list.map((item: any) => {
					const newItem = { ...item }
					newItem.orderPrice = toFixed(newItem.orderPrice, 2)
					return newItem
				})
			}
		}
		loading.value = false
		fetchWaUSDT()
	}

	return {
		data,
		loading,
		loadData
	}
}
