<script setup lang="ts">
import { routeTo } from '@/utils/routeTo'
import { thousandsComma, PONTextColor, formatNumUnit } from '@/utils/trade'
import { useTradeStore } from '@/store/modules/trade/index'
import { formatChange } from '@/utils'
import { reactive, ref, inject, watch, onMounted } from 'vue'
import Quote from '@/views/quote/index.vue'
import { marketSearchEnum } from '@/enums/trade'
import { formatTime } from '@/utils/date'
import { useKyc } from '@/hooks/useKyc'
import { useI18n } from 'vue-i18n'
import { useWalletStore } from '@/store/modules/wallet'
import TradeWs from '../trade-ws/index.vue'
import pcorder from '../trade-ws/pcorder.vue'
import CreateOrder from '../create-order/index.vue'
import { useDevice } from '@/hooks/useDevice'
import { useUserStore } from '@/store/useUserStore'
const userStore = useUserStore()
const { isPC } = useDevice()
const { kycInfo, toKyc, updateKycInfo } = useKyc()
const tradeStore = useTradeStore()
const { t } = useI18n()
const isVerfy = ref(!kycInfo.isAuth)
const globalData = inject('globalData')
const walletStore = useWalletStore()

const state = reactive({
	showCoinInfo: false,
	showSearch: false,
	coinInfo: {
		infolink: '',
		information: '',
		name: '',
		unit: ''
	} as any,
	switchShow: true
})
onMounted(() => {
	if (userStore.loginToken) {
		updateKycInfo()
	}
})
</script>
<template>
	<div
		class="px-4 py-3 text-style-small-500 bg-background-secondary flex items-center justify-between"
		v-if="isVerfy && !kycInfo.isAuth">
		<div class="flex items-center flex-1">
			<img src="/imgs/common/question.svg" class="w-4 h-4 mr-1" />
			<span class="overflow1Ellipsis text-style-web-small-regular text-text-secondary">
				{{ t('trade.txt11') }}{{ globalData.webName }}{{ t('trade.text11') }}
			</span>
		</div>
		<div class="flex items-center" v-if="!kycInfo.isAuth" @click="toKyc(true)">
			<van-button
				class="bg-brand-main border-0 cursor-pointer !h-[24px] text-always-white text-style-web-small-medium">
				<div>{{ t('trade.txt12') }}</div>
			</van-button>
			<Icon
				name="common/close"
				:size="24"
				class="text-text-primary w-6 h-6 ml-1 cursor-pointer"
				@click="isVerfy = false" />
		</div>
	</div>
	<div class="px-4 py-3 border-b-4 border-border-subtle web:hidden">
		<div>
			<div class="flex justify-between items-center">
				<div class="flex items-center text-style-medium-700">
					<Icon
						name="head/menu"
						:size="24"
						class="text-text-primary"
						@click="state.showSearch = true" />

					<!-- <img src="/imgs/trade/menu.svg " class="w-6 h-6" @click="state.showSearch = true" /> -->
					<span class="mx-2 my-[2px] text-text-primary">{{ tradeStore.state?.currentSymboy }}</span>
				</div>
				<div class="flex items-center">
					<Icon
						name="trade/credit-card"
						:size="20"
						class="text-text-primary mr-[16px]"
						@click="routeTo('/my/deposit')" />

					<!-- <img
						src="/imgs/trade/credit-card.svg"
						@click="routeTo('/my/deposit')"
						class="w-5 h-5 mx-4" /> -->
					<Icon
						:name="`common/${tradeStore.currentWsSymboy.isFavor ? 'bookmarked' : 'bookmark'}`"
						:size="20"
						:class="tradeStore.currentWsSymboy.isFavor ? 'text-text-brand' : 'text-text-tertiary'"
						@click="
							tradeStore.favorStatusAction(
								tradeStore.currentWsSymboy.symbol,
								tradeStore.currentWsSymboy.isFavor
							)
						" />

					<!-- <img
						:src="`/imgs/common/${tradeStore.currentWsSymboy.isFavor ? 'bookmarked' : 'bookmark'}.svg`"
						class="w-5 h-5"
						@click="
							tradeStore.favorStatusAction(
								tradeStore.currentWsSymboy.symbol,
								tradeStore.currentWsSymboy.isFavor
							)
						" /> -->
				</div>
			</div>
		</div>
		<div class="grid grid-cols-[156px_1fr_1fr] mt-3">
			<div class="mt-1">
				<div class="text-web-h1-bold" :class="tradeStore.currentWsSymboy?.textColor">
					{{ thousandsComma(tradeStore.currentWsSymboy?.close) }}
				</div>
				<div class="text-style-web-small-regular mt-1 text-text-tertiary">
					{{ thousandsComma(walletStore.getUSDTPrice(tradeStore.currentWsSymboy?.close))
					}}{{ walletStore.getCurrencyInfo().code }}
				</div>
				<div
					class="text-style-web-small-regular mt-1"
					:class="PONTextColor(tradeStore.currentWsSymboy?.chg)">
					{{ formatChange(tradeStore.currentWsSymboy?.chg) }}
				</div>
			</div>
			<div class="text-style-web-small-regular">
				<div class="text-text-description">24H {{ t('trade.txt17') }}</div>
				<div class="text-text-primary mt-[2px]">
					{{ thousandsComma(tradeStore.currentWsSymboy?.high) }}
				</div>
				<div class="text-text-description mt-2">
					24H {{ t('trade.txt18') }}({{ tradeStore.state.currentCoinInfo.coinSymbol }})
				</div>
				<div class="text-text-primary mt-[2px]">
					{{ formatNumUnit(tradeStore.currentWsSymboy?.volume?.toFixed(2)) }}
				</div>
			</div>
			<div class="text-style-web-small-regular">
				<div class="text-text-description">24H {{ t('trade.txt20') }}</div>
				<div class="text-text-primary mt-[2px]">
					{{ thousandsComma(tradeStore.currentWsSymboy?.low) }}
				</div>
				<div class="text-text-description mt-2">24H {{ t('trade.txt18') }}(USDT)</div>
				<div class="text-text-primary mt-[2px]">
					{{ formatNumUnit(tradeStore.currentWsSymboy?.turnover?.toFixed(2)) }}
				</div>
			</div>
		</div>
	</div>
	<div>
		<div class="flex" :class="isPC && 'border-b border-border-subtle'">
			<Quote v-model:show="state.showSearch" :type="marketSearchEnum.trade" />
			<div class="flex-1 border-t border-border-subtle">
				<div class="h-[72px] pdph:hidden flex items-center px-[16px] border-t border-border-gutter">
					<div class="flex items-center cursor-pointer text-text-primary">
						<span class="mx-2 my-[2px] text-style-web-h3-bold">
							{{ tradeStore.state?.currentSymboy }}
						</span>
						<!-- <img src="/imgs/common/arrow-down.svg" class="w-[18px] h-[18px]" /> -->
					</div>
					<div
						class="text-style-web-h2-bold ml-[16px] min-w-[120px]"
						:class="tradeStore.currentWsSymboy?.textColor">
						{{ thousandsComma(tradeStore.currentWsSymboy?.close) }}
					</div>
					<div
						class="ml-[30px] grid grid-cols-[100px_100px_100px_100px] text-style-web-small-regular text-text-primary">
						<div class=" ">
							<div class="text-text-description">24H {{ t('trade.txt17') }}</div>
							<div class="text-text-primary mt-[2px]">
								{{ thousandsComma(tradeStore.currentWsSymboy?.high) }}
							</div>
						</div>
						<div class=" ">
							<div class="text-style-web-small-regular text-text-description">
								24H {{ t('trade.txt18') }}（{{ tradeStore.state.currentCoinInfo.coinSymbol }}）
							</div>
							<div class="text-text-primary mt-[2px]">
								{{ formatNumUnit(tradeStore.currentWsSymboy?.volume?.toFixed(2)) }}
							</div>
						</div>
						<div class="">
							<div class="text-style-web-small-regular text-text-description">
								24H {{ t('trade.txt20') }}
							</div>
							<div class="text-text-primary mt-[2px]">
								{{ thousandsComma(tradeStore.currentWsSymboy?.low) }}
							</div>
						</div>
						<div class=" ">
							<div class="text-style-web-small-regular text-text-description">
								24H {{ t('trade.txt18') }}(USDT)
							</div>
							<div class="text-text-primary mt-[2px]">
								{{ formatNumUnit(tradeStore.currentWsSymboy?.turnover?.toFixed(2)) }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex" :class="isPC && 'border-t border-border-subtle'">
					<div class="flex-1">
						<TradeWs />
					</div>
					<div class="pdph:hidden w-[288px] border-l border-r border-border-strong overflow-hidden">
						<pcorder />
					</div>
					<div class="pdph:hidden w-[320px] ">
						<CreateOrder />
					</div>
				</div>
			</div>
		</div>
	</div>
	<van-popup v-model:show="state.showCoinInfo" position="bottom" round>
		<div class="mt-5 mb-[50px] px-4">
			<div class="flex items-center justify-between mb-[22px]">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt21') }}</div>
				<div class="">
					<img src="/imgs/common/close.svg" @click="state.showCoinInfo = false" class="w-6 h-6" />
				</div>
			</div>
			<div class="flex items-center my-3">
				<img :src="state.coinInfo?.logo" @click="state.showCoinInfo" class="w-7.5 h-7.5" />
				<span class="mx-3 text-web-h2-bold text-text-primary">{{ state.coinInfo.unit }}</span>
				<span class="text-style-web-body-regular text-text-tertiary">
					{{ state.coinInfo.name }}
				</span>
			</div>
			<div class="flex justify-between items-center">
				<div class="text-style-web-body-regular text-text-description">
					{{ t('trade.txt22') }}
				</div>
				<div class="text-style-web-body-regular text-text-brand">No.{{ state.coinInfo.rank }}</div>
			</div>
			<div class="flex justify-between items-center my-2">
				<div class="text-style-web-body-regular text-text-description">
					{{ t('trade.txt23') }}
				</div>
				<div class="text-style-web-body-regular text-text-primary">
					{{ formatNumUnit(state.coinInfo?.marketValue) }}
				</div>
			</div>
			<div class="flex justify-between items-center">
				<div class="text-style-web-body-regular text-text-description">
					{{ t('trade.txt24') }}
				</div>
				<div class="text-style-web-body-regular text-text-primary">
					{{ formatNumUnit(state.coinInfo?.currencyAmount) }}
				</div>
			</div>
			<div class="flex justify-between items-center my-2">
				<div class="text-style-web-body-regular text-text-description">
					{{ t('trade.txt25') }}
				</div>
				<div class="text-style-web-body-regular text-text-primary">
					{{ formatNumUnit(state.coinInfo?.publishAmount) }}
				</div>
			</div>
			<div class="flex justify-between">
				<div class="text-style-web-body-regular text-text-description">
					{{ t('trade.txt26') }}
				</div>
				<div class="text-style-web-body-regular text-text-primary">
					<div class="text-right">{{ thousandsComma(state.coinInfo?.highestPrice) }}</div>
					<div class="text-style-web-small-medium text-text-description mt-0.5 text-right">
						{{ formatTime(state.coinInfo?.highestPriceTime, 'YYYY-MM-DD') }}
					</div>
				</div>
			</div>
			<div class="text-web-h5-bold text-text-secondary my-3">{{ t('trade.txt27') }}</div>
			<div class="text-style-web-base-regular text-text-description">
				{{ state.coinInfo.information }}
			</div>
		</div>
	</van-popup>
</template>
<style>
.overflow1Ellipsis {
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 1;
	-webkit-box-orient: vertical;
	word-wrap: break-word;
}
</style>
