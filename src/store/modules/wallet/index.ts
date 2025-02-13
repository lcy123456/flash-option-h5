import { defineStore } from 'pinia'
import {
	spotAssetsOverview,
	swapAssetsOverview,
	getMidnightBalance,
	getAssetList
} from '@/apis/wallet'
import { exchangeRate } from '@/apis/index'
import { toFixed, plus, minus, div, mul } from '@/utils'
import { getItem, setItem } from '@/utils/storage'
import { StorageKeyEnum } from '@/enums'

export const useWalletStore = defineStore('wallet', {
	state: () => ({
		hideAsset: false,
		totalAsset: 0,
		spotAsset: 0,
		swapAsset: 0,
		followAsset: 0,
		profitAndLossAsset: 0, // 盈亏金额
		profitAndLossRatio: 0, // 盈亏率
		assetList: [],
		// currentCurrency: getItem(StorageKeyEnum.currency) || 'usd', // 当前渲染货币
		currentCurrency: 'usd', // 当前渲染货币
		usdRate: 1, // usdt 兑 usd 汇率
		vndRate: 0, //  usdt 兑 越南盾 汇率
		rates: []
	}),
	actions: {
		async initAsset() {
			try {
				const [spot, swap_follow, midnightBalance, assetRes] = await Promise.all([
					spotAssetsOverview(),
					swapAssetsOverview(),
					getMidnightBalance(),
					getAssetList()
				])

				const spotValue = spot.data
				const swapValue = swap_follow.data?.find((item: any) => item.type === 'SWAP')
				const followValue = swap_follow.data?.find((item: any) => item.type === 'FOLLOW')
				const midnightBalanceValue = midnightBalance.data

				const scale = spotValue.scale

				this.spotAsset = toFixed(spotValue?.totalUsdtBalance, scale)
				this.swapAsset = toFixed(swapValue?.totalUsdtBalance, scale)
				this.followAsset = toFixed(followValue?.totalUsdtBalance, scale)
				this.totalAsset = plus(
					plus(this.spotAsset, this.swapAsset).toNumber(),
					this.followAsset
				).toNumber()

				this.profitAndLossAsset = toFixed(
					minus(this.totalAsset, midnightBalanceValue.asset).toNumber(),
					scale
				)
				if (midnightBalanceValue.asset == 0) {
					if (this.profitAndLossAsset === 0) {
						this.profitAndLossRatio = 0
					} else {
						this.profitAndLossRatio = 100
					}
				} else {
					this.profitAndLossRatio = toFixed(
						mul(
							div(this.profitAndLossAsset, midnightBalanceValue.asset).toNumber(),
							100
						).toNumber(),
						scale
					)
				}

				this.assetList = assetRes.data
			} catch (e) {
				console.error(e)
			}
		},

		async initExchangeRate() {
			const res: any = await exchangeRate()
			if (res.code === 0) {
				this.rates = []
				res.data.forEach((item: any) => {
					for (const k in item) {
						const index = this.rates.findIndex((it: any) => it.value === k)
						if (index === -1) {
							this.rates.push({ label: k, value: k })
						}
					}
					if (item.usd) {
						this.usdRate = item.usd
					}
					if (item.vnd) {
						this.vndRate = item.vnd
					}
				})
			}
		},
		getAssetByCoin(coin: string) {
			if (this.assetList.length === 0) {
				return null
			}
			const item = this.assetList.find((item: any) => {
				return item.coin === coin
			})
			return item
		},
		setRate(type: string, rate: number) {
			switch (type) {
				case 'usd':
					this.usdRate = rate
					break
				case 'vnd':
					this.vndRate = rate
					break
				default:
			}
		},
		setHideAsset(flag: boolean) {
			this.hideAsset = flag
		},
		setCurrentCurrency(val: string) {
			setItem(StorageKeyEnum.currency, val)
			this.currentCurrency = val
		},
		getUSDTPrice(count: number, scale?: number) {
			let rate = this.usdRate
			if (this.currentCurrency === 'usd') {
				rate = this.usdRate
			}

			if (this.currentCurrency === 'vnd') {
				rate = this.vndRate
			}
			// 转换USDT汇率显示
			if (!scale) {
				const numStr = `${count}`
				// 查找小数点的位置
				const dotIndex = numStr.indexOf('.')
				if (dotIndex !== -1) {
					scale = numStr.length - dotIndex - 1
				}
			}
			scale = scale || 2
			return toFixed(mul(count, rate).toNumber(), scale)
		},
		getCurrencyInfo() {
			return {
				code: this.currentCurrency
			}
		}
	}
})
