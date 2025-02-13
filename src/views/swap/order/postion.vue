<script setup lang="ts">
import { onMounted, computed, reactive, ref, h } from 'vue'
import { useSwapStore } from '@/store/modules/swap/index'
import Close from './close.vue'
import Detail from './detail.vue'
import Empty from '@/components/empty.vue'
import Limit from './limit.vue'
import Reverse from './reverse.vue'
import {
	thousandsComma,
	macthPosition,
	macthDirectionType,
	fixD,
	PONTextColor,
	directionColor
} from '@/utils/trade'
import { closeAllPostion } from '@/apis/swap'
import { mul, div, plus, minus } from '@/utils/index'
import { actionTypeEnum } from '@/enums/swap'
import Checkbox from '@/components/base/checkbox/index.vue'
import { Table } from '@/components/base'
import Icon from '@/components/base/icon/index.vue'
const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const getList = () => {
	swapStore.fetchPostionList()
}
onMounted(() => {
	getList()
})
const state = reactive({
	showClose: false, // 平仓
	showLimit: false, //止盈止损
	showReverse: false, // 反向开仓
	showDetail: false, // 止盈止损弹框
	currentItem: {} as any
})

const handleAllClose = async () => {
	if (!swapStore.state?.positionList.length) return
	const res: any = await closeAllPostion()
	if (res?.code === 0) {
		swapStore.fetchPostionList(true)
	}
}
//当前最新价格
const newPrice = computed(() => {
	return function (item: any) {
		return swapStore.mathWsSymboy(item.coin.symbol) || {}
	}
})

// 总和计算
const allCalculator = computed(() => {
	const list = swapStore.state?.positionList
	let allPostionMargin: any = 0
	let allProfit: any = 0
	let sellMarketTotal: any = 0
	let buyMarketTotal: any = 0
	const symboyInfo: any = {}
	const symboyMargin: any = {} // 当前币对多空保证金之和
	list.forEach((item) => {
		const { direction, principalAmount, currentPosition } = item
		allPostionMargin = plus(allPostionMargin, principalAmount)
		allProfit = plus(allProfit, estimatedProft.value(item))
		const isSell = direction === actionTypeEnum.SELL
		if (symboyInfo.hasOwnProperty(item.coin.coinSymbol)) {
			symboyMargin[`${item.coin.coinSymbol}`] = plus(
				symboyMargin[`${item.coin.coinSymbol}`],
				principalAmount
			)
			if (!isSell) {
				symboyInfo[`${item.coin.coinSymbol}_${direction}`] = plus(
					symboyInfo[`${item.coin.symbol}_BUY`],
					currentPosition
				)
			} else {
				symboyInfo[`${item.coin.coinSymbol}_${direction}`] = plus(
					symboyInfo[`${item.coin.symbol}_SELL`],
					currentPosition
				)
			}
		} else {
			symboyInfo[`${item.coin.coinSymbol}_SELL`] = !isSell ? currentPosition : 0
			symboyInfo[`${item.coin.coinSymbol}_BUY`] = isSell ? currentPosition : 0
			symboyMargin[`${item.coin.coinSymbol}`] = principalAmount
		}

		// 账户多/空仓位市值 = 当前仓位 * 当前价格
		const marketPrice = mul(currentPosition, newPrice.value(item).mark)
		if (isSell) {
			// 空单
			sellMarketTotal = plus(sellMarketTotal, marketPrice)
		} else if (!isSell) {
			// 多
			buyMarketTotal = plus(buyMarketTotal, marketPrice)
		}
	})

	return {
		symboyMargin: symboyMargin,
		symboyInfo: symboyInfo,
		allPostionMargin: allPostionMargin, // 所有仓位保证金
		allProfit: allProfit, // 所有仓位盈利
		sellMarketTotal: sellMarketTotal,
		buyMarketTotal: buyMarketTotal
	}
})
/**
 * 预估盈利
 * 做空= 数量 * (开仓价 - 输入的止盈价)
 * 做多= 数量 * (输入的止盈价 - 开仓价)
 * 止盈价=[ws最新价格]
 */
