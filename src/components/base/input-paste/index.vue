<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { pasteText } from '@/utils/index'
import Input from '@/components/base/input-number/index.vue'
import { showFailToast } from '@/components/base/toast'

const { t } = useI18n()
const modelValue = defineModel()

const paste = async () => {
	const text = await pasteText()
	if (Number.isNaN(Number(text))) {
		showFailToast(t('text380'))
		return
	}
	modelValue.value = text
}
</script>

<template>
	<Input v-model="modelValue" v-bind="$attrs">
		<template v-slot:suffix>
			<div @click="paste" class="text-brand-main text-style-web-body-medium cursor-pointer">
				{{ t('my.txt139') }}
			</div>
		</template>
	</Input>
</template>
