<script setup lang="ts">
import { thousandsComma, formatNumUnit, fixD, directionTypeColor, deOrderBook } from '@/utils/trade'
import OrderBookType from '../components/order-book-type.vue'
import { useSwapStore } from '@/store/modules/swap/index'
import { computed, ref, onMounted } from 'vue'
import { mul } from '@/utils'
import { HandicapKeyEnum } from '@/enums/trade'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const swapStore = useSwapStore()
const currentCoinInfo = computed(() => {
	return swapStore.state.currentCoinInfo
})
const priceW = ref(280)
const setWidth = (vol: any) => {
	const maxTotalValue: any = Math.max(
		swapStore.state.orderBooks.askTotal,
		swapStore.state.orderBooks.buyTotal
	)
	let W = 0
	W = parseFloat(mul(priceW.value, vol)) / parseFloat(maxTotalValue)
	return `${W + 10}%`
}

const askList = computed(() => {
	if (!swapStore.state.orderBooks?.askList?.length) {
		return deOrderBook().splice(0, swapStore.state.maxPostion)
	}
	return swapStore.state.orderBooks?.askList
})
const buyList = computed(() => {
	if (!swapStore.state.orderBooks?.buyList?.length) {
		return deOrderBook().splice(0, swapStore.state.maxPostion)
	}
	return swapStore.state.orderBooks?.buyList
})
const proportion = computed(() => {
	const asksTotal =
		askList.value?.reduce((accumulator, item) => accumulator + Number(item.amount), 0) || 50
	const buysTotal =
		buyList.value?.reduce((accumulator, item) => accumulator + Number(item.amount), 0) || 50
	const allTotal = buysTotal + asksTotal
	const sell = fixD(Math.ceil((asksTotal / allTotal) * 100), 2)
	const buy = 100 - (typeof sell !== 'number' ? sell : 50)
	return {
		askTotal: sell,
		buyTotal: buy
	}
})
onMounted(() => {
	priceW.value = document.documentElement.clientWidth // 列表高度
	if (isPC.value) {
		swapStore.state.maxPostion = 8
	}
})
const handlePrice = (price: any) => {
	swapStore.state.echoPrice = price
}
</script>
<template>
	<div class="px-4 py-3">
		<OrderBookType v-model:model-value="swapStore.state.handicapType" />
		<div class="flex items-center justify-between w-full text-style-web-small-medium mt-3">
			<img src="/imgs/order-book/left.svg" alt="" class="cursor-pointer w-6 h-6" />
			<div class="flex flex-1 h-6">
				<div
					class="flex items-center bg-[#2ebd85] bg-opacity-20 text-function-buy pl-1"
					:style="{ transition: 'width 0.5s', width: `${proportion.buyTotal}%` }">
					{{ proportion.buyTotal }}%
				</div>
				<div
					class="flex items-center justify-end bg-[#f6465d] bg-opacity-20 text-function-sell pr-1"
					:style="{ minWidth: '60px', transition: 'width 0.5s', width: `${proportion.askTotal}%` }">
					{{ proportion.askTotal }}%
				</div>
			</div>
			<img src="/imgs/order-book/right.svg" alt="" class="cursor-pointer w-6 h-6" />
		</div>
		<div class="grid grid-cols-3 text-text-description text-style-web-small-regular my-3">
			<div>{{ t('trade.txt28') }}(USDT)</div>
			<div class="text-right mx-3">{{ t('trade.txt29') }}({{ currentCoinInfo?.coinSymbol }})</div>
			<div class="text-right">{{ t('trade.txt30') }}({{ currentCoinInfo?.coinSymbol }})</div>
		</div>
		<template v-if="swapStore.state.handicapType !== HandicapKeyEnum.SELL">
			<div v-for="(item, i) in buyList" :key="i" :class="!i && 'mt-1'">
				<div
					class="grid grid-cols-3 py-[2px] text-style-web-small-regular relative flex items-center cursor-pointer">
					<div :class="directionTypeColor(item.direction)" @click="handlePrice(item.price)">
						{{ thousandsComma(item.price) }}
					</div>
					<div class="text-right mx-3 text-text-tertiary">
						{{ formatNumUnit(fixD(item.amount, currentCoinInfo.coinDecimal)) }}
					</div>
					<div class="relative text-right w-full text-text-tertiary">
						{{ formatNumUnit(fixD(item.totalAmount, currentCoinInfo.coinDecimal)) }}
						<div
							class="absolute h-full bottom-0 !bg-opacity-10 bg-[#F54058] text-right right-0"
							:style="{ transition: 'width 0.5s', width: setWidth(item.amount) }"></div>
					</div>
				</div>
			</div>
		</template>
		<div class="my-3 flex items-center">
			<div
				class="text-web-h2-medium text-text-primary"
				:class="swapStore.currentWsSymboy?.textColor">
				{{ thousandsComma(swapStore.currentWsSymboy?.close) }}
			</div>
			<div class="mx-1">
				<img
					:src="
						swapStore.currentWsSymboy?.textColor === 'text-text-success'
							? '/imgs/order-book/up.svg'
							: '/imgs/order-book/down.svg'
					"
					class="w-5 h-5" />
			</div>
			<div class="text-text-description text-style-web-small-regular">
				{{ thousandsComma(swapStore.currentWsSymboy?.mark) }}
			</div>
		</div>
		<template v-if="swapStore.state.handicapType !== HandicapKeyEnum.BUY">
			<div v-for="(item, i) in askList" :key="i" :class="!i && 'mt-1'">
				<div class="grid grid-cols-3 text-style-web-small-regular py-[2px] cursor-pointer">
					<div :class="directionTypeColor(item.direction)" @click="handlePrice(item.price)">
						{{ thousandsComma(item.price) }}
					</div>
					<div class="mx-3 text-right text-text-tertiary">
						{{ formatNumUnit(fixD(item.amount, currentCoinInfo.coinScale)) }}
					</div>

					<div class="relative text-right w-full text-text-tertiary" :class="[i !== 0 && 'pt-1']">
						{{ formatNumUnit(fixD(item.totalAmount, currentCoinInfo.coinScale)) }}
						<div
							class="absolute h-full bottom-0 right-0 !bg-opacity-10 bg-[#F54058]"
							:style="{ transition: 'width 0.5s', width: setWidth(item.amount) }"></div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
