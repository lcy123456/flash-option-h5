<script setup lang="ts">
import { watch, ref, onBeforeMount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Button, Dialog } from '@/components/base'
import { routeTo } from '@/utils/routeTo'
import { useAppStore } from '@/store/useAppStore'
import { useUserStore } from '@/store/useUserStore'
import { showFailToast } from '@/components/base/toast'
// import { canWithdraw } from '@/apis/wallet'
import { useDevice } from '@/hooks/useDevice'

const { isPh } = useDevice()
import { useKyc } from '@/hooks/useKyc'

const { kycInfo, updateKycInfo } = useKyc()
const { t } = useI18n()
const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const userStore = useUserStore()
const isTransfer = ref(false)
const show = ref(false)
const canInfo: any = ref({})

onBeforeMount(() => {
	updateKycInfo()
})

const recharge = () => {
	if (userStore.isSimulatedAccount) {
		showFailToast(t('text137'))
		return
	}
	let tab = 1
	if (route.name === 'spot-account') {
		tab = 2
	}
	router.push('/my/deposit?tab=' + tab)
}

const withdraw = async () => {
	if (userStore.isSimulatedAccount) {
		showFailToast(t('text135'))
		return
	}
	if (!kycInfo.value.isAuth) {
		showFailToast(t('text366'))
		return
	}

	let tab = 1
	if (route.name === 'spot-account') {
		tab = 2
	}
	router.push('/my/withdraw?tab=' + tab)

	// const res: any = await canWithdraw()

	// if (res.code === 0) {
	// 	show.value = true
	// 	isTransfer.value = res.data.canWithdraw
	// 	canInfo.value = res.data
	// 	// if (res.data.canWithdraw) {
	// 	// 	let tab = 1
	// 	// 	if (route.name === 'spot-account') {
	// 	// 		tab = 2
	// 	// 	}
	// 	// 	router.push('/my/withdraw?tab=' + tab)
	// 	// } else {
	// 	// 	showFailToast(res.message)
	// 	// }
	// }
}

const toWithdraw = () => {
	let tab = 1
	if (route.name === 'spot-account') {
		tab = 2
	}
	router.push('/my/withdraw?tab=' + tab)
}

const transfer = () => {
	routeTo('/my/transfer')
}

const record = () => {
	let tab = 1
	if (route.name === 'spot-account') {
		tab = 2
	}
	router.push('/my/record?tab=' + tab)
}

watch(
	() => appStore.refreshTransfer,
	() => {
		// 划转成功，刷新数据
	}
)
</script>

<template>
	<div class="web:hidden flex justify-between">
		<div @click="recharge" class="w-1/4 flex flex-col items-center">
			<div class="rounded-full w-[54px] h-[54px] bg-brand-blue flex items-center justify-center">
				<base-icon name="wallet/icon4" :size="24" />
			</div>
			<div class="mt-1 text-text-tertiary text-style-web-body-medium text-center break-all">
				{{ t('flwaccount.txt23') }}
			</div>
		</div>
		<div @click="withdraw" class="w-1/4 flex flex-col items-center">
			<div class="rounded-full w-[54px] h-[54px] bg-brand-blue flex items-center justify-center">
				<base-icon name="wallet/icon5" :size="24" class="text-always-white" />
			</div>
			<div class="mt-1 text-text-tertiary text-style-web-body-medium text-center break-all">
				{{ t('flwaccount.txt24') }}
			</div>
		</div>
		<div class="w-1/4 flex flex-col items-center">
			<div
				@click="transfer"
				class="rounded-full w-[54px] h-[54px] bg-brand-blue flex items-center justify-center">
				<base-icon class="text-always-white" name="wallet/icon9" :size="24" />
			</div>
			<div class="mt-1 text-text-tertiary text-style-web-body-medium text-center break-all">
				{{ t('flwaccount.txt5') }}
			</div>
		</div>
		<div class="w-1/4 flex flex-col items-center">
			<div
				@click="record"
				class="rounded-full w-[54px] h-[54px] bg-brand-blue flex items-center justify-center">
				<base-icon name="wallet/icon6" :size="24" class="text-always-white" />
			</div>
			<div class="mt-1 text-text-tertiary text-style-web-body-medium text-center">
				{{ t('flwaccount.txt25') }}
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<Button @click="recharge" class="mr-4 w-auto min-w-[144px]">
			<div class="flex items-center">
				<base-icon name="wallet/icon4" :size="20" class="mb-[1px]" />
				<div class="ml-1 !text-always-white text-style-web-h4-medium">
					{{ t('flwaccount.txt23') }}
				</div>
			</div>
		</Button>
		<Button @click="withdraw" class="mr-4 w-auto min-w-[144px]" plain>
			<div class="flex items-center">
				<base-icon name="wallet/icon5" :size="20" class="text-text-primary" />
				<div class="ml-1 text-text-primary text-style-web-h4-medium">
					{{ t('flwaccount.txt24') }}
				</div>
			</div>
		</Button>
		<Button @click="transfer" class="mr-4 w-auto min-w-[144px]" plain>
			<div class="flex items-center">
				<base-icon name="wallet/icon9" :size="20" class="text-text-primary" />
				<div class="ml-1 text-text-primary text-style-web-h4-medium">
					{{ t('flwaccount.txt5') }}
				</div>
			</div>
		</Button>
		<Button @click="record" plain class="w-auto min-w-[144px]">
			<div class="flex items-center">
				<base-icon name="wallet/icon6" :size="20" class="text-text-primary" />
				<div class="ml-1 text-text-primary text-style-web-h4-medium">
					{{ t('flwaccount.txt25') }}
				</div>
			</div>
		</Button>
	</div>

	<Dialog v-model:show="show" :title="t('text197')" :width="isPh ? '370px' : '390px'">
		<div class="web:p-4 pt-0 pdph:pt-[20px]">
			<div v-if="isTransfer">
				<div class="h-[28px] flex items-center">
					<div class="w-[20px]"></div>
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text196') }} {{ canInfo?.rechargeAmount }} USDT
					</div>
				</div>
				<div class="h-[28px] flex items-center mt-5">
					<Icon name="wallet/yes" :size="20" class="text-text-brand" />
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text198') }} {{ canInfo?.diff }} / {{ canInfo?.transactionAmount }} USDT
					</div>
				</div>

				<Button @click="toWithdraw" size="small" class="mt-6">{{ t('text200') }}</Button>
			</div>
			<div v-else>
				<div class="h-[28px] flex items-center">
					<div class="w-[20px]"></div>
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text196') }} {{ canInfo?.rechargeAmount }} USDT
					</div>
				</div>
				<div class="h-[28px] flex items-center mt-5">
					<Icon name="wallet/no" :size="20" class="text-text-brand" />
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text198') }} {{ canInfo?.diff }} / {{ canInfo?.transactionAmount }} USDT
					</div>
				</div>

				<Button :disabled="true" size="small" class="mt-6">{{ t('text201') }}</Button>
			</div>
		</div>
	</Dialog>
</template>