const estimatedProft = computed(() => {
	return function (item: any) {
		const { currentPosition, openPrice, direction } = item
		const amount =
			direction === actionTypeEnum.SELL
				? minus(openPrice, newPrice.value(item)?.close)
				: minus(newPrice.value(item)?.close, openPrice)
		return fixD(mul(currentPosition, amount), 4)
	}
})
/**
 * 预估强平价
 * 当前币对爆仓价 = (多仓数量 * 开仓价 - 空仓数量 * 空仓开仓价 - 当前币对多空保证金之和) / (多仓数量 - 空仓数量)
 *
 */
const blastRate = computed(() => {
	return function (item: any) {
		const { openPrice, coin } = item
		const { symboyInfo, symboyMargin } = allCalculator.value
		const buyAmount = symboyInfo[`${coin.coinSymbol}_BUY`]
		const sellAmount = symboyInfo[`${coin.coinSymbol}_SELL`]
		const buyPrice = mul(buyAmount, openPrice)
		const sellPrice = mul(sellAmount, openPrice)
		// (多仓数量 - 空仓数量)
		const subAmount = Math.abs(minus(buyAmount, sellAmount))
		const molecular = minus(Math.abs(minus(sellPrice, buyPrice)), symboyMargin[coin.coinSymbol])
		const price = div(molecular, subAmount)
		return fixD(price, coin.coinScale)
	}
})
/**
 * 保证金率
 * 当前仓位保证金比率 = ( currentPosition * 当前标记价格 * coin.maintenanceMarginRate ) / principalAmount *100
 */
const marginRate = computed(() => {
	return function (item: any) {
		const { currentPosition, principalAmount } = item
		const mark = swapStore.mathWsSymboy(item.coin.symbol)?.mark
		const { maintenanceMarginRate } = item.coin
		const molecular = mul(mul(currentPosition, mark), maintenanceMarginRate)
		const cal = mul(div(molecular, principalAmount), 100)
		return fixD(cal, 4)
	}
})

/**
 * 盈亏率
 * 盈亏金额 / 保证金
 */
const profitRate = computed(() => {
	return function (item: any) {
		const profitAmount = estimatedProft.value(item)
		return fixD(div(profitAmount, item.principalAmount), 2)
	}
})

const handleChange = () => {
	swapStore.fetchPostionList()
}
const handleShowAction = (item: Object, type: String) => {
	state.currentItem = item
	state[type] = true
}
const handleLink = (symbol: any) => {
	swapStore.switchSymbol(symbol)
}
const finished = ref(true) // 持仓列表没有分页
const loading = ref(true)

