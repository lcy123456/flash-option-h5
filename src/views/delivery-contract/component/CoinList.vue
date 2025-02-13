<template>
	<div class="">
		<div
			class="text-style-web-small-regular text-text-description flex items-center px-[16px] mb-[12px]">
			<div class="flex-1">{{ t('option.txt5') }}</div>
			<div class="flex items-center w-[98px] text-right">
				<HeaderSort :content="t('option.txt6')" @updateChangeSort="handleChangeSort" :sort="sort" />
			</div>
			<div class="w-[90px] text-right">{{ t('option.txt7') }}</div>
		</div>
		<div
			class="flex items-center text-text-primary text-style-web-body-medium h-[44px] px-[16px]"
			v-for="(item, index) in symbolList"
			:key="item.symbol"
			:class="state.symbol === item.symbol ? 'bg-background-secondary' : 'bg-transparent'"
			@click="onOk(item)">
			<div class="flex items-center flex-1">
				<div class="mr-1" @click.stop="favorStatusAction(item.symbol, item.isFavor)">
					<img src="/imgs/common/stared.svg" class="w-6 h-6" v-if="item.isFavor" />
					<img src="/imgs/common/star.svg" class="w-6 h-6" v-else />
				</div>
				{{ item.symbol }}
			</div>
			<div class="w-[98px] flex justify-end">
				{{ thousandsComma(item.count) }}/{{ formatNumUnit(item.amount.toFixed(2)) }}
			</div>
			<div class="w-[90px] flex justify-end">
				<div class="w-[60px] h-[6px] rounded-[9px] overflow-hidden flex items-center">
					<div class="bg-function-buy h-[6px]" :style="{ width: `${buyPercent(item)}%` }"></div>
					<div class="bg-function-sell h-[6px]" :style="{ width: `${sellPercent(item)}%` }"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import HeaderSort from '@/components/header-sort.vue'
import { ref, computed } from 'vue'
import { thousandsComma, formatNumUnit } from '@/utils/trade'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { useI18n } from 'vue-i18n'
import useQuoteStore from '@/hooks/useQuoteStore'
import { fieldSort } from '@/utils/trade'
import { marketSearchEnum } from '@/enums/trade'
import { routeTo } from '@/utils/routeTo'

const quoteStore = useQuoteStore()
const { t } = useI18n()

const { changeSymbol, state, favorStatusAction } = useDeliveryContract()

const sort = ref('')

const emits = defineEmits(['onConfirm'])

const onOk = (item: any) => {
	console.log('onOk :', item)
	if (quoteStore.state.pageFrom !== marketSearchEnum.dcontract) {
		// routeTo('deliveryContract', { params: { symbol: item.symbol } })
		return
	}
	changeSymbol(item)
	emits('onConfirm')
}

function buyPercent(item: any) {
	const percent = Math.floor((item.totalBuy / item.amount) * 100)
	return percent
}

function sellPercent(item: any) {
	const percent = Math.floor((item.totalBuy / item.amount) * 100)
	return 100 - percent
}

const sortKeyObj = ref({})
const handleChangeSort = () => {
	const sortvalue = sort.value === 'asc' ? 'desc' : sort.value === 'desc' ? '' : 'asc'
	sort.value = sortvalue
	sortKeyObj.value = {
		...sortKeyObj.value,
		sortType: 1,
		sortName: 'amount',
		upOrDown: sortvalue
	}
}
const symbolList = computed(() => {
	if (
		quoteStore?.state.marketActive === marketSearchEnum.own &&
		quoteStore?.state.optActive === marketSearchEnum.dcontract
	) {
		return state.symbolThumbList.filter((item: any) => item.isFavor)
	}
	return state.symbolThumbList
	// return function (arr: any) {
	// 	const sortList = fieldSort(arr, sortKeyObj.value)
	// 	return sortList
	// }
})
</script>
