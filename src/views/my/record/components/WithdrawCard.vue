<script setup lang="ts">
import { onBeforeMount, reactive, ref, computed, h } from 'vue'
import { useI18n } from 'vue-i18n'

import { ListView, Copy, Table } from '@/components/base'
import { withdrawRecord } from '@/apis/wallet'
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
				h('img', { src: item?.coin?.log, class: 'w-[24px] h-[24px] rounded-full mr-2' }),
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
		title: t('my.txt25'),
		key: 'totalAmount'
	},
	{
		title: t('text4'),
		key: 'mainnet'
	},
	{
		title: t('option.txt19'),
		key: 'fee',
		render(item: any) {
			return h('div', {}, item?.fee + ' USDT')
		}
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
		key: 'transactionNumber',
		render(item: any) {
			return h(
				'div',
				{},
				item?.transactionNumber
					? h(Copy, {
							iconSize: 14,
							textClass: 'text-text-tertiary text-style-web-small-medium mr-[2px]',
							text: item?.transactionNumber,
							brief: true
						})
					: '--'
			)
		}
	},
	{
		title: t('my.txt34'),
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
		render(item: any) {
			const state: any = {
				0: t('text7'),
				1: t('text8'),
				2: t('text9'),
				3: t('text10'),
				4: t('text11'),
				5: t('text12'),
				6: t('text13'),
				7: t('text14'),
				8: t('text15')
			}
			return h('div', { class: 'text-text-success' }, state[item.status])
		}
	}
])

onBeforeMount(() => {
	updateList()
})

const status = computed(() => (item: any) => {
	const state: any = {
		0: t('text7'),
		1: t('text8'),
		2: t('text9'),
		3: t('text10'),
		4: t('text11'),
		5: t('text12'),
		6: t('text13'),
		7: t('text14'),
		8: t('text15')
	}
	return state[item.status]
})

const updateList = async () => {
	loading.value = true
	const res: any = await withdrawRecord({
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
							<img class="w-full h-full object-cover" :src="item?.coin?.logo" alt="" />
						</div>
						<div class="text-text-primary text-style-web-h3-bold">
							{{ item?.totalAmount }} {{ item?.coin?.unit }}
						</div>
					</div>
					<div class="text-text-success text-style-web-body-medium">{{ status(item) }}</div>
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
					<div class="text-text-description text-style-web-body-regular">{{ t('my.txt25') }}</div>
					<div class="text-text-primary text-style-web-body-medium">{{ item?.totalAmount }}</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('text4') }}</div>
					<div class="text-text-primary text-style-web-body-medium">{{ item?.mainnet }}</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('my.txt28') }}</div>
					<div class="text-text-primary text-style-web-body-medium">{{ item?.fee }} USDT</div>
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
						<Copy :text="item?.transactionNumber" brief />
					</div>
				</div>

				<div class="mt-2 flex justify-between">
					<div class="text-text-description text-style-web-body-regular">{{ t('my.txt34') }}</div>
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
