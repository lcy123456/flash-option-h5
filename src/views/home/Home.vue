<template>
	<div>
		<Header v-if="!isApp" />
		<SimulatedTips />
		<router-view></router-view>
		<van-tabbar
			v-if="!isApp"
			:border="false"
			v-model="active"
			class="h-[61px] web:hidden !bg-background-primary border-t border-border-subtle">
			<van-tabbar-item
				v-for="tab in tabbarList"
				:key="tab.name"
				:name="tab.name"
				:to="tab.path"
				class="!bg-background-primary">
				<span
					class="app-small3-400"
					:class="active === tab.name ? 'text-text-primary' : 'text-text-tips'">
					{{ tab.meta.title }}
				</span>
				<template #icon="props">
					<img
						class="!w-6 !h-6 object-contain"
						:src="
							active === tab.name
								? `/imgs/common/${tab.meta.icon}-active-${themeStore.theme}.svg`
								: `/imgs/common/${tab.meta.icon}-inactive-${themeStore.theme}.svg`
						" />
				</template>
			</van-tabbar-item>
		</van-tabbar>
		<div class="pdph:hidden">
			<Footer v-show="isHiddenFooter" />
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, onBeforeMount, ref, watch, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import { useIsApp } from '@/hooks/useIsApp'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useAppStore } from '@/store/useAppStore'
import SimulatedTips from '@/components/SimulatedTips.vue'
import { useThemeStore } from '@/store/useThemeStore'

const { isApp } = useIsApp()
const userStore = useUserStore()
const router = useRouter()
const route = useRoute()
const appstore = useAppStore()
const themeStore = useThemeStore()

const tabbarList = computed(() => {
	console.log(router?.options, ' router?.options=====')
	const list = router?.options?.routes[0]?.children || []
	const array = list
		.filter((item: any) => item.meta?.isHome || item.meta?.isHidden)
		.map((item) => {
			const newItem = { ...item }
			if (newItem.name === 'option') {
				newItem.path = '/home/deliveryContract/BTC-USDT'
			}
			return newItem
		})
	return array
})
const active: any = ref(route.name || 'market')

const handleVisibilityChange = () => {
	if (document.visibilityState === 'visible') {
		try {
			if (router.currentRoute.value?.name === 'option') {
				// 期权页面从后端切换到前端自动刷新
				// window.location.reload()
				appstore.visibleState = Date.now()
			}
		} catch (err) {
			console.log('err :', err)
		}
	}
}
const isHiddenFooter = computed(() => {
	return !router.currentRoute.value.meta?.hiddenFooter
})
document.addEventListener('visibilitychange', handleVisibilityChange)

watch(
	() => route.path,
	() => {
		active.value = route.name
	},
	{
		immediate: true
	}
)

onBeforeMount(() => {
	userStore.getUserInfo()
})

onBeforeUnmount(() => {
	document.removeEventListener('visibilitychange', handleVisibilityChange)
})

const getPath = (item: any) => {
	if (item.path.includes('/:symbol')) {
		return item.path.replace('/:symbol', '/BTC-USDT')
	}
	return item.path
}
</script>

<style lang="scss" scoped>
:deep(.van-tabbar-item__icon) {
	margin-bottom: 0;
}
</style>
