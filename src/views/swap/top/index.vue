<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import Pckline from '@/views/swap/swap-ws/pckline/index.vue'
import SwapWs from '@/views/swap/swap-ws/index.vue'
import { routeTo } from '@/utils/routeTo'
import { getAdvertise } from '@/apis/market'
import { marketSearchEnum } from '@/enums/trade'
import { thousandsComma, PONTextColor, formatNumUnit, fixD } from '@/utils/trade'
import { useSwapStore } from '@/store/modules/swap/index'
import { formatChange } from '@/utils'
import { reactive, ref, watch, computed, inject } from 'vue'
import Quote from '@/views/quote/index.vue'
import CreateOrder from '@/views/swap/create-order/index.vue'
import { formatTime } from '@/utils/date'
import { countDownFn } from '@/hooks/useCountDown'
import dayjs from 'dayjs'
import { useKyc } from '@/hooks/useKyc'
import { useWalletStore } from '@/store/modules/wallet'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const globalData = inject('globalData')
import { useUserStore } from '@/store/useUserStore'
const userStore = useUserStore()
const { kycInfo, toKyc, updateKycInfo } = useKyc()
const { countDown, startCountDown, formatCountTime } = countDownFn()
const swapStore = useSwapStore()
const walletStore = useWalletStore()

