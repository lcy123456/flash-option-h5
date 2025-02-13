<script lang="ts" setup>
import { reactive } from 'vue'
import { getActivityList, getActivityDetail } from '@/apis/other'
import { Dialog } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { ListView } from '@/components/base'

const { t } = useI18n()
const show = defineModel('show', { default: true })

const data = reactive({
	page: 'index',
	item: {},
	list: [],

	loading: false,
	noData: false,
	pageNo: 1,
	pageSize: 30
})

const goDetail = async (item: any) => {
	data.item = item
	data.page = 'detail'

	const res = await getActivityDetail({ id: item.id })

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
	const res = await getActivityList({ step: 1, pageNo: data.pageNo, pageSize: data.pageSize })
	data.loading = false
	if (res.code === 0) {
		// data.list = res.data.content
		const array = res.data.content

		if (array.length < data.pageSize) {
			data.noData = true
		}
		data.list.push(...array)
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
		:title="data.page === 'detail' ? t('other.txt6') : t('my.txt53')"
		:onBeforeClose="handleClose"
		width="600px">
		<div class="h-[400px] overflow-auto px-[24px]">
			<div v-show="data.page === 'index'">
				<ListView
					v-model:loading="data.loading"
					v-model:finished="data.noData"
					@load="onLoad"
					:pt="''">
					<div
						v-for="item in data.list"
						:key="item.id"
						class="mt-[24px] h-[126px] py-[20px] px-[16px] border border-border-subtle">
						<div class="flex items-center">
							<img
								v-if="item.bannerImageUrl"
								:src="item.bannerImageUrl"
								class="w-[64px] h-[64px]" />
							<div class="ml-[30px]">
								<div class="text-text-primary text-style-web-h3-bold">{{ item.title }}</div>
								<div class="mt-[8px] text-text-tertiary text-style-web-small-regular">
									{{ item.detail }}
								</div>

								<div
									@click="goDetail(item)"
									class="mt-[8px] w-[232px] h-[32px] rounded-[50px] text-style-web-body-bold text-text-primary border border-border-strong flex items-center justify-center">
									{{ t('other.txt5') }}
								</div>
							</div>
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
