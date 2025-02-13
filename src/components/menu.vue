<script setup lang="ts">
import { computed, reactive, inject } from 'vue'
import { useToggle, useVModel } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { changeLang } from '@/i18n'
import { useUserStore } from '@/store/useUserStore'
import { LANGUAGS } from '@/constants'
import { useDevice } from '@/hooks/useDevice'
import { ANDROID_DONWLOAD, IOS_DONWLOAD, WHITE_PAPER } from '@/constants/index'
import { useWelfareStore } from '@/store/modules/welfare/index'
import MainLogo from '@/components/business/MainLogo/index.vue'
import { useThemeStore } from '@/store/useThemeStore'

const { changeTheme } = useThemeStore()
const welfareStore = useWelfareStore()
const globalData: any = inject('globalData')
const userStore = useUserStore()
const { android, ios } = useDevice()

const { t, locale } = useI18n()
const router = useRouter()
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})

const data = reactive({
	currentLan: locale.value
})

const emits = defineEmits(['update:show'])
const show = useVModel(props, 'show', emits)
const [on, toggle] = useToggle(false)
const routeTo = (path: any) => {
	show.value = false
	router.push({ path: path })
}
const tabbarList = computed(() => {
	const list = router?.options?.routes[0]?.children || []
	return list.filter((item: any) => item.meta?.isHome)
})
// const langList = computed(() => {
// 	return [
// 		{
// 			value: 'zh_CN',
// 			label: t('home.txt18')
// 			//
// 		},
// 		{
// 			value: 'zh_HK',
// 			label: t('home.txt19')
// 		},
// 		{
// 			value: 'en_US',
// 			label: t('home.txt20')
// 		},
// 		{
// 			value: 'ja_JP',
// 			label: t('home.txt21')
// 		},
// 		{
// 			value: 'ko_KR',
// 			label: t('home.txt22')
// 		},
// 		{
// 			value: 'de_DE',
// 			label: t('home.txt23')
// 		},
// 		{
// 			value: 'fr_FR',
// 			label: t('home.txt24')
// 		},
// 		{
// 			value: 'it_IT',
// 			label: t('home.txt25')
// 		},
// 		{
// 			value: 'es_ES',
// 			label: t('home.txt26')
// 		}
// 	]
// })

const handleChangeLange = (lang: any) => {
	data.currentLan = lang.value
	changeLang(lang.value)
}

const logout = async () => {
	await userStore.logout()
	window.location.href = '/login'
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

const goWhitePaper = () => {
	window.open(WHITE_PAPER, '_blank')
}
</script>
<template>
	<van-popup
		v-model:show="show"
		position="right"
		class="bg-background-primary"
		:style="{ width: '100%', height: '100%' }"
		v-bind="$attrs">
		<div
			class="flex items-center justify-between text-secondary text-style-montserrat p-4 border-b border-border-subtle">
			<div class="flex items-center">
				<div class="flex items-center cursor-pointer" @click="routeTo('/home/market')">
					<MainLogo />
					<!-- <div class="ml-[8px] text-style-web-h2-bold text-text-primary">
						{{ globalData.title }}
					</div> -->
				</div>
				<!-- <img src="/imgs/logo2.svg" class="h-[24px]" alt="" @click="routeTo('/home/market')" /> -->
				<!-- <img src="/imgs/logo.svg" class="w-[25px] h-[27px]" @click="routeTo('/market')" />
				<div class="ml-[13px]">{{ t('home.txt1') }}</div> -->
			</div>
			<div class="flex items-center">
				<!-- <Icon @click="changeTheme" name="theme_icon" :size="24" class="text-text-primary mr-5" /> -->
				<Icon name="close" :size="24" class="text-text-primary" @click="show = false" />
			</div>
		</div>

		<div class="px-4 mb-3 mt-6">
			<div
				v-if="!userStore.loginToken"
				@click="routeTo('/login')"
				class="bg-brand-main text-always-white text-style-web-h-5-700 rounded-[50px] py-4 text-center">
				{{ t('home.txt27') }}
			</div>
			<div
				v-for="tab in tabbarList"
				:key="tab.name"
				@click="routeTo(tab.path)"
				class="flex items-center justify-between text-style-web-h4-medium text-text-primary py-[20px]">
				<span class="">{{ tab.meta.title }}</span>
				<Icon
					name="common/chevron-right"
					:size="24"
					class="text-text-primary"
					@click="show = false" />
			</div>
			<!-- <div
			 	v-if="welfareStore.data"
				@click="routeTo('/welfare')"
				class="flex items-center justify-between text-style-web-h4-medium text-text-primary py-[20px]">
				<span class="">{{ t('text178') }}</span>
				<img src="/imgs/common/chevron-right.svg" class="w-6 h-6" @click="show = false" />
			</div> -->
			<div
				class="border-t border-border-subtle pt-3 text-style-web-h4-medium text-text-primary relative">
				<div class="flex items-center justify-between py-[20px]" @click="toggle(!on)">
					<span>{{ t('home.txt28') }}</span>
					<Icon
						name="common/chevron-right"
						:size="24"
						class="text-text-primary"
						:class="!on ? 'rotate-90' : '-rotate-90'" />
				</div>
				<div class="" v-if="on">
					<div
						v-for="lang in LANGUAGS"
						class="py-4 px-8.5 flex items-center"
						@click="handleChangeLange(lang)"
						:key="lang.value">
						<div class="flex-1">
							{{ lang.label }}
						</div>
						<Icon
							v-if="data.currentLan === lang.value"
							class="text-text-primary"
							name="common/select-tip"
							:size="15" />
					</div>
				</div>
				<div class="py-5 cursor-pointer" @click="handleDownload">
					{{ t('text136') }}{{ globalData.appNameUpper }} App
				</div>
				<div class="py-5 cursor-pointer" @click="logout" v-if="userStore.loginToken">
					{{ t('home.txt30') }}
				</div>
				<!-- <div class="py-5 cursor-pointer" @click="goWhitePaper">
					{{ t('text368') }}
				</div> -->
			</div>
		</div>
	</van-popup>
</template>
