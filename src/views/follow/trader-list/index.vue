<script setup lang="ts">
import { reactive, computed, ref, shallowRef, onBeforeMount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Breadcrumb, ListView } from '@/components/base'
import Card from '../components/card/index.vue'

import { traderList } from '@/apis/follow'

const finished = ref(false)
const loading = ref(false)
const traderData: any = shallowRef([])

const route = useRoute()
const { t } = useI18n()

const tab = route.query?.tab || '1'

const title = computed(() => (tab == '1' ? t('flw.txt13') : t('flw.txt15')))

const pagination = reactive({
	pageNo: 1,
	pageSize: 12
})

const items = reactive([
	{
		title: t('flw.txt7'),
		path: '/home/follow'
	},
	{
		title: title.value
	}
])

onBeforeMount(() => {
	getData()
})

const getData = async () => {
	loading.value = true
	const params: any = {
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	}
	if (tab == '1') {
		params.level = 3
	}
	const res: any = await traderList(params)
	if (res.code === 0) {
		traderData.value = res.data.records

		const max = pagination.pageSize
		if (res.data.total <= max) {
			finished.value = true
		}
		loading.value = false
	}
}

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	getData()
}

const update = () => {
	getData()
}
</script>

<template>
	<div class="w-[1200px] mx-auto">
		<Breadcrumb :items="items" />

		<div class="pt-[30px]">
			<div class="text-text-primary text-style-web-h1-bold">{{ title }}</div>
		</div>
		<ListView @load="onLoad()" v-model:loading="loading" v-model:finished="finished">
			<div class="flex flex-wrap">
				<Card
					v-for="item in traderData"
					:key="item.id"
					:item="item"
					:is-vote="tab == '1'"
					:bg="tab == '1'"
					@update="update"
					class="w-[396px] mb-6 mr-[6px] flex-shrink-0 card" />
			</div>
		</ListView>
	</div>
</template>

<style scoped lang="scss">
.card {
	&:nth-of-type(3n + 0) {
		margin-right: 0 !important;
	}
}
</style>
