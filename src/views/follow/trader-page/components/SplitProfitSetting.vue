<script setup lang="ts">
import { ref, onBeforeMount, watch, computed } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'

import { Dialog, InputNumber, Button } from '@/components/base'
import { updateTraderInfo, getOverview } from '@/apis/follow'
import { useDevice } from '@/hooks/useDevice'

const { isPh } = useDevice()
const { t } = useI18n()
const show = defineModel('show', { default: true })
const ratio: any = ref('')
const highDividendPercent = ref(0)

const emits = defineEmits(['ok'])

const props = defineProps({
	value: {
		type: String,
		default: ''
	}
})

watch(
	() => props.value,
	() => {
		ratio.value = Number(props.value)
	},
	{
		immediate: true
	}
)

onBeforeMount(() => {
	getOverview().then((res: any) => {
		if (res.code === 0) {
			highDividendPercent.value = Number(res.data.highDividendPercent)
		}
	})
})

const disabled = computed(() => !(Number(ratio.value) > 0))

const submit = async () => {
	const res: any = await updateTraderInfo({ dividendPercent: ratio.value })
	if (res.code === 0) {
		showSuccessToast(t('flw.txt111'))
		show.value = false
		emits('ok')
	} else {
		showFailToast(res.msg)
	}
}
</script>

<template>
	<Dialog v-model:show="show" :title="t('flw.txt93')" :width="isPh ? '' : '390px'">
		<div class="web:px-4 web:pb-4">
			<div class="ph:py-5 web:pb-6 web:pt-1">
				<InputNumber
					v-model="ratio"
					size="small"
					:max="highDividendPercent"
					input-class="bg-background-secondary"
					:placeholder="t('flw.txt125') + `0%-${highDividendPercent}%`">
					<template v-slot:suffix>
						<div class="text-text-secondary text-style-web-body-medium">%</div>
					</template>
				</InputNumber>

				<div class="pt-[10px] text-text-tips text-style-ark-aans-tc-small-400_150">
					<span class="text-text-error">*</span>
					{{ t('flw.txt94') }}
				</div>
			</div>
			<Button :disabled="disabled" @click="submit" size="small">{{ t('my.txt38') }}</Button>
		</div>
	</Dialog>
</template>
