<template>
	<div class="w-[358px] flex flex-col items-center">
		<img
			:src="themeStore.theme === 'dark' ? '/imgs/m_guide_dark.svg' : '/imgs/m_guide.svg'"
			class="w-[110px] h-[110px]" />
		<div class="mt-[24px] flex flex-col items-center">
			<div class="text-style-web-h1-bold text-text-primary">{{ t('home.txt3') }}</div>
			<div class="mt-[8px] text-style-web-small-regular text-text-tertiary">
				{{ t('text371', { num: 1210 }) }}
			</div>
		</div>
		<div
			@click="routeTo('/login')"
			class="mt-[24px] h-[50px] w-[358px] rounded-[50px] flex items-center justify-center bg-brand-blue text-always-white text-web-h5-bold">
			{{ t('home.txt5') }}
		</div>
	</div>
</template>
<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useThemeStore } from '@/store/useThemeStore'

const { t } = useI18n()
const router = useRouter()
const themeStore = useThemeStore()

const routeTo = (path: any) => {
	router.push({ path: path })
}
</script>
