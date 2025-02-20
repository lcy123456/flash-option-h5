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
			class="flex items-center text-text-primary text-style-web-body-medium h-[44px] px-[16px] cursor-pointer hover:bg-background-secondary"
			v-for="(item, index) in symbolList(list)"
			:key="item.symbol"
			:class="state.symbol === item.symbol ? 'bg-background-secondary' : 'bg-transparent'"
			@click="onOk(item)">
			<div class="flex items-center flex-1">
				<div class="mr-1" @click.stop="quoteStore.favorOptionAction(item.symbol, item.isFavor)">
					<img src="/imgs/common/stared.svg" class="w-6 h-6" v-if="item.isFavor" />
					<img src="/imgs/common/star.svg" class="w-6 h-6" v-else />
				</div>
				{{ item.symbol }}
			</div>
			<div class="w-[98px] flex justify-end">
				{{ formatNumUnit(item.count) }}/{{ formatNumUnit(item.amount) }}
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
import { ref, computed, onBeforeMount } from 'vue'
import { formatNumUnit } from '@/utils/trade'
import { useFlashOption } from '@/hooks/useFlashOption'
import { useI18n } from 'vue-i18n'
import useQuoteStore from '@/hooks/useQuoteStore'
import { onMounted } from 'vue'
import { fieldSort } from '@/utils/trade'
import { marketSearchEnum } from '@/enums/trade'

const quoteStore = useQuoteStore()
const { t } = useI18n()

const { changeSymbol, state, createWsConnect } = useFlashOption()

const sort = ref('')
defineProps({
	list: {
		type: Object,
		default: () => []
	}
})
const emits = defineEmits(['onConfirm'])

onBeforeMount(() => {
	if (quoteStore.state.pageFrom !== marketSearchEnum.option) {
		createWsConnect()
	}
})

const onOk = (item: any) => {
	console.log('onOk :', item)
	// if (quoteStore.state.pageFrom !== marketSearchEnum.option) {
	// 	return
	// }
	// emits('hide')
	changeSymbol(item.symbol)
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

// watch(
// 	() => state.symbolThumbInfo,
// 	(newObj: any) => {
// 		data.optionCoinList = data.optionCoinList?.map((item) => {
// 			if (newObj.symbol === item.symbol) {
// 				const newItem = { ...newObj }
// 				return newItem
// 			}
// 			return item
// 		})
// 	}
// )
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
	return function (arr: any) {
		const sortList = fieldSort(arr, sortKeyObj.value)
		return sortList
	}
})
</script>
