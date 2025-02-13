<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Breadcrumb, Button, Tabs } from '@/components/base'

import TraderCard from './TraderCard.vue'
import CurrentCard from './CurrentCard.vue'
import HistoryCard from './HistoryCard.vue'

import { myFollowOverview } from '@/apis/follow'
import { toFixed } from '@/utils'
import { formatNumUnit } from '@/utils/trade'
import { useUserStore } from '@/store/useUserStore'
import { useFollowStore } from '@/store/modules/follow'

const { t } = useI18n()
const userStore: any = useUserStore()
const followStore = useFollowStore()
const router = useRouter()
const info: any = ref({})
const items = reactive([
	{
		title: t('flw.txt7'),
		path: '/home/follow'
	},
	{
		title: t('flw.txt11')
	}
])

const tabItems = reactive([
	{
		title: t('flw.txt47'),
		id: 1
	},
	{
		title: t('flw.txt104'),
		id: 2
	},
	{
		title: t('flw.txt48'),
		id: 3
	}
])

onBeforeMount(async () => {
	followStore.init()
	const res: any = await myFollowOverview()
	if (res.code === 0) {
		info.value = res.data
	}
})
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div class="px-4 pt-4 pb-5">
			<div class="flex justify-between">
				<div class="flex items-center">
					<div
						class="w-11 h-11 bg-background-tertiary rounded-full flex justify-center items-center overflow-hidden">
						<img
							v-if="userStore.userInfo?.avatar"
							class="w-full h-full object-cover"
							:src="userStore.userInfo?.avatar"
							alt="" />
						<base-icon v-else name="follow/icon7" :size="26" />
					</div>
					<div class="ml-2 text-text-primary text-style-web-h4-medium">
						{{ userStore.userInfo?.username }}
					</div>
				</div>
				<div class="flex items-center" @click="router.push('/followed-traders')">
					<div class="text-text-description text-style-web-small-regular mr-[6px]">
						{{ t('flw.txt37') }}
					</div>
					<div class="text-text-secondary text-style-web-body-medium">{{ info?.farvoCount }}</div>
				</div>
			</div>

			<div class="px-2 pt-4 flex justify-between">
				<div>
					<div class="text-text-secondary text-style-web-body-bold">
						{{ formatNumUnit(toFixed(info?.balance, 2)) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt49') }}(USDT)
					</div>
				</div>
				<div>
					<div class="text-text-secondary text-style-web-body-bold">
						{{ toFixed(info?.totalProfit, 2) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt50') }}(USDT)
					</div>
				</div>
				<div>
					<div v-if="!info?.balance" class="text-text-secondary text-style-web-body-bold">
						{{ 100 }}
					</div>
					<div v-else class="text-text-secondary text-style-web-body-bold">
						{{ toFixed(info?.totalProfit / info?.balance, 2) }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt51') }}
					</div>
				</div>
			</div>

			<Button @click="router.push('/become-trader')" class="mt-5" size="small">
				{{ t('flw.txt12') }}
			</Button>
		</div>

		<Tabs :items="tabItems" line head-class="px-4">
			<template v-slot="props">
				<div v-if="props.active === 1">
					<TraderCard />
				</div>
				<div v-if="props.active === 2">
					<!-- <div class="border-b border-border-strong box-border pt-3 pb-[2px] px-4">
					<Segmented
						:options="[
							{ title: '交易员1', id: 1 },
							{ title: '交易员2', id: 2 },
							{ title: '交易员3', id: 3 }
						]" />
				</div> -->
					<CurrentCard />
				</div>
				<div v-if="props.active === 3">
					<HistoryCard />
				</div>
			</template>
		</Tabs>
	</div>

	<div class="ph:hidden pd:hidden w-[1200px] mx-auto">
		<Breadcrumb :items="items" />
		<div class="py-10 flex justify-between items-center">
			<div class="flex">
				<div
					class="w-[86px] h-[86px] bg-background-tertiary rounded-full flex justify-center items-center overflow-hidden">
					<img
						v-if="userStore.userInfo?.avatar"
						class="w-full h-full object-cover"
						:src="userStore.userInfo?.avatar"
						alt="" />
					<base-icon v-else name="follow/icon7" :size="36" />
				</div>
				<div class="pl-6">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ userStore.userInfo?.username }}
					</div>
					<div
						class="mt-[6px] flex items-center cursor-pointer"
						@click="router.push('/followed-traders')">
						<div class="mr-[6px] text-text-description text-style-web-small-regular">
							{{ t('flw.txt37') }}
						</div>
						<div class="text-text-secondary text-style-web-body-medium">{{ info?.farvoCount }}</div>
					</div>

					<div class="mt-4 flex">
						<div class="mr-[42px]">
							<div class="text-text-secondary text-style-web-body-bold">
								{{ formatNumUnit(toFixed(info?.balance, 2)) || 0 }}
							</div>
							<div class="mt-1 text-text-description text-style-web-small-regular">
								{{ t('flw.txt49') }}(USDT)
							</div>
						</div>
						<div class="mr-[42px]">
							<div class="text-text-secondary text-style-web-body-bold">
								{{ toFixed(info?.totalProfit, 2) || 0 }}
							</div>
							<div class="mt-1 text-text-description text-style-web-small-regular">
								{{ t('flw.txt50') }}(USDT)
							</div>
						</div>
						<div>
							<div v-if="!info?.balance" class="text-text-secondary text-style-web-body-bold">
								{{ 100 }}
							</div>
							<div v-else class="text-text-secondary text-style-web-body-bold">
								{{ toFixed(info?.totalProfit / info?.balance, 2) }}
							</div>
							<div class="mt-1 text-text-description text-style-web-small-regular">
								{{ t('flw.txt51') }}
							</div>
						</div>
					</div>
				</div>
			</div>
			<div>
				<Button @click="router.push('/become-trader')" class="mt-5 min-w-[142px]" size="small">
					{{ t('flw.txt12') }}
				</Button>
			</div>
		</div>

		<Tabs :items="tabItems" line_b head-class="px-4">
			<template v-slot="props">
				<div v-if="props.active === 1">
					<TraderCard />
				</div>
				<div v-if="props.active === 2">
					<CurrentCard />
				</div>
				<div v-if="props.active === 3">
					<HistoryCard />
				</div>
			</template>
		</Tabs>
	</div>
</template>
