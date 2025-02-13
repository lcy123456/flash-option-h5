<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, watch, h } from 'vue'
import { useRouter } from 'vue-router'

import Menu from '@/views/my/components/Menu.vue'
import Checkbox from '@/components/base/checkbox/index.vue'
import Breadcrumb from '@/components/base/breadcrumb/index.vue'
import Empty from '@/components/empty.vue'
import { Loading, Button, Table } from '@/components/base'

import useSwapAccount from '@/hooks/useSwapAccount'
import { useWalletStore } from '@/store/modules/wallet'

import { useI18n } from 'vue-i18n'
import { thousandsComma } from '@/utils/trade'
import { routeTo } from '@/utils/routeTo'
import { useAppStore } from '@/store/useAppStore'

const { t } = useI18n()
const walletStore = useWalletStore()

const router = useRouter()
const { data, loading, loadData } = useSwapAccount()
const appStore = useAppStore()

const hidden0Asset = ref(false)

const items = reactive([
	{
		title: t('flwaccount.txt17'),
		path: '/home/my/wallet'
	},
	{
		title: t('flwaccount.txt18')
	}
])

const columns = reactive([
	{
		title: t('text141'),
		key: 'symbol',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h('img', { src: item.logo, class: 'w-10 h-10 rounded-full mr-3' }),
				h('div', {}, [
					h('div', { class: 'text-text-primary text-style-web-body-medium' }, item.coin),
					h('div', { class: 'text-text-description text-style-web-small-regular' }, item.name)
				])
			])
		}
	},
	{
		title: t('flwaccount.txt11'),
		key: 'currentCapital'
	},
	{
		title: t('flwaccount.txt12'),
		key: 'balance'
	},
	{
		title: t('flwaccount.txt15'),
		key: 'frozenBalance'
	},
	{
		title: t('flwaccount.txt16'),
		key: 'frozenMargin'
	}
])

const profitAndLossClass = computed(() =>
	data.profitAndLossAsset < 0 ? 'text-function-sell' : 'text-text-success'
)

onBeforeMount(() => {
	walletStore.initAsset()
})

const assetList = computed(() => {
	if (hidden0Asset.value) {
		return data.items.filter((item: any) => item.balance > 0)
	}
	return data.items
})

const transfer = () => {
	routeTo('/my/transfer')
}

const hideAsset = () => {
	walletStore.setHideAsset(!walletStore.hideAsset)
}

