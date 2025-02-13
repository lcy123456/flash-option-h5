<template>
	<div
		class="h-[60px] sticky bg-background-primary border-b border-border-subtle flex items-center px-[16px] top-0 z-1000 web:hidden">
		<div class="flex items-center flex-1">
			<!-- <img src="/imgs/logo2.svg" class="h-[24px]" alt="" @click="goHome" /> -->
			<div @click="goHome" class="flex items-center">
				<MainLogo />
				<!-- <div class="ml-[8px] text-style-web-h2-bold">{{ globalData.title }}</div> -->
			</div>
		</div>
		<div class="text-right flex items-center">
			<!-- <div
				v-if="userStore.loginToken"
				@click="openUserCenter"
				class="w-10 h-10 rounded-full flex items-center justify-center bg-background-tertiary">
				<base-icon name="avatar" :size="24" />
			</div> -->
			<div class="text-right flex items-center">
				<div
					v-if="userStore.loginToken"
					@click="openUserCenter"
					class="w-10 h-10 rounded-full flex items-center justify-center bg-background-tertiary">
					<!-- <base-icon name="avatar" :size="24" /> -->
					<Icon name="head/user" :size="24" class="text-text-primary" />
				</div>
				<div
					v-else
					@click="goRegister"
					class="py-2 px-4 flex items-center justify-center bg-brand-blue text-always-white text-style-web-body-bold rounded-[50px]">
					{{ isRegister ? t('login.txt1') : t('home.txt2') }}
				</div>
				<Icon name="head/menu" :size="24" class="text-text-primary ml-5" @click="showMenu = true" />

				<!-- <img src="/imgs/home/menu.svg" class="w-6 h-6 ml-5" @click="showMenu = true" /> -->
			</div>
		</div>
		<Menu v-model:show="showMenu" />
	</div>
	<div
		class="pdph:hidden sticky top-0 z-1000 bg-background-primary border-b border-border-strong box-border">
		<div class="h-[64px] flex items-center px-[24px]">
			<div class="flex items-center flex-1">
				<!-- <img src="/imgs/logo2.svg" class="h-[24px]" alt="" @click="goHome" /> -->
				<div @click="goHome" class="flex items-center cursor-pointer">
					<MainLogo />
					<!-- <div class="ml-[8px] text-style-web-h2-bold">{{ globalData.title }}</div> -->
				</div>

				<!-- <img src="/imgs/welcome/logo.svg" class="w-[30px] h-[28px]" />
				<div class="pc-ma ml-[5px]">
					<span class="text-text-primary">{{ titles[0] }}</span>
					<span class="text-brand-blue">{{ titles[1] }}</span>
				</div> -->
				<div class="text-style-web-body-medium text-text-primary flex items-center">
					<div
						class="ml-[30px] cursor-pointer hover:text-text-brand relative"
						v-for="item in data.titles"
						:key="item.path"
						@click="goPage(item)">
						{{ item.label }}
						<!-- :class="route.path.includes(item.path) ? 'text-text-brand' : ''" -->
						<div
							v-if="route.path.includes(item.name)"
							class="w-[28px] h-1 bg-text-brand absolute left-[50%] -bottom-[23px] -translate-x-1/2"></div>
					</div>
				</div>
			</div>
			<div class="flex items-center">
				<SimulatedTips type="head" />
				<div v-if="userStore.loginToken" class="flex items-center">
					<div
						@click="routeTo('/home/my/wallet')"
						class="px-[12px] h-[24px] flex items-center justify-center ml-[24px] min-w-[52px] rounded-[40px] bg-background-tertiary text-text-primary text-style-web-body-medium cursor-pointer whitespace-nowrap">
						{{ t('my.txt49') }}
					</div>
					<div class="relative ml-[24px]">
						<Icon
							name="head/notify"
							@click="routeTo('/notice')"
							:size="24"
							class="text-text-primary" />

						<!-- <img
							src="/imgs/common/notify.svg"
							class="w-[24px] h-[24px] cursor-pointer"
							@click="routeTo('/notice')" /> -->
					</div>
					<UserCenter>
						<Icon
							style="outline: 0 !important"
							name="head/user"
							:size="24"
							class="text-text-primary ml-6" />

						<!-- <img src="/imgs/common/user.svg" class="w-[24px] h-[24px] cursor-pointer ml-[24px]" /> -->
					</UserCenter>
				</div>
				<div v-else class="flex items-center">
					<div
						@click="routeTo('/login')"
						class="px-4 text-text-primary text-style-web-body-medium cursor-pointer">
						{{ t('login.txt1') }}
					</div>

					<Button
						@click="routeTo('/register')"
						class="w-auto text-always-white !h-[32px] !px-4 ml-4">
						{{ t('home.txt2') }}
					</Button>
				</div>
				<div>
					<Download>
						<Icon
							style="outline: 0 !important"
							name="head/download"
							:size="24"
							class="text-text-primary ml-6" />
						<!-- <img
							src="/imgs/welcome/download.svg"
							class="w-[24px] h-[24px] cursor-pointer ml-[24px]" /> -->
					</Download>
				</div>
				<div>
					<Icon name="head/world" :size="24" class="text-text-primary ml-6" @click="show = true" />

					<!-- <img
						src="/imgs/welcome/world.svg"
						class="w-[24px] h-[24px] ml-[24px] cursor-pointer"
						@click="show = true" /> -->
				</div>
				<!-- <div>
					<Icon @click="changeTheme" name="head/theme" :size="24" class="text-text-primary ml-6" />
				</div> -->
			</div>
		</div>
		<ChooseLanguage v-model:show="show" />
	</div>
