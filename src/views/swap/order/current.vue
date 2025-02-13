<script setup lang="ts">
import { onMounted, h, ref, reactive } from 'vue'
import { Table } from '@/components/base'
import { useSwapStore } from '@/store/modules/swap/index'
const swapStore = useSwapStore()
import Empty from '@/components/empty.vue'
import {
	directionTypeColor,
	directionTypeBgColor,
	macthOrderType,
	fixD,
	thousandsComma
} from '@/utils/trade'
import { formatTime } from '@/utils/date'
import { closeAllCurrent } from '@/apis/swap'
import Checkbox from '@/components/base/checkbox/index.vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const getList = () => {
	swapStore.fetchCurrentOrder()
}
onMounted(() => {
	getList()
})

const handleCancel = (data: any) => {
	swapStore.fetchCancelOrder({
		entrustId: data.id
	})
}
// 全部撤销
const closeAll = async () => {
	if (!swapStore.state?.currentOrderList.length) return
	const res: any = await closeAllCurrent()
	const isSuccess = res.code === 0
	if (isSuccess) {
		getList()
	}
}
const handleChange = () => {
	swapStore.fetchCurrentOrder()
}
const handleLink = (symbol: any) => {
	swapStore.switchSymbol(symbol)
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
					h('p', {}, formatTime(item.createTime, 'YYYY-MM-DD')),
					h('p', {}, formatTime(item.createTime, 'HH:mm:ss'))
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
				[
					h('div', { class: 'flex items-center' }, [
						h('p', {}, item.symbol),
						h('p', {}, t('trade.txt13'))
					])
				]
			)
		}
	},
	{
		title: `${t('trade.txt206')}`,
		key: 'optionName',
		render(item: any) {
			return h('div', { class: 'flex items-center  text-style-web-small-regular' }, [
				h('div', [h('p', {}, macthOrderType(item.type, 'name', 'type'))])
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
				`${swapStore.state.entrustTypeTextType[item.entrustType]}${swapStore.state.directionTextType[item.direction]}`
			)
		}
	},
	{
		title: t('trade.txt47'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				thousandsComma(fixD(item.entrustPrice, item.decimalScale))
			)
		}
	},
	{
		title: t('trade.txt48'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				thousandsComma(fixD(item.triggerPrice, item.decimalScale))
			)
		}
	},
	{
		title: t('trade.txt49'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				thousandsComma(fixD(item.tradedPrice, item.decimalScale))
			)
		}
	},
	{
		title: t('trade.txt57'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				thousandsComma(fixD(item.principalAmount, item.decimalScale))
			)
		}
	},
	{
		title: t('trade.txt50'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, `${item.volume}${item.coinSymbol}`)
		}
	},
	{
		title() {
			return h(
				'span',
				{
					class: 'flex items-center text-style-web-small-regular  text-text-warning cursor-pointer',
					onClick: () => {
						closeAll()
					}
				},
				`${t('trade.txt56')}`
			)
		},
		render(item: any) {
			return h(
				'div',
				{
					class:
						'flex items-center h-full  text-text-warning text-style-web-small-regular cursor-pointer '
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
	<div class="pb-20 web:hidden">
		<div class="text-style-web-small-regular my-2 flex px-4 items-center justify-between">
			<div class="flex items-center text-text-description">
				<Checkbox
					v-model:value="swapStore.state.currentParams.isOnlyCurrent"
					@change="handleChange">
					<div class="text-text-description">
						{{ t('trade.txt55') }}
					</div>
				</Checkbox>
			</div>
			<div
				class="border rounded-[20px] px-3 py-[6px] h-[28px] box-border"
				:class="[
					swapStore.state?.currentOrderList.length
						? 'text-text-primary border-border-button_strong'
						: 'text-text-disabled border-border-strong'
				]"
				@click="closeAll">
				{{ t('trade.txt56') }}
			</div>
		</div>
		<div
			v-for="(item, index) in swapStore.state?.currentOrderList"
			:key="index"
			class="px-4 border-t border-border-subtle py-4">
			<div class="flex items-center text-style-body-700 text-always-black justify-between">
				<div class="flex items-center text-text-primary" @click="handleLink(item.symbol)">
					{{ item.symbol }}
					<!-- <img src="/imgs/common/chevron-right.svg" class="w-5 h-5 ml-2" /> -->
				</div>
				<div @click="handleCancel(item)" class="text-text-warning text-style-web-body-medium">
					{{ t('trade.txt53') }}
				</div>
			</div>
			<div class="flex items-center text-style-web-small-regular mt-[6px] mb-4">
				<span
					class="py-[1px] px-[6px] rounded-[3px]"
					:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
					{{ swapStore.state.directionTextType[item.direction] }}{{ item.leverage }}X
				</span>
				<span
					class="py-[1px] px-[6px] ml-2 rounded-[3px] bg-background-secondary text-text-tertiary text-style-web-small-regular">
					{{ macthOrderType(item.type, 'name', 'type') }}
				</span>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">{{ t('trade.txt31') }}</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ formatTime(item.createTime) }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('trade.txt47') }} ({{ item.baseSymbol }})
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(fixD(item.entrustPrice, item.decimalScale)) }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('trade.txt48') }} ({{ item.baseSymbol }})
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(fixD(item.triggerPrice, item.decimalScale)) }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('trade.txt49') }} ({{ item.baseSymbol }})
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(fixD(item.tradedPrice, item.decimalScale)) }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">
					{{ t('trade.txt57') }} ({{ item.baseSymbol }})
				</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ thousandsComma(fixD(item.principalAmount, item.decimalScale)) }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div class="text-text-description text-style-web-base-regular">{{ t('trade.txt50') }}</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ item.volume }}{{ item.coinSymbol }}
				</div>
			</div>
		</div>
		<Empty v-if="!swapStore.state?.currentOrderList?.length" />
	</div>
	<div class="pdph:hidden">
		<Table
			:columns="columns"
			:dataSource="swapStore.state?.currentOrderList"
			slide
			v-model:loading="loading"
			v-model:finished="finished"
			@load="onLoad" />
	</div>
</template>
