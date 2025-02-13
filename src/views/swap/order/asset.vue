<script setup lang="ts">
import { routeTo } from '@/utils/routeTo'
import { watch, computed } from 'vue'
import { useSwapStore } from '@/store/modules/swap/index'
import { thousandsComma } from '@/utils/trade'
import { useI18n } from 'vue-i18n'
import useSwapAccount from '@/hooks/useSwapAccount'
import { useAppStore } from '@/store/useAppStore'

const { data, loading } = useSwapAccount()
const { t } = useI18n()
const swapStore = useSwapStore()
const appStore = useAppStore()

// 校验某个账户有余额
const isHasWallet = computed(() => {
	return data.items?.find((item) => item.balance > 0)
})
// 有资金的放在前面
const assetListSort = computed(() => {
	return data.items.sort((a, b) => b.balance - a.balance)
})
// 匹配币种ws
const mathWsSymboy = computed(() => {
	return function (symboy: any) {
		if (symboy && swapStore.state.symbolThumbList.length) {
			return swapStore.state.symbolThumbList.find((item) => item.symbol === symboy)
		}
		return {}
	}
})

watch(
	() => appStore.refreshTransfer,
	() => {
		// 划转成功，刷新数据
	}
)
</script>
<template>
	<div class="max-h-[450px] overflow-y-auto customize-crollbar">
		<div
			class="px-3 h-[39px] border-b border-l flex items-center border-border-strong text-style-web-body-medium text-text-description">
			{{ t('trade.txt204') }}
		</div>
		<template v-if="isHasWallet">
			<div
				class="px-4 border-b border-border-subtle pb-4"
				v-for="item in assetListSort"
				:key="item.coin">
				<div class="flex items-center justify-between my-4">
					<div class="flex items-center">
						<img :src="item?.logo" class="w-6 h-6" />
						<span class="text-style-web-body-medium text-text-primary ml-3 mr-2">
							{{ item.coin }}
						</span>
						<span class="text-style-web-small-regular text-text-description">{{ item.name }}</span>
					</div>
					<div class="text-text-primary">
						{{ thousandsComma(item.currentCapital) }}
					</div>
				</div>
				<div class="flex items-center justify-between">
					<div class="text-text-description text-style-web-xsmall-regular">
						{{ t('trade.txt120') }}
					</div>
					<div class="text-text-tertiary text-style-web-xsmall-medium">
						{{ thousandsComma(item.balance) }}
					</div>
				</div>
				<div class="flex items-center justify-between my-2">
					<div class="text-text-description text-style-web-xsmall-regular">
						{{ t('trade.txt121') }}
					</div>
					<div class="text-text-tertiary text-style-web-xsmall-medium">
						{{ thousandsComma(item.frozenBalance) }}
					</div>
				</div>
				<div class="flex items-center justify-between my-2">
					<div class="text-text-description text-style-web-xsmall-regular">
						{{ t('text158') }}(USD)
					</div>
					<div class="text-text-tertiary text-style-web-xsmall-medium">
						{{ thousandsComma(mathWsSymboy(item.coin)) }}
					</div>
				</div>
			</div>
		</template>
		<div v-else class="flex items-center justify-center flex-col py-8 px-4">
			<div class="text-style-web-h5-medium text-text-primary">
				{{ t('trade.txt120') }}:
				<span>0</span>
				USDT
			</div>
			<div class="text-style-web-small-regular text-text-secondary py-3">
				{{ t('trade.txt122') }}
			</div>
			<div class="flex items-center justify-center">
				<div
					@click="routeTo('/my/deposit')"
					class="flex items-center justify-center flex-col cursor-pointer">
					<img src="/imgs/trade/asset-recharge.svg" class="w-11 h-11" />
					<p class="text-style-web-small-regular text-text-tertiary">{{ t('trade.txt123') }}</p>
				</div>
				<div
					@click="routeTo('/my/transfer')"
					class="flex items-center justify-center ml-14 flex-col cursor-pointer">
					<img src="/imgs/trade/asset-transfer.svg" class="w-11 h-11" />
					<p class="text-style-web-small-regular text-text-tertiary">{{ t('trade.txt124') }}</p>
				</div>
			</div>
		</div>
	</div>
</template>
