<template>
	<div>
		<div class="web:hidden">
			<Breadcrumb :items="items" />
			<div class="py-[24px] px-[16px]">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt46') }}</div>
				<ListView
					v-model:loading="data.loading"
					v-model:finished="data.noData"
					@load="onLoad"
					:pt="''">
					<div class="mt-[8px]" v-for="item in list" :key="item.id" @click="goDetail(item)">
						<div class="py-[16px] border-b border-border-subtle">
							<div class="flex items-center">
								<div
									class="flex-1 text-style-web-body-regular text-text-secondary overflow-hidden whitespace-nowrap text-ellipsis">
									{{ item.title }}
								</div>
								<img src="/imgs/common/arrow-right.svg" class="w-6 h-3" />
							</div>
							<div class="mt-[6px] text-style-web-small-regular text-text-tips">
								{{ item.createTime }}
							</div>
						</div>
						<!-- <div class="pt-[12px]">
						</div> -->
					</div>
				</ListView>
			</div>
		</div>
		<div class="pdph:hidden">
			<div class="w-[1200px] m-auto">
				<div class="py-[24px] px-[16px]">
					<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt46') }}</div>
					<ListView
						v-model:loading="data.loading"
						v-model:finished="data.noData"
						@load="onLoad"
						:pt="''">
						<div
							class="mt-[8px] flex cursor-pointer"
							v-for="item in list"
							:key="item.id"
							@click="goDetail(item)">
							<div class="py-[16px] flex-1 border-b border-border-subtle">
								<div
									class="text-style-web-body-regular text-text-secondary overflow-hidden whitespace-nowrap text-ellipsis">
									{{ item.title }}
								</div>
								<div class="mt-[6px] text-style-web-small-regular text-text-tips">
									{{ item.createTime }}
								</div>
							</div>
							<div class="pt-[12px]">
								<img src="/imgs/common/arrow-right.svg" class="w-6 h-3" />
							</div>
						</div>
					</ListView>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { Breadcrumb } from '@/components/base'
import { getNotices } from '@/apis/market'
import { useNotices } from '@/hooks/useNotice'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { formatTime } from '@/utils/date'
import { ListView } from '@/components/base'

const { t } = useI18n()
const { setNotice } = useNotices()
const router = useRouter()

const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('my.txt46')
	}
])

const list = reactive([])
const data = reactive({
	loading: false,
	noData: false,
	pageNo: 1,
	pageSize: 30
})

const goDetail = (item: any) => {
	setNotice(item)
	router.push({ name: 'noticeDetail', params: { id: item.id } })
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

const onLoad = () => {
	data.pageNo = data.pageNo + 1
	loadData()
}
</script>
