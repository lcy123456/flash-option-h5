<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, h } from 'vue'
import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { myTraderList, traderInfo, getFollowSettings } from '@/apis/follow'
import { ListView, Table } from '@/components/base'
import FollowSettings from '../components/follow-settings/index.vue'
import { useFollowStore } from '@/store/modules/follow'

const { t } = useI18n()
const followStore = useFollowStore()
const list: any = ref([])
const finished = ref(false)
const loading = ref(true)
const show = ref(false)
const traderData = ref({})
const editTraderData = ref({})
const pagination = reactive({
	pageNo: 1,
	pageSize: 10
})

const columns = reactive([
	{
		title: t('flw.txt42'),
		key: 'nickname'
	},
	{
		title: t('flw.txt45'),
		key: 'followDays',
		render(item: any) {
			return h('span', {}, item?.followDays + t('flw.txt107'))
		}
	},
	{
		title: t('flw.txt55'),
		key: 'totalProfit',
		render(item: any) {
			return h('span', {}, item?.totalProfit + 'USDT')
		}
	},
	{
		title: t('flw.txt56'),
		key: 'direction',
		render(item: any) {
			const text = () => {
				if (item?.tradingMode === 1) {
					return t('flw.txt23')
				}
				if (item?.tradingMode === 2) {
					return t('flw.txt24')
				}
				if (item?.tradingMode === 3) {
					return t('flw.txt105')
				}
			}
			return h('span', {}, text())
		}
	},
	{
		title: t('flw.txt43'),
		key: 'followTime',
		render(item: any) {
			return h('span', {}, moment(Number(item?.followTime)).format('MM/DD HH:mm'))
		}
	},
	{
		title: t('other.txt26'),
		key: 'orderPrice',
		render(item: any) {
			return h(
				'span',
				{
					class: 'text-text-brand cursor-pointer',
					onClick: () => {
						edit(item)
					}
				},
				t('flw.txt106')
			)
		}
	}
])

onBeforeMount(async () => {
	updateList()
})

const updateList = async () => {
	loading.value = true
	const res: any = await myTraderList({
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	})
	if (res.code === 0) {
		const max = pagination.pageSize
		if (res.data.total <= max) {
			finished.value = true
		}
		list.value = res.data.records
		loading.value = false
	}
}

const mode = computed(() => (item: any) => {
	if (item?.tradingMode === 1) {
		return t('flw.txt23')
	}
	if (item?.tradingMode === 2) {
		return t('flw.txt24')
	}
	if (item?.tradingMode === 3) {
		return t('flw.txt105')
	}
	return ''
})

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	updateList()
}

const edit = async (item: any) => {
	const [settingsInfo, info]: any = await Promise.all([
		getFollowSettings({ traderId: item.id }),
		traderInfo({ traderId: item.id })
	])
	show.value = true
	editTraderData.value = settingsInfo.data
	traderData.value = info.data
}

const onUpdate = () => {
	updateList()
	followStore.init()
}
</script>

<template>
	<div class="web:hidden">
		<ListView v-model:loading="loading" v-model:finished="finished" @load="onLoad" class="pt-0">
			<div v-for="item in list" :key="item.id" class="p-4 border-b border-border-subtle">
				<div class="pb-2 flex justify-between">
					<div class="flex items-center">
						<div class="w-6 h-6 rounded-full overflow-hidden mr-2">
							<img class="w-full h-full object-cover" :src="item?.avatar" alt="" />
						</div>
						<div class="text-text-primary text-style-web-h4-medium">{{ item?.nickname }}</div>
					</div>
					<div
						@click="edit(item)"
						class="py-[6px] px-3 bg-background-secondary rounded-[48px] text-text-secondary text-style-web-base-medium">
						{{ t('flw.txt106') }}
					</div>
				</div>

				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt45') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ item?.followDays }}{{ t('flw.txt107') }}
					</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt55') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ item?.totalProfit }} USDT
					</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt56') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ mode(item) }}</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt43') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ moment(Number(item?.followTime)).format('MM/DD HH:mm') }}
					</div>
				</div>
			</div>
		</ListView>
	</div>

	<div class="ph:hidden pd:hidden">
		<Table
			:columns="columns"
			:dataSource="list"
			slide
			v-model:loading="loading"
			v-model:finished="finished"
			@load="onLoad" />
	</div>

	<FollowSettings
		v-model:show="show"
		:item="traderData"
		:edit-info="editTraderData"
		@update="onUpdate" />
</template>
