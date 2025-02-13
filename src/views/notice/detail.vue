<template>
	<div>
		<div class="web:hidden">
			<Breadcrumb :items="items" />

			<div class="py-[24px] px-[16px]">
				<div class="text-text-primary text-style-web-h3-bold">
					{{ data.title }}
				</div>
				<div class="mt-[16px] text-text-description" v-html="data.content"></div>
			</div>
		</div>
		<div class="pdph:hidden">
			<div class="w-[1200px] m-auto">
				<Breadcrumb :items="items2" />

				<div class="py-[24px] px-[16px]">
					<div class="text-text-primary text-style-web-h3-bold">
						{{ data.title }}
					</div>
					<div class="mt-[16px] text-text-description" v-html="data.content"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { useNotices } from '@/hooks/useNotice'
import { Breadcrumb } from '@/components/base'
import { getAnnouncementDetail } from '@/apis/market'
import { useRoute } from 'vue-router'

import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const { notice } = useNotices()
const route = useRoute()

const data = reactive({
	title: '',
	content: ''
})
const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('my.txt46'),
		path: '/notice'
	},
	{
		title: t('other.txt1')
	}
])
const items2 = reactive([
	// {
	// 	title: t('invite.txt22'),
	// 	path: '-1',
	// 	name: 'userCenter'
	// },
	{
		title: t('my.txt46'),
		path: '/notice'
	},
	{
		title: t('other.txt1')
	}
])
const loadData = async () => {
	const id = route.params.id
	const res = await getAnnouncementDetail(id)

	if (res.code === 0) {
		data.title = res.data.title
		data.content = res.data.content
	}
}
// data.title = notice.title
// data.content = notice.content

loadData()
</script>
