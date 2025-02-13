<script lang="ts" setup>
import { reactive } from 'vue'
import { getNotices, getAnnouncementDetail } from '@/apis/market'
import { formatTime } from '@/utils/date'

import { Dialog } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { ListView } from '@/components/base'

const { t } = useI18n()
const show = defineModel('show', { default: true })

const data = reactive({
	page: 'index',
	item: {},

	loading: false,
	noData: false,
	pageNo: 1,
	pageSize: 30
})

const list = reactive([])

const goDetail = async (item: any) => {
	data.item = item
	data.page = 'detail'

	const res = await getAnnouncementDetail(item.id)

	if (res.code === 0) {
		data.item.content = res.data.content
	}
}

const goBack = () => {
	data.page = 'index'
	data.item = {}
}
const loadData = async () => {
	data.loading = true
	const res1 = await getNotices({ pageNo: data.pageNo, pageSize: data.pageSize })
	data.loading = false
	if (res1.code === 0) {
		const array = res1.data.content.map((item: any) => {
			if (item.createTimeLong) {
				item.createTime = formatTime(Number(item.createTimeLong))
			}
			return item
		})

		if (array.length < data.pageSize) {
			data.noData = true
		}
		list.push(...array)
	}
}

loadData()

const handleClose = () => {
	if (data.page === 'detail') {
		goBack()
		return
	}
	show.value = false
}

const onLoad = () => {
	data.pageNo = data.pageNo + 1
	loadData()
}
</script>
<template>
	<Dialog
		v-model:show="show"
		:title="data.page === 'detail' ? t('other.txt1') : t('other.txt54')"
		:onBeforeClose="handleClose"
		width="600px">
		<div class="h-[400px] overflow-auto px-[24px]">
			<div v-show="data.page === 'index'">
				<ListView
					v-model:loading="data.loading"
					v-model:finished="data.noData"
					@load="onLoad"
					:pt="''">
					<div class="mt-[8px] flex" v-for="item in list" :key="item.id" @click="goDetail(item)">
						<div class="py-[16px] flex-1 border-b border-border-subtle">
							<div class="text-style-web-body-regular text-text-secondary">
								{{ item.title }}
							</div>
							<div class="mt-[6px] text-style-web-small-regular text-text-tips">
								{{ item.createTime }}
							</div>
						</div>
						<div class="pt-[12px]">
							<img src="/imgs/common/arrow-right.svg" class="w-6 h-6" />
						</div>
					</div>
				</ListView>
			</div>
			<div v-show="data.page === 'detail'">
				<div class="flex items-center">
					<!-- <img
						src="/imgs/common/chevron-left.svg"
						class="w-[30px] h-[30px] cursor-pointer"
						@click="goBack" /> -->
					<div class="flex-1 flex justify-center text-text-primary text-style-web-h3-bold">
						{{ data.item.title }}
					</div>
				</div>
				<div class="mt-[16px]" v-html="data.item.content"></div>
			</div>
		</div>
	</Dialog>
</template>
