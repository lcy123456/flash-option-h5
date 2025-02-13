<script setup lang="ts">
import { onBeforeMount, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ListView } from '@/components/base'
import { myFollowersList } from '@/apis/follow'

const { t } = useI18n()
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
	loading.value = true
	const res: any = await myFollowersList({
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
	console.log('我的跟随者', res)
}

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	updateList()
}
</script>

<template>
	<ListView v-model:loading="loading" v-model:finished="finished" @load="onLoad" class="pt-0">
		<div
			v-for="item in [1, 2, 3, 4, 5, 6, 7]"
			:key="item"
			class="p-4 flex justify-between items-center">
			<div class="flex items-center">
				<div class="w-10 h-10 rounded-full overflow-hidden">
					<!-- <img src="./test.png" alt="" /> -->
				</div>
				<div class="pl-1 text-text-primary text-style-web-h4-medium">JBW</div>
			</div>
			<div>
				<div class="text-function-buy text-style-web-body-medium">+6.384.41</div>
				<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt88') }}</div>
			</div>
		</div>
	</ListView>
</template>
