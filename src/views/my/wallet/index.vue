<script setup lang="ts">
import { ref, onBeforeMount, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import LineChar from './components/LineChart.vue'
import RingChart from './components/RingChart.vue'
import Menu from '../components/Menu.vue'
import ActionBar from '@/views/my/components/ActionBar.vue'

import { useWalletStore } from '@/store/modules/wallet'
import { getProfitAndLossChart } from '@/apis/wallet'
import { thousandsComma } from '@/utils/trade'
import { useAppStore } from '@/store/useAppStore'
import { useDevice } from '@/hooks/useDevice'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const { t } = useI18n()
const { isWeb } = useDevice()
const router = useRouter()
const show = ref(true)
const lineData = ref([])

const appStore = useAppStore()
const walletStore = useWalletStore()

onBeforeMount(() => {
	walletStore.initAsset()
	getProfitAndLossChart().then((res: any) => {
		if (res.code === 0) {
			lineData.value = res.data.map((item: any) => ({
				...item,
				asset: walletStore.getUSDTPrice(item.asset)
			}))
		}
	})
})

const chartData = computed(() => {
	return [
		{
			name: t('flwaccount.txt19'),
			color: themeStore.theme === 'light' ? '#000000' : '#FFFFFF',
			value: walletStore.spotAsset
		},
		{
			name: t('flwaccount.txt18'),
			color: '#2862FF',
			value: walletStore.swapAsset
		},
		{
			name: t('transfer.txt13'),
			color: '#00E700',
			value: walletStore.followAsset
		}
	]
})

watch(
	() => appStore.refreshTransfer,
	() => {
		walletStore.initAsset()
		// 划转成功，刷新数据
	}
)

const profitAndLossClass = computed(() =>
	walletStore.profitAndLossAsset < 0 ? 'text-function-sell' : 'text-text-success'
)

const openSpotAccount = () => {
	router.push('/my/spot-account')
}

const openSwapAccount = () => {
	router.push('/my/swap-account')
}

const openFollowAccount = () => {
	router.push('/my/follow-account')
}

const hideAsset = () => {
	walletStore.setHideAsset(!walletStore.hideAsset)
}
</script>

<template>
	<div class="web:hidden px-4 py-[22px] mb-4">
		<div>
			<div class="flex justify-between">
				<div class="flex items-center">
					<div class="text-text-tertiary text-style-web-small-regular mr-2">
						{{ t('flwaccount.txt2') }}
					</div>
					<base-icon
						class="text-text-tertiary"
						@click="hideAsset"
						v-if="walletStore.hideAsset"
						name="hide"
						:size="16" />
					<base-icon class="text-text-tertiary" @click="hideAsset" v-else name="show" :size="16" />
				</div>
				<div class="flex items-center">
					<!-- <base-icon name="wallet/icon1" :size="16" />
					<div class="text-text-brand text-style-web-small-medium ml-1">
						{{ t('flwaccount.txt4') }}
					</div> -->
				</div>
			</div>

			<div class="flex my-2">
				<div class="text-text-primary text-style-web-large-bold mr-2">
					{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.totalAsset) }}
				</div>
				<div class="text-text-primary text-style-web-h4-bold mt-3">USDT</div>
			</div>

			<div class="flex mb-2">
				<div class="text-text-description text-style-web-xsmall-medium mr-1">
					{{ t('flwaccount.txt3') }}
				</div>
				<div class="text-style-web-xsmall-medium" :class="[profitAndLossClass]">
					<div v-if="walletStore.hideAsset">******</div>
					<div v-else>
						{{ thousandsComma(walletStore.getUSDTPrice(walletStore.profitAndLossAsset))
						}}{{ walletStore.getCurrencyInfo().code }} ({{ walletStore.profitAndLossRatio }}%)
					</div>
				</div>
			</div>

			<div v-if="lineData.length">
				<div :class="[show ? 'expand-collapse-show' : 'expand-collapse']">
					<LineChar :data="lineData" :hideAsset="walletStore.hideAsset" />
				</div>
				<div @click="show = !show" class="mt-2 h-5 flex items-center justify-center">
					<base-icon :name="show ? 'wallet/icon2' : 'wallet/icon3'" :size="20" />
				</div>
			</div>

			<div class="py-6">
				<ActionBar v-if="!isWeb" />
			</div>

			<div class="h-[1px] bg-border-strong"></div>
		</div>

		<div class="pt-6">
			<div class="text-text-primary text-style-web-h3-bold mb-2">{{ t('flwaccount.txt17') }}</div>

			<div @click="openSpotAccount" class="py-4 border-b border-border-strong flex justify-between">
				<div class="flex">
					<div class="mr-3">
						<base-icon name="my/icon2" :size="20" class="text-text-primary" />
					</div>
					<div>
						<div class="text-text-tertiary text-style-web-body-regular mb-[6px]">
							{{ t('flwaccount.txt19') }}
						</div>
						<div class="text-text-primary text-style-web-h4-bold">
							<div v-if="walletStore.hideAsset">******</div>
							<div v-else>{{ thousandsComma(walletStore.spotAsset) }} USDT</div>
						</div>
					</div>
				</div>
				<base-icon name="wallet/icon8" :size="24" class="text-text-primary" />
			</div>
			<div @click="openSwapAccount" class="py-4 border-b border-border-strong flex justify-between">
				<div class="flex">
					<div class="mr-3">
						<base-icon name="my/icon3" :size="20" class="text-text-primary" />
					</div>
					<div>
						<div class="text-text-tertiary text-style-web-body-regular mb-[6px]">
							{{ t('flwaccount.txt18') }}
						</div>
						<div class="text-text-primary text-style-web-h4-bold">
							<div v-if="walletStore.hideAsset">******</div>
							<div v-else>{{ thousandsComma(walletStore.swapAsset) }} USDT</div>
						</div>
					</div>
				</div>
				<base-icon name="wallet/icon8" :size="24" class="text-text-primary" />
			</div>
			<div
				@click="openFollowAccount"
				class="py-4 border-b border-border-strong flex justify-between">
				<div class="flex">
					<div class="mr-3">
						<base-icon name="my/icon4" :size="20" class="text-text-primary" />
					</div>
					<div>
						<div class="text-text-tertiary text-style-web-body-regular mb-[6px]">
							{{ t('transfer.txt13') }}
						</div>
						<div class="text-text-primary text-style-web-h4-bold">
							<div v-if="walletStore.hideAsset">******</div>
							<div v-else>{{ thousandsComma(walletStore.followAsset) }} USDT</div>
						</div>
					</div>
				</div>
				<base-icon name="wallet/icon8" :size="24" class="text-text-primary" />
			</div>
		</div>

		<RingChart :data="chartData" :hideAsset="walletStore.hideAsset" />
	</div>

	<div class="ph:hidden pd:hidden flex">
		<div class="w-[268px] flex-shrink-0 h-[calc(100vh-64px)] border-r border-border-strong pt-10">
			<Menu :active="1" />
		</div>
		<div class="flex-1 pt-10 px-20">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('text140') }}</div>

			<div class="flex pt-[30px]">
				<div class="flex-1 py-10 px-[30px] rounded-[12px] border border-border-strong">
					<div class="flex items-center">
						<div class="text-text-tertiary text-style-web-h4-medium mr-2">
							{{ t('flwaccount.txt2') }}
						</div>
						<base-icon
							class="text-text-tertiary"
							@click="hideAsset"
							v-if="walletStore.hideAsset"
							name="hide"
							:size="16" />
						<base-icon
							class="text-text-tertiary"
							@click="hideAsset"
							v-else
							name="show"
							:size="16" />
					</div>
					<div class="flex py-[13px] text-text-primary text-style-web-xlarge-bold">
						<div>
							{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.totalAsset) }}
						</div>
						<div class="ml-2">USDT</div>
					</div>
					<div class="flex">
						<div class="text-text-description text-style-web-body-regular mr-1">
							{{ t('flwaccount.txt3') }}
						</div>
						<div class="text-style-web-body-regular" :class="[profitAndLossClass]">
							<div v-if="walletStore.hideAsset">******</div>
							<div v-else>
								{{ thousandsComma(walletStore.getUSDTPrice(walletStore.profitAndLossAsset))
								}}{{ walletStore.getCurrencyInfo().code }} ({{ walletStore.profitAndLossRatio }}%)
							</div>
						</div>
						<div v-if="lineData.length" class="ml-1" @click="show = !show">
							<base-icon :name="show ? 'wallet/icon2' : 'wallet/icon3'" :size="20" />
						</div>
					</div>
					<div
						v-if="lineData.length"
						:class="[show ? 'expand-collapse-show-web' : 'expand-collapse']">
						<LineChar :data="lineData" :hideAsset="walletStore.hideAsset" />
					</div>
				</div>

				<div
					style="align-self: flex-start"
					class="w-[388px] ml-4 py-[24px] px-[30px] rounded-[12px] border border-border-strong">
					<RingChart :data="chartData" :hideAsset="walletStore.hideAsset" />
				</div>
			</div>

			<div class="flex">
				<div class="flex-1">
					<div class="py-[30px]">
						<ActionBar v-if="isWeb" />
					</div>
					<div>
						<div class="text-text-primary text-style-web-h2-bold">{{ t('my.txt10') }}</div>
						<div>
							<div
								@click="openSpotAccount"
								class="py-6 px-4 cursor-pointer flex justify-between border-b border-border-strong">
								<div class="flex">
									<div>
										<base-icon name="my/icon2" :size="20" class="text-text-primary" />
									</div>
									<div class="ml-3">
										<div class="text-text-tertiary text-style-web-body-regular">
											{{ t('flwaccount.txt19') }}
										</div>
										<div class="mt-[6px] text-text-primary text-style-web-h2-bold">
											<div v-if="walletStore.hideAsset">******</div>
											<div v-else>{{ thousandsComma(walletStore.spotAsset) }} USDT</div>
										</div>
									</div>
								</div>
								<div>
									<base-icon name="wallet/icon8" :size="24" class="text-text-primary" />
								</div>
							</div>

							<div
								@click="openSwapAccount"
								class="py-6 px-4 cursor-pointer flex justify-between border-b border-border-strong">
								<div class="flex">
									<div>
										<base-icon name="my/icon3" :size="20" class="text-text-primary" />
									</div>
									<div class="ml-3">
										<div class="text-text-tertiary text-style-web-body-regular">
											{{ t('flwaccount.txt18') }}
										</div>
										<div class="mt-[6px] text-text-primary text-style-web-h2-bold">
											<div v-if="walletStore.hideAsset">******</div>
											<div v-else>{{ thousandsComma(walletStore.swapAsset) }} USDT</div>
										</div>
									</div>
								</div>
								<div>
									<base-icon name="wallet/icon8" :size="24" class="text-text-primary" />
								</div>
							</div>

							<div
								@click="openFollowAccount"
								class="py-6 px-4 cursor-pointer flex justify-between border-b border-border-strong">
								<div class="flex">
									<div>
										<base-icon name="my/icon4" :size="20" class="text-text-primary" />
									</div>
									<div class="ml-3">
										<div class="text-text-tertiary text-style-web-body-regular">
											{{ t('transfer.txt13') }}
										</div>
										<div class="mt-[6px] text-text-primary text-style-web-h2-bold">
											<div v-if="walletStore.hideAsset">******</div>
											<div v-else>{{ thousandsComma(walletStore.followAsset) }} USDT</div>
										</div>
									</div>
								</div>
								<div>
									<base-icon name="wallet/icon8" :size="24" class="text-text-primary" />
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="w-[388px] ml-4"></div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.expand-collapse {
	height: 0;
	overflow: hidden;
	transition: height 0.3s ease;
}
.expand-collapse-show {
	height: 184px;
	transition: height 0.3s ease;
}

.expand-collapse-show-web {
	height: 140px;
	transition: height 0.3s ease;
}
</style>
