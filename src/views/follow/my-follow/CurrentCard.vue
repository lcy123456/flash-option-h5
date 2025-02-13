<script setup lang="ts">
import { computed, onBeforeMount, reactive, ref, h } from 'vue'
// import moment from 'moment'
import { useI18n } from 'vue-i18n'
import { ListView, Table } from '@/components/base'
import { currentFollowOrder } from '@/apis/follow'

const { t } = useI18n()
const list: any = ref([])
const finished = ref(false)
const loading = ref(true)
const pagination = reactive({
	pageNo: 1,
	pageSize: 10
})

const columns = reactive([
	{
		title: t('text138'),
		key: 'symbol'
	},
	{
		title: t('flw.txt102'),
		key: 'optionName'
	},
	{
		title: t('flw.txt103'),
		key: 'direction',
		render(item: any) {
			return h(
				'span',
				{ class: item.direction === 'BUY' ? 'text-function-buy' : 'text-function-sell' },
				item.direction === 'BUY' ? t('flw.txt72') : t('flw.txt71')
			)
		}
	},
	{
		title: t('flwaccount.txt10'),
		key: 'orderPrice'
	},
	{
		title: t('text18'),
		key: 'betAmount'
	},
	{
		title: t('flw.txt42'),
		key: 'nickname'
	}
])

onBeforeMount(() => {
	updateList()
})

const mode = computed(() => (item: any) => {
	if (item.direction === 'BUY') {
		return {
			text: t('flw.txt72'),
			textClass: 'text-function-buy',
			bgClass: 'bg-function-buy'
		}
	}
	return {
		text: t('flw.txt71'),
		textClass: 'text-function-sell',
		bgClass: 'bg-function-sell'
	}
})

const updateList = async () => {
	loading.value = true
	const res: any = await currentFollowOrder({
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	})
	if (res.code === 0) {
		const max = pagination.pageSize
		if (res.data.total <= max) {
			finished.value = true
		}
		list.value = res.data.list
		loading.value = false
	}
}

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	updateList()
}
</script>

<template>
	<div class="web:hidden">
		<ListView v-model:loading="loading" v-model:finished="finished" @load="onLoad" class="pt-0">
			<div v-for="item in list" :key="item.id" class="p-4 border-b border-border-subtle">
				<div class="flex items-center pb-2">
					<div class="w-1 h-5" :class="[mode(item).bgClass]"></div>
					<div class="px-2 text-text-primary text-style-web-body-bold">{{ item?.symbol }}</div>
					<!-- <base-icon name="follow/icon8" :size="20" /> -->
				</div>

				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt102') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ item?.optionName }}</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt103') }}</div>
					<div class="text-style-web-base-medium" :class="[mode(item).textClass]">
						{{ mode(item).text }}
					</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('flwaccount.txt10') }}
					</div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ item?.orderPrice }}</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('text18') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ item?.betAmount }}</div>
				</div>
				<div class="pt-2 flex justify-between">
					<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt42') }}</div>
					<div class="text-text-tertiary text-style-web-base-medium">{{ item?.nickname }}</div>
				</div>
				<!-- <div class="pt-2 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt43') }}</div>
				<div class="text-text-tertiary text-style-web-base-medium">
					{{ moment(Number(item?.followTime)).format('MM/DD HH:mm') }}
				</div>
			</div> -->
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
</template>
