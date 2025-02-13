<template>
	<div
		class="w-full h-full flex items-center py-[30px] justify-center text-text-description text-style-web-body-regular">
		<span class="text-brand-blue cursor-pointer" @click="routeTo('/login')">
			{{ t('login.txt5') }}
		</span>
		{{ t('trade.txt202') }}
		<span class="text-brand-blue cursor-pointer" @click="routeTo('/register')">
			{{ t('other.txt17') }}
		</span>
		{{ t('trade.txt203') }}
	</div>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { routeTo } from '@/utils/routeTo'

const { t } = useI18n()
</script>
