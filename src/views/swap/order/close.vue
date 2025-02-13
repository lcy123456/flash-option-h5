<script setup lang="ts">
import { orderTypeEnum, actionTypeEnum } from '@/enums/swap'
import { reactive, ref, computed } from 'vue'
import NtSlider from '@/components/NtSlider/index.vue'
import NtIInput from '@/components/NtIInput/index.vue'
import { Dialog } from '@/components/base'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
import { Popup } from 'vant'
import {
	PONTextColor,
	fixD,
	thousandsComma,
	macthDirectionType,
	directionColor,
	macthPosition,
	closeOrderList
} from '@/utils/trade'
import { useSwapStore } from '@/store/modules/swap/index'
import { closePostion } from '@/apis/swap'
import { useVModel } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { mul, div, minus } from '@/utils/index'
import { showSuccessToast, showFailToast, showToast } from '@/components/base/toast'
const swapStore = useSwapStore()
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	// 操作项
	currentItem: {
		type: Object,
		default: () => {}
	}
})
const emits = defineEmits(['update:show'])
const show = useVModel(props, 'show', emits)
const state = reactive({
	tradeList: closeOrderList,
	formInfo: {
		symbol: swapStore.state.currentSymboy,
		type: orderTypeEnum.MARKET,
		volume: '',
		entrustPrice: '',
		triggerPrice: ''
	},
	percentValue: 0,
	actionType: actionTypeEnum.BUY
})

const percentList = ref([
	{
		id: 0,
		name: '0%'
	},
	{
		id: 25,
		name: '25%'
	},
	{
		id: 50,
		name: '50%'
	},
	{
		id: 75,
		name: '75%'
	},
	{
		id: 100,
		name: '100%'
	}
])
const close = () => {
	show.value = false
	state.formInfo.volume = ''
	state.percentValue = 0
}
// 校验数据
const isVail = (params: any) => {
	// 限价单
	if (params.type === orderTypeEnum.LIMIT) {
		if (!params.entrustPrice) {
			showToast(t(`trade.txt66`))
			return false
		}
		if (!params.volume) {
			showToast(t(`trade.txt67`))
			return false
		}
	}
	// 市价
	if (isMarket.value) {
		if (!params.volume) {
			showToast(t(`trade.txt67`))
			return false
		}
	}
	return true
}
// 下单
const closeHold = async () => {
	const params = {
		positionId: props.currentItem.id,
		entrustPrice: inputPrice.value, // 委托价格
		volume: inputVol.value, // 委托数量
		type: state.formInfo.type // 下单类型
	}
	if (!isVail(params)) return
	const res: any = await closePostion(params)
	const isSuccess = res.code === 0
	if (isSuccess) {
		swapStore.fetchPostionList()
	}
	isSuccess ? showSuccessToast(t('trade.txt85')) : showFailToast(t('trade.txt86'))
	close()
}
const updateAmount = () => {
	state.percentValue = 0
}
const percentVol = computed(() => {
	const { availablePosition = 0 } = props.currentItem
	if (!state.percentValue || !availablePosition) return ''
	return mul(availablePosition, div(state.percentValue, 100))
})
// ws 币对相关价格
const wsPrice = computed(() => {
	const price = swapStore.mathWsSymboy(props.currentItem.coin.symbol) || {}
	return price
})

// 用户输入价格
const inputPrice = computed(() => {
	return isMarket.value ? wsPrice.value.close : state.formInfo.entrustPrice
})
// 用户输入的数量或滑块的计算出来的数量
const inputVol = computed(() => {
	return percentVol.value ? percentVol.value.toNumber() : state.formInfo.volume
})
/**
 * 预估盈利
 * 做空= 数量 * (开仓价 -用户输入价格)
 * 做多= 数量 * (用户输入价格 - 开仓价)
 */
const estimatedProft = computed(() => {
	const { openPrice, direction } = props.currentItem
	const price = inputPrice.value
	if (!price || !inputVol.value) return '--'
	const amount =
		direction === actionTypeEnum.SELL ? minus(openPrice, price) : minus(price, openPrice)
	return fixD(mul(inputVol.value, amount), 4)
})
/**
 * 盈亏率
 * 盈亏金额 / 保证金
 */
