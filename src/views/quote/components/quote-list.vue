<script setup lang="ts">
import SearchHeader from './search-header.vue'
import Empty from '@/components/empty.vue'
import DcontractCoinList from '@/views/delivery-contract/component/CoinList.vue'
import { formatNumUnit, PONTextColor, thousandsComma, fieldSort, fixD } from '@/utils/trade'
import { formatChange } from '@/utils'
import { marketSearchEnum } from '@/enums/trade'
import useQuoteStore from '@/hooks/useQuoteStore'
const quoteStore = useQuoteStore()
import { useTradeStore } from '@/store/modules/trade/index'
const tradeStore = useTradeStore()
import { useSwapStore } from '@/store/modules/swap/index'
const swapStore = useSwapStore()
import { computed, ref } from 'vue'
const emit = defineEmits(['closeShow'])
defineProps({
	list: {
		type: Object,
		default: () => []
	}
})
const handleSwitch = (item: any) => {
	console.log(
		'quoteStore?.state.marketActive :',
		quoteStore?.state.marketActive,
		quoteStore?.state.optActive
	)
	console.log(
		'item---item',
		item,
		quoteStore?.state.marketActive,
		marketSearchEnum.trade,
		marketSearchEnum.swap
	)
	if (quoteStore?.state.marketActive === marketSearchEnum.trade) {
		tradeStore.switchSymbol(item.symbol)
	} else if (quoteStore?.state.marketActive === marketSearchEnum.swap) {
		swapStore.switchSymbol(item.symbol)
	}
	close()
}

const currentSymbol = computed(() => {
	if (quoteStore?.state.marketActive === marketSearchEnum.trade) {
		return tradeStore.state.currentSymboy
	} else {
		return swapStore.state.currentSymboy
	}
})

const handleAdd = (item: any) => {
	if (
		quoteStore?.state.marketActive === marketSearchEnum.trade ||
		(quoteStore.state.optActive === marketSearchEnum.trade &&
			quoteStore?.state.marketActive === marketSearchEnum.own)
	) {
		tradeStore.favorStatusAction(item.symbol, item.isFavor)
	} else if (
		quoteStore?.state.marketActive === marketSearchEnum.swap ||
		(quoteStore.state.optActive === marketSearchEnum.swap &&
			quoteStore?.state.marketActive === marketSearchEnum.own)
	) {
		swapStore.favorStatusAction(item.symbol, item.isFavor)
	} else {
		quoteStore.favorOptionAction(item.symbol, item.isFavor)
	}
}
const isdcontract = computed(() => {
	return (
		quoteStore?.state.marketActive === marketSearchEnum.dcontract ||
		(quoteStore?.state.marketActive === marketSearchEnum.own &&
			quoteStore?.state.optActive === marketSearchEnum.dcontract)
	)
})
const close = () => {
	emit('closeShow', false)
}
const sortKey = ref({} as any)
const changeSort = (sortObj: any) => {
	sortKey.value = {
		...sortObj,
		sortType: 1,
		sortName: sortObj.sortName,
		upOrDown: sortObj.sortType
	}
}
const symbolList = computed(() => {
	return function (arr: any) {
		const sortList = fieldSort(arr, sortKey.value)
		return sortList
	}
})
</script>
<template>
	<SearchHeader v-if="!isdcontract" class="px-4 pt-3" @changeSort="changeSort" />
	<div class="pt-3">
		<template v-if="list.length">
			<DcontractCoinList v-if="isdcontract" :list="list" @onConfirm="close" />
			<template v-else>
				<div
					v-for="item in symbolList(list)"
					class="px-4 py-3 cursor-pointer hover:bg-background-secondary"
					:key="item.symbol"
					:class="currentSymbol === item.symbol ? 'bg-background-secondary' : 'bg-transparent'">
					<div class="flex" @click="handleSwitch(item)">
						<div class="flex items-center flex-1">
							<div class="mr-1" @click.stop="handleAdd(item)">
								<Icon v-if="item.isFavor" name="common/stared" :size="24" class="text-text-brand" />
								<Icon v-else name="common/star" :size="24" class="text-background-disabled" />
								<!-- <img src="/imgs/common/star.svg" class="w-6 h-6" v-else /> -->
							</div>
							<div>
								<p class="text-text-primary text-style-web-body-medium">{{ item.symbol }}</p>
								<p class="text-style-web-small-regular text-text-secondary">
									{{ formatNumUnit(fixD(item.volume, 2)) }}
								</p>
							</div>
						</div>
						<div class="flex items-center justify-end flex-1 text-style-web-body-medium">
							<div class="text-text-primary">{{ thousandsComma(item.close) }}</div>
							<div class="w-[82px] text-right" :class="PONTextColor(item.chg)">
								{{ formatChange(item.chg) }}
							</div>
						</div>
					</div>
				</div>
			</template>
		</template>
		<Empty v-if="!list.length" />
	</div>
</template>
