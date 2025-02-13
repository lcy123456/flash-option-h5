<template>
	<div class="flex">
		<div
			class="flex flex-col items-center flex-1"
			v-for="(item, index) in menuList"
			@click="goPage(item)"
			:key="index">
			<!-- <img :src="item.img" class="w-[46px] h-[46px]" /> -->
			<Icon :name="item.img" :dark-name="`${item.img}-dark`" :size="46" class="cursor-default" />

			<div class="text-web-small-regular text-text-tertiary mt-[4px]">{{ item.title }}</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()

const state = reactive({
	menus: [
		{ title: t('home.txt8'), img: 'home/trade', name: 'trade', path: '/trade/BTC-USDT' },
		{ title: t('home.txt11'), img: 'home/swap', name: 'swap', path: '/home/follow' },
		{
			img: 'home/option',
			title: t('text130'),
			name: 'deliveryContract',
			path: '/home/deliveryContract/BTC-USDT'
		},
		{
			title: t('home.txt9'),
			img: 'home/cypto',
			name: 'deposit',
			path: '/home/swap/BTC-USDT'
		},
		{ title: t('home.txt2'), img: 'home/more', name: 'register', path: '/register' }
	]
})

const goPage = (item: { path: string }) => {
	router.push({ path: item.path })
}

const menuList = computed(() => {
	if (userStore.loginToken) {
		return state.menus.filter((item) => item.name !== 'register')
	}
	return state.menus
})
</script>
