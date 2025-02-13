<script setup lang="ts">
import { ref, watch } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'

import { PopupBottom, Input, Dialog, Button } from '@/components/base'
import { updateTraderInfo } from '@/apis/follow'
import { useDevice } from '@/hooks/useDevice'

const { isPh } = useDevice()
const { t } = useI18n()
const show = defineModel('show', { default: false })
const props = defineProps({
	nickname: {
		type: String,
		default: ''
	}
})

const name = ref(props.nickname)

watch(
	() => props.nickname,
	() => {
		name.value = props.nickname
	}
)
const emits = defineEmits(['ok'])

const setName = async () => {
	if (name.value) {
		const res: any = await updateTraderInfo({ nickName: name.value })
		if (res.code === 0) {
			show.value = false
			emits('ok')
			showSuccessToast({
				message: t('my.txt79'),
				zIndex: 9999
			})
		} else {
			showFailToast(res.msg)
		}
	}
}
</script>

<template>
	<PopupBottom v-if="isPh" :title="t('my.txt88')" height="222px" v-model:show="show">
		<Input v-model="name" input-class="bg-background-secondary" />

		<template #bottom>
			<van-button
				@click="setName"
				round
				block
				type="primary"
				class="!h-[42px] text-text-inverse-primary text-style-web-body-bold">
				{{ t('my.txt38') }}
			</van-button>
		</template>
	</PopupBottom>
	<Dialog v-else :title="t('my.txt88')" v-model:show="show" width="390px">
		<div class="py-3 px-4">
			<Input v-model="name" input-class="bg-background-secondary" />
		</div>
		<div class="py-5 px-4 border-t border-border-strong">
			<Button @click="setName" size="small">{{ t('my.txt38') }}</Button>
		</div>
	</Dialog>
</template>
