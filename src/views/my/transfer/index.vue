<template>
	<Breadcrumb :items="items" />
	<div class="py-[24px] px-[16px]">
		<div class="flex items-center justify-between text-text-primary">
			<div class="text-style-web-h3-bold">{{ t('transfer.txt1') }}</div>
			<div
				@click="routeTo('/my/record?active=5')"
				class="text-style-web-small-regular flex items-center">
				{{ t('text376') }}
				<Icon name="my/right" :size="14" class="text-text-disabled" />
			</div>
		</div>
		<div class="mt-[24px]">
			<TSelectCoin
				class="z-11"
				v-model:value="coin"
				:options="coinList"
				imgField="logo"
				:placeholder="t('transfer.txt2')" />
		</div>
		<div class="mt-[24px] flex items-center">
			<TSelectAccount class="flex-1" @click="handleShowAccount('left')" :item="state.leftAccount" />
			<Icon
				name="common/transfer1"
				:size="24"
				class="text-text-primary mx-[8px]"
				@click="swapAccount" />

			<!-- <img
				src="/imgs/common/transfer1.svg"
				class="w-[24px] h-[24px] mx-[8px] cursor-pointer"
				@click="swapAccount" /> -->
			<TSelectAccount
				class="flex-1"
				@click="handleShowAccount('right')"
				:item="state.rightAccount" />
		</div>
		<div class="mt-[24px]">
			<div class="bg-background-secondary h-[50px] rounded-[6px] px-[16px] flex items-center">
				<input
					class="flex-1 custom-input"
					id="number-input"
					type="number"
					min="1"
					v-model.number="amount"
					@input="validateInput" />

				<div class="flex items-center">
					<div class="text-text-secondary text-style-web-body-medium">USDT</div>
					<div class="w-[1px] h-3 bg-border-button_line mx-[10px]"></div>
					<div class="text-text-brand text-style-web-body-medium" @click="handleMax">MAX</div>
				</div>
			</div>
			<div class="flex justify-end items-center mt-[4px]">
				<div class="text-text-description text-style-web-small-regular mr-1">
					{{ t('transfer.txt3') }}
				</div>
				<div class="text-text-primary text-style-web-small-medium mr-1">
					{{ thousandsComma(freeUSDT) }} USDT
				</div>
			</div>
		</div>
		<div class="mt-[24px]">
			<Button
				@click="handleTransfer"
				class="h-[50px] cursor-pointer border-0 rounded-[50px] flex items-center justify-center text-style-web-h5-bold text-text-inverse-primary"
				:class="amount > 0 ? 'bg-brand-blue' : 'bg-background-disabled'">
				{{ t('transfer.txt4') }}
			</Button>
		</div>
	</div>
	<AccountPopup v-model:show="showAccount" />
</template>
<script lang="ts" setup>
import { toFixed } from '@/utils'

import { reactive, ref, computed, watch } from 'vue'
import { Breadcrumb } from '@/components/base'
import TSelectCoin from '@/components/TSelectCoin/index.vue'
import TSelectAccount from '@/components/TSelectAccount/index.vue'
import { Input, Button } from '@/components/base'
import AccountPopup from './components/AccountPopup.vue'
import { useTransfer } from '@/hooks/useTransfer'
import { transfer } from '@/apis/wallet'
import { showToast, showFailToast } from '@/components/base/toast'
import { thousandsComma } from '@/utils/trade'
// import useBreadcrumb from '@/hooks/useBreadcrumb'
import { useI18n } from 'vue-i18n'
import { routeTo } from '@/utils/routeTo'

const coinList = ref([])
const coin = ref('')
const showAccount = ref(false)
const amount = ref()
const { state, refreshAmount, initData, checkAccount } = useTransfer()
// const { breadcrumbs } = useBreadcrumb()
const { t } = useI18n()

initData([
	{
		label: t('transfer.txt13'),
		value: 'FOLLOW'
	},
	{
		label: t('transfer.txt14'),
		value: 'SWAP'
	},
	{
		label: t('transfer.txt15'),
		value: 'SPOT'
	}
])
refreshAmount()

const items = reactive([
	{
		title: t('transfer.txt5'),
		path: '-1'
	},
	{
		title: t('transfer.txt1')
	}
])

const handleShowAccount = (type: string) => {
	state.type = type
	state.currentAccount = type === 'left' ? state.leftAccount : state.rightAccount
	showAccount.value = true
}

const swapAccount = () => {
	const c = state.leftAccount

	state.leftAccount = state.rightAccount
	state.rightAccount = c
}

watch(
	() => state.leftAccount,
	() => {
		refreshAmount()
	}
)

const freeUSDT = computed(() => {
	let num = state.amountObj[state.leftAccount.value]
	if (!num) return 0
	num = Number(num)
	return toFixed(num, 2)
})

const handleTransfer = async () => {
	if (!amount.value) {
		showToast(t('transfer.txt6'))
		return
	}
	if (state.leftAccount.value === state.rightAccount.value) {
		showToast(t('transfer.txt7'))
		return
	}
	if (amount.value < 1) {
		showToast(`${t('transfer.txt8')}1USDT`)
		return
	}
	if (amount.value > freeUSDT.value) {
		showToast(t('transfer.txt9'))
		return
	}
	const params = {
		from: state.leftAccount.value,
		to: state.rightAccount.value,
		amount: amount.value
	}

	const checkres = await checkAccount()
	console.log('checkres :', checkres)
	if (checkres.code === 0 && !checkres.data.canTransfer) {
		showFailToast(checkres.message)
		return
	}

	const res = await transfer(params)
	if (res.code === 0) {
		amount.value = undefined
		refreshAmount()
		showToast(t('transfer.txt10'))
	}
}

const handleMax = () => {
	if (freeUSDT.value <= 0) {
		return
	}
	amount.value = freeUSDT.value
}
</script>
<style scoped>
/* 定义 input 的样式 */
.custom-input {
	background-color: transparent; /* 去除背景色 */
	border: none; /* 去除边框 */
	outline: none; /* 去除焦点轮廓 */
	font-size: 16px; /* 设置字体大小 */
	color: var(--color-text-primary); /* 设置字体颜色 */
	padding: 8px; /* 添加内边距以保持良好的视觉效果 */
}

/* 样式可以根据需要进行调整 */
</style>
