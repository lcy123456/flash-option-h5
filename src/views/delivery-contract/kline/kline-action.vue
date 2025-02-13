<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import NtDropdown from '@/components/NtDropdown/index.vue'
import { computed } from 'vue'
import { klineTypeEnum } from '@/enums/trade'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { useI18n } from 'vue-i18n'

const { setKLineResolution } = useDeliveryContract()
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
		// {
		// 	label: '10m',
		// 	value: '10',
		// 	key: '10m',
		// 	shrink: true,
		// 	proid: '10min'
		// },

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
			label: t('trade.txt33'),
			key: klineTypeEnum.dept,
			value: klineTypeEnum.dept
		},
		{
			label: t('trade.txt32'),
			key: klineTypeEnum.kline,
			value: klineTypeEnum.kline
		}
	]
})
const actionInfo = computed(() => {
	return {
		shrinkList: state.times.filter((item) => item.shrink),
		expandList: state.times.filter((item) => !item.shrink)
	}
})
const handleActive = (item: any) => {
	state.selectValue = item.key
	localStorage.setItem('dcontract_proid', item.proid)
	setKLineResolution(item)
}
const handleDrop = (data: any, row: any) => {
	handleActive(row)
}

onMounted(() => {
	const proid = localStorage.getItem('dcontract_proid')
	if (!proid) {
		localStorage.setItem('dcontract_proid', '15min')
		return
	}
	const item = state.times.find((item) => item.proid === proid)
	if (item) {
		state.selectValue = item.key
	}
	console.log('state.selectValue :', state.selectValue)
})
</script>
<template>
	<div
		class="flex items-center px-4 py-2 border-b border-border-strong text-style-web-small-regular justify-between">
		<div class="flex items-center">
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
		<!-- <div class="flex items-center">
			<NtDropdown
				v-model:selectValue="swapStore.state.KlineAction"
				:option-list="state.KlineList"
				select-class="text-text-brand" />
		</div> -->
	</div>
</template>
