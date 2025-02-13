<template>
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
</template>
<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { thousandsComma, PONTextColor, formatNumUnit } from '@/utils/trade'

const { t } = useI18n()
const state = reactive({
	showCoinInfo: false,
	showSearch: false,
	coinInfo: {
		infolink: '',
		information: '',
		name: '',
		unit: ''
	} as any
})
</script>
