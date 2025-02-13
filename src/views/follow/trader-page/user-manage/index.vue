<script setup lang="ts">
import { reactive, ref, onBeforeMount, h, watch } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'

import { Breadcrumb, Dialog, Button, Table, Input } from '@/components/base'
import {
	traderOverview,
	traderInfo,
	myFollowersList,
	removeFollower,
	removeAllFollower
} from '@/apis/follow'
import { ListView } from '@/components/base'
import { toFixed, colorChange } from '@/utils'
import { useDevice } from '@/hooks/useDevice'

const { isPh } = useDevice()
const { t } = useI18n()
const list: any = ref([])
const finished = ref(false)
const loading = ref(true)
const pagination = reactive({
	pageNo: 1,
	pageSize: 10
})
const show = ref(false)
const info: any = ref({})
const active: any = ref()
const overview: any = ref({})
const searchValue = ref('')
const items = reactive([
	{
		title: t('text17'),
		path: '/trader'
	},
	{
		title: t('flw.txt96')
	}
])

const columns = reactive([
	{
		title: 'ID',
		key: 'memberId'
	},
	{
		title: t('text139'),
		key: 'nickname',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h(
					'div',
					{ class: 'w-[20px] h-[20px] rounded-full overflow-hidden mr-[6px] flex-shrink-0' },
					h('img', { class: 'w-full h-full object-cover', src: item?.avatar })
				),
				h(
					'div',
					{
						class: 'text-text-tertiary text-style-web-small-regular text-ellipsis overflow-hidden'
					},
					item?.nickname
				)
			])
		}
	},
	{
		title: t('flw.txt43'),
		key: 'followTime'
	},
	{
		title: t('flw.txt88'),
		key: 'optionName',
		render(item: any) {
			return h('span', { class: colorChange(item?.totalProfit) }, item?.totalProfit)
		}
	},
	{
		title: t('other.txt26'),
		key: 'tool',
		render(item: any) {
			return h(
				'span',
				{
					class: 'text-text-primary cursor-pointer',
					onClick: () => {
						del(item)
					}
				},
				t('flw.txt122')
			)
		}
	}
])

watch(
	() => searchValue.value,
	() => {
		if (!searchValue.value) {
			pagination.pageNo = 1
			pagination.pageSize = 10
			finished.value = false
			loading.value = true
			list.value = []
			getMyFollowersList()
		}
	}
)

onBeforeMount(() => {
	traderOverview().then((res: any) => {
		if (res.code === 0) {
			overview.value = res.data
		}
	})
	getTraderInfo()
	getMyFollowersList()
})

const getTraderInfo = () => {
	traderInfo({}).then((res: any) => {
		if (res.code === 0) {
			info.value = res.data
		}
	})
}

const getMyFollowersList = async () => {
	const params: any = {
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	}

	if (searchValue.value) {
		params.query = searchValue.value
	}

	const res: any = await myFollowersList(params)
	if (res.code === 0) {
		const max = pagination.pageSize
		if (res.data.total <= max) {
			finished.value = true
		}
		list.value = res.data.records
		loading.value = false
	}
}

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	getMyFollowersList()
}

const del = (item: any) => {
	show.value = true
	active.value = item
}

const submit = async () => {
	if (active.value) {
		const res: any = await removeFollower({ followerId: active.value.memberId })
		if (res.code === 0) {
			show.value = false
			showSuccessToast(t('flw.txt111'))
			getMyFollowersList()
			getTraderInfo()
		}
	} else {
		const res: any = await removeAllFollower()
		if (res.code === 0) {
			show.value = false
			showSuccessToast(t('flw.txt111'))
			pagination.pageNo = 1
			pagination.pageSize = 10
			getMyFollowersList()
			getTraderInfo()
		}
	}
}

const removeAll = () => {
	if (!list.value.length) {
		showFailToast(t('trade.txt125'))
		return
	}
	show.value = true
}

