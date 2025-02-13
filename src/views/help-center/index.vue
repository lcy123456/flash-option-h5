<script lang="ts" setup>
import { reactive, onMounted, computed } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { getHelpList, getSubHelpList } from '@/apis/other'
import { routeTo } from '@/utils/routeTo'
const { t } = useI18n()
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const items = computed(() => {
	if (state.isSub) {
		return [
			{
				title: t('invite.txt22'),
				path: 'back',
				name: 'userCenter'
			},
			{
				title: t('my.txt55'),
				path: 'back',
				name: 'sub'
			},
			{
				title: state.currentInfo.titleCN
			}
		]
	}
	return [
		{
			title: t('invite.txt22'),
			path: 'back',
			name: 'userCenter'
		},
		{
			title: t('my.txt55')
		}
	]
})
const showList = computed(() => {
	if (state.isSub) {
		return state.subList
	}
	return state.list
})
const state = reactive({
	title: t('my.txt55'),
	list: [],
	subList: [], // 二级列表
	isSub: false, // 是否二级
	currentInfo: {
		titleCN: '',
		cate: ''
	} // 当前操作的项
})
const fetchList = async () => {
	const res: any = await getHelpList()
	if (res.code === 0) {
		state.list = res.data || []
	}
}
const handleSub = (row: any) => {
	if (state.isSub) {
		routeTo(`/helpDetail?id=${row.id}`)
	} else {
		state.currentInfo = row
		getSub()
	}
}
const getSub = async () => {
	const res: any = await getSubHelpList({
		cate: state.currentInfo.cate
	})
	if (res.code === 0) {
		state.subList = res.data.content || []
	}
	state.title = state.currentInfo.titleCN
	state.isSub = true
}
const handleBack = (item: any) => {
	state.isSub = false
}
onMounted(() => {
	fetchList()
})
</script>
<template>
	<Breadcrumb v-if="!isPC" :items="items" @back="handleBack" />
	<div class="px-4 mt-6" :class="[isPC && 'w-[1200px] mx-auto py-[64px]']">
		<div class="text-style-web-h3-bold text-text-primary mb-2">{{ state.title }}</div>
		<div>
			<div
				v-for="item in showList"
				@click="handleSub(item)"
				:key="item.cate"
				class="text-style-web-body-regular text-text-secondary py-4 flex items-center justify-between border-b border-border-subtle cursor-pointer">
				<div>{{ item.title }}</div>
				<img src="/imgs/common/arrow-right.svg" class="w-4 h-4" />
			</div>
		</div>
	</div>
</template>