watch(
	() => appStore.refreshTransfer,
	() => {
		console.log('划转成功111')
		walletStore.initAsset()
		loadData()
		// 划转成功，刷新数据
	}
)
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div class="px-4 pb-[22px] pt-3">
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
						<base-icon
							class="text-text-tertiary"
							@click="hideAsset"
							v-else
							name="show"
							:size="16" />
					</div>
					<!-- <div class="flex items-center">
					<base-icon name="wallet/icon1" :size="16" />
					<div class="text-text-brand text-style-web-small-medium ml-1">
						{{ t('flwaccount.txt4') }}
					</div>
				</div> -->
				</div>

				<div class="flex my-2">
					<div class="text-text-primary text-style-web-large-bold mr-2">
						{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.swapAsset) }}
					</div>
					<div class="text-text-primary text-style-web-h4-bold mt-3">USDT</div>
				</div>

				<!-- <div class="flex mb-2">
				<div class="text-text-description text-style-web-xsmall-medium mr-1">
					{{ t('flwaccount.txt3') }}
				</div>
				<div class="text-style-web-xsmall-medium" :class="[profitAndLossClass]">
					<div v-if="walletStore.hideAsset">******</div>
					<div v-else>${{ data.profitAndLossAsset }} ({{ data.profitAndLossRatio }}%)</div>
				</div>
			</div> -->

				<div class="py-6 flex items-center justify-center">
					<div
						class="w-[358px] h-[42px] rounded-[50px] flex items-center justify-center bg-brand-main text-style-web-body-bold text-always-white cursor-pointer"
						@click="transfer">
						{{ t('flwaccount.txt5') }}
					</div>
				</div>
				<div class="h-[1px] bg-border-strong"></div>
			</div>

			<div class="py-3">
				<div class="py-3 flex justify-between items-center">
					<div class="text-text-primary text-style-web-h4-medium">{{ t('flwaccount.txt20') }}</div>
					<Checkbox v-model:value="hidden0Asset" shape="round">
						<div class="text-text-description text-style-web-small-regular">
							{{ t('flwaccount.txt22') }}
						</div>
					</Checkbox>
				</div>

				<div>
					<div
						class="py-4 border-b border-border-strong"
						v-for="item in assetList"
						:key="item.coin">
						<div class="flex justify-between">
							<div class="flex">
								<div class="w-6 h-6 rounded-full mr-3 overflow-hidden">
									<img v-if="item.logo" :src="item.logo" alt="" />
								</div>
								<div>
									<div class="mr-2">
										<div class="text-text-primary text-style-web-body-medium">
											{{ item.coin }}
										</div>
										<div class="mt-[6px] text-text-description text-style-web-small-regular">
											{{ t('flwaccount.txt11') }}
										</div>
										<div class="mt-[2px] text-text-description text-style-web-small-regular">
											{{ t('flwaccount.txt12') }}
										</div>
										<div class="mt-[2px] text-text-description text-style-web-small-regular">
											{{ t('flwaccount.txt15') }}
										</div>
										<div class="mt-[2px] text-text-description text-style-web-small-regular">
											{{ t('flwaccount.txt16') }}
										</div>
									</div>
								</div>
							</div>
							<div>
								<!-- <img
									@click="routeTo('/home/swap/BTC-USDT')"
									src="/imgs/common/chevron-right.svg"
									class="float-right text-text-primary w-[18px] h-[18px]" /> -->
								<Icon
									class="float-right text-text-primary"
									@click="routeTo('/home/swap/BTC-USDT')"
									name="common/chevron-right"
									:size="18" />
								<div
									class="mt-[24px] text-text-description text-style-web-xsmall-regular text-right">
									<div v-if="walletStore.hideAsset">******</div>
									<div v-else>{{ item.currentCapital }}</div>
								</div>
								<div
									class="mt-[2px] text-text-description text-style-web-xsmall-regular text-right">
									<div v-if="walletStore.hideAsset">******</div>
									<div v-else>{{ item.balance }}</div>
								</div>
								<div
									class="mt-[2px] text-text-description text-style-web-xsmall-regular text-right">
									<div v-if="walletStore.hideAsset">******</div>
									<div v-else>{{ item.frozenBalance }}</div>
								</div>
								<div
									class="mt-[2px] text-text-description text-style-web-xsmall-regular text-right">
									<div v-if="walletStore.hideAsset">******</div>
									<div v-else>{{ item.frozenMargin }}</div>
								</div>
							</div>
						</div>
					</div>
					<Loading v-model:loading="loading" />
					<Empty v-if="!assetList.length && !loading" />
				</div>
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<div class="w-[268px] flex-shrink-0 h-[calc(100vh-64px)] border-r border-border-strong pt-10">
			<Menu :active="3" />
		</div>
		<div class="flex-1 pt-10 px-20">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('my.txt2') }}</div>

			<div class="mt-[30px] py-10 px-[30px] rounded-[12px] border border-border-strong">
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
					<base-icon class="text-text-tertiary" @click="hideAsset" v-else name="show" :size="16" />
				</div>
				<div class="flex mt-[13px]">
					<div class="text-text-primary text-style-web-xlarge-bold flex items-center">
						{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.swapAsset) }}
						<div class="ml-2">USDT</div>
					</div>
				</div>
			</div>

			<div class="py-[30px]">
				<Button @click="transfer" plain class="w-auto !px-[30px] !min-w-[144px]">
					<div class="flex">
						<Icon name="wallet/icon10" :size="20" />
						<div class="ml-1 text-text-primary text-style-web-h3-medium">
							{{ t('flwaccount.txt5') }}
						</div>
					</div>
				</Button>
			</div>

			<div class="text-text-primary text-style-web-h2-bold mb-5 flex justify-between items-center">
				<div>
					{{ t('flwaccount.txt20') }}
				</div>
				<Checkbox v-model:value="hidden0Asset" shape="round">
					<div class="text-text-description text-style-web-small-regular">
						{{ t('flwaccount.txt22') }}
					</div>
				</Checkbox>
			</div>
			<Table :columns="columns" :dataSource="assetList" v-model:loading="loading" />
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
}
</style>
