<script setup lang="ts">
import { orderTypeEnum, directionTypeEnum, actionTypeEnum } from '@/enums/swap'
import { reactive, ref, computed, h, watch, onMounted } from 'vue'
import { useDevice } from '@/hooks/useDevice'
import { Tabs, Button } from '@/components/base'
import NtSlider from '@/components/NtSlider/index.vue'
import NtIInput from '@/components/NtIInput/index.vue'
import { Popup } from 'vant'
import { useAppStore } from '@/store/useAppStore'

const { isPC } = useDevice()
import {
	directionBgColor,
	fixD,
	thousandsComma,
	directionTypeColor,
	macthPosition,
	swapOrderList
} from '@/utils/trade'
import { useSwapStore } from '@/store/modules/swap/index'
import { orderAdd, getLeverage } from '@/apis/swap'
import { routeTo } from '@/utils/routeTo'
import Margin from './components/margin.vue'
import LeveragePop from './components/leverage-pop.vue'
import { div, minus, mul } from '@/utils'
import { showToast, showSuccessToast } from '@/components/base/toast'
const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useUserStore } from '@/store/useUserStore'

const appStore = useAppStore()
const userStore = useUserStore()
const state = reactive({
	tradeList: swapOrderList,
	showCreateOrder: false,
	formInfo: {
		symbol: swapStore.state.currentSymboy,
		direction: directionTypeEnum.BUY,
		type: orderTypeEnum.LIMIT,
		volume: '',
		entrustPrice: '',
		triggerPrice: ''
	},
	percentValue: 0,
	walletSymbol: {}, // 当前币种
	walletUsdt: {}, // usdt
	leverage: 1, //杠杆
	showMargin: false, // 保证金弹框
	showLeverage: false, // 调整杠杆
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
const handleCreate = (data: any) => {
	fetchLeverage()
	state.formInfo.entrustPrice = swapStore?.currentWsSymboy?.close
	state.showCreateOrder = true
	state.formInfo.direction = data
}

const close = () => {
	state.showCreateOrder = false
}

const fetchLeverage = async () => {
	if (!swapStore.state.currentSymboy) return
	const res = await getLeverage({ symbol: swapStore.state.currentSymboy })
	state.leverage = res?.data.leverage
}
// 获取到数据请求参数
watch([() => swapStore.state?.currentSymboy], () => {
	if (isPC.value && userStore.loginToken) {
		fetchLeverage()
	}
})
// 校验数据
const isVail = (params: any) => {
	// 限价单
	if (params.type === orderTypeEnum.LIMIT) {
		if (!params.entrustPrice) {
			showToast(t(`trade.txt151`))
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
	// 计划委托
	if (params.type === orderTypeEnum.CONDITION) {
		if (!params.triggerPrice) {
			showToast(t(`trade.txt152`))
			return false
		}
		if (!params.entrustPrice) {
			showToast(t(`trade.txt151`))
			return false
		}
		if (!params.volume) {
			showToast(t(`trade.txt67`))
			return false
		}
	}
	return true
}
// 下单
const createOrder = async (type: any) => {
	state.formInfo.direction = type
	const params: any = {
		contractCoinId: swapStore.state.currentCoinInfo.id,
		triggerPrice: state.formInfo.triggerPrice, // 触发价
		entrustPrice: state.formInfo.entrustPrice, // 委托价格
		volume: state.formInfo.volume, // 委托数量
		direction: state.formInfo.direction, // 方向
		type: state.formInfo.type, // 下单类型
		leverage: state.leverage // 杠杆
	}
	// 百分比下单
	if (state.percentValue) {
		params.volume = state.percentValue
		params.isPercentage = 1
	}
	if (canUseAmount.value <= 0) {
		showToast(t(`text379`))
		return
	}
	if (!isVail(params)) return
	if (!canAmount.value) {
		showToast(t('trade.txt156'))
		return
	}
	const res: any = await orderAdd(params)
	const isSuccess = res.code === 0
	if (res.code === 0) {
		showSuccessToast(t('trade.txt97'))
	}
	// isSuccess ? showSuccessToast(t('trade.txt97')) : showFailToast(t('trade.txt86'))
	if (isSuccess) {
		swapStore.fetchCurrentOrder()
		swapStore.fetchPostionList()
	}

	state.formInfo.volume = ''
	state.percentValue = 0
	state.showCreateOrder = false
}
// 是否是市价
const isMarket = computed(() => {
	return state.formInfo.type === orderTypeEnum.MARKET
})

const canUseAmount = computed(() => {
	const { baseCoinDecimal } = swapStore.state.currentCoinInfo
	const { balance } = swapStore.state.currentUserInfo
	if (!balance || !baseCoinDecimal) return 0
	return fixD(balance, baseCoinDecimal)
})

const updateAmount = () => {
	state.percentValue = 0
}
/**
 * availableAmount = (maxTotalShare - frozenBalance - frozenMargin) ;
 * availableAmount = (availableAmount <= 0 ? 0 : availableAmount)
 * availableAmount = (availableAmount >= balance ? balance : availableAmount )
 * 可买数量 = availableAmount * 杠杆倍数 / 委托价
 */
const canAmount = computed(() => {
	if (!state.formInfo.entrustPrice) return ''
	const { baseCoinDecimal, maxTotalShare } = swapStore.state.currentCoinInfo
	const { frozenBalance, frozenMargin } = swapStore.state.positionData
	let availableAmount: any = minus(minus(maxTotalShare, frozenBalance), frozenMargin)
	console.log(maxTotalShare, 'maxTotalShare====')
	console.log(frozenBalance, 'frozenBalance====')
	console.log(frozenMargin, 'frozenMargin====')
	const { balance } = swapStore.state.currentUserInfo
	console.log(balance, 'balance****')
	console.log(availableAmount.toString(), 'availableAmount*****')
	console.log(state.leverage, '杠杆倍数====')
	console.log(state.formInfo.entrustPrice, 'state.formInfo.entrustPrice====')
	if (availableAmount <= 0) {
		availableAmount = 0
	} else if (availableAmount >= balance) {
		console.log('====', availableAmount >= balance)
		availableAmount = balance
	}
	const cal = div(mul(availableAmount, state.leverage), state.formInfo.entrustPrice)
	console.log(cal.toString(), 'availableAmount====可买数量')
	return fixD(cal, baseCoinDecimal)
})
const useTypeInfo = computed(() => {
	const { coinScale, baseCoinScale, coinSymbol, baseSymbol, baseCoinDecimal, coinDecimal } =
		swapStore.state.currentCoinInfo
	return {
		coinScale: coinScale,
		baseCoinScale: baseCoinScale,
		baseSymbol: baseSymbol,
		coinSymbol: coinSymbol,
		baseCoinDecimal: baseCoinDecimal,
		coinDecimal: coinDecimal
	}
})
const renderTem = computed(() => {
	if (isPC.value) {
		return !state.showCreateOrder && h('div')
	}
	return Popup
})
watch(
	() => swapStore.state.echoPrice,
	(val) => {
		if (val) {
			state.formInfo.entrustPrice = val
		}
	}
)
watch(
	() => appStore.refreshTransfer,
	() => {
		// 划转成功，刷新数据
		swapStore.fetchPostionList()
	}
)
onMounted(() => {
	setTimeout(() => {
		state.formInfo.entrustPrice = swapStore?.currentWsSymboy?.close
	}, 2000)

	
})
</script>
<template>
	<component
		:is="renderTem"
		v-model:show="state.showCreateOrder"
		position="bottom"
		round
		:class="[isPC ? 'w-[320px] ' : 'bg-background-window']">
		<div class="mt-5 mb-[30px]">
			<div class="flex items-center justify-between mb-[22px] px-4">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt95') }}</div>
				<div class="web:hidden">
					<Icon name="close" :size="24" class="text-text-primary" @click="close" />
				</div>
			</div>
			<div
				class="flex items-center rounded-md justify-between py-2 text-style-web-body-medium text-text-primary mb-3 mx-4"
				:class="[!isPC ? 'bg-background-secondary' : '']">
				<div
					class="flex-1 flex items-center cursor-pointer"
					:class="[
						isPC
							? 'border border-border-subtle rounded-md text-style-app-small-500 justify-between py-[7px] px-2'
							: 'justify-center'
					]"
					@click="state.showMargin = true">
					{{ macthPosition(swapStore.state.currentUserInfo?.positionType) }}
					<Icon name="common/chevron-right" :size="!isPC ? 20 : 12" class="rotate-90 ml-1" />
				</div>
				<div
					class="flex-1 flex items-center cursor-pointer"
					:class="[
						!isPC
							? 'border-l border-border-strong border-h justify-center'
							: 'border border-border-subtle rounded-md text-style-app-small-500 ml-2 justify-between py-[7px] px-2'
					]"
					@click="state.showLeverage = true">
					<span>{{ state.leverage }}X</span>
					<Icon name="common/chevron-right" :size="!isPC ? 20 : 12" class="rotate-90 ml-1" />
				</div>
			</div>
			<Tabs
				:items="state.tradeList"
				v-model:active="state.formInfo.type"
				:headClass="'px-4'"
				:line_b="true" />
			<div class="px-4">
				<div class="flex items-center my-3">
					<div class="text-text-description text-style-web-small-regular">
						{{ t('trade.txt102') }}
					</div>
					<div class="flex items-center text-text-primary text-style-web-small-medium">
						<span class="mx-1">{{ thousandsComma(canUseAmount) }} USDT</span>
						<img
							src="/imgs/common/transfer.svg"
							@click="routeTo('/my/transfer')"
							class="w-4 h-4 cursor-pointer" />
					</div>
				</div>
				<NtIInput
					v-show="state.formInfo.type === orderTypeEnum.CONDITION"
					:label="t('trade.txt48')"
					:i-placeholder="t('trade.txt66')"
					v-model="state.formInfo.triggerPrice"
					:decimal="swapStore.state.currentCoinInfo.coinScale"
					right-text="USDT"
					class="mb-3" />
				<NtIInput
					v-show="!isMarket"
					:label="t('trade.txt47')"
					:i-placeholder="t('trade.txt66')"
					v-model="state.formInfo.entrustPrice"
					:decimal="swapStore.state.currentCoinInfo.coinScale"
					right-text="USDT" />
				<NtIInput
					v-show="isMarket"
					:label="t('trade.txt64')"
					:right-text="t('trade.txt103')"
					:disabled="true" />
				<NtIInput
					:label="t('trade.txt43')"
					:i-placeholder="t('trade.txt67')"
					v-model="state.formInfo.volume"
					:right-text="useTypeInfo.coinSymbol"
					:decimal="useTypeInfo.coinDecimal"
					:inputText="state.percentValue ? `${state.percentValue}%` : ''"
					class="py-3"
					@update:modelValue="updateAmount"></NtIInput>
				<div class="w-full">
					<NtSlider v-model:model-value="state.percentValue" :data="percentList" />
				</div>
				<div class="flex items-center justify-between mt-3">
					<div
						class="text-text-description text-style-web-small-regular flex"
						:class="[isPC ? 'flex-col items-start' : 'items-center']">
						<div :class="[directionTypeColor(actionTypeEnum.BUY)]">{{ t('trade.txt104') }}：</div>
						<div class="web:hidden text-text-secondary">
							{{ thousandsComma(canAmount) }} {{ useTypeInfo.coinSymbol }}
						</div>
						<div class="pdph:hidden text-text-tertiary text-style-web-base-regular mt-1">
							{{ thousandsComma(canAmount) }} {{ useTypeInfo.coinSymbol }}
						</div>
					</div>
					<div
						class="text-text-tertiary text-style-web-base-regular flex"
						:class="[isPC ? 'flex-col items-start' : 'items-center']">
						<div :class="directionTypeColor(actionTypeEnum.SELL)">{{ t('trade.txt105') }}：</div>
						<div class="web:hidden text-text-secondary">
							{{ thousandsComma(canAmount) }} {{ useTypeInfo.coinSymbol }}
						</div>
						<div class="pdph:hidden text-text-tertiary text-style-web-base-regular mt-1">
							{{ thousandsComma(canAmount) }} {{ useTypeInfo.coinSymbol }}
						</div>
					</div>
				</div>
			</div>
			<div
				v-if="userStore.loginToken"
				class="mt-3 pt-3 border-border-strong border-t px-4"
				:class="[!isPC && 'flex items-center']">
				<Button
					size="small"
					:type="actionTypeEnum.BUY.toLocaleLowerCase()"
					class="text-style-web-small-regular"
					:class="!isPC ? 'mt-3' : 'mt-4'"
					@click="createOrder(directionTypeEnum.BUY)">
					{{ isPC ? t('trade.txt108') : t('trade.txt106') }}
				</Button>
				<Button
					size="small"
					:type="actionTypeEnum.SELL.toLocaleLowerCase()"
					class="text-style-web-small-regular"
					:class="!isPC ? 'mt-3  ml-2' : 'mt-2'"
					@click="createOrder(directionTypeEnum.SELL)">
					{{ isPC ? t('trade.txt109') : t('trade.txt107') }}
				</Button>
			</div>
			<div v-if="isPC && !userStore.loginToken" class="px-4">
				<Button
					@click="routeTo('/login')"
					size="small"
					class="mt-3 bg-brand-main text-always-white text-style-web-body-bold">
					{{ t('login.txt1') }}
				</Button>
				<Button
					@click="routeTo('/register')"
					size="small"
					class="mt-3 border border-border-button_strong bg-transparent !text-text-primary text-style-web-body-bold">
					{{ t('home.txt2') }}
				</Button>
			</div>
		</div>
	</component>
	<div
		class="fixed z-50 bottom-[61px] w-full p-4 border-t border-border-gutter flex bg-background-primary text-always-white"
		v-if="!isPC"
		:class="isPC ? 'w-[390px] left-[50%] -translate-x-1/2' : ''">
		<template v-if="userStore.loginToken">
			<div
				@click="handleCreate(directionTypeEnum.BUY)"
				class="flex-1 flex mr-4 py-[11px] rounded-[50px] bg-function-buy text-style-web-body-700 items-center justify-center">
				{{ t('trade.txt108') }}
			</div>
			<div
				@click="handleCreate(directionTypeEnum.SELL)"
				class="flex-1 flex py-[11px] rounded-[50px] bg-function-sell text-style-web-body-700 items-center justify-center">
				{{ t('trade.txt109') }}
			</div>
		</template>
		<div
			v-else
			@click="routeTo('/login')"
			class="flex-1 flex h-[39px] rounded-[50px] bg-brand-main text-style-web-body-700 items-center justify-center">
			{{ t('trade.txt110') }}
		</div>
	</div>
	<Margin v-model:show="state.showMargin" />
	<LeveragePop v-model:show="state.showLeverage" v-model:leverage="state.leverage" @getLeverage="fetchLeverage" />
</template>
