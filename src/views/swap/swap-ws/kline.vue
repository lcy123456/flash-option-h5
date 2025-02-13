<script setup lang="ts">
import { reactive,onMounted } from 'vue'
import DepthGraph from './depth-graph.vue'
import KlineAction from './kline-action.vue'
import { useSwapStore } from '@/store/modules/swap/index'
import { klineTypeEnum } from '@/enums/trade'
const swapStore = useSwapStore()
import { useSwapWsStore } from '@/store/modules/swap/swap-ws'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const { setSubAction } = useSwapWsStore()
const state = reactive({
	mainIndicators: [
		{
			value: 'Moving Average',
			label: 'MA'
		},
		{
			value: 'Bollinger Bands',
			label: 'BOLL'
		}
	],
	subIndicators: [
		{
			value: 'Volume',
			label: 'VOL'
		},
		{
			value: 'MACD',
			label: 'MACD'
		},
		{
			value: 'Relative Strength Index',
			label: 'RSI'
		},
		{
			value: 'Stochastic',
			label: 'KDJ'
		},
		{
			value: 'Williams %R',
			label: 'WR'
		}
	],
	mainActive: '',
	subActive: ['VOL'] as any
})
const setMainIndicator = (main: any) => {
	state.mainActive = state.mainActive === main.label ? '' : main.label
	setSubAction(main)
}
const setSubIndicator = (sub: any) => {
	const filIndex = state.subActive.findIndex((item) => item === sub.label)
	if (filIndex >= 0) {
		state.subActive.splice(filIndex, 1)
	} else {
		state.subActive.push(sub.label)
	}

	setSubAction(sub)
}
onMounted(() => {
	// 默认选择vol
	// setTimeout(() => {
	// 	setSubIndicator({
	// 		value: 'Volume',
	// 		label: 'VOL'
	// 	})
	// },3500)
})
</script>
<template>
	<div>
		<KlineAction  />
		<!-- TradingView Widget BEGIN -->
		<div
			v-show="swapStore.state.KlineAction === klineTypeEnum.kline"
			id="kline_swap_container"
			class="w-full " :class="[isPC?'h-[468px]':'h-[400px]']"></div>
		<!-- TradingView Widget END -->
		<DepthGraph v-if="swapStore.state.KlineAction === klineTypeEnum.dept" class="w-full" />
		<div class="flex items-center w-full px-4 border-t border-border-strong py-[6px]"  v-if="!isPC">
			<div class="flex flex-1 overflow-y-scroll items-center">
				<div
					class="text-style-web-body-medium mr-4"
					:class="state.mainActive === item.label ? 'text-text-primary ' : '  text-text-tertiary'"
					v-for="item in state.mainIndicators"
					:key="item"
					@click="setMainIndicator(item)">
					{{ item.label }}
				</div>
				<div class="border-r border-border-strong h-[15px] mr-4"></div>
				<div
					class="text-style-web-body-medium mr-4"
					v-for="key in state.subIndicators"
					:class="
						state.subActive.includes(key.label) ? 'text-text-primary ' : '  text-text-tertiary'
					"
					:key="key.label"
					@click="setSubIndicator(key)">
					{{ key.label }}
				</div>
			</div>
		</div>
	</div>
</template>
