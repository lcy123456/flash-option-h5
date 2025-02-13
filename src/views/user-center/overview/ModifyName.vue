<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { PopupBottom, Input, Dialog } from '@/components/base'
import { useUserStore } from '@/store/useUserStore'
import { userName } from '@/apis/user'
import { useDevice } from '@/hooks/useDevice'

const { isPh } = useDevice()
const { t } = useI18n()
const show = defineModel('show', { default: false })
const userStore: any = useUserStore()
const name = ref(userStore.userInfo?.username)

watch(
	() => userStore.userInfo?.username,
	() => {
		name.value = userStore.userInfo?.username
	}
)

const disabled = computed(() => {
	return name.value ? false : true
})

const setName = async () => {
	if (name.value) {
		const res: any = await userName({ username: name.value })
		if (res.code === 0) {
			await userStore.getUserInfo()
			show.value = false
			showSuccessToast({
				message: t('my.txt79'),
				zIndex: 9999
			})
		} else {
			showFailToast(res.message)
		}
	}
}
</script>

<template>
	<PopupBottom v-if="isPh" :title="t('my.txt88')" height="222px" v-model:show="show">
		<Input v-model.trim="name" input-class="bg-background-secondary" />

		<template #bottom>
			<van-button
				@click="setName"
				:disabled="disabled"
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
			<Input v-model.trim="name" input-class="bg-background-secondary" />
		</div>
		<div class="py-5 px-4 border-t border-border-strong">
			<Button @click="setName" :disabled="disabled" size="small">{{ t('my.txt38') }}</Button>
		</div>
	</Dialog>
</template>
