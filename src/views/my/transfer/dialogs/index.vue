<script lang="ts" setup>
import { watch, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import TSelectCoin from '@/components/TSelectCoin/index.vue'
import TSelectAccount from '@/components/TSelectAccount/index.vue'
import { useTransfer } from '@/hooks/useTransfer'
import { toFixed } from '@/utils'
import { showToast, showSuccessToast, showFailToast } from '@/components/base/toast'
import { thousandsComma } from '@/utils/trade'
import { transfer } from '@/apis/wallet'
import { Dialog } from '@/components/base'
import { useDevice } from '@/hooks/useDevice'
import { Button } from '@/components/base'

const { t } = useI18n()
const show = defineModel('show', { default: true })
const emits = defineEmits(['ok'])
const { isWeb } = useDevice()

const coinList = ref([])
const coin = ref('')
const showAccount = ref(false)
const amount = ref()
const { state, refreshAmount, initData, checkAccount } = useTransfer()

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

const handleShowAccount = (type: string) => {
	if (isWeb.value) return
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
		show.value = false
		amount.value = undefined
		// refreshAmount()
		emits('ok')
		showSuccessToast(t('transfer.txt10'))
	}
}

const handleMax = () => {
	if (freeUSDT.value <= 0) {
		return
	}
	amount.value = freeUSDT.value
}

const getList = (type: string) => {
	if (type === 'right') {
		return state.items.filter((item: any) => item.value !== state.leftAccount.value)
	}
	return state.items.filter((item: any) => item.value !== state.rightAccount.value)
}

const handleOkLeft = (item: any) => {
	state.leftAccount = item
}

const handleOkRight = (item: any) => {
	state.rightAccount = item
}
</script>
<template>
	<Dialog v-model:show="show" :title="t('flwaccount.txt5')" width="600px">
		<div class="p-[24px] pt-0">
			<TSelectCoin
				class="z-11"
				v-model:value="coin"
				:options="coinList"
				imgField="logo"
				:placeholder="t('transfer.txt2')" />
			<div class="mt-[24px] flex items-center">
				<TSelectAccount
					class="flex-1 w-[255px]"
					@click="handleShowAccount('left')"
					:showSelect="isWeb"
					:items="getList('left')"
					@ok="handleOkLeft"
					:item="state.leftAccount" />
				<Icon
					name="common/transfer1"
					:size="36"
					class="text-text-primary mx-[8px]"
					@click="swapAccount" />

				<TSelectAccount
					class="flex-1 w-[255px]"
					@click="handleShowAccount('right')"
					:showSelect="isWeb"
					:items="getList('right')"
					@ok="handleOkRight"
					:item="state.rightAccount" />
			</div>
			<div class="mt-[24px]">
				<div class="bg-background-secondary h-[50px] rounded-[6px] px-[16px] flex items-center">
					<input
						class="flex-1 custom-input text-text-primary"
						id="number-input"
						type="number"
						min="1"
						:placeholder="t('trade.txt29')"
						v-model.number="amount" />

					<div class="flex items-center">
						<div class="text-text-secondary text-style-web-body-medium">USDT</div>
						<div class="w-[1px] h-3 bg-border-button_line mx-[10px]"></div>
						<div
							class="text-text-brand text-style-web-body-medium cursor-pointer"
							@click="handleMax">
							MAX
						</div>
					</div>
				</div>
				<div class="flex justify-start items-center mt-[4px] px-[16px]">
					<div class="text-text-description text-style-web-small-regular mr-1">
						{{ t('transfer.txt3') }}
					</div>
					<div class="text-text-primary text-style-web-small-medium mr-1">
						{{ thousandsComma(freeUSDT) }} USDT
					</div>
				</div>
			</div>
			<!-- <div class="mt-[16px]">
				<span>错误提示：</span>
			</div> -->
			<div class="mt-[24px] flex justify-end">
				<Button
					@click="show = false"
					plain
					size="small"
					class="w-[100px] h-[42px] cursor-pointer rounded-[50px] border border-border-button_strong text-text-primary text-style-web-body-bold">
					{{ t('transfer.txt12') }}
				</Button>
				<Button
					size="small"
					@click="handleTransfer"
					class="ml-[10px] w-[100px] h-[42px] cursor-pointer rounded-[50px] bg-brand-main text-always-white text-style-web-body-bold">
					{{ t('my.txt38') }}
				</Button>
			</div>
			<!-- </div> -->
		</div>
	</Dialog>
	<!-- </van-popup> -->
</template>
<style scoped>
/* 定义 input 的样式 */
.custom-input {
	background-color: transparent; /* 去除背景色 */
	border: none; /* 去除边框 */
	outline: none; /* 去除焦点轮廓 */
	font-size: 16px; /* 设置字体大小 */
	padding: 8px; /* 添加内边距以保持良好的视觉效果 */
}

/* 样式可以根据需要进行调整 */
</style>
