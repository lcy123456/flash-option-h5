<script setup lang="ts">
import { thousandsComma, formatNumUnit, fixD, directionTypeColor, deOrderBook } from '@/utils/trade'
import OrderBookType from '../components/order-book-type.vue'
import { useTradeStore } from '@/store/modules/trade/index'
import { computed, onMounted, ref } from 'vue'
import { HandicapKeyEnum } from '@/enums/trade'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { mul } from '@/utils'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const tradeStore = useTradeStore()
const currentCoinInfo = computed(() => {
	return tradeStore.state.currentCoinInfo
})
const priceW = ref(280)
const setWidth = (vol: any) => {
	const maxTotalValue: any = Math.max(
		tradeStore.state.orderBooks.askTotal,
		tradeStore.state.orderBooks.buyTotal
	)
	let W = 0
	W = parseFloat(mul(vol, priceW.value)) / parseFloat(maxTotalValue)
	return `${W}%`
}

const askList = computed(() => {
	if (!tradeStore.state.orderBooks?.askList.length) {
		return deOrderBook()?.splice(0, tradeStore.state.maxPostion)
	}
	return tradeStore.state.orderBooks?.askList
})
const buyList = computed(() => {
	if (!tradeStore.state.orderBooks?.buyList.length) {
		return deOrderBook().splice(0, tradeStore.state.maxPostion)
	}
	return tradeStore.state.orderBooks?.buyList
})
const proportion = computed(() => {
	const asksTotal =
		askList.value?.reduce((accumulator, item) => accumulator + Number(item.amount), 0) || 50
	const buysTotal =
		buyList.value?.reduce((accumulator, item) => accumulator + Number(item.amount), 0) || 50
	const allTotal = buysTotal + asksTotal
	const sell = fixD(Math.ceil((asksTotal / allTotal) * 100), 2)
	const buy = 100 - sell
	return {
		askTotal: sell,
		buyTotal: buy
	}
})

onMounted(() => {
	priceW.value = document.documentElement.clientWidth // 列表高度
	if (isPC.value) {
		tradeStore.state.maxPostion = 8
	}
})
const handlePrice = (price: any) => {
	tradeStore.state.echoPrice = price
}
</script>
<template>
	<div class="px-4 py-3">
		<OrderBookType v-model:model-value="tradeStore.state.handicapType" />
		<div class="flex items-center justify-between w-full text-style-web-small-medium mt-3">
			<img src="/imgs/order-book/left.svg" alt="" class="cursor-pointer w-6 h-6" />
			<div class="flex flex-1 h-6">
				<div
					class="flex items-center bg-[#2ebd85] bg-opacity-20 text-function-buy pl-1"
					:style="{ width: `${proportion.buyTotal}%` }">
					{{ proportion.buyTotal }}%
				</div>
				<div
					class="flex items-center justify-end bg-[#f6465d] bg-opacity-20 text-function-sell pr-1"
					:style="{ minWidth: '60px', width: `${proportion.askTotal}%` }">
					{{ proportion.askTotal }}%
				</div>
			</div>
			<img src="/imgs/order-book/right.svg" alt="" class="cursor-pointer w-6 h-6" />
		</div>
		<div class="grid grid-cols-3 text-text-description text-style-web-small-regular my-3">
			<div>{{ t('trade.txt28') }}(USDT)</div>
			<div class="text-right">{{ t('trade.txt29') }}({{ currentCoinInfo?.coinSymbol }})</div>
			<div class="text-right">{{ t('trade.txt30') }}({{ currentCoinInfo?.coinSymbol }})</div>
		</div>
		<template v-if="tradeStore.state.handicapType !== HandicapKeyEnum.SELL">
			<div v-for="(item, i) in buyList" :class="!i && 'mt-1'">
				<div
					class="grid grid-cols-3 text-style-web-small-regular flex items-center relative py-[2px] cursor-pointer">
					<div :class="directionTypeColor(item.direction)" @click="handlePrice(item.price)">
						{{ thousandsComma(item.price) }}
					</div>
					<div class="text-right text-text-tertiary">
						{{ formatNumUnit(fixD(item.amount, currentCoinInfo.coinScale)) }}
					</div>
					<div class="relative text-right w-full text-text-tertiary">
						{{ formatNumUnit(fixD(item.totalAmount, currentCoinInfo.coinScale)) }}
						<div
							class="absolute h-full bottom-0 !bg-opacity-10 bg-[#F54058] text-right right-0"
							:style="{ width: setWidth(item.amount) }"></div>
					</div>
				</div>
			</div>
		</template>
		<div class="my-3 flex items-center">
			<div class="text-web-h2-medium" :class="tradeStore.currentWsSymboy?.textColor">
				{{ thousandsComma(tradeStore.currentWsSymboy?.close) }}
			</div>
			<div class="mx-1">
				<img
					:src="
						tradeStore.currentWsSymboy?.textColor === 'text-text-success'
							? '/imgs/order-book/up.svg'
							: '/imgs/order-book/down.svg'
					"
					class="w-5 h-5" />
			</div>
			<div class="text-text-description text-style-web-small-regular">
				{{ thousandsComma(tradeStore.currentWsSymboy?.close) }}
			</div>
		</div>
		<template v-if="tradeStore.state.handicapType !== HandicapKeyEnum.BUY">
			<div v-for="(item, i) in askList" :class="!i && 'mt-1'" :key="i">
				<div
					class="grid grid-cols-3 text-style-web-small-regular py-[2px] cursor-pointer items-center">
					<div :class="directionTypeColor(item.direction)" @click="handlePrice(item.price)">
						{{ thousandsComma(item.price) }}
					</div>
					<div class="text-right text-text-tertiary">
						{{ formatNumUnit(fixD(item.amount, currentCoinInfo.coinScale)) }}
					</div>

					<div class="relative text-right w-full text-text-tertiary" :class="[i !== 0 && 'pt-1']">
						{{ formatNumUnit(fixD(item.totalAmount, currentCoinInfo.coinScale)) }}
						<div
							class="absolute h-full bottom-0 right-0 !bg-opacity-10 bg-[#F54058]"
							:style="{ width: setWidth(item.amount) }"></div>
					</div>
				</div>
			</div>
		</template>
	</div>
</template>