const columns = reactive([
	{
		title: t('trade.txt205'),
		render(item: any) {
			return h(
				'div',
				{
					class: 'flex items-center text-style-web-small-medium text-text-tertiary'
				},
				[
					h('div', [h('p', {}, item.coin?.symbol), h('p', {}, t('trade.txt13'))]),
					h(
						'div',
						{
							class: `text-style-web-small-regular py-[1px] px-[2px] rounded-[3px] ml-1 ${directionColor(item.direction)?.lightBg}
						${directionColor(item.direction)?.textColor}`,
							props: {
								type: '',
								size: 'small'
							}
						},
						item.leverage + 'X'
					)
				]
			)
		}
	},
	{
		title: `${t('trade.txt73')}/${t('trade.txt74')}`,
		key: 'optionName',
		render(item: any) {
			return h('div', { class: 'flex items-center  text-style-web-small-regular' }, [
				h(
					'div',
					{
						class: 'flex items-center'
					},
					[
						h(
							'p',
							{
								class: `${directionColor(item.direction)?.textColor}`
							},
							thousandsComma(item.totalPosition)
						),
						h('p', {}, `/${thousandsComma(item.availablePosition)}`)
					]
				)
			])
		}
	},
	{
		title: t('trade.txt75'),
		key: 'direction',
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				thousandsComma(fixD(item.openPrice, item.coin.coinScale))
			)
		}
	},
	{
		title: t('trade.txt76'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'div',
				{ class: 'flex items-center ' },
				h('div', [
					h(
						'p',
						{
							class: 'text-style-web-small-regular text-text-tertiary'
						},
						thousandsComma(fixD(item.principalAmount, item.coin.coinScale))
					),
					h('p', {}, `(${macthPosition(item.type)})`)
				])
			)
		}
	},
	{
		title: t('trade.txt77'),
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, `${marginRate.value(item)}%`)
		}
	},
	{
		title: t('trade.txt78'),
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, `${thousandsComma(blastRate.value(item))}`)
		}
	},
	{
		title: t('trade.txt79'),
		render(item: any) {
			return h(
				'span',
				{ class: 'flex items-center ' },
				`${thousandsComma(fixD(newPrice.value(item)?.close, item.coin.coinScale))}`
			)
		}
	},
	{
		title: `${t('trade.txt80')}(${t('trade.txt81')})`,
		render(item: any) {
			return h('div', { class: 'flex  flex-col text-style-web-small-regular' }, [
				h('div', { class: 'flex  items-center ' }, [
					h(
						'p',
						{
							class: `${directionColor(item.direction)?.textColor}`
						},
						thousandsComma(item.totalPosition)
					),
					h('p', {}, `/${thousandsComma(item.availablePosition)}`)
				])
			])
		}
	},
	{
		title() {
			return h(
				'span',
				{
					class: 'flex items-center text-style-web-small-regular text-text-brand cursor-pointer',
					onClick: () => {
						handleAllClose()
					}
				},
				`${t('trade.txt72')}`
			)
		},
		render(item: any) {
			return h(
				'div',
				{ class: 'flex items-center text-text-brand text-style-web-small-regular cursor-pointer ' },
				[
					h(
						'div',
						{
							onClick: () => {
								handleShowAction(item, 'showClose')
							}
						},
						t('text159')
					)
				]
			)
		}
	},
	{
		title: `${t('trade.txt60')}`,
		render(item: any) {
			return h(
				'div',
				{ class: 'flex items-center  text-style-web-small-regular cursor-pointer ' },
				[
					h(
						'div',
						{
							class: 'flex items-center'
						},
						[
							h(
								'span',
								{
									class: 'flex items-center',
									onClick: () => {
										handleShowAction(item, 'showLimit')
									}
								},
								// sssss
								[
									// h('img', {
									// 	class: ' w-3 h-3',
									// 	src: '/imgs/common/add.svg'
									// }),
									h(Icon, {
										size: 12,
										name: 'common/add',
										class: 'text-text-primary'
									}),
									h('span', t('text160'))
								]
							),
							h(
								'span',
								{
									onClick: () => {
										handleShowAction(item, 'showDetail')
									},
									class: 'flex items-center ml-1'
								},
								[
									h(Icon, {
										size: 12,
										name: 'swap/detail',
										class: 'text-text-primary'
									}),
									h('span', t('help.detail'))
								]
							)
						]
					)
				]
			)
		}
	},
	{
		title: `${t('trade.txt83')}`,
		render(item: any) {
			return h(
				'div',
				{ class: 'flex items-center h-full text-style-web-small-regular cursor-pointer ' },
				[
					h(
						'div',
						{
							onClick: () => {
								handleShowAction(item, 'showReverse')
							}
						},
						t('text160')
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
		<div
			class="text-text-tips text-style-web-small-regular my-2 px-4 flex items-center justify-between">
			<div class="flex items-center text-text-description">
				<Checkbox v-model:value="swapStore.state.positionInfo.isOnlyCurrent" @change="handleChange">
					<div class="text-text-description">
						{{ t('trade.txt55') }}
					</div>
				</Checkbox>
			</div>
			<div
				class="px-3 py-[6px] rounded-[20px] text-style-web-small-regular border h-[28px] box-border"
				:class="[
					swapStore.state?.positionList.length
						? 'text-text-primary border-border-button_strong'
						: 'text-text-disabled border-border-strong'
				]"
				@click="handleAllClose">
				{{ t('trade.txt72') }}
			</div>
		</div>
		<template v-if="swapStore.state?.positionList.length">
			<div
				class="px-4 border-t border-border-subtle py-4"
				v-for="item in swapStore.state?.positionList"
				:key="item.coin">
				<div class="flex items-center justify-between">
					<div
						class="border-left-4 flex items-center"
						:class="directionColor(item.direction)?.borderColor"
						@click="handleLink(item.coin.symbol)">
						<span class="text-style-web-body-700 text-text-primary mx-2">
							{{ item.coin.symbol }}
						</span>
						<!-- <img src="/imgs/common/chevron-right.svg" class="w-5 h-5" /> -->
					</div>
					<!-- <img src="/imgs/common/share.svg" class="w-5 h-5" /> -->
				</div>
				<div class="text-style-web-small-regular mt-[6px]">
					<span
						class="rounded-[3px] py-[1px] px-[6px]"
						:class="[
							directionColor(item.direction)?.lightBg,
							directionColor(item.direction)?.textColor
						]">
						{{ macthDirectionType(item.direction, 'key') }}{{ item.leverage }}X
					</span>

					<span
						class="bg-background-tertiary text-text-tertiary rounded-[3px] py-[1px] px-[6px] ml-2">
						{{ macthPosition(item.type) }}
					</span>
				</div>
				<div class="flex items-center justify-between pt-4">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt73') }}/{{ t('trade.txt74') }}({{ item.coin.coinSymbol }})
					</span>
					<span class="text-style-web-base-medium text-text-secondary">
						{{ thousandsComma(item.totalPosition) }}/{{ thousandsComma(item.availablePosition) }}
					</span>
				</div>
				<div class="flex items-center justify-between py-2">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt75') }}（USDT）
					</span>
					<span class="text-style-web-base-medium text-text-secondary">
						{{ thousandsComma(fixD(item.openPrice, item.coin.coinScale)) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt76') }}（USDT）
					</span>
					<span class="text-style-web-base-medium text-text-secondary">
						{{ thousandsComma(fixD(item.principalAmount, item.coin.coinScale)) }}
					</span>
				</div>
				<div class="flex items-center justify-between py-2">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt77') }}
					</span>
					<span class="text-style-web-base-medium text-text-secondary">
						{{ marginRate(item) }}%
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt78') }}（USDT）
					</span>
					<span class="text-style-web-base-medium text-text-secondary">
						{{ thousandsComma(blastRate(item)) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-style-web-base-regular text-text-description py-2">
						{{ t('trade.txt79') }}（USDT）
					</span>
					<span class="text-style-web-base-medium text-text-secondary">
						{{ thousandsComma(fixD(newPrice(item)?.close, item.coin.coinScale)) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt80') }}/{{ t('trade.txt81') }}
					</span>
					<span class="text-style-web-base-medium" :class="PONTextColor(estimatedProft(item))">
						{{ thousandsComma(estimatedProft(item)) }}/{{ profitRate(item) }}%
					</span>
				</div>
				<div class="grid grid-cols-3 gap-[7px] text-style-web-base-medium text-text-tertiary mt-4">
					<div
						class="py-2 rounded-md bg-background-tertiary text-center"
						@click="handleShowAction(item, 'showLimit')">
						{{ t('trade.txt60') }}
					</div>
					<div
						class="py-2 rounded-md bg-background-tertiary text-center"
						@click="handleShowAction(item, 'showClose')">
						{{ t('trade.txt82') }}
					</div>
					<div
						class="py-2 rounded-md bg-background-tertiary text-center"
						@click="handleShowAction(item, 'showReverse')">
						{{ t('trade.txt83') }}
					</div>
				</div>
			</div>
		</template>
		<Empty v-else :tips="t('trade.txt84')" />
	</div>
	<div class="pdph:hidden">
		<Table
			:columns="columns"
			:dataSource="swapStore.state?.positionList"
			slide
			v-model:loading="loading"
			v-model:finished="finished"
			@load="onLoad" />
	</div>
	<Detail v-model:show="state.showDetail" :currentItem="state.currentItem" />
	<Close v-model:show="state.showClose" :currentItem="state.currentItem" />
	<Limit v-model:show="state.showLimit" :currentItem="state.currentItem" />
	<Reverse v-model:show="state.showReverse" :currentItem="state.currentItem" />
</template>
