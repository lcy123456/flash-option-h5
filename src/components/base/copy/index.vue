<script setup lang="ts">
import useClipboard from 'vue-clipboard3'
import { useI18n } from 'vue-i18n'
import { showSuccessToast } from '@/components/base/toast'

const { t } = useI18n()
const { toClipboard } = useClipboard()
const props = defineProps({
	text: {
		type: String,
		default: ''
	},
	// 保留前后6位中间 ...
	brief: {
		type: Boolean,
		default: false
	},
	textClass: {
		type: String,
		default: ''
	},
	iconSize: {
		type: Number,
		default: 20
	}
})

const copy = () => {
	toClipboard(props.text)
	showSuccessToast(t('invite.txt24'))
}

const insertDots = (str: string) => {
	if (!props.brief) {
		return str
	}
	if (!str) {
		return str
	}
	if (str.length <= 12) {
		return str
	}
	let firstSix = str.substring(0, 6)
	let lastSix = str.substring(str.length - 6)

	return `${firstSix}...${lastSix}`
}
</script>

<template>
	<div class="flex items-center">
		<div class="text-text-primary text-style-web-body-medium mr-2" :class="[textClass]">
			{{ insertDots(text) }}
		</div>
		<icon @click="copy" name="copy" :size="iconSize" class="text-text-primary" />
	</div>
</template>
