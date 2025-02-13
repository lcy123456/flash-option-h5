<script setup lang="ts">
import { onBeforeMount, reactive, ref, h } from 'vue'
import { useI18n } from 'vue-i18n'

import { ListView, Copy, Table } from '@/components/base'
import { rechargeList } from '@/apis/wallet'
import { formatTime } from '@/utils/date'

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
		title: t('text141'),
		key: 'logo',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h('img', { src: item?.logo, class: 'w-[30px] h-[30px] rounded-full mr-2' }),
				h('div', { class: 'text-text-primary text-style-web-body-medium' }, item.unit)
			])
		}
	},
	{
		title: t('trade.txt31'),
		key: 'createTimeLong',
		render(item: any) {
			return h('span', {}, formatTime(item?.createTimeLong))
		}
	},
	{
		title: t('text3'),
		key: 'amount'
	},
	{
		title: t('text4'),
		key: 'mainnet'
	},
	{
		title: t('text5'),
		key: 'address',
		render(item: any) {
			return h(
				'div',
				{},
				h(Copy, {
					iconSize: 14,
					textClass: 'text-text-tertiary text-style-web-small-medium mr-[2px]',
					text: item?.address,
					brief: true
				})
			)
		}
	},
	{
		title: 'TxID',
		key: 'txid',
		render(item: any) {
			return h(
				'div',
				{},
				h(Copy, {
					iconSize: 14,
					textClass: 'text-text-tertiary text-style-web-small-medium mr-[2px]',
					text: item?.txid,
					brief: true
				})
			)
		}
	},
	{
		title: t('text6'),
		key: 'my.txt1',
		render() {
			return h('div', {}, t('my.txt1'))
		}
	},
	{
		width: '60px',
		title: t('text124'),
		align: 'right',
		key: 'my.txt1',
		render() {
			return h('div', { class: 'text-text-success' }, t('text16'))
		}
	}
])

onBeforeMount(() => {
	updateList()
})

const updateList = async () => {
	loading.value = true
	const res: any = await rechargeList({
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	})
	if (res.code === 0) {
		const max = pagination.pageSize
		if (res.data.totalElements <= max) {
			finished.value = true
		}
		list.value = res.data.content
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
			<div v-for="item in list" :key="item.id" class="pt-6 pb-4 border-b border-border-strong">
				<div class="flex justify-between items-center">
					<div class="flex items-center mb-2">
						<div class="w-[30px] h-[30px] rounded-full mr-2">
							<img class="w-full h-full object-cover" :src="item?.logo" alt="" />
						</div>
						<div class="text-text-primary text-style-web-h3-bold">
							{{ item?.amount }} {{ item?.unit }}
						</div>
					</div>
					<div class="text-text-success text-style-web-body-medium">{{ t('text16') }}</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">
						{{ t('trade.txt31') }}
					</div>
					<div class="text-text-primary text-style-web-body-medium">
						{{ formatTime(item?.createTimeLong) }}
					</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('text3') }}</div>
					<div class="text-text-primary text-style-web-body-medium">
						{{ item?.amount }}
					</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('text4') }}</div>
					<div class="text-text-primary text-style-web-body-medium">{{ item?.mainnet }}</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('text5') }}</div>
					<div class="text-text-primary text-style-web-body-medium">
						<Copy :text="item?.address" brief />
					</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">TxID</div>
					<div class="text-text-primary text-style-web-body-medium">
						<Copy :text="item?.txid" brief />
					</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('text6') }}</div>
					<div class="text-text-primary text-style-web-body-medium">{{ t('my.txt1') }}</div>
				</div>
			</div>
		</ListView>
	</div>

	<div class="ph:hidden pd:hidden">
		<Table
			slide
			:columns="columns"
			:dataSource="list"
			v-model:loading="loading"
			v-model:finished="finished"
			@load="onLoad" />
	</div>
</template>
