<script setup lang="ts">
import { inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const globalData: any = inject('globalData')

const { t } = useI18n()
</script>

<template>
	<div class="w-[40vw] h-[100%] bg-background-special">
		<div class="pt-[113px] flex justify-center">
			<div class="text-style-web-mega-black text-text-primary text-center">
				<div>
					{{ t('text276') }}
					<span class="text-text-brand">BTC</span>
				</div>
				<div>{{ t('text277') }} {{ globalData.appNameUpper }}</div>
			</div>
		</div>
		<div class="pt-[65px] flex justify-center">
			<img
				:src="
					themeStore.theme === 'light' ? '/imgs/illustration.svg' : '/imgs/illustration_dark.svg'
				"
				class="w-[340px] h-[360px]"
				alt="" />
		</div>
	</div>
</template>
