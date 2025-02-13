<script setup lang="ts">
import { routeTo, toLogin } from '@/utils/routeTo'
import { useDevice } from '@/hooks/useDevice'
import { useUserStore } from '@/store/useUserStore'
import { directionTypeEnum, tradeOrderEnum, orderTabActiveEnum } from '@/enums/trade'
import { reactive, ref, h, onMounted } from 'vue'
import { Popup } from 'vant'
import NtSlider from '@/components/NtSlider/index.vue'
import NtIInput from '@/components/NtIInput/index.vue'
import { directionBgColor, fixD, thousandsComma } from '@/utils/trade'
import { useTradeStore } from '@/store/modules/trade/index'
import { getWalletSymbol, getWalletUSDT, orderAdd } from '@/apis/trade'
import { computed, watch } from 'vue'
import { div, mul } from '@/utils'
import { showSuccessToast, showFailToast, showToast } from '@/components/base/toast'
import { Button } from '@/components/base'
import { useAppStore } from '@/store/useAppStore'
const userStore = useUserStore()
const tradeStore = useTradeStore()
import { useI18n } from 'vue-i18n'
const { isPC } = useDevice()
const { t } = useI18n()
const appStore = useAppStore()

const state = reactive({
	tradeList: [
		{
			title: t('trade.txt96'),
			id: tradeOrderEnum.LIMIT_PRICE
		},
		{
			title: t('trade.txt91'),
			id: tradeOrderEnum.MARKET_PRICE
		}
	],
	showCreateOrder: false,
	formInfo: {
		symbol: tradeStore.state.currentSymboy,
		direction: directionTypeEnum.BUY,
		type: tradeOrderEnum.LIMIT_PRICE,
		amount: '',
		price: 0
	},
	percentValue: 0,
	walletSymbol: {}, // 当前币种
	walletUsdt: {} // usdt
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
// 余额最大可用
const balanceAmount = computed(() => {
	// 买入&限价
	if (isBuy.value && isLimit.value) {
		const balance = state.walletUsdt?.balance / state.formInfo.price
		return balance || 0
	}
	// 买入&市价
	if (isBuy.value && !isLimit.value) {
		const balance = state.walletUsdt?.balance
		return balance || 0
	}
	const balance = state.walletSymbol?.balance
	return fixD(balance, useTypeInfo.value.precisionAmount) || 0
})
// 使用精度 [市价用baseCoinScale 限价:coinScale]
const useTypeInfo = computed(() => {
	const { coinScale, baseCoinScale, coinSymbol, baseSymbol } = tradeStore.state.currentCoinInfo
	if (isBuy.value) {
		return {
			precisionAmount: isLimit.value ? coinScale : baseCoinScale,
			symbol: isLimit.value ? coinSymbol : baseSymbol
		}
	} else {
		return {
			precisionAmount: coinScale,
			symbol: coinSymbol
		}
	}
})
// 监听滑块
watch([() => state.percentValue, () => state.formInfo.direction, () => state.formInfo.type], () => {
	if (state.percentValue) {
		const calA: any = mul(state.percentValue, div(balanceAmount.value, 100))
		state.formInfo.amount = fixD(calA, calA > 0 ? useTypeInfo.value.precisionAmount : 2)
	} else {
		state.formInfo.amount = ''
	}
})

const handleCreate = (data: any) => {
	getWallet()
	state.formInfo.price = tradeStore?.currentWsSymboy?.close
	state.showCreateOrder = true
	state.formInfo.direction = data
}
const getWallet = () => {
	fetchWaUSDT()
	fetchWaSymbol()
}
const changeDirection = (data: any) => {
	state.formInfo.direction = data
}
const close = () => {
	state.showCreateOrder = false
}

// 数据回显
watch([() => tradeStore.state.currentCoinInfo?.coinSymbol], () => {
	if (isPC.value && userStore.loginToken) {
		getWallet()
	}
})
const setBgColor = (type: string) => {
	if (state.formInfo.direction === type)
		return `${directionBgColor(type)} rounded-md  text-always-white`
	return 'text-text-tertiary '
}

const fetchWaSymbol = async () => {
	const res = await getWalletSymbol(tradeStore.state.currentCoinInfo?.coinSymbol)
	state.walletSymbol = res?.data
}
const fetchWaUSDT = async () => {
	const res = await getWalletUSDT(tradeStore.state.currentCoinInfo?.baseSymbol)
	state.walletUsdt = res?.data
}
// 校验数据
const isVail = (params: any) => {
	// 限价单
	if (params.type === tradeOrderEnum.LIMIT_PRICE) {
		if (!params.price) {
			showToast(t(`trade.txt66`))
			return false
		}
		if (!params.amount || !Number(params.amount)) {
			showToast(t(`trade.txt67`))
			return false
		}
	}
	// 市价
	if (params.type === tradeOrderEnum.MARKET_PRICE) {
		console.log(Number(params.amount))
		if (!params.amount || !Number(params.amount)) {
			showToast(t(`trade.txt67`))
			return false
		}
	}
	return true
}
// 下单
const createOrder = async () => {
	const params = {
		symbol: tradeStore.state.currentSymboy,
		price: !isLimit.value ? 0 : state.formInfo.price,
		amount: state.formInfo.amount,
		direction: state.formInfo.direction,
		type: state.formInfo.type
	}
	if (canUseAmount.value <= 0) {
		showToast(t(`text379`))
		return
	}
	if (!isVail(params)) return
	const res: any = await orderAdd(params)
	const isSuccess = res.code === 0
	isSuccess ? showSuccessToast(res.message) : showFailToast(res.message)
	if (isSuccess && tradeStore.state.orderTabActive === orderTabActiveEnum.current) {
		tradeStore.fetchCurrentOrder()
	} else {
		tradeStore.fetchHistoryOrder(true)
	}
	state.formInfo.amount = ''
	updateAmount()
	getWallet()
	state.showCreateOrder = false
}
// 是否是限价单
const isLimit = computed(() => {
	return state.formInfo.type === tradeOrderEnum.LIMIT_PRICE
})
// 是否是买入
const isBuy = computed(() => {
	const direction = directionTypeEnum.BUY === state.formInfo.direction
	return direction
})
const canUseAmount = computed(() => {
	const { coinScale } = tradeStore.state.currentCoinInfo
	if (!state.walletUsdt?.balance || !coinScale) return 0
	return fixD(state.walletUsdt?.balance, coinScale)
})

const dealAmount = computed(() => {
	const price = Number(state.formInfo.price)
	const amount = Number(state.formInfo.amount)
	if (!amount || !price) return ''
	console.log(amount, 'balance====')
	console.log(price, 'price====')
	const res = mul(amount, price)
	return res.toString()
})

const directionText = computed(() => {
	const type = isBuy.value ? t('trade.txt98') : t('trade.txt99')
	return {
		canMax: isBuy.value ? t('trade.txt100') : t('trade.txt101'),
		orderType: `${type} ${tradeStore.state.currentCoinInfo.coinSymbol}`
	}
})
const updateAmount = () => {
	state.percentValue = 0
}

watch(
	() => appStore.refreshTransfer,
	() => {
		// 划转成功，刷新数据
		getWallet()
	}
)

watch(
	() => tradeStore.state.echoPrice,
	(val) => {
		if (val) {
			state.formInfo.price = val
		}
	}
)
const renderTem = computed(() => {
	if (isPC.value) {
		return !state.showCreateOrder && h('div')
	}
	return Popup
})

onMounted(() => {
	if (isPC.value && userStore.loginToken) {
		// 因为需要获取到当前的币种，需等待
		setTimeout(() => {
			state.formInfo.price = tradeStore?.currentWsSymboy?.close
		}, 1200)
	}
})

const onTransfer = () => {
	if (!userStore.loginToken) {
		toLogin()
		return
	}

	routeTo('/my/transfer')
}

const calcFee = computed(() => {
	if (!tradeStore.state.currentCoinInfo?.fee) return 0
	// 公式：price * 数量*fee/100
	if (isLimit.value) {
		if (!state.formInfo.price || !Number(state.formInfo.amount) || !state.formInfo.amount) return 0
		const calFee = div(
			mul(dealAmount.value, tradeStore.state.currentCoinInfo?.fee),
			100
		)
		return calFee
	} else {
		// 公式：amount * fee/100  (amount 是计算u)
		const amount = state.formInfo.amount
		if (!amount || !Number(amount) || !tradeStore.state.currentCoinInfo?.fee) return 0
		const calFee = div(
			mul(amount, tradeStore.state.currentCoinInfo?.fee),
			100
		)
		return calFee
	}
})
</script>
<template>
	<component
		:is="renderTem"
		v-model:show="state.showCreateOrder"
		position="bottom"
		round
		:class="!isPC ? '!bg-background-window' : ''">
		<div class="mt-5 mb-[30px] px-4">
			<div class="flex items-center justify-between mb-[22px]">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt95') }}</div>
				<div v-if="!isPC">
					<Icon name="common/close" :size="24" class="text-text-primary w-6 h-6" @click="close" />

					<!-- <img v-if="!isPC" src="/imgs/common/close.svg" @click="close" class="w-6 h-6" /> -->
				</div>
			</div>
			<div
				class="p-1 text-style-web-h5-medium flex rounded-lg text-style-web-h5-medium"
				:class="[!isPC ? 'bg-background-secondary' : '']">
				<div
					class="py-[10px] flex flex-1 items-center justify-center cursor-pointer"
					:class="[
						isPC ? 'bg-background-secondary rounded-[26px]' : '',
						setBgColor(directionTypeEnum.BUY)
					]"
					@click="changeDirection(directionTypeEnum.BUY)">
					{{ t('trade.txt98') }}
				</div>
				<div
					class="py-[10px] flex flex-1 items-center justify-center cursor-pointer"
					:class="[
						isPC ? 'bg-background-secondary rounded-[26px] ml-1' : '',
						setBgColor(directionTypeEnum.SELL)
					]"
					@click="changeDirection(directionTypeEnum.SELL)">
					{{ t('trade.txt99') }}
				</div>
			</div>
			<Tabs :items="state.tradeList" v-model:active="state.formInfo.type" :line_b="true" />
			<div class="flex items-center mt-3" v-if="!isPC">
				<div class="text-text-description text-style-web-small-regular">
					{{ t('trade.txt102') }}
				</div>
				<div class="flex items-center text-text-primary text-style-web-small-medium">
					<span class="mx-4">{{ thousandsComma(canUseAmount) }} USDT</span>
					<img src="/imgs/common/transfer.svg" @click="routeTo('/my/transfer')" c class="w-4 h-4" />
				</div>
			</div>
			<NtIInput
				class="mt-3"
				v-show="isLimit"
				:label="t('trade.txt45')"
				:i-placeholder="t('trade.txt66')"
				v-model="state.formInfo.price"
				:decimal="tradeStore.state.currentCoinInfo.baseCoinScale"
				right-text="USDT" />
			<NtIInput
				class="mt-3"
				v-show="!isLimit"
				:label="t('trade.txt103')"
				:disabled="true"
				:labelWidth="`95%`" />
			<div class="my-3">
				<NtIInput
					:label="t('trade.txt43')"
					:i-placeholder="t('trade.txt67')"
					v-model="state.formInfo.amount"
					:right-text="useTypeInfo.symbol"
					:decimal="useTypeInfo.precisionAmount"
					@update:modelValue="updateAmount" />
			</div>
			<div class="w-full">
				<NtSlider v-model:model-value="state.percentValue" :data="percentList" />
			</div>
			<NtIInput
				:labelWidth="`45%`"
				v-show="isLimit"
				:label="t('trade.txt46')"
				:model-value="dealAmount"
				right-text="USDT"
				class="mt-3"
				readonly />
			<div class="flex items-center justify-between mt-3" v-if="isPC">
				<div class="text-text-description text-style-web-small-regular">
					{{ t('trade.txt102') }}
				</div>
				<div class="flex items-center text-text-primary text-style-web-small-medium">
					<span class="mx-4 web:mr-1">{{ thousandsComma(canUseAmount) }} USDT</span>
					<img
						src="/imgs/common/transfer.svg"
						@click="onTransfer"
						c
						class="w-4 h-4 cursor-pointer" />
				</div>
			</div>
			<div class="flex items-center justify-between mt-3">
				<div class="text-text-description text-style-web-small-regular">
					{{ directionText.canMax }} asad
				</div>
				<div class="text-text-tertiary text-style-web-base-regular">
					{{ thousandsComma(balanceAmount) }} {{ useTypeInfo.symbol }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-2">
				<div
					class="flex items-center cursor-pointer text-text-description text-style-web-small-regular">
					{{ t('trade.txt51') }}
					<img src="/imgs/common/question.svg" class="w-4 h-4 ml-[2px]" />
				</div>
				<div class="text-text-tertiary text-style-web-base-regular">
					{{ calcFee }}
					{{ tradeStore.state.currentCoinInfo?.baseSymbol }}
				</div>
			</div>
			<Button
				v-if="userStore.loginToken"
				size="small"
				:type="state.formInfo.direction.toLocaleLowerCase()"
				class="text-style-web-small-regular"
				:class="!isPC ? 'mt-3' : 'mt-4'"
				@click="createOrder">
				{{ directionText.orderType }}
			</Button>
			<template v-if="isPC && !userStore.loginToken">
				<Button
					@click="toLogin()"
					size="small"
					class="mt-3 bg-brand-main text-always-white text-style-web-body-bold">
					{{ t('login.txt1') }}
				</Button>
				<Button
					@click="routeTo('/register')"
					size="small"
					plain
					class="mt-3 border border-border-button_strong bg-transparent !text-text-primary text-style-web-body-bold">
					{{ t('home.txt2') }}
				</Button>
			</template>
		</div>
	</component>
	<div
		v-if="!isPC"
		class="fixed z-50 bottom-0 w-full p-4 border-t border-border-gutter flex bg-background-primary text-always-white">
		<Button
			@click="handleCreate(directionTypeEnum.BUY)"
			type="buy"
			class="flex-1 flex mr-4 py-[11px] !h-[42px] bg-function-buy text-style-web-body-700 items-center justify-center">
			{{ t('trade.txt98') }} {{ tradeStore.state.currentCoinInfo.coinSymbol }}
		</Button>
		<Button
			@click="handleCreate(directionTypeEnum.SELL)"
			type="sell"
			class="flex-1 flex py-[11px] !h-[42px] bg-function-sell text-style-web-body-700 items-center justify-center">
			{{ t('trade.txt99') }} {{ tradeStore.state.currentCoinInfo.coinSymbol }}
		</Button>
	</div>
</template>
