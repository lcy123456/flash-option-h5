<script setup lang="ts">
import { useTradeStore } from '@/store/modules/trade/index'
import { formatTime } from '@/utils/date'
import { thousandsComma } from '@/utils/trade'
const tradeStore = useTradeStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>
<template>
	<div class="px-4 py-3">
		<div class="grid grid-cols-3 gap-[24px] text-web-small-regular text-text-description mb-3">
			<div class="">{{ t('trade.txt31') }}</div>
			<div class="">{{ t('trade.txt28') }}(USDT)</div>
			<div class="text-right">
				{{ t('trade.txt30') }}({{ tradeStore.state?.currentCoinInfo?.coinSymbol }})
			</div>
		</div>
		<div
			class="grid grid-cols-3 gap-[24px] text-web-small-regular text-text-secondary mb-[6px]"
			v-for="item in tradeStore.state?.lastTrades">
			<div class="">{{ formatTime(item.time, 'HH:mm:ss') }}</div>
			<div
				class=""
				:class="[item.direction === 'BUY' ? 'text-function-buy' : 'text-function-sell']">
				{{ thousandsComma(item.price) }}
			</div>
			<div class="text-right">{{ thousandsComma(item.amount) }}</div>
		</div>
	</div>
</template>
