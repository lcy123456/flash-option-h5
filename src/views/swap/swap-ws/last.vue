<script setup lang="ts">
import { useSwapStore } from '@/store/modules/swap/index'
import { formatTime } from '@/utils/date'
import { thousandsComma } from '@/utils/trade'
const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
swapStore.fetchLastTrade()
</script>
<template>
	<div class="px-4 py-3">
		<div class="grid grid-cols-3 gap-[24px] text-web-small-regular text-text-description mb-3">
			<div class="">{{ t('trade.txt31') }}</div>
			<div class="">{{ t('trade.txt28') }}(USDT)</div>
			<div class="text-right">
				{{ t('trade.txt30') }}({{ swapStore.state?.currentCoinInfo?.coinSymbol }})
			</div>
		</div>
		<div
			class="grid grid-cols-3 gap-[24px] text-web-small-regular text-text-secondary mb-[6px]"
			v-for="(item, i) in swapStore.state?.lastTrades"
			:key="i">
			<div class="text-text-secondary">{{ formatTime(item.time, 'HH:mm:ss') }}</div>
			<div
				class=""
				:class="[item.direction === 'BUY' ? 'text-function-buy' : 'text-function-sell']">
				{{ thousandsComma(item.price) }}
			</div>
			<div class="text-right text-text-secondary">{{ thousandsComma(item.amount) }}</div>
		</div>
	</div>
</template>
