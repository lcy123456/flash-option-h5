<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'

import Card from '../components/card/index.vue'
import { ListView } from '@/components/base'

const { t } = useI18n()
import { myFavorTraderList } from '@/apis/follow'

const items = reactive([
	{
		title: t('flw.txt7'),
		path: '/home/follow'
	},
	{
		title: t('flw.txt11'),
		path: '/my-follow'
	},
	{
		title: t('flw.txt37')
	}
])
const list: any = ref([])
const finished = ref(false)
const loading = ref(true)
const pagination = reactive({
	pageNo: 1,
	pageSize: 10
})

onBeforeMount(() => {
	updateList()
})

const updateList = async () => {
	const res: any = await myFavorTraderList({
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

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	updateList()
}

const onUpdate = () => {
	updateList()
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />

		<div class="py-6 px-4">
			<div class="text-text-primary text-style-web-h1-medium">{{ t('flw.txt38') }}</div>

			<ListView v-model:loading="loading" v-model:finished="finished" @load="onLoad">
				<Card class="mb-3" v-for="item in list" :key="item.id" :item="item" @update="onUpdate" />
			</ListView>
		</div>
	</div>

	<div class="ph:hidden pd:hidden w-[1200px] mx-auto">
		<Breadcrumb :items="items" />
		<div class="pt-10">
			<div class="text-text-primary text-style-web-h1-bold">{{ t('flw.txt38') }}</div>

			<ListView @load="onLoad()" v-model:loading="loading" v-model:finished="finished">
				<div class="flex flex-wrap">
					<Card
						v-for="item in list"
						:key="item.id"
						:item="item"
						@update="onUpdate"
						class="w-[396px] mb-6 mr-[6px] flex-shrink-0 card" />
				</div>
			</ListView>
		</div>
	</div>
</template>

<style scoped lang="scss">
.card {
	&:nth-of-type(3n + 0) {
		margin-right: 0 !important;
	}
}
</style>
