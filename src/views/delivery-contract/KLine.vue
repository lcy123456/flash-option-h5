<template>
	<div class="pt-[4px]">
		<div class="flex h-[32px] items-center pr-[16px] border-b border-tertiary">
			<div
				v-for="item in data.times"
				:key="item.value"
				@click="handleResolution(item)"
				class="text-style-web-small-regular ml-[16px] cursor-pointer"
				:class="data.selectValue === item.proid ? 'text-text-primary' : 'text-text-description'">
				{{ item.label }}
			</div>
		</div>
		<div
			id="kline_dcontract_container"
			class="w-full"
			:class="isWeb ? 'mt-[16px] h-[482px]' : 'h-[120px]'"></div>
	</div>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { useDevice } from '@/hooks/useDevice'

// const { setKLineResolution, state } = useFlashOption()
const { setKLineResolution } = useDeliveryContract()
const { isWeb } = useDevice()

const data = reactive({
	selectValue: '1min',
	times: [
		{
			label: '1m',
			value: '1',
			proid: '1min'
		},
		{
			label: '5m',
			value: '5',
			proid: '5min'
		},
		{
			label: '15m',
			value: '15',
			proid: '15min'
		},
		{
			label: '30m',
			value: '30',
			proid: '30min'
		},
		{
			label: '1h',
			value: '60',
			proid: '60min'
		},
		{
			label: '4h',
			value: '240',
			proid: '4hour'
		},
		{
			label: '1d',
			value: '1D',
			proid: '1day'
		},
		{
			label: '1w',
			value: '1W',
			proid: '1week'
		}
		// {
		// 	label: '1M',
		// 	value: '1M',
		// 	proid: '1month'
		// }
	]
})

onMounted(() => {
	localStorage.setItem('flash_option_resolution', '15min')

	const proid = localStorage.getItem('flash_option_resolution')
	if (!proid) {
		localStorage.setItem('flash_option_resolution', '1min')
		return
	}
	data.selectValue = proid
})

const handleResolution = (item: any) => {
	data.selectValue = item.proid
	localStorage.setItem('flash_option_resolution', item.proid)
	setKLineResolution(item.value, item.proid)
}
</script>
