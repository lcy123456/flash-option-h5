<template>
	<div class="px-[16px] py-[12px]">
		<div class="flex items-center h-[30px] mb-[12px]">
			<div class="flex-1 text-style-web-h3-medium text-text-primary">{{ t('option.txt22') }}</div>
		</div>
		<div class="my-[12px] flex pdph:hidden justify-between">
			<div
				class="w-[58px] h-[28px] rounded-[4px] flex items-center justify-center text-style-web-base-medium cursor-pointer"
				v-for="(item, i) in state.times"
				:key="item.value"
				@click="updateTimeResolution(item)"
				:class="getClass(item, i)">
				{{ item.label }}
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
		<div class="py-3">
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
		<div class="w-full">
			<NtSlider v-model="data.percentageVlaue" :data="percentList" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import NtSlider from '@/components/NtSlider/index.vue'
import NtIInput from '@/components/NtIInput/index.vue'
import { thousandsComma } from '@/utils/trade'
import { useFlashOption } from '@/hooks/useFlashOption'
import { calculatePercentageAmount, toFixed } from '@/utils'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { getWalletUSDT } from '@/apis/trade'
import { followWallet } from '@/apis/follow'
import { routeTo } from '@/utils/routeTo'
import { useAppStore } from '@/store/useAppStore'

const { t } = useI18n()
const userStore = useUserStore()
const { state, updateTimeResolution } = useFlashOption()
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
	percentageVlaue: 0,
	freeUSDT: 0,
	flowBalance: 0, // 跟单账户可用

	transferVisible: false
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

const handleRefresh = () => {
	fetchWaUSDT()
	fetchFlowBalance()
}

handleRefresh()

const getPlaceTxt = computed(() => {
	return t('option.txt24') + ` ${state.minAmount}`
})

const goTransfer = () => {
	routeTo('/my/transfer')
}

function getClass(item, index) {
	let cls = ''
	if (index > 0) {
		cls = 'ml-[12px]'
	}
	if (state.timeResolution.value === item.value) {
		cls += ' bg-background-tertiary text-text-primary border border-border-button_strong'
	} else {
		cls += ' border-0 bg-background-secondary text-text-description'
	}
	return cls
}

watch(
	() => data.percentageVlaue,
	(newVal: number) => {
		if (newVal == 0) {
			state.amount = undefined
			return
		}
		if (data.freeUSDT === 0) return
		state.amount = calculatePercentageAmount(Number(newVal), Number(data.freeUSDT))
	}
)

watch(
	() => state.orderRefreshTime,
	(val: number) => {
		if (val < 1) return
		state.amount = undefined
		data.percentageVlaue = 0
		// fetchWaUSDT()
		// fetchFlowBalance()
		handleRefresh()
	}
)

watch(
	() => appStore.refreshTransfer,
	() => {
		handleRefresh()
	}
)
</script>
