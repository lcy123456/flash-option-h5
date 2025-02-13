<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const loading = defineModel('loading', { default: false })
const emits = defineEmits(['refresh'])

const { t } = useI18n()

const onRefresh = () => {
	emits('refresh')
}
</script>

<template>
	<van-pull-refresh
		v-model="loading"
		@refresh="onRefresh"
		:success-text="t('text44')"
		:loading-text="t('flw.txt113')"
		:pulling-text="t('text42')"
		:loosing-text="t('text43')">
		<slot></slot>
	</van-pull-refresh>
</template>