const searchUser = () => {
	if (searchValue.value) {
		pagination.pageNo = 1
		pagination.pageSize = 10
		finished.value = false
		loading.value = true
		list.value = []
		getMyFollowersList()
	}
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />

		<div class="py-5 px-4">
			<div class="flex">
				<div class="mr-10">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ toFixed(overview?.profitAmount, 2) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt118') }}（USDT）
					</div>
				</div>
				<div>
					<div class="text-style-web-h1-bold" :class="[colorChange(overview?.totalDividend)]">
						{{ toFixed(overview?.totalDividend, 2) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt119') }}
					</div>
				</div>
			</div>
			<div class="flex items-center pt-5">
				<div class="text-text-description text-style-web-small-regular mr-[10px]">
					{{ t('flw.txt120') }}
				</div>
				<div
					class="text-style-web-small-regular"
					:class="[colorChange(overview?.totalFollowAmount)]">
					{{ toFixed(overview?.totalFollowAmount, 2) || 0 }}USDT
				</div>
			</div>
		</div>

		<div class="border-t border-b border-border-strong p-4 flex justify-between items-center">
			<div class="text-text-secondary text-style-web-base-medium">{{ t('flw.txt121') }}</div>
			<div class="flex items-center">
				<base-icon name="follow/icon11" :size="12" />
				<div class="ml-[2px] text-text-description text-style-web-small-regular">
					{{ info?.following }}/{{ info?.maxFollow }}
				</div>
			</div>
		</div>

		<div class="mt-4 mb-4 flex items-center justify-between w-full px-4">
			<Input
				class="flex-1"
				v-model="searchValue"
				:placeholder="t('text387')"
				inputClass="h-[38px] rounded-[41px] border-0 bg-background-secondary !pl-4 !pr-1 flex-1">
				<template v-slot:prefix>
					<Icon name="search" :size="16" class="mr-[10px] flex-shrink-0 text-text-primary" />
				</template>
				<template v-slot:suffix>
					<Button @click="searchUser" size="mini" class="px-4 border-none w-auto">
						{{ t('text155') }}
					</Button>
				</template>
			</Input>

			<Button @click="removeAll" size="mini" plain class="w-[auto] ml-2 flex-shrink-0">
				{{ t('text383') }}
			</Button>
		</div>

		<ListView v-model:loading="loading" v-model:finished="finished" @load="onLoad" class="pt-0">
			<div v-for="item in list" :key="item.id" class="p-4 border-b border-border-subtle">
				<div class="flex items-center justify-between">
					<div class="flex items-center">
						<div class="flex-shrink-0 w-6 h-6 rounded-full overflow-hidden">
							<img class="w-full h-full object-cover" :src="item?.avatar" alt="" />
						</div>
						<div class="ml-2 text-text-primary text-style-web-h4-medium">{{ item?.nickname }}</div>
					</div>

					<div
						@click="del(item)"
						class="ml-4 h-6 bg-background-secondary rounded-[48px] py-1 px-3 text-text-primary text-style-web-small-medium">
						{{ t('flw.txt122') }}
					</div>
				</div>

				<div class="flex items-center justify-between mt-4">
					<div class="text-text-description text-style-web-base-regular">ID</div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ item?.memberId }}</div>
				</div>

				<div class="flex items-center justify-between mt-2">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt55') }}</div>
					<div class="text-style-web-base-medium" :class="[colorChange(item?.totalProfit)]">
						{{ item?.totalProfit }}
					</div>
				</div>

				<div class="flex items-center justify-between mt-2">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt43') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">
						{{ item?.followTime }}
					</div>
				</div>

				<!-- <div class="flex items-center flex-1 w-[170px] mr-[12px]">
					<div class="flex-shrink-0 w-10 h-10 rounded-full overflow-hidden">
						<img class="w-full h-full object-cover" :src="item?.avatar" alt="" />
					</div>
					<div class="flex-1 pl-[10px] overflow-hidden text-ellipsis">
						<el-tooltip popper-class="max-w-[90vw]" :content="item?.nickname" placement="top">
							<div
								class="text-text-primary text-style-web-h4-medium overflow-hidden text-ellipsis whitespace-nowrap">
								{{ item?.nickname }}
							</div>
						</el-tooltip>
						<div class="pt-[2px] text-text-description text-style-web-small-regular">
							{{ item?.followTime }}
						</div>
					</div>
				</div>
				<div class="flex items-center flex-shrink-0">
					<div>
						<div
							class="text-style-web-body-medium flex items-center"
							:class="[colorChange(item?.totalProfit)]">
							{{ item?.totalProfit }}
						</div>
						<div class="text-text-description text-style-web-small-regular">
							{{ t('flw.txt88') }}
						</div>
					</div>
					<div
						@click="del(item)"
						class="ml-4 h-6 bg-background-secondary rounded-[3px] py-1 px-3 text-text-primary text-style-web-small-medium">
						{{ t('flw.txt122') }}
					</div>
				</div> -->
			</div>
		</ListView>
	</div>

	<div class="ph:hidden pd:hidden w-[1200px] mx-auto">
		<Breadcrumb :items="items" />

		<div class="py-10">
			<div class="flex">
				<div class="mr-20">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ toFixed(overview?.profitAmount, 2) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt118') }}（USDT）
					</div>
				</div>
				<div class="mr-20">
					<div class="text-style-web-h1-bold" :class="[colorChange(overview?.totalDividend)]">
						{{ toFixed(overview?.totalDividend, 2) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt119') }}
					</div>
				</div>
				<div>
					<div class="text-style-web-h1-bold" :class="[colorChange(overview?.totalFollowAmount)]">
						{{ toFixed(overview?.totalFollowAmount, 2) || 0 }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt120') }}(USDT)
					</div>
				</div>
			</div>
		</div>

		<div
			class="py-[10px] px-4 flex justify-between items-center bg-background-secondary rounded-[6px]">
			<div class="text-text-secondary text-style-web-base-medium">{{ t('flw.txt121') }}</div>
			<div class="flex items-center">
				<base-icon name="follow/icon11" :size="12" />
				<div class="ml-[2px] text-text-description text-style-web-small-regular">
					{{ info?.following }}/{{ info?.maxFollow }}
				</div>
			</div>
		</div>

		<div class="mt-10">
			<div class="flex justify-between items-center mb-[20px]">
				<div class="text-text-primary text-style-web-h1-bold">{{ t('flw.txt96') }}</div>

				<div class="flex items-center">
					<Input
						v-model="searchValue"
						:placeholder="t('text387')"
						inputClass="h-[38px] rounded-[41px] border-0 bg-background-secondary !pl-4 !pr-1 w-[320px]">
						<template v-slot:prefix>
							<Icon name="search" :size="16" class="mr-[10px] flex-shrink-0 text-text-primary" />
						</template>
						<template v-slot:suffix>
							<Button @click="searchUser" size="mini" class="px-4 border-none w-auto">
								{{ t('text155') }}
							</Button>
						</template>
					</Input>

					<Button @click="removeAll" size="mini" plain class="ml-2">{{ t('text383') }}</Button>
				</div>
			</div>
			<Table
				:columns="columns"
				:data-source="list"
				slide
				v-model:loading="loading"
				v-model:finished="finished"
				@load="onLoad" />
		</div>
	</div>

	<Dialog
		v-model:show="show"
		:title="active ? t('flw.txt123') : t('text385')"
		:width="isPh ? '' : '390px'"
		@cancel="active = null">
		<div class="web:hidden pd:hidden">
			<div class="py-6 text-text-description text-style-web-body-regular">
				{{ active ? t('flw.txt124', { num: active?.nickname }) : t('text386') }}
			</div>
			<Button plain @click="submit">{{ t('my.txt38') }}</Button>
		</div>

		<div class="ph:hidden px-4 pb-4 pt-1">
			<div class="pb-6 text-text-description text-style-web-body-regular">
				{{ active ? t('flw.txt124', { num: active?.nickname }) : t('text386') }}
			</div>
			<Button plain @click="submit">{{ t('my.txt38') }}</Button>
		</div>
	</Dialog>
</template>
