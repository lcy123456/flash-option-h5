<script setup lang="ts">
import { reactive, watch, h } from 'vue'
import { formatTimestamp } from '@/utils/date'
import { thousandsComma } from '@/utils/trade'
import { queryCurrentOrders, cancelOrders } from '@/apis/dcontract'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { directionTypeColor, directionTypeBgColor } from '@/utils/trade'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
// import ListView from '@/components/base/list-view/index.vue'
import { getOrderStatus, getOrderOption } from '../utils'
import { showToast } from '@/components/base/toast'
import { ListView, Table } from '@/components/base'

const { t } = useI18n()
const userStore = useUserStore()

const { state } = useDeliveryContract()

const data = reactive({
	pageInfo: {
		size: 30,
		current: 1
	},
	list: [],
	noData: true,
	loading: true,
	filterType: sessionStorage.getItem('dcontract_filter_order')
})

const columns = reactive([
	{
		title: t('trade.txt1'),
		key: 'symbol',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h('span', { class: 'text-text-tertiary text-style-web-small-medium' }, item.symbol),
				h(
					'span',
					{
						class: `py-[1px] px-[6px] ml-[8px] text-style-web-small-regular rounded-[3px] min-w-[36px] ${directionTypeBgColor(item.direction)} ${directionTypeColor(item.direction)}`
					},
					item.direction === 'SELL' ? t('option.txt12') : t('option.txt11')
				)
			])
		}
	},
	{
		title: t('text360'), // 期权编号
		key: 'optionId'
	},

	{
		title: t('text120'),
		key: 'orderTime'
	},
	{
		title: t('option.txt15'), // 预测周期
		key: 'optionName',
		render(item: any) {
			return h(
				'div',
				{ class: 'text-style-web-small-regular text-text-tertiary' },
				item?.optionName
			)
		}
	},

	{
		title: t('option.txt13'), // 交易 金额
		key: 'betAmount',
		render(item: any) {
			return h(
				'div',
				{ class: 'text-style-web-small-regular text-text-tertiary' },
				thousandsComma(item.betAmount)
			)
		}
	},
	{
		title: t('option.txt16'), // 下单价格
		key: 'direction',
		render(item: any) {
			return h(
				'div',
				{ class: 'text-style-web-small-regular text-text-tertiary' },
				thousandsComma(item.orderPrice)
			)
		}
	},
	{
		title: t('option.txt19'), // 手续费
		key: 'fee',
		render(item: any) {
			return h(
				'div',
				{ class: 'text-text-tertiary text-style-web-small-regular' },
				thousandsComma(item.fee)
			)
		}
	},
	{
		title: t('other.txt26'), //操作
		key: 'operation',
		render(item: any) {
			if (item.status === 'OPEN') {
				return h(
					'div',
					{
						class: 'text-style-web-body-medium text-text-warning cursor-pointer',
						onClick: () => {
							handleCancel(item.id)
						}
					},
					t('text118')
				)
			}
			return null
		}
	}
])

const getList = async () => {
	if (!userStore.loginToken) {
		data.noData = true
		return
	}
	const params = {
		size: data.pageInfo.size,
		current: data.pageInfo.current
	}
	if (data.filterType == '1') {
		params.symbol = state.symbol
	}
	const res = await queryCurrentOrders(params)
	data.loading = false
	if (res.code === 0) {
		let array = res.data.list.map((item: any) => {
			item.orderTime = formatTimestamp(Number(item.time), 'MM-DD HH:mm:ss')
			item.statusText = getOrderStatus(item.status)
			item.optionName = getOrderOption(item)
			return item
		})
		if (array.length > 0) {
			// data.list = array
			array = array.filter(
				(item: any) => data.list.findIndex((it: any) => it.id === item.id) === -1
			)
			data.list.push(...array)
		}
		if (res.data.list.length === 0) {
			data.noData = true
		} else {
			data.noData = false
		}

		if (data.list.length === 0) {
			state.orderRefreshTime = 0
		}
	} else {
		data.noData = true
	}
}
const initLoadData = () => {
	data.list.splice(0, data.list.length)
	data.list = []
	data.noData = false
	data.loading = true
	data.pageInfo.current = 1
	getList()
}
initLoadData()

watch(
	() => state.orderRefreshTime,
	(val: number) => {
		if (val < 1) return
		initLoadData()
	}
)

const onLoad = () => {
	data.pageInfo.current = data.pageInfo.current + 1
	getList()
}

const handleFilter = () => {
	let type = sessionStorage.getItem('dcontract_filter_order')
	type = type == '1' ? '0' : '1'
	sessionStorage.setItem('dcontract_filter_order', type)
	data.filterType = type

	initLoadData()
}

const handleCancel = async (id?: string) => {
	if (data.list.length === 0) return
	const params = {}
	if (id) {
		params.id = id
	}
	const res = await cancelOrders(params)
	if (res.code === 0) {
		state.orderRefreshTime = Date.now()
		showToast(t('trade.txt85'))
		// initLoadData()
	}
}

watch(
	() => state.filterOrderType,
	(newType: string) => {
		data.filterType = newType
		initLoadData()
	}
)
</script>
<template>
	<div>
		<div class="pb-20 web:hidden">
			<div class="h-[44px] flex items-center px-[16px] border-b border-border-strong">
				<div class="flex items-center flex-1">
					<img
						:src="data.filterType == 1 ? '/imgs/common/checked.svg' : '/imgs/common/check.svg'"
						class="w-[16px] h-[16px]"
						@click="handleFilter" />
					<span class="ml-[4px] text-style-web-small-regular text-text-description">
						{{ t('text104') }}
					</span>
				</div>
			</div>
			<ListView
				v-model:loading="data.loading"
				v-model:finished="data.noData"
				@load="onLoad"
				:pt="''">
				<div
					v-for="(item, index) in data.list"
					:key="index"
					class="px-4 border-t border-border-subtle py-4"
					:class="index > 0 ? 'border-t border-border-subtle' : ''">
					<div class="flex items-center text-style-body-700 text-always-black justify-between">
						<div class="flex items-center flex-1">
							<span
								class="w-[4px] h-[20px] mr-[8px]"
								:class="item.direction === 'SELL' ? 'bg-function-sell' : 'bg-function-buy'"></span>
							<span class="text-style-web-body-bold text-text-primary">{{ item.symbol }}</span>
							<span
								class="py-[1px] px-[6px] ml-[8px] text-style-web-small-regular rounded-[3px] min-w-[36px]"
								:class="[directionTypeBgColor(item.direction), directionTypeColor(item.direction)]">
								{{ item.direction === 'SELL' ? t('option.txt12') : t('option.txt11') }}
							</span>
						</div>
						<div
							@click="handleCancel(item.id)"
							class="text-style-web-body-medium text-text-warning cursor-pointer"
							v-if="item.status === 'OPEN'">
							{{ t('text118') }}
						</div>
					</div>
					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text360') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ item.optionId }}
						</div>
					</div>

					<div class="flex items-center justify-between mt-[12px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text120') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">{{ item.orderTime }}</div>
					</div>
					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text121') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ item.optionName }}
						</div>
					</div>

					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text122') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ thousandsComma(item.betAmount) }}
						</div>
					</div>
					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text124') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ item.statusText }}
						</div>
					</div>
				</div>
			</ListView>
		</div>
		<div class="pb-20 pdph:hidden">
			<Table
				:columns="columns"
				:dataSource="data.list"
				slide
				v-model:loading="data.loading"
				v-model:finished="data.noData"
				@load="onLoad" />
		</div>
	</div>
</template>
