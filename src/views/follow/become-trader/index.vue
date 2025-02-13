<script setup lang="ts">
import { routeTo } from '@/utils/routeTo'
import { reactive, onMounted, computed, inject, ref, watch } from 'vue'
import { Breadcrumb, Button, Dialog } from '@/components/base'
import {
	getTraderOverview,
	getIsFollow,
	getMinAsset,
	traderApply,
	followWallet
} from '@/apis/follow'
import { fixD, thousandsComma } from '@/utils/trade'
import { showSuccessToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { useIsApp } from '@/hooks/useIsApp'
import logo from '@/assets/icon/follow/logo.svg'
import h5Logo from '@/assets/icon/follow/become-trader-h5-logo.svg'
import { useAppStore } from '@/store/useAppStore'
import { useCache } from '@/hooks/useCache'

const globalData: any = inject('globalData')

const cache = useCache()
const { isApp } = useIsApp()
const userStore: any = useUserStore()
const { t } = useI18n()
const show = ref(false)
const appStore = useAppStore()

const items = reactive([
	{
		title: t('flw.txt7'),
		path: '/home/follow'
	},
	{
		title: t('flw.txt12')
	}
])
const state = reactive({
	oview: cache.get('follow_become-trader_oview') || {
		amount: 0, //累计总收益
		count: 0, // 累计跟单人数
		highDividendPercent: 0 // 最高分润比例
	},
	isFlow: true, // 是否跟随
	minAsset: 0, // 最低资金
	balance: 0 // 可用余额
})
const fetchAllConfig = async () => {
	const res: any = await Promise.allSettled([
		getTraderOverview(),
		getIsFollow(),
		getMinAsset(),
		followWallet()
	])
	if (res[0]?.value?.code === 0) {
		state.oview = res[0]?.value?.data
		cache.set('follow_become-trader_oview', res[0]?.value?.data)
	}
	if (res[1]?.value?.code === 0) {
		state.isFlow = res[1]?.value?.data
	}
	if (res[2]?.value?.code === 0) {
		state.minAsset = res[2]?.value?.data
	}
	if (res[3]?.value?.code === 0) {
		state.balance = res[3]?.value?.data.balance
	}
}
onMounted(() => {
	fetchAllConfig()
})

const reachMini = computed(() => {
	if (!state.minAsset || !state.balance) return false
	return state.balance >= state.minAsset
})

// 是否可以申请交易员
const isCanApply = computed(() => {
	const isTrader = userStore.userInfo?.isTrader
	if (!reachMini.value || state.isFlow || isTrader === 1 || isTrader === 2) return true
	return false
})
//成为交易员
const handleApply = async () => {
	if (isCanApply.value) return
	const res: any = await traderApply()
	const isSuccess = res.code === 0
	if (isSuccess) {
		userStore.getUserInfo()
	}
	if (res.code === 0) {
		showSuccessToast(t('flowapply.txt1'))
		show.value = false
	}
}
const appTxt = computed(() => {
	const isTrader = userStore.userInfo?.isTrader
	let txt = t('flowapply.txt3')
	if (isTrader === 2) {
		txt = t('flowapply.txt4')
	} else if (isTrader === 1) {
		txt = t('flowapply.txt28')
	}
	return txt
})

const applyTrader = () => {
	show.value = true
}

watch(
	() => appStore.refreshTransfer,
	() => {
		// 划转成功，刷新数据
		updateFollowWallet()
	}
)

const updateFollowWallet = async () => {
	const res: any = await followWallet()
	if (res.code === 0) {
		state.balance = res?.data.balance
	}
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div class="px-4">
			<div class="mt-[30px] mb-[29px] mx-auto flex justify-center">
				<img :src="h5Logo" class="w-[121px] h-[140px]" />
			</div>

			<div class="text-text-primary text-style-web-h1-bold text-center">
				{{ t('text156', { num: globalData.appNameUpper }) }}
			</div>

			<div class="pt-3 text-text-primary text-style-web-small-regular text-center">
				{{ t('flowapply.txt6') }}
			</div>

			<div class="flex justify-between mt-5">
				<div class="p-4 bg-background-secondary rounded-[8px] flex-1">
					<div class="text-text-brand text-style-web-body-bold text-center">
						{{ state.oview.highDividendPercent }}%
					</div>
					<div class="pt-1 text-text-description text-style-web-small-regular text-center">
						{{ t('flowapply.txt7') }}
					</div>
				</div>
				<div class="mx-2 p-4 bg-background-secondary rounded-[8px] flex-1">
					<div class="text-text-brand text-style-web-body-bold text-center">
						{{ thousandsComma(state.oview.count) }}
					</div>
					<div class="pt-1 text-text-description text-style-web-small-regular text-center">
						{{ t('flowapply.txt8') }}
					</div>
				</div>
				<div class="p-4 bg-background-secondary rounded-[8px] flex-1">
					<div class="text-text-brand text-style-web-body-bold text-center">
						{{ thousandsComma(fixD(state.oview.amount, 2)) }}
					</div>
					<div class="pt-1 text-text-description text-style-web-small-regular text-center">
						{{ t('flowapply.txt9') }}
					</div>
				</div>
			</div>

			<div class="py-5 px-4 mt-4 bg-background-secondary rounded-[8px]">
				<div class="text-text-primary text-style-web-h4-bold">{{ t('flowapply.txt10') }}</div>
				<div class="h-[1px] bg-border-strong my-5"></div>
				<div class="flex items-center justify-between">
					<div class="flex items-center flex-1">
						<base-icon
							:name="reachMini ? 'follow/icon16' : 'follow/icon17'"
							:size="18"
							class="text-text-success" />
						<div class="pl-2 text-text-primary text-style-web-base-medium">
							{{ t('flowapply.txt26') }} ≥ {{ thousandsComma(state.minAsset) }} USDT
						</div>
					</div>
					<div v-if="!reachMini">
						<Button
							v-if="!isApp"
							size="mini"
							class="text-style-web-small-regular"
							@click="routeTo('/my/transfer')">
							{{ t('flowapply.txt27') }}
						</Button>
					</div>
				</div>
				<div class="flex items-center pt-5 pb-6 justify-between">
					<div class="flex items-center flex-1">
						<base-icon
							:name="!state.isFlow ? 'follow/icon16' : 'follow/icon17'"
							:size="18"
							class="text-text-success" />
						<div class="pl-2 text-text-primary text-style-web-base-medium">
							{{ t('flowapply.txt12') }}
						</div>
					</div>
					<div
						v-if="state.isFlow"
						class="text-text-primary text-style-web-small-regular px-3 py-[6px] border border-border-button_strong rounded-[20px]"
						@click="routeTo('/my-follow')">
						{{ t('flowapply.txt13') }}
					</div>
				</div>
				<Button size="small" :disabled="isCanApply" @click="handleApply">{{ appTxt }}</Button>
			</div>

			<div class="py-[39px]">
				<div class="text-text-primary text-style-web-h2-bold text-center pb-5">
					{{ t('flowapply.txt14') }}
				</div>

				<div class="border border-border-subtle p-5 mb-4 flex items-center">
					<div
						class="w-[50px] h-[50px] bg-background-secondary rounded-full flex flex-shrink-0 items-center justify-center">
						<Icon name="follow/icon21" :size="24" class="text-text-primary" />
					</div>
					<div class="pl-4">
						<div class="text-text-primary text-style-app-h3-600">{{ t('flowapply.txt15') }}</div>
						<div class="mt-[6px] text-text-description text-style-web-small-regular">
							{{ t('flowapply.txt16') }} {{ state.oview.highDividendPercent }}%
							{{ t('flowapply.text16') }}
						</div>
					</div>
				</div>

				<div class="border border-border-subtle p-5 mb-4 flex items-center">
					<div
						class="w-[50px] h-[50px] bg-background-secondary rounded-full flex flex-shrink-0 items-center justify-center">
						<Icon name="follow/icon23" :size="24" class="text-text-primary" />
					</div>
					<div class="pl-4">
						<div class="text-text-primary text-style-app-h3-600">{{ t('flowapply.txt17') }}</div>
						<div class="mt-[6px] text-text-description text-style-web-small-regular">
							{{ t('flowapply.txt18') }}
						</div>
					</div>
				</div>

				<div class="border border-border-subtle p-5 mb-4 flex items-center">
					<div
						class="w-[50px] h-[50px] bg-background-secondary rounded-full flex flex-shrink-0 items-center justify-center">
						<Icon name="follow/icon24" :size="24" class="text-text-primary" />
					</div>
					<div class="pl-4">
						<div class="text-text-primary text-style-app-h3-600">{{ t('flowapply.txt19') }}</div>
						<div class="mt-[6px] text-text-description text-style-web-small-regular">
							{{ t('flowapply.txt20') }}
							<br />
							{{ t('flowapply.txt22') }}
						</div>
					</div>
				</div>

				<div class="border border-border-subtle p-5 mb-4 flex items-center">
					<div
						class="w-[50px] h-[50px] bg-background-secondary rounded-full flex flex-shrink-0 items-center justify-center">
						<Icon name="follow/icon25" :size="24" class="text-text-primary" />
					</div>
					<div class="pl-4">
						<div class="text-text-primary text-style-app-h3-600">{{ t('flowapply.txt23') }}</div>
						<div class="mt-[6px] text-text-description text-style-web-small-regular">
							{{ t('flowapply.txt24') }}
							<br />
							{{ t('flowapply.txt25') }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div class="ph:hidden pd:hidden">
		<div class="h-[487px] bg-[#000]">
			<div class="w-[1200px] mx-auto flex justify-between pt-[97px]">
				<div>
					<div class="text-always-white text-style-web-oversize-bold">
						{{ t('text156', { num: globalData.appNameUpper }) }}
					</div>
					<div class="mt-[30px] text-always-white text-style-web-h2-regular">
						{{ t('flowapply.txt6') }}
					</div>
					<div class="mt-[30px] flex items-center">
						<div class="mr-[72px]">
							<div class="text-always-white text-style-web-h1-bold">
								{{ state.oview.highDividendPercent }}%
							</div>
							<div class="mt-1 text-text-disabled text-style-web-small-regular">
								{{ t('flowapply.txt7') }}
							</div>
						</div>

						<div class="mr-[72px]">
							<div class="text-always-white text-style-web-h1-bold">
								{{ thousandsComma(state.oview.count) }}
							</div>
							<div class="mt-1 text-text-disabled text-style-web-small-regular">
								{{ t('flowapply.txt8') }}
							</div>
						</div>

						<div>
							<div class="text-always-white text-style-web-h1-bold">
								{{ thousandsComma(fixD(state.oview.amount, 2)) }}
							</div>
							<div class="mt-1 text-text-disabled text-style-web-small-regular">
								{{ t('flowapply.txt9') }}
							</div>
						</div>
					</div>
					<div class="mt-[30px]">
						<Button
							@click="applyTrader"
							size="small"
							:disabled="userStore.userInfo?.isTrader === 1 || userStore.userInfo?.isTrader === 2"
							class="w-auto px-6 rounded-[50px]"
							:class="
								userStore.userInfo?.isTrader === 1 || userStore.userInfo?.isTrader === 2
									? '!bg-transparent border-border-button_line !text-text-inverse-primary'
									: ''
							"
							:plain="userStore.userInfo?.isTrader === 1 || userStore.userInfo?.isTrader === 2">
							{{ appTxt }}
						</Button>
					</div>
				</div>
				<img class="mr-[51px] flex-shrink-0 w-[227px] h-[262px]" :src="logo" alt="" />
			</div>
		</div>
		<div class="w-[1200px] mx-auto pt-[100px]">
			<div class="text-text-primary text-style-web-xlarge-bold text-center">
				{{ t('flowapply.txt14') }}
			</div>

			<div class="pt-10">
				<div class="flex justify-between">
					<div
						class="flex items-center w-[590px] h-[160px] border border-border-strong rounded-[6px] px-20">
						<div
							class="mr-4 flex-shrink-0 w-[65px] h-[65px] bg-background-secondary flex items-center justify-center rounded-full">
							<Icon name="follow/icon21" :size="34" class="text-text-primary" />
						</div>
						<div>
							<div class="text-text-primary text-style-web-h1-bold">{{ t('flowapply.txt15') }}</div>
							<div class="mt-[6px] text-text-description text-style-web-h4-regular">
								{{ t('flowapply.txt16') }} {{ state.oview.highDividendPercent }}%
								{{ t('flowapply.text16') }}
							</div>
						</div>
					</div>
					<div
						class="flex items-center w-[590px] h-[160px] border border-border-strong rounded-[6px] px-20">
						<div
							class="mr-4 flex-shrink-0 w-[65px] h-[65px] bg-background-secondary flex items-center justify-center rounded-full">
							<Icon name="follow/icon23" :size="34" class="text-text-primary" />
						</div>
						<div>
							<div class="text-text-primary text-style-web-h1-bold">{{ t('flowapply.txt17') }}</div>
							<div class="mt-[6px] text-text-description text-style-web-h4-regular">
								{{ t('flowapply.txt18') }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex justify-between mt-5">
					<div
						class="flex items-center w-[590px] h-[160px] border border-border-strong rounded-[6px] px-20">
						<div
							class="mr-4 flex-shrink-0 w-[65px] h-[65px] bg-background-secondary flex items-center justify-center rounded-full">
							<Icon name="follow/icon24" :size="34" class="text-text-primary" />
						</div>
						<div>
							<div class="text-text-primary text-style-web-h1-bold">{{ t('flowapply.txt19') }}</div>
							<div class="mt-[6px] text-text-description text-style-web-h4-regular">
								{{ t('flowapply.txt20') }}
								<br />
								{{ t('flowapply.txt22') }}
							</div>
						</div>
					</div>
					<div
						class="flex items-center w-[590px] h-[160px] border border-border-strong rounded-[6px] px-20">
						<div
							class="mr-4 flex-shrink-0 w-[65px] h-[65px] bg-background-secondary flex items-center justify-center rounded-full">
							<Icon name="follow/icon25" :size="34" class="text-text-primary" />
						</div>
						<div>
							<div class="text-text-primary text-style-web-h1-bold">{{ t('flowapply.txt23') }}</div>
							<div class="mt-[6px] text-text-description text-style-web-h4-regular">
								{{ t('flowapply.txt24') }}
								<br />
								{{ t('flowapply.txt25') }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Dialog v-model:show="show" :title="t('flowapply.txt10')" width="390px">
			<div class="p-4 pt-0">
				<div class="flex items-center justify-between">
					<div class="flex items-center flex-1">
						<base-icon
							:name="reachMini ? 'follow/icon16' : 'follow/icon17'"
							:size="18"
							class="text-text-success" />
						<div class="pl-2 text-text-primary text-style-web-base-medium">
							{{ t('flowapply.txt26') }} ≥ {{ thousandsComma(state.minAsset) }} USDT
						</div>
					</div>
					<div v-if="!reachMini">
						<Button
							v-if="!isApp"
							size="mini"
							class="text-style-web-small-regular"
							@click="routeTo('/my/transfer')">
							{{ t('flowapply.txt27') }}
						</Button>
					</div>
				</div>
				<div class="flex items-center pt-5 justify-between">
					<div class="flex items-center flex-1">
						<base-icon
							:name="!state.isFlow ? 'follow/icon16' : 'follow/icon17'"
							:size="18"
							class="text-text-success" />
						<div class="pl-2 text-text-primary text-style-web-base-medium">
							{{ t('flowapply.txt12') }}
						</div>
					</div>
					<Button
						class="w-auto"
						v-if="state.isFlow"
						size="mini"
						@click="routeTo('/my-follow')"
						plain>
						{{ t('flowapply.txt13') }}
					</Button>
					<!-- <div
						v-if="state.isFlow"
						class="text-text-primary text-style-web-small-regular px-3 py-[6px] border border-border-button_strong rounded-[20px]"
						@click="routeTo('/my-follow')">
						{{ t('flowapply.txt13') }}
					</div> -->
				</div>

				<Button
					v-if="!isCanApply"
					class="mt-6"
					size="small"
					:disabled="isCanApply"
					@click="handleApply">
					{{ t('text157') }}
				</Button>
			</div>
		</Dialog>
	</div>
</template>
