<script setup lang="ts">
import { onBeforeMount, ref, reactive, h } from 'vue'
import { thousandsComma } from '@/utils/trade'
// import useFollowAccount from '@/hooks/useFollowAccount'
import Empty from '@/components/empty.vue'
import { directionTypeColor, directionTypeBgColor } from '@/utils/trade'
import { useI18n } from 'vue-i18n'
import { Loading, Table } from '@/components/base'
import { getFollowCurrent } from '@/apis/wallet'
import { toFixed } from '@/utils/index'

const { t } = useI18n()
const loading = ref(true)
const list: any = ref([])

const columns = reactive([
	{
		title: t('text141'),
		key: 'symbol'
	},
	{
		title: t('flwaccount.txt8'),
		key: 'optionName'
	},
	{
		title: t('flwaccount.txt14'),
		key: 'direction',
		render(item: any) {
			return h(
				'div',
				{
					class: item.direction === 'SELL' ? 'text-function-sell' : 'text-function-buy'
				},
				item.direction === 'SELL' ? t('flw.txt71') : t('flw.txt72')
			)
		}
	},
	{
		title: t('option.txt16'),
		key: 'orderPrice',
		render(item: any) {
			return h('div', {}, thousandsComma(item.orderPrice) + ' USDT')
		}
	},
	{
		title: t('text18'),
		key: 'betAmount',
		render(item: any) {
			return h('div', {}, thousandsComma(item.betAmount) + ' USDT')
		}
	}
	// {
	// 	title: t('flw.txt42'),
	// 	align: 'right',
	// 	key: 'memberId',
	// 	render(item: any) {
	// 		return h(
	// 			'div',
	// 			{ class: 'text-text-primary text-style-medium-400-underline cursor-pointer' },
	// 			t('help.detail')
	// 		)
	// 	}
	// }
])

onBeforeMount(async () => {
	await getData()
})

const getData = async () => {
	const res: any = await getFollowCurrent({
		current: 1,
		size: 100
	})
	if (res.code === 0) {
		if (res.data.list.length > 0) {
			list.value = res.data.list.map((item: any) => {
				const newItem = { ...item }
				newItem.orderPrice = toFixed(newItem.orderPrice, 2)
				return newItem
			})
		}
	}
	loading.value = false
}
</script>
<template>
	<div class="web:hidden pb-20">
		<div v-for="item in list" :key="item.id" class="px-4 border-t border-border-subtle py-4">
			<div class="flex items-center text-style-body-700 text-always-black justify-between">
				<div class="flex items-center">
					<span
						class="w-[4px] h-[20px] mr-[8px]"
						:class="item.direction === 'SELL' ? 'bg-function-sell' : 'bg-function-buy'"></span>
					{{ item.symbol }}
					<span
						class="py-[1px] px-[6px] ml-[8px] text-style-web-small-regular rounded-[3px]"
						:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
						{{ item.direction === 'SELL' ? t('option.txt12') : t('option.txt11') }}
					</span>
					<!-- <span class="text-style-web-small-regular " :class="item.direction === 'SELL' ? 'bg-function-sell': 'bg-function-buy'">{{ item.direction === 'SELL' ? '下跌': '上涨'}}</span> -->
					<!-- <img src="/imgs/common/chevron-right.svg" class="w-5 h-5 ml-2" /> -->
				</div>
			</div>
			<div class="flex items-center justify-between mt-[12px]">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('flwaccount.txt8') }}
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">{{ item.optionName }}</div>
			</div>
			<div class="flex items-center justify-between mt-[10px]">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('flwaccount.txt14') }}
				</div>
				<div
					class="text-text-tertiary text-style-web-base-medium py-[1px] px-[6px]"
					:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
					{{ item.direction === 'SELL' ? t('option.txt12') : t('option.txt11') }}
				</div>
			</div>

			<div class="flex items-center justify-between mt-[10px]">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('flwaccount.txt9') }}(USDT)
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(item.betAmount) }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-[10px]">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('flwaccount.txt10') }}(USDT)
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(item.orderPrice) }}
				</div>
			</div>
		</div>
		<Loading v-model:loading="loading" />
		<Empty v-if="list.length === 0 && !loading" />
	</div>

	<div class="pdph:hidden">
		<Table :columns="columns" :dataSource="list" v-model:loading="loading" />
	</div>
</template>
