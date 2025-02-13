<script setup lang="ts">
import { reactive, ref, onBeforeMount, computed } from 'vue'
import { Button, Tabs, Breadcrumb } from '@/components/base'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import TradeData from '../trader-detail/TradeData/index.vue'
import CurrentOrders from '../trader-detail/CurrentOrders.vue'
import HistoryOrders from '../trader-detail/HistoryOrders.vue'
import Team from '../trader-detail/Team.vue'

import SplitProfitSetting from './components/SplitProfitSetting.vue'

import ModifyAvatar from './components/ModifyAvatar.vue'
import ModifyName from './components/ModifyName.vue'

import { traderOverview, traderInfo } from '@/apis/follow'
import { toFixed, getLangContrast, colorChange } from '@/utils'
// import { formatNumUnit } from '@/utils/trade'

const { t } = useI18n()
const info: any = ref({})
const overview: any = ref({})
const show = ref(false)
const avatarShow = ref(false)
const nameShow = ref(false)
const router = useRouter()
const items = reactive([
	{
		title: t('flw.txt7'),
		path: '/home/follow'
	},
	{
		title: t('text17')
	}
])
const tabItems = reactive([
	{
		title: t('flw.txt83'),
		id: 1
	},
	{
		title: t('flw.txt84'),
		id: 2
	},
	{
		title: t('flw.txt85'),
		id: 3
	}
])

onBeforeMount(async () => {
	getTraderInfo()
	getTraderOverview()
})

const tagList = computed(() => {
	if (info.value?.taglist && info.value?.taglist.length) {
		return info.value?.taglist.map((tag: any) => {
			return {
				label: tag[getLangContrast()]
			}
		})
	}
	return []
})

const getTraderInfo = async () => {
	const res: any = await traderInfo({})
	info.value = res.data
}

const getTraderOverview = async () => {
	const res: any = await traderOverview()
	if (res.code === 0) {
		overview.value = res.data
	}
}

