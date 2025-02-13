<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const loading = defineModel('loading', { default: false })

const { t } = useI18n()

defineProps({
	tips: {
		type: String,
		default: ''
	}
})
</script>

<template>
	<div v-if="loading" class="flex items-center justify-center">
		<van-loading size="16" />
		<div class="van-loading__text whitespace-nowrap">{{ tips ? tips : t('flw.txt113') }}</div>
	</div>
</template>
