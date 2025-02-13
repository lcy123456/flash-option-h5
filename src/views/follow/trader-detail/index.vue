<script setup lang="ts">
import { reactive, onBeforeMount, ref, computed, watchEffect } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Breadcrumb, Button, Tabs } from '@/components/base'
import { getLangContrast } from '@/utils'

import TradeData from './TradeData/index.vue'
import CurrentOrders from './CurrentOrders.vue'
import HistoryOrders from './HistoryOrders.vue'
import Team from './Team.vue'
import FollowSettings from '../components/follow-settings/index.vue'

import { useUserStore } from '@/store/useUserStore'
import { traderInfo, favorTrader, unfavorTrader } from '@/apis/follow'

const { t } = useI18n()
const userStore: any = useUserStore()
const route = useRoute()
const info: any = ref({})
const isTrader = ref(false)
const show = ref(false)
const traderId: any = ref(route.query.traderId)

const items = reactive([
	{
		title: t('flw.txt7'),
		path: '/home/follow'
	},
	{
		title: t('flw.txt82')
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

watchEffect(() => {
	isTrader.value = userStore.userInfo?.isTrader === 1
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

onBeforeMount(async () => {
	update()
})

const update = async () => {
	if (traderId.value) {
		const res: any = await traderInfo({ traderId: traderId.value })
		if (res.code === 0) {
			info.value = res.data
		}
	}
}

const followTrader = async () => {
	const res: any = await favorTrader({ traderId: traderId.value })
	if (res.code === 0) {
		update()
		showSuccessToast(t('text40'))
	} else {
		showFailToast(res.msg)
	}
}

const unFollowTrader = async () => {
	const res: any = await unfavorTrader({ traderId: traderId.value })
	if (res.code === 0) {
		update()
		showSuccessToast(t('text41'))
	} else {
		showFailToast(res.msg)
	}
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />

		<div class="py-5 px-4">
			<div class="flex justify-center">
				<div class="w-[88px] h-88px rounded-full overflow-hidden">
					<img v-if="info.avatar" class="w-[100%] h-[100%]" :src="info.avatar" alt="" />
				</div>
			</div>
			<div class="pt-3 flex justify-center items-center">
				<div class="text-text-primary text-style-web-h4-medium mr-[2px]">{{ info?.nickname }}</div>
				<img class="w-4 h-4" :src="info?.traderLevel?.avatar" alt="" />
			</div>
			<div class="pt-3 flex justify-center items-center">
				<base-icon name="follow/icon2" :size="12" class="text-text-description" />
				<div class="text-text-description text-style-web-small-regular">
					{{ info?.following }}/{{ info?.maxFollow }}
				</div>
			</div>
			<div v-if="tagList.length" class="pt-3 flex justify-center">
				<div
					v-for="item in tagList"
					:key="item.label"
					class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
					{{ item.label }}
				</div>
			</div>
			<div
				v-if="info.description"
				class="py-4 flex justify-center items-center text-style-web-small-regular">
				<base-icon name="follow/icon3" :size="16" class="text-text-brand w-4 shrink-0" />
				<div class="text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
					{{ info?.description }}
				</div>
			</div>
			<div v-else class="h-4"></div>
			<div class="flex">
				<Button
					v-if="info?.following >= info?.maxFollow"
					disabled
					class="w-[254px] mr-2 !bg-function-sell-light-backgroundr !border-0 !text-function-sell"
					size="small">
					{{ t('flw.txt89') }}
				</Button>
				<Button
					v-else
					:disabled="info?.isFollow === 1 || isTrader"
					@click="show = true"
					class="w-[254px] mr-2"
					size="small">
					{{ t('flw.txt19') }}
				</Button>
				<Button
					v-if="info?.isFavorite === 0"
					class="w-[96px]"
					size="small"
					plain
					:disabled="isTrader"
					@click="followTrader">
					<div class="flex items-center" :class="[isTrader ? 'text-always-white' : '']">
						<base-icon
							name="follow/icon9"
							:size="16"
							class="mr-1"
							:class="[isTrader ? 'text-always-white' : 'text-text-primary']" />
						<div>
							{{ t('flw.txt87') }}
						</div>
					</div>
				</Button>
				<Button
					v-if="info?.isFavorite === 1"
					class="w-[96px] border-border-button_line"
					size="small"
					plain
					:disabled="isTrader"
					@click="unFollowTrader">
					<div
						class="flex items-center"
						:class="[isTrader ? 'text-always-white' : 'text-text-disabled']">
						{{ t('flw.txt99') }}
					</div>
				</Button>
			</div>
		</div>

		<Tabs :items="tabItems" line head-class="px-4">
			<template v-slot="props">
				<div v-if="props.active === 1">
					<TradeData :info="info" />
				</div>
				<div v-if="props.active === 2">
					<CurrentOrders :traderId="traderId" />
				</div>
				<div v-if="props.active === 3">
					<HistoryOrders :traderId="traderId" />
				</div>
				<div v-if="props.active === 4">
					<Team />
				</div>
			</template>
		</Tabs>
	</div>

	<div class="ph:hidden pd:hidden w-[1200px] mx-auto">
		<Breadcrumb :items="items" />
		<div class="flex justify-between pt-10">
			<div class="flex">
				<div class="w-[88px] h-88px rounded-full overflow-hidden mr-6">
					<img v-if="info.avatar" class="w-[100%] h-[100%]" :src="info.avatar" alt="" />
				</div>
				<div>
					<div class="text-text-primary text-style-web-h1-bold">{{ info?.nickname }}</div>
					<div class="flex items-center py-2">
						<base-icon name="follow/icon2" :size="12" class="text-text-description" />
						<div class="ml-[2px] text-text-description text-style-web-small-regular">
							{{ info?.following }}/{{ info?.maxFollow }}
						</div>
					</div>
					<div v-if="tagList.length" class="flex">
						<div
							v-for="item in tagList"
							:key="item.label"
							class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
							{{ item.label }}
						</div>
					</div>
					<div
						v-if="info.description"
						class="w-[342px] py-4 flex items-center text-style-web-small-regular">
						<base-icon name="follow/icon3" :size="16" class="text-text-brand w-4 shrink-0" />
						<div class="text-text-tertiary overflow-hidden text-ellipsis whitespace-nowrap">
							{{ info?.description }}
						</div>
					</div>
				</div>
			</div>
			<div class="flex items-center">
				<Button
					v-if="info?.isFavorite === 0"
					class="min-w-[96px]"
					size="small"
					plain
					:disabled="isTrader"
					@click="followTrader">
					<div class="flex items-center" :class="[isTrader ? 'text-always-white' : '']">
						<base-icon
							name="follow/icon9"
							:size="16"
							class="mr-1"
							:class="[isTrader ? 'text-always-white' : 'text-text-primary']" />
						<div class="whitespace-nowrap">
							{{ t('flw.txt87') }}
						</div>
					</div>
				</Button>
				<Button
					v-if="info?.isFavorite === 1"
					class="min-w-[96px] border-border-button_line whitespace-nowrap"
					size="small"
					plain
					:disabled="isTrader"
					@click="unFollowTrader">
					<div
						class="flex items-center"
						:class="[isTrader ? 'text-always-white' : 'text-text-disabled']">
						{{ t('flw.txt99') }}
					</div>
				</Button>

				<Button
					v-if="info?.following >= info?.maxFollow"
					disabled
					class="min-w-[132px] ml-2 !bg-function-sell-light-backgroundr !border-0 !text-function-sell whitespace-nowrap"
					size="small">
					{{ t('flw.txt89') }}
				</Button>
				<Button
					v-else
					:disabled="info?.isFollow === 1 || isTrader"
					@click="show = true"
					class="min-w-[132px] ml-2 whitespace-nowrap"
					size="small">
					{{ t('flw.txt19') }}
				</Button>
			</div>
		</div>

		<div class="mt-10">
			<Tabs :items="tabItems" line_b>
				<template v-slot="props">
					<div v-if="props.active === 1">
						<TradeData :info="info" />
					</div>
					<div v-if="props.active === 2">
						<CurrentOrders :traderId="traderId" />
					</div>
					<div v-if="props.active === 3">
						<HistoryOrders :traderId="traderId" />
					</div>
					<div v-if="props.active === 4">
						<Team />
					</div>
				</template>
			</Tabs>
		</div>
	</div>

	<FollowSettings v-model:show="show" :item="info" @update="update" />
</template>
