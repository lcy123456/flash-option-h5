<template>
	<div>
		<div class="web:hidden">
			<Breadcrumb :items="items" />
			<div class="py-6 px-4">
				<div class="flex items-center justify-between">
					<el-tooltip
						class="box-item"
						:effect="theme"
						:content="state.content.name"
						placement="bottom">
						<div
							class="text-text-primary text-style-web-h3-bold flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
							{{ state.content.name }}
						</div>
					</el-tooltip>
					<div class="text-style-web-small-regular text-text-description w-[145px]">
						{{ formatData(state.content.startTime, 'YYYY-MM-DD') }}~{{
							formatData(state.content.endTime, 'YYYY-MM-DD')
						}}
					</div>
				</div>
				<div class="mt-4">
					<img :src="state.content.url" class="w-full h-full" />
				</div>
			</div>
		</div>
		<div class="pdph:hidden w-[1200px] m-auto">
			<Breadcrumb :items="items" />
			<div class="py-6 px-4">
				<div class="flex items-center justify-between">
					<el-tooltip
						class="box-item"
						:effect="theme"
						:content="state.content.name"
						placement="bottom">
						<div
							class="text-text-primary text-style-web-h3-bold flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
							{{ state.content.name }}
						</div>
					</el-tooltip>
					<div class="text-style-web-small-regular text-text-description w-[145px]">
						{{ formatData(state.content.startTime, 'YYYY-MM-DD') }}~{{
							formatData(state.content.endTime, 'YYYY-MM-DD')
						}}
					</div>
				</div>
				<div class="mt-4">
					<img :src="state.content.url" class="w-[600px] m-auto object-contain" />
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { Breadcrumb } from '@/components/base'
import { getAdvertiseDetail } from '@/apis/market'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { onMounted } from 'vue'
import { formatData } from '@/utils/date'
import { useThemeStore } from '@/store/useThemeStore'

const { t } = useI18n()
const route = useRoute()
const themeStore = useThemeStore()

const state = reactive({
	content: ''
})
const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('other.txt10')
	}
])

const fectAdvertiseDetail = async () => {
	const id = route.params.id
	const res: any = await getAdvertiseDetail({
		serialNumber: id
	})

	if (res.code === 0) {
		state.content = res.data
	}
}
onMounted(() => {
	fectAdvertiseDetail()
})

const theme = computed(() => {
	if (themeStore.theme === 'dark') {
		return 'light'
	}
	return 'dark'
})
</script>
