<script setup lang="ts">
import { routeTo, toLogin } from '@/utils/routeTo'
import { onMounted, computed, watch } from 'vue'
import { useTradeStore } from '@/store/modules/trade/index'
import { thousandsComma } from '@/utils/trade'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/useAppStore'
import { useDevice } from '@/hooks/useDevice'
import { useUserStore } from '@/store/useUserStore'

const userStore = useUserStore()
const { isPC } = useDevice()
const { t } = useI18n()
const tradeStore = useTradeStore()
const appStore = useAppStore()

const getList = () => {
	tradeStore.fetchAssetList({})
}
onMounted(() => {
	getList()
})

// 校验某个账户有余额
const isHasWallet = computed(() => {
	return tradeStore.state?.assetList?.find((item) => item.usdtBalance > 0)
})
// 有资金的放在前面
const assetListSort = computed(() => {
	return tradeStore.state?.assetList.sort((a, b) => b.balance - a.balance)
})

watch(
	() => appStore.refreshTransfer,
	() => {
		// 划转成功，刷新数据
	}
)

const onTransfer = () => {
	if (!userStore.loginToken) {
		toLogin()
		return
	}

	routeTo('/my/transfer')
}
</script>
<template>
	<div>
		<div
			v-if="isPC"
			class="border-l border-border-subtle pdph:text-text-tips web:text-text-description pdph:text-style-web-small-regular web:text-style-web-body-medium h-[40px] flex items-center px-4 border-b web:border-border-gutter">
			{{ t('trade.txt204') }}
		</div>
		<template v-if="isHasWallet">
			<div v-if="!isPC" class="text-text-tips text-style-web-small-regular my-2 px-4">
				{{ t('trade.txt155') }}
			</div>
			<div class="h-[450px] overflow-y-auto customize-crollbar">
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
							<span class="text-style-web-small-regular text-text-description">
								{{ item.name }}
							</span>
						</div>
						<div class="text-style-web-body-medium text-text-primary">
							{{ thousandsComma(item.balance) }}
						</div>
					</div>
					<div class="flex items-center justify-between">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('trade.txt120') }}
						</div>
						<div class="text-text-tertiary text-style-web-xsmall-medium">
							{{ thousandsComma(item.usdtBalance) }}
						</div>
					</div>
					<div class="flex items-center justify-between my-2">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('trade.txt121') }}
						</div>
						<div class="text-text-tertiary text-style-web-xsmall-medium">
							{{ thousandsComma(item.frozenBalance) }}
						</div>
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
				<div @click="routeTo('/my/deposit')" class="cursor-pointer">
					<img src="/imgs/trade/asset-recharge.svg" class="w-11 h-11" />
					<p class="mt-[10px] text-style-web-small-regular text-text-tertiary text-center">
						{{ t('trade.txt123') }}
					</p>
				</div>
				<div class="ml-14 cursor-pointer" @click="onTransfer">
					<img src="/imgs/trade/asset-transfer.svg" class="w-11 h-11" />
					<p class="mt-[10px] text-style-web-small-regular text-text-tertiary text-center">
						{{ t('trade.txt124') }}
					</p>
				</div>
			</div>
		</div>
	</div>
</template>
