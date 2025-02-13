<script setup lang="ts">
import { reactive, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import { useI18n } from 'vue-i18n'
import LanguagePopup from './components/LanguagePopup.vue'
import ExchangeRateUpdate from './components/ExchangeRateUpdate.vue'
import { routeTo } from '@/utils/routeTo'

import { useKyc } from '@/hooks/useKyc'
import { useSimulation } from '@/hooks/useSimulation'

const { t } = useI18n()
const userStore: any = useUserStore()
const simulation = useSimulation()
const router = useRouter()

const { kycInfo, updateKycInfo } = useKyc()

onBeforeMount(() => {
	updateKycInfo()
	userStore.getUserInfo()
	userStore.initSettingInfo()
	userStore.initCountryList()
})

const showLanguage = ref(false)
const showExchangeRate = ref(false)

const list = reactive([
	// {
	// 	name: t('my.txt41'),
	// 	id: 1
	// },
	{
		name: t('my.txt42'),
		id: 2
	},
	{
		id: 3,
		path: '/invite',
		name: t('my.txt43')
	},
	// {
	// 	id: 5,
	// 	name: t('text107')
	// },
	{
		name: t('my.txt44'),
		id: 4
	},
	{
		id: 6,
		name: t('my.txt45'),
		path: '/about'
	},
	{
		id: 7,
		name: t('my.txt46'),
		path: '/notice'
	}
])

const openWallet = () => {
	router.push('/home/my/wallet')
}

// const openSpot = () => {
// 	router.push('/my/spot-account')
// }
const clickList = (item: any) => {
	if (item.id === 5) {
		showExchangeRate.value = true
		return
	}

	if (item?.id === 2) {
		router.push('/user/security-setting')
	} else if (item.id === 4) {
		showLanguage.value = true
	} else if (item.path) {
		router.push({ path: item.path })
	}
}

const changeSimulatedAccount = () => {
	simulation.changeUser()
}
</script>

<template>
	<div>
		<div class="overflow-y-auto py-6 px-4">
			<div class="flex items-center w-full">
				<div class="flex w-full" @click="router.push('/user/overview')">
					<div class="flex-shrink-0 w-[64px] h-[64px] rounded-full overflow-hidden mr-3">
						<img class="w-full h-full" :src="userStore.userInfo?.avatar" alt="" />
					</div>
					<div class="flex-1 overflow-hidden">
						<div class="flex items-center">
							<div
								class="text-text-primary text-style-web-h3-bold overflow-hidden text-ellipsis whitespace-nowrap">
								{{ userStore.userInfo?.username }}
							</div>
							<!-- <div class="h-[16px] rounded-[3px] py-[1px] px-1 text-text-brand bg-text-brand-10">
								{{ userStore.userInfo?.teamLevel }}
							</div> -->
						</div>
						<div class="text-text-description text-style-web-small-regular my-1">
							UID:{{ userStore.userInfo?.id }}
						</div>
						<div class="flex">
							<div
								:class="[kycInfo.bgClass, kycInfo.textClass]"
								class="rounded-[10px] px-2 py-[2[x]] text-style-web-xsmall-regular">
								{{ kycInfo.lable }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-between my-[32px]">
				<van-button @click="openWallet" class="flex-1 text-style-web-body-bold mr-4" type="primary">
					{{ t('my.txt49') }}
				</van-button>

				<van-button
					@click="router.push('/user/overview')"
					class="flex-1 text-style-web-body-bold !text-text-primary"
					plain
					type="primary">
					{{ t('my.txt50') }}
				</van-button>
			</div>

			<div class="pb-[32px] border-b border-border-strong">
				<div class="text-text-primary text-style-web-h3-bold mb-[20px]">{{ t('my.txt51') }}</div>

				<div class="flex">
					<div class="flex-1 flex justify-center">
						<div
							@click="router.push('/user/kyc')"
							class="w-[80px] flex flex-col justify-center items-center">
							<base-icon name="user-center/icon1" :size="32" class="text-text-primary" />
							<div class="mt-2 text-text-secondary text-style-web-small-medium text-center">
								{{ t('my.txt52') }}
							</div>
						</div>
					</div>
					<div class="flex-1 flex justify-center">
						<div
							class="w-[80px] flex flex-col justify-center items-center"
							@click="routeTo('/activitycenter')">
							<base-icon name="user-center/icon2" :size="32" class="text-text-primary" />
							<div class="mt-2 text-text-secondary text-style-web-small-medium text-center">
								{{ t('my.txt53') }}
							</div>
						</div>
					</div>
					<div class="flex-1 flex justify-center">
						<div
							class="w-[80px] flex flex-col justify-center items-center"
							@click="changeSimulatedAccount">
							<base-icon name="user-center/simulation" :size="32" />
							<div class="mt-2 text-text-secondary text-style-web-small-medium text-center">
								{{ t('text110') }}
							</div>
						</div>
					</div>
					<div class="flex-1 flex justify-center">
						<div
							class="w-[80px] flex flex-col justify-center items-center"
							@click="routeTo('/helpCenter')">
							<base-icon name="user-center/icon4" :size="32" />
							<div class="mt-2 text-text-secondary text-style-web-small-medium text-center">
								{{ t('my.txt55') }}
							</div>
						</div>
					</div>
				</div>
			</div>

			<div>
				<div
					v-for="item in list"
					@click="clickList(item)"
					:key="item.name"
					class="flex justify-between py-[20px] items-center">
					<div class="text-style-web-h4-medium text-text-primary">{{ item.name }}</div>
					<base-icon name="arrow-right" :size="24" class="text-text-primary" />
				</div>
			</div>
		</div>
	</div>

	<LanguagePopup v-model:show="showLanguage" />
	<ExchangeRateUpdate v-model:show="showExchangeRate" />
</template>