</template>
<script setup lang="ts">
import { ref, watch, inject, computed } from 'vue'
import Menu from './menu.vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store/useAppStore'
import ChooseLanguage from './dialogs/ChooseLanguage.vue'
import { routeTo } from '@/utils/routeTo'
import { ANDROID_DONWLOAD, IOS_DONWLOAD, WHITE_PAPER } from '@/constants/index'
import { splitStringAtMiddle } from '@/utils'
import { useDevice } from '@/hooks/useDevice'
import UserCenter from '@/components/business/user-center/index.vue'
import { Button } from '@/components/base'
import SimulatedTips from '@/components/SimulatedTips.vue'
import Download from '@/components/Download.vue'
import { useWelfareStore } from '@/store/modules/welfare/index'
import { useThemeStore } from '@/store/useThemeStore'
import MainLogo from '@/components/business/MainLogo/index.vue'

const { changeTheme } = useThemeStore()
const welfareStore = useWelfareStore()
// welfareStore.init()
const appstore = useAppStore()
const { android, ios } = useDevice()

const { t } = useI18n()

const showMenu = ref(false)
const isUserCenter = ref(false)
const isRegister = ref(false)

const router = useRouter()
const route = useRoute()

const userStore = useUserStore()
const globalData: any = inject('globalData')

const titles = computed(() => {
	const array = splitStringAtMiddle(globalData.appNameCFN)

	return array
})
const show = ref(false)
const data = computed(() => {
	return {
		show: false,
		titles: [
			// { label: t('menu.txt3'), path: '/welcome' }, // 首页
			{ label: t('menu.txt3'), path: '/home/market', name: 'home/market' }, // 首页
			{ label: t('my.txt22'), path: '/trade/BTC-USDT', name: '/trade/' }, // 现货
			{ label: t('trade.txt13'), path: '/home/swap/BTC-USDT', name: 'home/swap' }, // 合约
			{
				label: t('text130'),
				path: '/home/deliveryContract/BTC-USDT',
				name: 'home/deliveryContract'
			}, // 交割
			{ label: t('menu.txt6'), path: '/home/follow', name: 'home/follow' }, // 跟单
			{ label: t('text368'), url: WHITE_PAPER } // 跟单
			// { label: t('text178'), path: '/welfare' } // 福利中心

			// { label: t('about.txt1'), path: '/about' } // 关于
		].filter((item) => {
			if (!welfareStore.data && item.path === '/welfare') {
				return false
			}
			return true
		})
	}
})

const goPage = (item: any) => {
	if (item.path) {
		routeTo(item.path)
		return
	} else if (item.url) {
		window.open(item.url, '_blank')
	}
}
const goRegister = () => {
	if (isRegister.value) {
		router.push({ name: 'login' })
	} else {
		router.push({ name: 'register' })
	}
}

const goHome = () => {
	router.push('/home/market')
}

const openUserCenter = () => {
	router.push('/user')
}

const handleDownload = () => {
	console.log('Android 设备 :', android.value)
	console.log('IOS 设备 :', ios.value)
	if (android.value) {
		window.open(ANDROID_DONWLOAD, '_blank')
	} else if (ios.value) {
		window.open(IOS_DONWLOAD, '_blank')
	} else {
		window.open(ANDROID_DONWLOAD, '_blank')
	}
}

watch(
	() => route.path,
	() => {
		if (route.path === '/user') {
			isUserCenter.value = true
		} else {
			isUserCenter.value = false
		}

		isRegister.value = route.path.includes('/register')
	},
	{
		immediate: true
	}
)

watch(
	() => appstore.showUserCenter,
	() => {
		openUserCenter()
	}
)
</script>
