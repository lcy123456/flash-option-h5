<script setup lang="ts">
import { reactive, watch, h } from 'vue'
import { formatTimestamp } from '@/utils/date'
import { thousandsComma } from '@/utils/trade'
import { getCurrentOrders } from '@/apis/option'
import { useFlashOption } from '@/hooks/useFlashOption'
// import Empty from '@/components/empty.vue'
import { directionTypeColor, directionTypeBgColor, filterType } from '@/utils/trade'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { ListView, Table } from '@/components/base'
import { getOrderOption } from '../utils'

const { t } = useI18n()
const userStore = useUserStore()

const { state } = useFlashOption()

const data = reactive({
	pageInfo: {
		pageSize: 20,
		pageNo: 1
	},
	list: [],
	noData: false,
	loading: true
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
		title: t('text120'), // 下单时间
		key: 'time'
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
		title: t('option.txt16'), // 下单价格
		key: 'orderPrice',
		render(item: any) {
			return h(
				'div',
				{ class: 'text-style-web-small-regular text-text-tertiary' },
				thousandsComma(item.orderPrice)
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
		title: t('option.txt19'), // 手续费
		key: 'fee',
		render(item: any) {
			return h(
				'div',
				{ class: 'text-text-tertiary text-style-web-small-regular' },
				thousandsComma(item.fee)
			)
		}
	}
])

const getList = async () => {
	if (!userStore.loginToken) {
		data.noData = true

		return
	}
	const res = await getCurrentOrders({
		symbol: state.symbol,
		size: data.pageInfo.pageSize,
		current: data.pageInfo.pageNo
	})
	data.loading = false

	if (res.code === 0) {
		const array = res.data.list.map((item: any) => {
			// item.optionName = formatTimestamp(Number(item.time))
			item.optionName = getOrderOption(item)
			item.time = formatTimestamp(Number(item.time))
			return item
		})
		data.list.push(...array)

		if (data.list.length < 1) {
			state.orderRefreshTime = 0
		}
		if (array.length < data.pageInfo.pageSize) {
			data.noData = true
		} else {
			data.noData = false
		}
	}
}

const initData = () => {
	data.pageInfo.pageNo = 1
	data.list = []
	data.loading = true
	data.noData = false
	getList()
}

initData()

watch(
	() => state.orderRefreshTime,
	(val: number) => {
		if (val < 1) return
		initData()
	}
)
const onLoad = () => {}
</script>
<template>
	<div>
		<div class="pb-20 web:hidden">
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
						<div class="flex items-center">
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
					</div>
					<div class="flex items-center justify-between mt-[12px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text360') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">{{ item.optionId }}</div>
					</div>
					<div class="flex items-center justify-between mt-[12px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text120') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">{{ item.time }}</div>
					</div>
					<div class="flex items-center justify-between mt-[12px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('option.txt15') }}
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">{{ item.optionName }}</div>
					</div>
					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('option.txt13') }}(USDT)
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ thousandsComma(item.betAmount) }}
						</div>
					</div>
					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('option.txt16') }}(USDT)
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ thousandsComma(item.orderPrice) }}
						</div>
					</div>
					<div class="flex items-center justify-between mt-[10px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('option.txt19') }}(USDT)
						</div>
						<div class="text-text-tertiary text-style-web-base-medium">
							{{ thousandsComma(item.fee) }}
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
