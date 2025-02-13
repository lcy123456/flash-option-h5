<script setup lang="ts">
import { h, reactive } from 'vue'
import { tradeOrderEnum, orderStatusEnum } from '@/enums/trade'
import { useTradeStore } from '@/store/modules/trade/index'
const tradeStore = useTradeStore()
import Empty from '@/components/empty.vue'
import { directionTypeColor, directionTypeBgColor, filterType } from '@/utils/trade'
import { formatTime } from '@/utils/date'
import { thousandsComma } from '@/utils/trade'
import { div } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useUserStore } from '@/store/useUserStore'
const userStore = useUserStore()
const getList = async () => {
	tradeStore.fetchHistoryOrder()
}

// 成交均价 = 成交金额(turnover)/成交数量(amount)
const avgPrice = (item: any) => {
	const avg = div(item.turnover, item.amount)
	return thousandsComma(avg)
}
const onLoad = () => {
	if (tradeStore.state.historyInfo.finished) return
	if (!userStore.loginToken) {
		tradeStore.state.historyInfo.finished = true
		return
	}
	getList()
}
const handleLink = (symbol: any) => {
	tradeStore.switchSymbol(symbol)
}
const showAmount = (item: any) => {
	// 如果是市价 返回--
	if (item.type === tradeOrderEnum.MARKET_PRICE) {
		return '--'
	}
	return `${item.amount} ${item.coinSymbol}`
}

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
		title: t('trade.txt44'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, avgPrice(item))
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
		title: t('trade.txt42'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, item.tradedAmount)
		}
	},
	{
		title: t('trade.txt43'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, showAmount(item))
		}
	},
	{
		title: t('option.txt19'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, thousandsComma(item.fee))
		}
	},
	{
		title: t('trade.txt211'),
		render(item: any) {
			return h(
				'div',
				{
					class: `flex items-center h-full   text-style-web-small-regular ${item.status === orderStatusEnum.CANCELED ? 'text-text-disabled' : 'text-text-description'}`
				},
				[h('div', {}, item.status && tradeStore.state.orderStatusType[item.status])]
			)
		}
	}
])
</script>
<template>
	<div class="pb-20 web:hidden">
		<van-list
			v-model:loading="tradeStore.state.historyInfo.loading"
			:finished="tradeStore.state.historyInfo.finished"
			:finished-text="tradeStore.state?.historyOrderList.length ? t('trade.txt41') : ''"
			:loading-text="t('trade.txt153')"
			@load="onLoad">
			<div
				v-for="item in tradeStore.state?.historyOrderList"
				:key="item.id"
				class="px-4 border-t border-border-subtle py-4">
				<div class="flex items-center text-style-body-700 text-always-black justify-between">
					<div class="flex items-center text-text-primary" @click="handleLink(item.symbol)">
						{{ item.symbol }}
						<Icon name="common/chevron-right" :size="20" class="text-text-primary ml-2" />
					</div>
					<div class="text-text-description text-style-web-body-medium">
						{{ item.status && tradeStore.state.orderStatusType[item.status] }}
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
						{{ t('trade.txt42') }}/{{ t('trade.txt43') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ item.tradedAmount }}/{{ showAmount(item) }}
					</div>
				</div>
				<div class="flex items-center justify-between my-2">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt44') }}/{{ t('trade.txt45') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ avgPrice(item) }}/{{ thousandsComma(item.price) }}
					</div>
				</div>
				<div class="flex items-center justify-between">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt46') }}(USDT)
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ thousandsComma(item.turnover) }}
					</div>
				</div>
				<div class="flex items-center justify-between mt-2">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('option.txt19') }}(USDT)
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ thousandsComma(item.fee) }}
					</div>
				</div>
				<div class="flex items-center justify-between mt-2">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt31') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ formatTime(item.time) }}
					</div>
				</div>
			</div>
		</van-list>

		<Empty v-if="!tradeStore.state?.historyOrderList.length" />
	</div>
	<div class="pdph:hidden">
		<Table
			:columns="columns"
			:dataSource="tradeStore.state?.historyOrderList"
			slide
			v-model:loading="tradeStore.state.historyInfo.loading"
			v-model:finished="tradeStore.state.historyInfo.finished"
			@load="onLoad" />
	</div>
</template>
