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
		<div class="pdph:hidden flex">
			<Menu :active="4" />
			<div class="flex-1 px-20 py-10">
				<Breadcrumb :items="items2" />
				<div>
					<div class="text-text-primary text-style-web-xlarge-bold text-center">
						{{ data.title }}
					</div>
					<div class="w-[800px] mt-10 mx-auto text-text-description" v-html="data.content"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { Breadcrumb } from '@/components/base'
import { getActivityDetail } from '@/apis/other'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Menu from '@/views/user-center/components/Menu.vue'

const route = useRoute()
const { t } = useI18n()
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
		title: t('my.txt53'),
		path: '/activitycenter'
	},
	{
		title: t('other.txt6')
	}
])
const items2 = reactive([
	// {
	// 	title: t('invite.txt22'),
	// 	path: '-1',
	// 	name: 'userCenter'
	// },
	{
		title: t('my.txt53'),
		path: '/activitycenter'
	},
	{
		title: t('other.txt6')
	}
])

const loadData = async () => {
	const id = route.params.id
	const res = await getActivityDetail({ id })

	if (res.code === 0) {
		data.title = res.data.title
		data.content = res.data.content
	}
}
loadData()
</script>
