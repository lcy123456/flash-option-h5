<script setup lang="ts">
import { useSwapStore } from '@/store/modules/swap/index'
import { formatChange } from '@/utils'
import { PONTextColor, thousandsComma } from '@/utils/trade'
import { favorAdd } from '@/apis/swap'
import { computed, ref } from 'vue'
import { showFailToast, showSuccessToast } from '@/components/base/toast'
import Checkbox from '@/components/base/checkbox/index.vue'
import { marketSearchEnum } from '@/enums/trade'
import useQuoteStore from '@/hooks/useQuoteStore'
const quoteStore = useQuoteStore()

const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const recommendList = computed(() => {
	const top = JSON.parse(JSON.stringify(swapStore.state.symbolThumbList))
	return top.splice(0, 6)
})
const symbolComment = ref(recommendList.value)
const handleAdd = async () => {
	const symbolStr = symbolComment.value.map((item) => item.symbol).join(';')
	const res: any = await favorAdd({
		symbol: symbolStr,
		type: 2
	})
	const isSuccess = res.code === 0
	if (isSuccess) {
		isSuccess ? showSuccessToast(t('trade.txt5')) : showFailToast(t('trade.txt6'))
		swapStore.fetchFavorFind()
		quoteStore.state.optActive = marketSearchEnum.swap
	}
}
const changeSymbol = (row: any) => {
	const isIn = isInclude(row)
	symbolComment.value = isIn
		? symbolComment.value.filter((item) => item.symbol !== row.symbol)
		:  [...symbolComment.value, row]
}

const isInclude = (row: any) => {
	const isIn = symbolComment.value.findIndex((item) => item.symbol === row.symbol)
	return isIn >= 0
}
</script>
<template>
	<div class="grid grid-cols-2 gap-2 px-4 mt-4 web:pb-3">
		<div
			v-for="item in recommendList"
			:key="item.symbol"
			class="border border-border-strong rounded-md py-4 pl-4 pr-[23px]">
			<div>
				<img :src="item.logo" class="w-6 h-6" />
				<div class="text-style-web-small-regular text-text-primary mt-[6px]">
					{{ item.symbol }}
				</div>
				<div class="text-style-web-h4-medium text-text-primary">
					{{ thousandsComma(item.close) }}
				</div>
				<div
					:class="PONTextColor(item.chg)"
					class="flex items-center justify-between text-style-web-small-medium">
					{{ formatChange(item.chg) }}
					<Checkbox shape="round" :value="isInclude(item)" @change="changeSymbol(item)" />
				</div>
			</div>
		</div>
	</div>
	<div
		class="border-t border-border-strong py-5 px-4 pdph:fixed pdph:bottom-0 w-[100%] bg-background-window">
		<div
			@click="handleAdd"
			class="bg-brand-main text-always-white text-style-web-h-5-700 rounded-[50px] h-[42px] flex items-center justify-center cursor-pointer">
			{{ t('trade.txt4') }}
		</div>
	</div>
</template>
