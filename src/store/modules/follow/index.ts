import { defineStore } from 'pinia'
import { StorageKeyEnum } from '@/enums'
import { getItem } from '@/utils/storage'
import { symbolList, followWallet } from '@/apis/follow'

export const useFollowStore = defineStore('follow', {
	state: () => ({
		symbolList: [],
		walletInfo: {}
	}),
	actions: {
		async init() {
			if (!getItem(StorageKeyEnum.token)) return
			const [res, res1]: any = await Promise.all([symbolList(), followWallet()])
			if (res.code === 0) {
				this.symbolList = res.data
			}
			if (res1.code === 0) {
				this.walletInfo = res1.data
			}
		}
	}
})
