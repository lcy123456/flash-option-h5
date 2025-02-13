<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Dialog, Button, PopupBottom } from '@/components/base'
import { useDevice } from '@/hooks/useDevice'

const { t } = useI18n()
const { isWeb } = useDevice()

const show = defineModel('show', { default: true })

defineProps({
	content: {
		type: String,
		default: ''
	}
})
</script>

<template>
	<Dialog v-if="isWeb" v-model:show="show" :title="t('text181')" width="420px">
		<div
			v-html="content"
			class="px-4 pb-3 min-h-[20px] max-h-[416px] overflow-y-auto text-text-description text-style-web-small-regular"></div>

		<div class="py-5 px-4 border-t border-border-strong">
			<Button @click="show = false" size="small">{{ t('text266') }}</Button>
		</div>
	</Dialog>

	<PopupBottom v-else v-model:show="show" :title="t('text181')" height="438px">
		<div v-html="content" class="text-text-description text-style-web-small-regular"></div>
		<template v-slot:bottom>
			<Button @click="show = false" size="small">{{ t('text266') }}</Button>
		</template>
	</PopupBottom>
</template>