const onUpdate = () => {
	getTraderOverview()
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div class="px-4 pt-4 pb-5">
			<div class="flex items-center">
				<div class="w-[64px] h-[64px] relative rounded-full mr-3 border box-border">
					<img
						class="w-full h-[100%] object-cover rounded-full overflow-hidden"
						:src="info?.avatar"
						alt="" />

					<div
						@click="avatarShow = true"
						class="w-4 h-4 absolute z-10 bottom-0 right-0 rounded-full bg-text-inverse-primary box-border border border-border-strong flex items-center justify-center">
						<base-icon name="follow/icon12" :size="12" class="text-text-primary" />
					</div>
				</div>
				<div>
					<div class="flex items-center">
						<div
							@click="nameShow = true"
							class="text-text-primary text-style-web-h4-medium mr-[2px]">
							{{ info?.nickname }}
						</div>
						<div class="w-4 h-4">
							<img class="w-full h-full object-cover" :src="info?.traderLevel?.avatar" alt="" />
						</div>
					</div>
					<div class="py-[2px] flex items-center">
						<base-icon name="follow/icon2" :size="12" class="text-text-description" />
						<div class="text-text-description text-style-web-small-regular">
							{{ info?.following }}/{{ info?.maxFollow }}
						</div>
					</div>
					<div class="flex justify-center">
						<div
							v-for="item in tagList"
							:key="item.label"
							class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
							{{ item.label }}
						</div>
					</div>
				</div>
			</div>

			<div class="py-5">
				<div class="flex justify-between">
					<div>
						<div class="text-text-primary text-style-web-h2-bold">
							{{ toFixed(overview?.totalDividend, 2) || 0 }}
						</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							{{ t('flw.txt115') }}（USDT）
						</div>
					</div>
					<div>
						<div class="text-style-web-h2-bold" :class="[colorChange(overview?.totalFollowAmount)]">
							{{ toFixed(overview?.totalFollowAmount, 2) || 0 }}
						</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							{{ t('flw.txt66') }}(USDT)
						</div>
					</div>
					<div>
						<div class="text-text-primary text-style-web-h2-bold">
							{{ toFixed(overview?.dividendPercent, 2) || 0 }}%
						</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							{{ t('flw.txt116') }}
						</div>
					</div>
				</div>

				<!-- <div class="flex">
				<div>
					<div>
						<div class="text-text-primary text-style-web-h1-bold">1,946,914</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							累计分润（USDT）
						</div>
					</div>
					<div class="mt-[10px]">
						<div class="text-text-primary text-style-web-h1-bold">8%</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">分润比例</div>
					</div>
				</div>
				<div class="pl-[50px]">
					<div>
						<div class="text-function-buy text-style-web-h1-bold">249.84M</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							资金管理规模(USDT)
						</div>
					</div>
					<div class="mt-[10px]">
						<div class="text-text-primary text-style-web-h1-bold">0.00</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							近90日带单规模(USDT)
						</div>
					</div>
				</div>
			</div> -->
			</div>

			<div class="flex justify-between">
				<Button @click="show = true" size="small" class="mr-3">{{ t('flw.txt117') }}</Button>
				<Button @click="router.push('/follow/user-manage')" size="small" plain>
					{{ t('flw.txt96') }}
				</Button>
			</div>
		</div>

		<Tabs :items="tabItems" line head-class="px-4">
			<template v-slot="props">
				<div v-if="props.active === 1">
					<TradeData :info="info" />
				</div>
				<div v-if="props.active === 2">
					<CurrentOrders :traderId="info?.id" />
				</div>
				<div v-if="props.active === 3">
					<HistoryOrders :traderId="info?.id" />
				</div>
				<div v-if="props.active === 4">
					<Team />
				</div>
			</template>
		</Tabs>
	</div>

	<div class="ph:hidden pd:hidden w-[1200px] mx-auto">
		<Breadcrumb :items="items" />
		<div class="py-10 flex justify-between">
			<div>
				<div class="flex">
					<div class="w-[88px] h-[88px] relative rounded-full mr-6 border box-border">
						<img
							class="w-full h-[100%] object-cover rounded-full overflow-hidden"
							:src="info?.avatar"
							alt="" />

						<div
							@click="avatarShow = true"
							class="w-6 h-6 absolute z-10 bottom-0 right-0 rounded-full bg-text-inverse-primary box-border border-[1.5px] border-border-strong flex items-center justify-center">
							<base-icon name="follow/icon12" :size="18" class="text-text-primary" />
						</div>
					</div>
					<div>
						<div class="flex items-center">
							<div
								@click="nameShow = true"
								class="text-text-primary cursor-pointer text-style-web-h1-bold mr-2">
								{{ info?.nickname }}
							</div>
							<div class="w-6 h-6">
								<img class="w-full h-full object-cover" :src="info?.traderLevel?.avatar" alt="" />
							</div>
						</div>
						<div class="pt-[8px] flex items-center">
							<base-icon name="follow/icon2" :size="12" />
							<div class="text-text-description text-style-web-small-regular">
								{{ info?.following }}/{{ info?.maxFollow }}
							</div>
						</div>
						<div v-if="tagList.length" class="pt-2 flex justify-center">
							<div
								v-for="item in tagList"
								:key="item.label"
								class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
								{{ item.label }}
							</div>
						</div>

						<div v-if="info?.description" class="mt-4 h-4 flex items-center">
							<base-icon name="follow/icon3" :size="16" class="text-text-brand w-4" />
							<div
								class="ml-[2px] flex-1 text-style-web-small-regular overflow-hidden text-text-tertiary text-ellipsis whitespace-nowrap">
								{{ info?.description }}
							</div>
						</div>

						<div class="pt-4">
							<div class="flex justify-between">
								<div class="mr-10">
									<div class="text-text-primary text-style-web-h2-bold">
										{{ toFixed(overview?.totalDividend, 2) || 0 }}
									</div>
									<div class="mt-1 text-text-description text-style-web-small-regular">
										{{ t('flw.txt115') }}（USDT）
									</div>
								</div>
								<div class="mr-10">
									<div
										class="text-style-web-h2-bold"
										:class="[colorChange(overview?.totalFollowAmount)]">
										{{ toFixed(overview?.totalFollowAmount, 2) || 0 }}
									</div>
									<div class="mt-1 text-text-description text-style-web-small-regular">
										{{ t('flw.txt66') }}(USDT)
									</div>
								</div>
								<div>
									<div class="text-text-primary text-style-web-h2-bold">
										{{ Number(toFixed(overview?.dividendPercent, 2)) || 0 }}%
									</div>
									<div class="mt-1 text-text-description text-style-web-small-regular">
										{{ t('flw.txt116') }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-between items-center">
				<Button @click="show = true" size="small" class="mr-2 min-w-[132px]">
					{{ t('flw.txt117') }}
				</Button>
				<Button
					@click="router.push('/follow/user-manage')"
					size="small"
					class="!min-w-[132px]"
					plain>
					{{ t('flw.txt96') }}
				</Button>
			</div>
		</div>

		<Tabs :items="tabItems" line_b>
			<template v-slot="props">
				<div v-if="props.active === 1">
					<TradeData :info="info" />
				</div>
				<div v-if="props.active === 2">
					<CurrentOrders :traderId="info?.id" />
				</div>
				<div v-if="props.active === 3">
					<HistoryOrders :traderId="info?.id" />
				</div>
				<div v-if="props.active === 4">
					<Team />
				</div>
			</template>
		</Tabs>
	</div>

	<SplitProfitSetting v-model:show="show" @ok="onUpdate" :value="overview?.dividendPercent" />

	<ModifyAvatar v-model:show="avatarShow" :avatar="info?.avatar" @ok="getTraderInfo" />
	<ModifyName v-model:show="nameShow" :nickname="info?.nickname" @ok="getTraderInfo" />
</template>
