<script setup lang="ts">
import { onMounted, watch, reactive } from 'vue'
import { useSwapStore } from '@/store/modules/swap/index'
import NtDropdown from '@/components/NtDropdown/index.vue'
import { computed } from 'vue'
import { klineTypeEnum } from '@/enums/trade'
import { useSwapWsStore } from '@/store/modules/swap/swap-ws'
import { useDevice } from '@/hooks/useDevice'
import TradingViewSetingDialog from '@/components/dialogs/TradingViewSeting.vue'

const { isPC } = useDevice()
const { setKLineResolution, showTVSetting, fullscreen } = useSwapWsStore()
const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const state = reactive({
	times: [
		{
			label: 'line',
			value: '1',
			key: 'line',
			proid: '1min'
		},
		{
			label: '1m',
			value: '1',
			key: '1m',
			proid: '1min'
		},
		{
			label: '5m',
			value: '5',
			key: '5m',
			proid: '5min'
		},
		{
			label: '15m',
			value: '15',
			key: '15m',
			shrink: true,
			proid: '15min'
		},
		{
			label: '30m',
			value: '30',
			key: '30m',
			shrink: true,
			proid: '30min'
		},
		{
			label: '1h',
			value: '60',
			key: '1h',
			shrink: true,
			proid: '60min'
		},
		{
			label: '4h',
			value: '240',
			key: '4h',
			shrink: true,
			proid: '4hour'
		},
		{
			label: '1d',
			value: '1D',
			key: '1d',
			shrink: true,
			proid: '1day'
		},
		{
			label: '1w',
			value: '1W',
			key: '1w',
			shrink: true,
			proid: '1week'
		},
		{
			label: '1M',
			value: '1M',
			key: '1M',
			shrink: true,
			proid: '1month'
		}
	],
	selectValue: '15m',
	KlineList: [
		{
			label: t('trade.txt32'),
			key: klineTypeEnum.kline,
			value: klineTypeEnum.kline
		},
		{
			label: t('trade.txt33'),
			key: klineTypeEnum.dept,
			value: klineTypeEnum.dept
		}
	],
	showTVSetting: false
})
const actionInfo = computed(() => {
	return {
		shrinkList: state.times.filter((item) => item.shrink),
		expandList: state.times.filter((item) => !item.shrink),
		webTimeList: state.times.slice(1, 8),
		webExpandList: state.times.slice(8, 10)
	}
})
const handleActive = (item: any) => {
	state.selectValue = item.key
	localStorage.setItem('swap_proid', item.proid)
	setKLineResolution(item)
}
const handleDrop = (data: any, row: any) => {
	handleActive(row)
}
const handleAtion = (row: any) => {
	swapStore.state.KlineAction = row.key
}
onMounted(() => {
	const proid = localStorage.getItem('swap_proid')
	if (!proid) {
		localStorage.setItem('swap_proid', '15min')
		return
	}
	const item = state.times.find((item) => item.proid === proid)
	if (item) {
		state.selectValue = item.key
	}
})
const handleShowTV = () => {
	showTVSetting()
}
</script>
<template>
	<div
		class="flex items-center px-4 py-2 border-b border-border-strong text-style-web-small-regular justify-between">
		<div class="flex items-center" v-if="!isPC">
			<div
				v-for="item in actionInfo.expandList"
				:key="item.key"
				class="mr-4"
				@click="handleActive(item)"
				:class="[state.selectValue === item.key ? 'text-text-primary' : 'text-text-description']">
				{{ item.label }}
			</div>
			<NtDropdown
				v-model:selectValue="state.selectValue"
				:option-list="actionInfo.shrinkList"
				@update:select-value="handleDrop" />
		</div>
		<div class="flex items-center flex-1 justify-between">
			<NtDropdown
				v-if="!isPC"
				v-model:selectValue="swapStore.state.KlineAction"
				:option-list="state.KlineList"
				select-class="text-text-brand " />
			<template v-if="isPC">
				<div class="flex items-center">
					<div
						v-for="item in actionInfo.webTimeList"
						:key="item.key"
						class="mr-4 cursor-pointer"
						@click="handleActive(item)"
						:class="[
							state.selectValue === item.key ? 'text-text-primary' : 'text-text-description'
						]">
						{{ item.label }}
					</div>
					<NtDropdown
						v-model:selectValue="state.selectValue"
						:option-list="actionInfo.webExpandList"
						@update:select-value="handleDrop" />
				</div>

				<div class="flex items-center">
					<div
						v-for="item in state.KlineList"
						:key="item.key"
						class="hover:cursor-pointer px-[6px]"
						:class="
							swapStore.state.KlineAction === item.key ? 'text-text-brand' : 'text-text-tertiary'
						"
						@click="handleAtion(item)">
						{{ item.label }}
					</div>
					<van-icon
						name="setting-o"
						size="18"
						color="#7a8091"
						class="cursor-pointer"
						@click="handleShowTV" />
					<img
						src="/imgs/common/full.svg"
						@click="fullscreen()"
						class="w-[14px] h-[14px] mx-[8px]" />
				</div>
			</template>
		</div>

		<!-- <TradingViewSetingDialog v-model:show="state.showTVSetting" /> -->
	</div>
</template>
