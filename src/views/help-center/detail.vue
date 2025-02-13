<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { getHelpDetail } from '@/apis/other'
const { t } = useI18n()
import { useRoute } from 'vue-router'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const route = useRoute()
const items = computed(() => {
	return [
		{
			title: t('invite.txt22'),
			path: 'back',
			name: 'userCenter'
		},
		{
			title: t('my.txt55'),
			path: '-1'
		},
		{
			title: t('help.detail')
		}
	]
})
const items2 = computed(() => {
	return [
		// {
		// 	title: t('invite.txt22'),
		// 	path: 'back',
		// 	name: 'userCenter'
		// },
		{
			title: t('my.txt55'),
			path: '-1'
		},
		{
			title: t('help.detail')
		}
	]
})

const detailInfo = ref({
	title: '',
	content: ''
})
const helpDetail = async () => {
	const res = await getHelpDetail({
		id: route.query.id
	})
	detailInfo.value = res.data
}
onMounted(() => {
	helpDetail()
})
</script>

<template>
	<Breadcrumb :items="isPC ? items2 : items" />
	<div class="px-4 my-6" :class="[isPC && 'w-[1200px] mx-auto py-[64px]']">
		<div class="text-style-web-h3-bold text-text-primary mb-4">{{ detailInfo.title }}</div>
		<div
			class="text-style-web-small-regular text-text-description"
			v-html="detailInfo.content"></div>
	</div>
</template>
