<template>
	<div class="flex items-center">
		<div class="flex-1">
			<div class="text-style-web-small-regular text-text-description">{{ t('home.txt6') }}</div>
			<div class="mt-[4px] text-web-h1-bold text-text-primary">
				<span>{{ thousandsComma(walletStore.totalAsset) }}</span>
				<span class="text-style-web-h4-bold ml-[8px]">USDT</span>
			</div>
			<div class="flex mt-[4px]">
				<span class="text-style-web-small-regular text-text-description">{{ t('home.txt7') }}</span>
				<span class="text-style-web-xsmall-medium ml-[4px]" :class="profitAndLossClass">
					{{ thousandsComma(walletStore.getUSDTPrice(walletStore.profitAndLossAsset)) }}
					{{ walletStore.getCurrencyInfo().code }} ({{ walletStore.profitAndLossRatio }}%)
				</span>
			</div>
		</div>
		<Button @click="goDeposit" class="!h-[36px] !px-4 w-auto text-always-white">
			{{ t('home.txt17') }}
		</Button>
	</div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'
import { useWalletStore } from '@/store/modules/wallet'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { thousandsComma } from '@/utils/trade'
import { Button } from '@/components/base'

const { t } = useI18n()
const walletStore = useWalletStore()
const router = useRouter()

// import { getWallet } from '@/apis/market'

// const loadData = async () => {
// 	const res = await getWallet()
// 	console.log('loadData res :', res)
// }

// loadData()

const goDeposit = () => {
	router.push({ name: 'deposit' })
}
const profitAndLossClass = computed(() =>
	walletStore.profitAndLossAsset < 0 ? 'text-function-sell' : 'text-text-success'
)
</script>