const profitRate = computed(() => {
	const profitAmount = estimatedProft.value
	if (!profitAmount || !inputPrice.value) return '--'
	return `${fixD(div(profitAmount, props.currentItem.principalAmount), 2)}%`
})
// 是否是市价
const isMarket = computed(() => {
	return state.formInfo.type === orderTypeEnum.MARKET
})
// 渲染选择的组件
const renderTem = computed(() => {
	if (!isPC.value) {
		return Popup
	}
	return Dialog
})
</script>
<template>
	<component
		:is="renderTem"
		v-model:show="show"
		v-bind:position="!isPC ? 'bottom' : 'center'"
		:title="t('trade.txt82')"
		class="bg-background-window"
		round>
		<div class="mt-5 mb-3 px-4">
			<div class="flex items-center justify-between mb-[22px]" v-if="!isPC">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt82') }}</div>
				<div class="">
					<Icon name="close" :size="24" @click="close" class="text-text-primary" />
				</div>
			</div>
			<div class="my-3">
				<div class="flex items-center justify-between">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt61') }}
					</span>
					<div class="flex items-center">
						<img :src="currentItem.coin.logo" class="w-4 h-4" />
						<span class="text-text-primary text-style-web-base-bold mx-1">
							{{ currentItem.coin.symbol }}
						</span>
						<span
							class="text-style-web-small-regular text-text-tertiary bg-background-tertiary px-[6px] py-[1px] rounded-[3px]">
							{{ t('trade.txt13') }}
						</span>
						<span
							class="text-style-web-small-regular text-text-tertiary bg-background-tertiary px-[6px] py-[1px] mx-1 rounded-[3px]">
							{{ macthPosition(currentItem.type) }}
						</span>
						<span
							class="ml-1 rounded-[3px] py-[1px] px-[6px] text-style-web-small-regular"
							:class="[
								directionColor(currentItem.direction)?.lightBg,
								directionColor(currentItem.direction)?.textColor
							]">
							{{ macthDirectionType(currentItem.direction, 'key', 'name')
							}}{{ currentItem.leverage }}X
						</span>
					</div>
				</div>
				<div class="flex items-center justify-between my-2">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt62') }}
					</span>
					<span class="text-text-primary">
						{{ thousandsComma(fixD(currentItem.openPrice, currentItem.coin.coinScale)) }}
					</span>
				</div>
				<div class="flex items-center justify-between">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('trade.txt16') }}
					</span>
					<span class="text-text-primary">
						{{ thousandsComma(fixD(wsPrice.mark, currentItem.coin.coinScale)) }}
					</span>
				</div>
			</div>
			<NtIInput
				:label="t('trade.txt28')"
				:i-placeholder="isMarket ? '' : t('trade.txt66')"
				v-model="state.formInfo.entrustPrice"
				:decimal="swapStore.state.currentCoinInfo.baseCoinScale"
				:right-text="state.tradeList"
				:disabled="isMarket"
				v-model:selectValue="state.formInfo.type" />
			<NtIInput
				:label="t('trade.txt29')"
				:i-placeholder="t('trade.txt67')"
				v-model="state.formInfo.volume"
				:inputText="state.percentValue ? `${state.percentValue}%(≈${percentVol})` : ''"
				:right-text="currentItem.coin.coinSymbol"
				:decimal="props.currentItem.decimalScale"
				class="py-3"
				@update:modelValue="updateAmount" />
			<div class="w-full pl-2">
				<NtSlider v-model="state.percentValue" :data="percentList" />
			</div>
			<div class="flex items-center justify-between mt-3">
				<span class="text-style-web-base-regular text-text-description">
					{{ t('trade.txt68') }}
				</span>
				<span class="text-text-primary">
					{{ thousandsComma(currentItem.availablePosition) }} {{ currentItem.coin.coinSymbol }}
				</span>
			</div>
			<div class="flex items-center justify-between mt-2">
				<span class="text-style-web-base-regular text-text-description">
					{{ t('trade.txt69') }}（{{ t('trade.txt70') }}）
				</span>
				<span :class="PONTextColor(estimatedProft)">
					{{ estimatedProft }}USDT({{ profitRate }})
				</span>
			</div>
		</div>
		<div class="flex items-center border-t border-border-gutter py-5 px-4">
			<Button
				type="small"
				class="flex-1 border-border-button_strong bg-transparent !text-text-primary"
				@click="close">
				{{ t('trade.txt71') }}
			</Button>
			<Button type="small" class="ml-4 flex-1" @click="closeHold">
				{{ t('trade.txt4') }}
			</Button>
		</div>
	</component>
</template>
