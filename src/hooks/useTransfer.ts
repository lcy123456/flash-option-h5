import { reactive, watch } from 'vue'
import { swapAssetsOverview } from '@/apis/wallet'
import { getWalletUSDT, canTransfer } from '@/apis/trade'
import { toFixed } from '@/utils/index'
import { useUserStore } from '@/store/useUserStore'

type ITEM = {
	label: string
	value: string
}
type STATEOBJ = {
	[key: string]: any
	items: ITEM[]
}
const state: STATEOBJ = reactive({
	leftAccount: {},
	type: 'left',
	currentAccount: null,
	rightAccount: {},
	amountObj: {},
	items: []
})
export function useTransfer() {
	const userStore = useUserStore()

	const initData = (items: ITEM[]) => {
		state.items = items
		state.leftAccount = state.items.filter((item: any) => item.value === 'SPOT')[0]
		state.rightAccount = state.items.filter((item: any) => item.value === 'FOLLOW')[0]
	}

	const refreshAmount = async () => {
		if (!userStore.loginToken) {
			return
		}
		refreshSwapAndFollowAmount()
		const res1 = await getWalletUSDT('USDT')
		if (res1.code === 0) {
			const amount = toFixed(res1?.data.balance, 2)
			state.amountObj['SPOT'] = amount
		}
	}
	const refreshSwapAndFollowAmount = async () => {
		const res = await swapAssetsOverview()
		if (res.code === 0) {
			res.data.forEach((item: any) => {
				state.amountObj[item.type] = item.balance
			})
		}
	}

	// watch(
	// 	() => state.leftAccount,
	// 	() => {
	// 		if (state.leftAccount.value === 'FOLLOW' && state.rightAccount.value === 'SWAP') {
	// 		}
	// 	}
	// )
	// watch(
	// 	() => state.rightAccount,
	// 	() => {
	// 		if (state.leftAccount.value === 'FOLLOW' && state.rightAccount.value === 'SWAP') {
	// 		}
	// 	}
	// )

	async function checkAccount() {
		if (state.leftAccount.value === 'FOLLOW' && state.rightAccount.value === 'SWAP') {
			const res = await canTransfer()
			return res
		}
		return {
			code: 0,
			data: { canTransfer: true }
		}
	}

	return {
		initData,
		state,
		refreshAmount,
		refreshSwapAndFollowAmount,
		checkAccount
	}
}
