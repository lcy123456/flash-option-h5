<script setup lang="ts">
import { watch, ref, reactive, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import Menu from '@/views/my/components/Menu.vue'
import Checkbox from '@/components/base/checkbox/index.vue'
import Breadcrumb from '@/components/base/breadcrumb/index.vue'
import { Table, Tabs } from '@/components/base'
import order from './order/index.vue'
import useFollowAccount from '@/hooks/useFollowAccount'
import { routeTo } from '@/utils/routeTo'
import { useAppStore } from '@/store/useAppStore'
import { useWalletStore } from '@/store/modules/wallet'
import { thousandsComma } from '@/utils/trade'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const router = useRouter()
const walletStore = useWalletStore()
const appStore = useAppStore()
const list: any = ref([])
const hidden0Asset = ref(false)
const { data, loadData } = useFollowAccount()
loadData()
const items = reactive([
	{
		title: t('flwaccount.txt17'),
		path: '/home/my/wallet'
	},
	{
		title: t('transfer.txt13')
	}
])

const tabsList = reactive([
	{
		title: t('flw.txt104'),
		id: 1
	},
	{
		title: t('my.txt49'),
		id: 2
	}
])

onBeforeMount(() => {
	walletStore.initAsset()
})

const assetList = computed(() => {
	if (hidden0Asset.value) {
		return list.value.filter((item: any) => item.balance > 0)
	}
	return list.value
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
		walletStore.initAsset()
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
				</div>

				<div class="flex my-2">
					<div class="text-text-primary text-style-web-large-bold mr-2">
						{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.followAsset) }}
					</div>
					<div class="text-text-primary text-style-web-h4-bold mt-3">USDT</div>
				</div>

				<div class="py-6 flex items-center justify-center">
					<div
						class="w-[358px] h-[42px] rounded-[50px] flex items-center justify-center bg-brand-main text-style-web-body-bold text-always-white cursor-pointer"
						@click="transfer">
						{{ t('flwaccount.txt5') }}
					</div>
				</div>
				<div class="h-[1px] bg-border-strong"></div>
			</div>
			<order />
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<div class="w-[268px] flex-shrink-0 h-[calc(100vh-64px)] border-r border-border-strong pt-10">
			<Menu :active="4" />
		</div>
		<div class="flex-1 pt-10 px-20">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('transfer.txt13') }}</div>

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
						{{ walletStore.hideAsset ? '******' : thousandsComma(walletStore.followAsset) }}
						<div class="ml-2">USDT</div>
					</div>
				</div>
			</div>

			<div class="py-[30px]">
				<Button @click="transfer" plain class="w-auto !px-[30px] !min-w-[144px]">
					<div class="flex">
						<Icon name="wallet/icon10" :size="20" class="text-text-primary" />
						<div class="ml-1 text-text-primary text-style-web-h3-medium">
							{{ t('flwaccount.txt5') }}
						</div>
					</div>
				</Button>
			</div>

			<div>
				<div
					class="text-text-primary text-style-web-h2-bold mb-5 flex justify-between items-center">
					<div>
						{{ t('text162') }}
					</div>
				</div>

				<order />
				<!-- <Tabs :items="tabsList">
					<template v-slot="props">
						<div v-if="props.active === 1">
							<Table />
						</div>
						<div v-if="props.active === 2">2</div>
					</template>
				</Tabs> -->
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
