<script setup lang="ts">
import { onBeforeMount, ref, reactive, computed, h, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import Menu from '@/views/my/components/Menu.vue'
import Checkbox from '@/components/base/checkbox/index.vue'
import Breadcrumb from '@/components/base/breadcrumb/index.vue'
import ActionBar from '@/views/my/components/ActionBar.vue'
import { Loading, Table } from '@/components/base'
import Empty from '@/components/empty.vue'
import { thousandsComma } from '@/utils/trade'

import { useWalletStore } from '@/store/modules/wallet'
import { useAppStore } from '@/store/useAppStore'
import { useDevice } from '@/hooks/useDevice'
import { spotAssetList } from '@/apis/wallet'

const { t } = useI18n()
const { isWeb } = useDevice()
const appStore = useAppStore()
const walletStore = useWalletStore()

const loading = ref(true)
const list: any = ref([])
const hidden0Asset = ref(false)

watch(
	() => appStore.refreshTransfer,
	() => {
		walletStore.initAsset()
		getSpotAssetList()
		// 划转成功，刷新数据
	}
)

const items = reactive([
	{
		title: t('flwaccount.txt17'),
		path: '/home/my/wallet'
	},
	{
		title: t('flwaccount.txt19')
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
		title: t('text142'),
		key: 'optionName',
		render(item: any) {
			return h('div', {}, [
				h(
					'div',
					{ class: 'text-text-primary text-style-web-body-medium' },
					walletStore.hideAsset ? '******' : item.balance
				),
				h(
					'div',
					{ class: 'text-text-description text-style-web-xsmall-regular' },
					walletStore.hideAsset
						? '******'
						: walletStore.getUSDTPrice(item.usdtBalance) +
								walletStore.getCurrencyInfo().code.toUpperCase()
				)
			])
		}
	}
	// {
	// 	title: t('text143'),
	// 	key: 'toos',
	// 	render(item: any) {
	// 		return h(
	// 			'span',
	// 			{ class: item.direction === 'BUY' ? 'text-function-buy' : 'text-function-sell' },
	// 			item.direction === 'BUY' ? t('flw.txt72') : t('flw.txt71')
	// 		)
	// 	}
	// }
])

onBeforeMount(() => {
	walletStore.initAsset()
	getSpotAssetList()
})

const getSpotAssetList = () => {
	spotAssetList().then((res) => {
		list.value = res.data
		loading.value = false
	})
}

// const profitAndLossClass = computed(() =>
// 	walletStore.profitAndLossAsset < 0 ? 'text-function-sell' : 'text-text-success'
// )

const assetList = computed(() => {
	if (hidden0Asset.value) {
		return list.value.filter((item: any) => item.balance > 0)
	}
	return list.value
})

const hideAsset = () => {
	walletStore.setHideAsset(!walletStore.hideAsset)
}
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
					<div class="flex items-center">
						<!-- <base-icon name="wallet/icon1" :size="16" />
					<div class="text-text-brand text-style-web-small-medium ml-1">
						{{ t('flwaccount.txt4') }}
					</div> -->
					</div>
				</div>

				<div class="flex my-2">
					<div class="text-text-primary text-style-web-large-bold mr-2">
						{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.spotAsset) }}
					</div>
					<div class="text-text-primary text-style-web-h4-bold mt-3">USDT</div>
				</div>

				<!-- <div class="flex mb-2">
				<div class="text-text-description text-style-web-xsmall-medium mr-1">
					{{ t('flwaccount.txt3') }}
				</div>
				<div class="text-style-web-xsmall-medium" :class="[profitAndLossClass]">
					<div v-if="walletStore.hideAsset">******</div>
					<div v-else>
						${{ walletStore.profitAndLossAsset }} ({{ walletStore.profitAndLossRatio }}%)
					</div>
				</div>
			</div> -->

				<div class="py-6">
					<ActionBar v-if="!isWeb" />
				</div>

				<div class="h-[1px] bg-border-strong"></div>
			</div>

			<div class="py-3">
				<div class="py-3 flex justify-between items-center">
					<div class="text-text-primary text-style-web-h4-medium">{{ t('flwaccount.txt21') }}</div>
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
										<div class="text-text-description text-style-web-small-regular">
											{{ item.name }}
										</div>
									</div>
								</div>
							</div>
							<div>
								<div class="text-text-primary text-style-web-body-medium text-right">
									<div v-if="walletStore.hideAsset">******</div>
									<div v-else>{{ item.balance }}</div>
								</div>
								<div
									class="mt-[2px] text-right text-text-description text-style-web-xsmall-regular">
									<div v-if="walletStore.hideAsset">******</div>
									<div v-else>
										{{ walletStore.getUSDTPrice(item.usdtBalance) }}
										{{ walletStore.getCurrencyInfo().code.toUpperCase() }}
									</div>
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
			<Menu :active="2" />
		</div>
		<div class="flex-1 pt-10 px-20">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('transfer.txt15') }}</div>

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
						{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.spotAsset) }}
						<div class="ml-2">USDT</div>
					</div>
				</div>
			</div>

			<div class="py-[30px] w-[680px]">
				<ActionBar v-if="isWeb" />
			</div>

			<div>
				<div
					class="text-text-primary text-style-web-h2-bold mb-5 flex justify-between items-center">
					<div>
						{{ t('flwaccount.txt21') }}
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
