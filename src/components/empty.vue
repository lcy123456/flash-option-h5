<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
// import { useUserStore } from '@/store/useUserStore'
// import { routeTo } from '@/utils/routeTo'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const { t } = useI18n()
// const userStore = useUserStore()
const props = defineProps({
	tips: {
		type: String,
		default: ''
	},
	className: {
		type: String,
		default: ''
	}
})
const msg = ref(props.tips || t('trade.txt125'))
</script>
<template>
	<div
		class="flex items-center web:hidden flex-col pt-[30px] pb-20 text-text-description text-style-web-body-regular"
		:class="[className]">
		<img
			:src="
				themeStore.theme === 'light'
					? '/imgs/common/empty_light.svg'
					: '/imgs/common/empty_dark.svg'
			"
			class="w-[55px] h-[54px] mb-4" />
		{{ msg }}
	</div>
	<div class="pdph:hidden">
		<!-- <div
			v-if="!userStore.loginToken"
			class="flex justify-center items-center pt-[30px] pb-20 text-text-description text-style-web-body-regular">
			<span class="text-brand-blue cursor-pointer" @click="routeTo('/login')">
				{{ t('login.txt5') }}
			</span>
			{{ t('trade.txt202') }}
			<span class="text-brand-blue cursor-pointer" @click="routeTo('/register')">
				{{ t('other.txt17') }}
			</span>
			{{ t('trade.txt203') }}
		</div> -->
		<div
			class="flex items-center flex-col pt-[124px] pb-20 text-text-secondary text-style-web-h5-medium"
			:class="[className]">
			<img
				:src="
					themeStore.theme === 'light'
						? '/imgs/common/empty_light.svg'
						: '/imgs/common/empty_dark.svg'
				"
				class="w-[55px] h-[54px] mb-4" />
			{{ msg }}
		</div>
	</div>
</template>
