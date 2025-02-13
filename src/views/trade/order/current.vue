<script setup lang="ts">
import { onMounted, h, reactive, ref } from 'vue'
import { Table } from '@/components/base'
import { useTradeStore } from '@/store/modules/trade/index'
const tradeStore = useTradeStore()
import Empty from '@/components/empty.vue'
import { directionTypeColor, directionTypeBgColor, filterType, fixD } from '@/utils/trade'
import { formatTime } from '@/utils/date'
import { thousandsComma } from '@/utils/trade'
import { div } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const getList = () => {
	tradeStore.fetchCurrentOrder()
}
onMounted(() => {
	getList()
})

const handleCancel = async (data: any) => {
	const res = await tradeStore.fetchCancelOrder({
		orderId: data.orderId
	})
	if (res.code === 0) {
		getList()
	}
}
const handleTypeChange = (item: any) => {
	tradeStore.state.currentParams.type = item.value
	getList()
}
const handleLink = (symbol: any) => {
	tradeStore.switchSymbol(symbol)
}
const finished = ref(true) // 当前委托没有分页
const loading = ref(true)

const columns = reactive([
	{
		title: t('trade.txt31'),
		key: 'optionName',
		render(item: any) {
			return h('div', { class: 'flex items-center  text-style-web-small-regular' }, [
				h('div', [
					h('p', {}, formatTime(item.time, 'YYYY-MM-DD')),
					h('p', {}, formatTime(item.time, 'HH:mm:ss'))
				])
			])
		}
	},
	{
		title: t('trade.txt205'),
		render(item: any) {
			return h(
				'div',
				{
					class: 'flex items-center text-style-web-small-regular text-text-tertiary'
				},
				[h('div', { class: 'flex items-center' }, [h('p', {}, item.symbol)])]
			)
		}
	},
	{
		title: `${t('trade.txt206')}`,
		key: 'optionName',
		render(item: any) {
			return h('div', { class: 'flex items-center  text-style-web-small-regular' }, [
				h('div', [h('p', {}, filterType(tradeStore.state?.typeList, item.type))])
			])
		}
	},
	{
		title: t('trade.txt207'),
		key: 'direction',
		render(item: any) {
			return h(
				'span',
				{ class: `flex items-center ${directionTypeColor(item.direction)}` },
				`${tradeStore.state.directionType[item.direction]}`
			)
		}
	},
	{
		title: t('trade.txt28'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, `${thousandsComma(item.price)}`)
		}
	},
	{
		title: t('trade.txt29'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, item.amount)
		}
	},
	{
		title: t('trade.txt208'),
		key: 'tradedAmount',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				`${fixD(div(item.tradedAmount, item.amount), 2)}%`
			)
		}
	},
	{
		title: t('other.txt26'),
		render(item: any) {
			return h(
				'div',
				{
					class:
						'flex items-center h-full  text-text-brand text-style-web-small-regular cursor-pointer '
				},
				[
					h(
						'div',
						{
							onClick: () => {
								handleCancel(item)
							}
						},
						`${t('trade.txt53')}`
					)
				]
			)
		}
	}
])
const onLoad = () => {}
</script>
<template>
	<div class="web:hidden">
		<div class="text-style-web-small-medium my-3 flex px-4">
			<div
				v-for="type in tradeStore.state.typeList"
				class="py-1 px-2 bg-background-tertiary mr-[10px]"
				:key="type.value"
				:class="[
					tradeStore.state?.currentParams?.type === type.value
						? 'text-text-primary'
						: 'text-text-description'
				]"
				@click="handleTypeChange(type)">
				{{ type.label }}
			</div>
		</div>
		<div
			v-for="item in tradeStore.state?.currentOrderList"
			:key="item.orderId"
			class="px-4 border-t border-border-subtle py-4 web:hidden">
			<div class="flex items-center text-style-body-700 text-always-black justify-between">
				<div class="flex items-center text-text-primary" @click="handleLink(item.symbol)">
					{{ item.symbol }}
					<Icon name="common/chevron-right" :size="20" class="text-text-primary ml-2" />
				</div>
				<div @click="handleCancel(item)" class="text-text-brand text-style-web-body-medium">
					{{ t('trade.txt53') }}
				</div>
			</div>
			<div class="flex items-center text-style-web-small-regular mt-[6px] mb-4">
				<span
					class="py-[1px] px-[6px] rounded-[3px]"
					:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
					{{ tradeStore.state.directionType[item.direction] }}
				</span>
				<span
					class="py-[1px] px-[6px] ml-2 rounded-[3px]"
					:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
					{{ filterType(tradeStore.state?.typeList, item.type) }}
				</span>
			</div>
			<div class="flex items-center justify-between">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('trade.txt43') }}({{ item.coinSymbol }})
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">{{ item.amount }}</div>
			</div>
			<div class="flex items-center justify-between my-2">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('trade.txt45') }}(USDT)
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(item.price) }}
				</div>
			</div>
			<div class="flex items-center justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('trade.txt54') }}</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ fixD(div(item.tradedAmount, item.amount), 2) }}%
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">{{ t('trade.txt31') }}</div>
				<div class="text-text-tertiary text-style-web-base-medium">{{ formatTime(item.time) }}</div>
			</div>
		</div>
		<Empty v-if="!tradeStore.state?.currentOrderList?.length" />
	</div>
	<div class="pdph:hidden">
		<Table
			:columns="columns"
			:dataSource="tradeStore.state?.currentOrderList"
			slide
			v-model:loading="loading"
			v-model:finished="finished"
			@load="onLoad" />
	</div>
</template>
