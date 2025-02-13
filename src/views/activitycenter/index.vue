<template>
	<div>
		<div class="web:hidden">
			<Breadcrumb :items="items" />
			<div class="py-[24px] px-[16px]">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt53') }}</div>
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
							<div class="ml-[30px] overflow-hidden">
								<el-tooltip
									class="box-item"
									:effect="theme"
									:content="item.title"
									placement="bottom">
									<div
										class="text-text-primary text-style-web-h3-bold overflow-hidden whitespace-nowrap text-ellipsis">
										{{ item.title }}
									</div>
								</el-tooltip>
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
		</div>
		<div class="pdph:hidden flex">
			<Menu :active="4" />
			<div class="flex-1 pl-20 py-10">
				<div class="text-text-primary text-style-web-xlarge-bold">{{ t('my.txt53') }}</div>

				<div class="mt-10 h-[660px] overflow-auto">
					<ListView
						v-model:loading="data.loading"
						v-model:finished="data.noData"
						@load="onLoad"
						:pt="''">
						<div
							v-for="item in data.list"
							:key="item.id"
							class="mt-[24px] h-[126px] py-[20px] px-[16px] border-b border-border-subtle">
							<div class="flex items-center">
								<div class="w-[64px] h-[64px]">
									<img
										v-if="item.bannerImageUrl"
										:src="item.bannerImageUrl"
										class="w-[64px] h-[64px] rounded-full" />
								</div>

								<div class="ml-[30px] overflow-hidden">
									<div
										class="text-text-primary text-style-web-h3-bold ml-[12px] overflow-hidden whitespace-nowrap text-ellipsis">
										{{ item.title }}
									</div>
									<div
										class="mt-[8px] ml-[12px] text-style-web-small-regular text-text-description">
										{{ item.updatedTime }}
									</div>

									<Button
										plain
										@click="goDetail(item)"
										size="small"
										class="mt-[8px] w-auto h-[32px] border-border-button_strong border cursor-pointer text-text-primary">
										{{ t('other.txt5') }}
									</Button>
								</div>
							</div>
						</div>
					</ListView>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, inject, computed } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { getActivityList } from '@/apis/other'
import { useRouter } from 'vue-router'
import { ListView, Button } from '@/components/base'
import Menu from '@/views/user-center/components/Menu.vue'
import { useThemeStore } from '@/store/useThemeStore'

const { t } = useI18n()
const globalData = inject('globalData')
const router = useRouter()
const themeStore = useThemeStore()

const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('my.txt53')
	}
])

const data = reactive({
	list: [],

	loading: false,
	noData: false,
	pageNo: 1,
	pageSize: 30
})
const loadData = async () => {
	data.loading = true
	const res = await getActivityList({ step: 1, pageNo: data.pageNo, pageSize: data.pageSize })
	data.loading = false
	if (res.code === 0) {
		const array = res.data.content

		if (array.length < data.pageSize) {
			data.noData = true
		}
		data.list.push(...array)
	}
}

loadData()

const goDetail = (item: { id: string }) => {
	router.push({ name: 'activityDetail', params: { id: item.id } })
}
const onLoad = () => {
	data.pageNo = data.pageNo + 1
	loadData()
}

const theme = computed(() => {
	if (themeStore.theme === 'dark') {
		return 'light'
	}
	return 'dark'
})
</script>
