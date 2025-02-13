<script setup lang="ts">
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
const active = defineModel('active', { default: 1 })

const { t } = useI18n()
const router = useRouter()

const items = reactive([
	{
		id: 1,
		title: t('text140'),
		path: '/home/my/wallet',
		icon: 'my/icon1'
	},
	{
		id: 2,
		title: t('my.txt1'),
		path: '/my/spot-account',
		icon: 'my/icon2'
	},
	{
		id: 3,
		title: t('my.txt2'),
		path: '/my/swap-account',
		icon: 'my/icon3'
	},
	{
		id: 4,
		title: t('transfer.txt13'),
		path: '/my/follow-account',
		icon: 'my/icon4'
	}
])

const activeClass = computed(() => (item: any) => {
	return item.id === active.value ? 'bg-background-secondary border-r-[2px] border-text-brand' : ''
})
</script>

<template>
	<div
		v-for="item in items"
		:key="item.title"
		@click="router.push(item.path)"
		class="w-[100%] flex items-center mb-6 py-4 pl-10 cursor-pointer hover:bg-background-secondary hover:border-r-[2px] hover:border-text-brand"
		:class="[activeClass(item)]">
		<Icon :name="item.icon" :size="20" class="text-text-primary" />
		<div class="text-text-primary text-style-web-h4-medium ml-[42px]">{{ item.title }}</div>
	</div>
</template>
