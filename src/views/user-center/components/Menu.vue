<script setup lang="ts">
import { computed, watchEffect, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import { routeTo } from '@/utils/routeTo'

const userStore: any = useUserStore()

const isTrader = ref(false)

watchEffect(() => {
	isTrader.value = userStore.userInfo?.isTrader === 1
})

const { t } = useI18n()
const router = useRouter()

const active = defineModel('active', { default: 1 })

const items = computed(() => {
	const list = [
		{
			id: 1,
			title: t('my.txt42'),
			path: '/user/security-setting'
		},
		{
			id: 2,
			title: t('my.txt74'),
			path: '/user/kyc'
		},
		{
			id: 3,
			title: t('my.txt43'),
			path: '/invite'
		},
		{
			id: 4,
			title: t('my.txt53'),
			path: '/activitycenter'
		},
		{
			id: 5,
			title: t('flw.txt11'),
			path: '/my-follow'
		},
		{
			id: 6,
			title: t('flowapply.txt3'),
			path: '/become-trader'
		}
	]

	if (isTrader.value) {
		return list.filter((item) => ![5, 6].includes(item.id))
	}

	return list
})

const activeClass = computed(() => (item: any) => {
	return item.id === active.value ? 'bg-background-secondary border-r-[2px] border-text-brand' : ''
})
</script>

<template>
	<div class="w-[268px] flex-shrink-0 h-[calc(100vh-64px)] border-r border-border-strong">
		<div class="w-full py-4 pl-[74px] cursor-pointer text-text-disabled text-style-web-h4-medium">
			{{ t('menu.txt2') }}
		</div>
		<div
			v-for="item in items"
			@click="routeTo(item.path)"
			:key="item.id"
			:class="[activeClass(item)]"
			class="w-full py-4 pl-[74px] cursor-pointer text-text-primary text-style-web-h4-medium hover:bg-background-secondary hover:border-r-[2px] hover:border-text-brand">
			{{ item.title }}
		</div>
	</div>
</template>