const { t } = useI18n()
const isVerfy = ref(!kycInfo.isAuth)
const state = reactive({
	showCoinInfo: false,
	showSearch: false,
	coinInfo: {
		infolink: '',
		information: '',
		name: '',
		unit: ''
	} as any,
	advertiseList: [] as any
})
watch(
	() => swapStore.state.fundingTime,
	() => {
		if (swapStore.state.fundingTime) {
			const nowDay = dayjs().format('YYYY-MM-DD HH:mm:ss')
			const second = dayjs(nowDay).valueOf()
			const time = (swapStore.state.fundingTime - second) / 1000
			startCountDown(time, true)
		}
	}
)
const coinScale = computed(() => {
	return swapStore.state.currentCoinInfo?.coinScale || 2
})
const fetchAdvertise = async () => {
	const res: any = await getAdvertise({
		sysAdvertiseLocation: 3
	})
	if (res.code === 0) {
		state.advertiseList = res.data
	}
}
onMounted(() => {
	fetchAdvertise()
	if (userStore.loginToken) {
		updateKycInfo()
	}
})
const handleToBulletin = (row: any) => {
	if (row.linkUrl.includes('http://') || row.linkUrl.includes('https://')) {
		window.open(row.linkUrl, '_blank')
		return
	}
	routeTo('advertiseDetail', { params: { id: row.serialNumber } })
}
</script>
<template>
	<div class="w-full h-full">
		<van-notice-bar
			v-if="state.advertiseList.length"
			:scrollable="false"
			background="var(--color-background-secondary)"
			color="var(--nt-gray)"
			class="">
			<template #left-icon>
				<!-- <img src="/imgs/swap/award.svg" class="w-4 h-4 mr-1" /> -->
				<Icon name="swap/award" :size="16" class="text-text-primary mr-1" />
			</template>
			<template #right-icon>
				<Icon name="close" :size="24" class="text-text-primary" @click="state.advertiseList = []" />
				<!-- <img src="/imgs/common/close-white.svg" class="w-6 h-6" @click="state.advertiseList = []" /> -->
			</template>
			<van-swipe
				v-if="state.advertiseList"
				vertical
				class="h-34"
				:autoplay="3000"
				:touchable="false"
				:show-indicators="false">
				<van-swipe-item
					class="flex items-center"
					v-for="(item, index) in state.advertiseList"
					:key="index"
					@click="handleToBulletin(item)">
					<div class="w-full van-ellipsis text-style-web-small-regular text-text-primary">
						{{ item.name }}
					</div>
				</van-swipe-item>
			</van-swipe>
		</van-notice-bar>
	</div>

	<div
		class="px-4 py-3 bg-background-secondary flex items-center justify-between"
		v-if="isVerfy && !kycInfo.isAuth">
		<div class="flex items-center flex-1">
			<img src="/imgs/common/question.svg" class="w-4 h-4 mr-1" />
			<span class="overflow1Ellipsis text-style-web-small-regular text-text-secondary">
				{{ t('trade.txt11') }}{{ globalData.webName }}{{ t('trade.text11') }}
			</span>
		</div>
		<div class="flex items-center cursor-pointer" v-if="!kycInfo.isAuth">
			<div
				@click="toKyc(true)"
				class="bg-brand-main rounded-[50px] px-3 py-1 text-always-white flex items-center justify-center">
				<div class="text-style-web-small-medium">{{ t('trade.txt12') }}</div>
			</div>
			<Icon
				name="close"
				:size="24"
				@click="isVerfy = false"
				class="text-text-primary ml-1 cursor-pointer" />
		</div>
	</div>
	<div
		:class="[
			!isPC ? 'px-4 border-b-4 border-border-subtle py-3' : 'border-t border-border-gutter'
		]">
		<div class="web:hidden">
			<div>
				<div class="flex justify-between items-center">
					<div class="flex items-center text-style-medium-700">
						<!-- <img src="/imgs/trade/menu.svg" class="w-6 h-6" @click="state.showSearch = true" /> -->
						<Icon
							name="trade/menu"
							:size="24"
							@click="state.showSearch = true"
							class="text-text-primary" />
						<span class="mx-2 my-[2px] flex items-center text-text-primary">
							{{ swapStore.state?.currentSymboy }}
							<span
								class="text-style-web-small-regular text-text-tertiary bg-background-tertiary px-[6px] py-[1px] ml-2 flex items-center">
								{{ t('trade.txt13') }}
							</span>
						</span>
					</div>
					<div class="flex items-center">
						<Icon
							name="trade/credit-card"
							:size="20"
							@click="routeTo('/my/deposit')"
							class="mx-4 text-text-tertiary" />
						<Icon
							v-if="swapStore.currentWsSymboy.isFavor"
							class="text-text-brand"
							name="common/bookmarked"
							:size="20"
							@click="
								swapStore.favorStatusAction(
									swapStore.currentWsSymboy.symbol,
									swapStore.currentWsSymboy.isFavor
								)
							" />
						<Icon
							v-else
							class="text-text-tertiary"
							name="common/bookmark"
							:size="20"
							@click="
								swapStore.favorStatusAction(
									swapStore.currentWsSymboy.symbol,
									swapStore.currentWsSymboy.isFavor
								)
							" />
						<!-- <img
							:src="`/imgs/common/${swapStore.currentWsSymboy.isFavor ? 'bookmarked' : 'bookmark'}.svg`"
							class="w-5 h-5"
							@click="
								swapStore.favorStatusAction(
									swapStore.currentWsSymboy.symbol,
									swapStore.currentWsSymboy.isFavor
								)
							" /> -->
					</div>
				</div>
			</div>
			<div class="grid grid-cols-[156px_1fr_1fr] mt-3">
				<div class="mt-1 w-[106px]">
					<div
						class="text-web-h1-bold text-text-primary"
						:class="swapStore.currentWsSymboy?.textColor">
						{{ thousandsComma(fixD(swapStore.currentWsSymboy?.close, coinScale)) }}
					</div>
					<div class="text-style-web-small-regular text-text-tertiary mt-1">
						{{
							thousandsComma(walletStore.getUSDTPrice(swapStore.currentWsSymboy?.close, coinScale))
						}}{{ walletStore.getCurrencyInfo().code }}
					</div>
					<div
						class="text-style-web-small-regular mt-1"
						:class="PONTextColor(swapStore.currentWsSymboy?.chg)">
						{{ formatChange(swapStore.currentWsSymboy?.chg) }}
					</div>
					<div>
						<div class="text-style-web-small-regular text-text-description mt-4">
							{{ t('trade.txt14') }}/{{ t('trade.txt15') }}
						</div>
						<div class="flex text-text-primary text-style-web-small-regular mt-[2px]">
							<span :class="PONTextColor(swapStore.state?.rate)" class="mr-[2px]">
								{{ fixD(swapStore.state?.rate, 2) }}%
							</span>
							{{ formatCountTime(countDown) }}
						</div>
					</div>
				</div>
				<div class="text-style-web-small-regular">
					<div class="text-text-description">{{ t('trade.txt16') }}</div>
					<div class="text-text-primary mt-[2px]">
						{{ thousandsComma(fixD(swapStore.currentWsSymboy?.mark, coinScale)) }}
					</div>
					<div class="text-text-description mt-2">24H {{ t('trade.txt17') }}</div>
					<div class="text-text-primary mt-[2px]">
						{{ thousandsComma(fixD(swapStore.currentWsSymboy?.high, coinScale)) }}
					</div>
					<div class="text-text-description mt-2">
						24H {{ t('trade.txt18') }}({{ swapStore.state.currentCoinInfo?.coinSymbol }})
					</div>
					<div class="text-text-primary mt-[2px]">
						{{ formatNumUnit(swapStore.currentWsSymboy?.volume?.toFixed(2)) }}
					</div>
				</div>
				<div class="text-style-web-small-regular">
					<div class="text-text-description">{{ t('trade.txt19') }}</div>
					<div class="text-text-primary mt-[2px]">
						{{ thousandsComma(fixD(swapStore.currentWsSymboy?.index, coinScale)) }}
					</div>
					<div class="text-text-description mt-2">24H {{ t('trade.txt20') }}</div>
					<div class="text-text-primary mt-[2px]">
						{{ thousandsComma(fixD(swapStore.currentWsSymboy?.low, coinScale)) }}
					</div>
					<div class="text-text-description mt-2">24H {{ t('trade.txt18') }}(USDT)</div>
					<div class="text-text-primary mt-[2px]">
						{{ formatNumUnit(swapStore.currentWsSymboy?.turnover?.toFixed(2)) }}
					</div>
				</div>
			</div>
		</div>
		<div class="flex">
			<Quote v-model:show="state.showSearch" :type="marketSearchEnum.swap" />
			<div v-if="isPC" class="flex-1">
				<div class="flex items-center text-style-web-small-regular my-[19px] px-4 pdph:hidden">
					<img :src="swapStore.currentWsSymboy.logo" class="w-7.5 h-7.5 mr-2" />
					<div class="text-style-web-h3-bold text-text-primary flex">
						{{ swapStore.state?.currentSymboy }}
						<span
							class="text-style-web-small-regular text-text-tertiary bg-background-tertiary px-[6px] py-[1px] ml-2 flex items-center">
							{{ t('trade.txt13') }}
						</span>
						<!-- <img src="/imgs/common/arrow-down.svg" class="w-[18px] h-[18px]" /> -->
					</div>

					<div
						class="text-web-h2-bold ml-4 mr-[30px] text-text-primary"
						:class="swapStore.currentWsSymboy?.textColor">
						{{ thousandsComma(fixD(swapStore.currentWsSymboy?.close, coinScale)) }}
					</div>
					<div class="grid grid-cols-7 gap-2">
						<div>
							<div class="text-style-web-small-regular text-text-description">
								{{ t('trade.txt14') }}/{{ t('trade.txt15') }}
							</div>
							<div class="flex text-text-primary text-style-web-small-regular mt-[2px]">
								<span :class="PONTextColor(swapStore.state?.rate)" class="mr-[2px]">
									{{ fixD(swapStore.state?.rate, 2) }}%
								</span>
								{{ formatCountTime(countDown) }}
							</div>
						</div>
						<div>
							<div class="text-text-description">{{ t('trade.txt16') }}</div>
							<div class="text-text-primary mt-[2px]">
								{{ thousandsComma(fixD(swapStore.currentWsSymboy?.mark, coinScale)) }}
							</div>
						</div>
						<div>
							<div class="text-text-description">{{ t('trade.txt19') }}</div>
							<div class="text-text-primary mt-[2px]">
								{{ thousandsComma(fixD(swapStore.currentWsSymboy?.index, coinScale)) }}
							</div>
						</div>
						<div>
							<div class="text-text-description">24H {{ t('trade.txt17') }}</div>
							<div class="text-text-primary mt-[2px]">
								{{ thousandsComma(fixD(swapStore.currentWsSymboy?.high, coinScale)) }}
							</div>
						</div>
						<div>
							<div class="text-text-description">24H {{ t('trade.txt20') }}</div>
							<div class="text-text-primary mt-[2px]">
								{{ thousandsComma(fixD(swapStore.currentWsSymboy?.low, coinScale)) }}
							</div>
						</div>
						<div>
							<div class="text-text-description">
								24H {{ t('trade.txt18') }}({{ swapStore.state.currentCoinInfo?.coinSymbol }})
							</div>
							<div class="text-text-primary mt-[2px]">
								{{ formatNumUnit(swapStore.currentWsSymboy?.volume?.toFixed(2)) }}
							</div>
						</div>
						<div>
							<div class="text-text-description">24H {{ t('trade.txt18') }}(USDT)</div>
							<div class="text-text-primary mt-[2px]">
								{{ formatNumUnit(swapStore.currentWsSymboy?.turnover?.toFixed(2)) }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex flex-1 border-t border-border-subtle">
					<Pckline class="flex-1" />
					<div class="w-[288px] border-x  border-border-subtle overflow-hidden">
						<SwapWs />
					</div>
					<CreateOrder class="w-[320px]" />
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
					<img :src="state.coinInfo.logo" @click="state.showCoinInfo" class="w-7.5 h-7.5" />
					<span class="mx-3 text-web-h2-bold text-text-primary">{{ state.coinInfo.unit }}</span>
					<span class="text-style-web-body-regular text-text-tertiary">
						{{ state.coinInfo.name }}
					</span>
				</div>
				<div class="flex justify-between items-center">
					<div class="text-style-web-body-regular text-text-description">
						{{ t('trade.txt22') }}
					</div>
					<div class="text-style-web-body-regular text-text-brand">
						No.{{ state.coinInfo.rank }}
					</div>
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
	</div>
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
