<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useSwapStore } from '@/store/modules/swap/index'
const swapStore: any = useSwapStore()
import { Table } from '@/components/base'
import Empty from '@/components/empty.vue'
import { h, reactive } from 'vue'
import { directionTypeColor, directionTypeBgColor, filterType } from '@/utils/trade'
import { formatTime } from '@/utils/date'
import { thousandsComma, fixD, macthOrderType } from '@/utils/trade'
import { orderStatusEnum, entrustTypeEnum } from '@/enums/swap'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useUserStore } from '@/store/useUserStore'
const userStore = useUserStore()

onBeforeMount(() => {
	if (userStore.loginToken) {
		getList()
		return
	}
})
const getList = async () => {
	swapStore.fetchHistoryOrder()
}
const onLoad = () => {
	if (swapStore.state.historyInfo.finished) return
	if (!userStore.loginToken) {
		swapStore.state.historyInfo.finished = true
		return
	}
	getList()
}
const handleLink = (symbol: any) => {
	swapStore.switchSymbol(symbol)
}

const columns: any = reactive([
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
		title: t('trade.txt206'),
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
		title: t('trade.txt51'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				item.entrustType === entrustTypeEnum.OPEN
					? thousandsComma(fixD(item.openFee, item.decimalScale))
					: thousandsComma(fixD(item.closeFee, item.decimalScale))
			)
		}
	},
	{
		title: t('trade.txt52'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, thousandsComma(item.profitAndLoss))
		}
	},
	{
		title: t('trade.txt211'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{
					class: `flex items-center ${
						item.status === orderStatusEnum.ENTRUST_SUCCESS
							? 'text-function-buy'
							: 'text-text-description'
					}`
				},
				item.status && swapStore.state.orderStatusType[item.status]
			)
		}
	}
])
</script>
<template>
	<div class="pdph:hidden">
		<Table
			max-height="348px"
			:columns="columns"
			:dataSource="swapStore.state?.historyOrderList"
			slide
			v-model:loading="swapStore.state.historyInfo.loading"
			v-model:finished="swapStore.state.historyInfo.finished"
			@load="onLoad" />
	</div>
	<div class="pb-20 web:hidden">
		<van-list
			v-model:loading="swapStore.state.historyInfo.loading"
			:finished="swapStore.state.historyInfo.finished"
			:finished-text="swapStore.state?.historyOrderList.length ? t('trade.txt41') : ''"
			:loading-text="t('trade.txt153')"
			@load="onLoad">
			<div
				v-for="item in swapStore.state?.historyOrderList"
				:key="item.id"
				class="px-4 border-t border-border-subtle py-4">
				<div class="flex items-center text-style-body-700 text-always-black justify-between">
					<div class="flex items-center text-text-primary" @click="handleLink(item.symbol)">
						{{ item.symbol }}
						<!-- <img src="/imgs/common/chevron-right.svg" class="w-5 h-5 ml-2" /> -->
					</div>
					<div
						class="text-style-web-body-medium"
						:class="
							item.status === orderStatusEnum.ENTRUST_SUCCESS
								? 'text-function-buy'
								: 'text-text-description'
						">
						{{ item.status && swapStore.state.orderStatusType[item.status] }}
					</div>
				</div>
				<div class="flex items-center text-style-web-small-regular mt-[6px] mb-4">
					<span
						class="py-[1px] px-[6px] rounded-[3px]"
						:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
						{{ swapStore.state.entrustTypeTextType[item.entrustType]
						}}{{ swapStore.state.directionTextType[item.direction] }}
					</span>
					<span
						class="py-[1px] px-[6px] ml-2 rounded-[3px] bg-background-secondary text-text-tertiary text-style-web-small-regular">
						{{ filterType(swapStore.state?.typeList, item.type) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt31') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ formatTime(item.dealTime) }}
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
						{{ t('trade.txt50') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ item.volume }} {{ item.coinSymbol }}
					</div>
				</div>
				<div class="flex items-center justify-between mt-2">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt51') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{
							item.entrustType === entrustTypeEnum.OPEN
								? thousandsComma(fixD(item.openFee, item.decimalScale))
								: thousandsComma(fixD(item.closeFee, item.decimalScale))
						}}
					</div>
				</div>
				<div class="flex items-center justify-between mt-2">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt52') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ thousandsComma(item.profitAndLoss) }}
					</div>
				</div>
			</div>
		</van-list>
		<Empty
			v-if="!swapStore.state?.historyOrderList.length && !swapStore.state.historyInfo.loading" />
	</div>
</template>
