<template>
	<div class="px-[16px] py-[12px]">
		<div class="flex items-center h-[30px] mb-[12px]">
			<div class="flex-1 text-style-web-h3-medium text-text-primary">{{ t('option.txt22') }}</div>
		</div>
		<div class="my-[12px] flex justify-between">
			<div
				class="w-[82px] h-[28px] rounded-[4px] cursor-pointer flex items-center justify-center text-style-web-base-medium"
				v-for="(item, i) in data.times"
				:key="item.period"
				@click="updatePeriod(item)"
				:class="getClass(item, i)">
				{{ item.name }}
			</div>
		</div>
		<div
			class="h-[44px] relative mb-[12px] bg-background-secondary flex items-center border border-border-strong rounded-[6px] px-[16px] text-style-web-body-medium text-text-secondary">
			<div class="flex-1 cursor-pointer" @click="data.showTimePopup = !data.showTimePopup">
				{{ t('text106') }}
			</div>
			<div
				class="flex items-center cursor-pointer"
				@click="data.showTimePopup = !data.showTimePopup">
				<span v-if="state.currentTimesOption">{{ state.currentTimesOption.name }}</span>
				<img src="/imgs/common/chevron-down.svg" class="w-[14px] h-[14px]" />
			</div>
			<div
				v-if="data.showTimePopup"
				class="absolute w-[100%] z-1000 px-[16px] bg-background-primary rounded-[8px]"
				:style="{
					boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.1)',
					top: '46px',
					left: 0,
					right: 0
				}">
				<div
					class="h-[54px] flex items-center text-style-web-h4-regular text-text-secondary cursor-pointer"
					v-for="item in state.times"
					@click="handleChange(item)"
					:key="item.optionNo">
					<div class="flex-1">{{ item.name }}</div>
					<img
						v-if="state.currentTimesOption.optionNo === item.optionNo"
						src="/imgs/common/select-tip.svg" />
				</div>
			</div>
		</div>
		<NtIInput
			label=""
			ref="ntInput"
			textAlign="left"
			:i-placeholder="getPlaceTxt"
			v-model="state.amount"
			:decimal="state.baseCoinScale"
			:focusInput="state.focusInput"
			right-text="USDT" />

		<NtIInput
			label=""
			class="mt-[12px]"
			ref="ntInput"
			textAlign="left"
			:i-placeholder="t('text340')"
			v-model="state.amountPercent"
			right-text="%" />

		<div class="my-[12px]">
			<div class="text-style-web-small-regular text-text-description flex items-center">
				<span class="flex-1">{{ t('flwaccount.txt28') }}:</span>
				<span class="text-style-web-small-medium text-text-primary flex items-center">
					{{ thousandsComma(data.flowBalance) }} USDT
					<img
						src="/imgs/flashoption/translate.svg"
						class="w-[16px] h-[16px] ml-[4px] cursor-pointer"
						@click="goTransfer" />
				</span>
			</div>
			<div class="text-style-web-small-regular text-text-description flex items-center mt-[10px]">
				<span class="flex-1">{{ t('flwaccount.txt29') }}:</span>
				<span class="text-style-web-small-medium text-text-primary flex items-center">
					{{ thousandsComma(data.freeUSDT) }} USDT
					<img
						src="/imgs/flashoption/translate.svg"
						class="w-[16px] h-[16px] ml-[4px] cursor-pointer"
						@click="goTransfer" />
				</span>
			</div>
		</div>
		<!-- <div class="w-full">
			<NtSlider v-model="state.amountPercent" :vdata="percentList" />
		</div> -->
	</div>
	<TimePopup v-if="!isWeb" v-model:show="data.showTimePopup" />
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import NtSlider from '@/components/NtSlider/index.vue'
import NtIInput from '@/components/NtIInput/index.vue'
import { thousandsComma } from '@/utils/trade'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { calculatePercentageAmount, toFixed } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { getWalletUSDT } from '@/apis/trade'
import { queryOptionPeriod } from '@/apis/dcontract'
import { followWallet } from '@/apis/follow'
import { formatTime } from '@/utils/date'
import { useDevice } from '@/hooks/useDevice'
import { useRouter } from 'vue-router'
import TimePopup from './component/TimePopup.vue'
import { routeTo } from '@/utils/routeTo'
import { useAppStore } from '@/store/useAppStore'

const { t } = useI18n()
const { isWeb } = useDevice()
const userStore = useUserStore()
const { state, updatePeriod } = useDeliveryContract()
const router = useRouter()
const ntInput = ref(null)
const appStore = useAppStore()

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
const data = reactive({
	currentPeriod: undefined,
	times: [
		// { label: '60s', value: 'PERIOD_1' },
		// { label: '120s', value: 'PERIOD_2' },
		// { label: '5min', value: 'PERIOD_5' },
		// { label: '10min', value: 'PERIOD_10' }
	],
	// amountPercent: undefined,
	freeUSDT: 0,
	flowBalance: 0, // 跟单账户可用
	showTimePopup: false
})

const fetchWaUSDT = async () => {
	if (!userStore.loginToken) return
	const res = await getWalletUSDT('USDT')
	if (res.code === 0) {
		data.freeUSDT = toFixed(res?.data.balance, 2)
	}
}
const fetchFlowBalance = async () => {
	if (!userStore.loginToken) return
	const res: any = await followWallet()
	if (res.code === 0) {
		data.flowBalance = toFixed(res?.data.balance, 2)
	}
}
fetchWaUSDT()
fetchFlowBalance()

const initData = async () => {
	const res = await queryOptionPeriod()
	if (res.code === 0) {
		data.times = res.data.map((item: any) => {
			return item
		})
		// state.timeResolution = data.times[0]
		updatePeriod(data.times[0])
	}
}

initData()
const getPlaceTxt = computed(() => {
	return t('option.txt24') + ` ${state.minAmount}`
})

const goTransfer = () => {
	// router.push('/my/transfer')
	routeTo('/my/transfer')
}

function getClass(item, index) {
	let cls = ''
	if (index > 0) {
		cls = 'ml-[12px]'
	}
	if (state.timeResolution.period === item.period) {
		cls += ' bg-background-tertiary text-text-primary border border-border-button_strong'
	} else {
		cls += ' border-0 bg-background-secondary text-text-description'
	}
	return cls
}

watch(
	() => state.amountPercent,
	(newVal: number) => {
		if (newVal == 0) {
			state.amount = undefined
			return
		}
		if (!newVal) return

		if (userStore.userInfo?.isTrader === 1) {
			// 交易员身份，用跟单账户资金
			if (data.flowBalance === 0) return
			state.amount = calculatePercentageAmount(Number(newVal), Number(data.flowBalance))
		} else {
			if (data.freeUSDT === 0) return
			state.amount = calculatePercentageAmount(Number(newVal), Number(data.freeUSDT))
		}
	}
)

watch(
	() => state.orderRefreshTime,
	(val: number) => {
		if (val < 1) return
		state.amount = undefined
		state.amountPercent = undefined
		fetchWaUSDT()
		fetchFlowBalance()
	}
)

const handleChange = (item: any) => {
	// changeLang(data.currentLan)
	state.currentTimesOption = item
	data.showTimePopup = false
	console.log('data.showTimePopup :', data.showTimePopup)
}

watch(
	() => appStore.refreshTransfer,
	() => {
		fetchWaUSDT()
		fetchFlowBalance()
	}
)
</script>
