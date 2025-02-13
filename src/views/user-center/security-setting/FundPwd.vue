<script setup lang="ts">
import { reactive, computed, watchEffect } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'

import PopupRight from '../components/popup-right/index.vue'
import Input from '@/components/base/input/index.vue'
import InputCountDown from '@/components/base/input-count-down/index.vue'
import Button from '@/components/base/button/index.vue'
import { useUserStore } from '@/store/useUserStore'

import { emailCode, smsCode } from '@/apis/index'
import { setJyPassword, updateJyPassword } from '@/apis/user'

const { t } = useI18n()
const show = defineModel('show', { default: true })
const emits = defineEmits(['back'])
const userStore = useUserStore()

const props = defineProps({
	settingInfo: {
		type: Object,
		default: () => ({})
	}
})

const items = computed(() => [
	{
		title: t('my.txt57'),
		path: '/user'
	},
	{
		title: t('my.txt42'),
		path: 'back'
	},
	{
		title: props.settingInfo.isFundPwd ? t('my.txt153') : t('my.txt116')
	}
])

const form = reactive({
	oldPassword: '',
	password: '',
	confirmPassword: '',
	code: ''
})
const isFirstMobile = computed(() => props.settingInfo.isMobileAuth)

const disabled = computed(() => !(form.code && form.confirmPassword && form.password))

const reset = () => {
	form.code = ''
	form.oldPassword = ''
	form.password = ''
	form.confirmPassword = ''
}

watchEffect(() => {
	if (!show.value) {
		reset()
	}
})

const onBack = (item: any) => {
	show.value = false
	if (item.go === -2) {
		emits('back')
	}
}

const sendCode = async () => {
	const operateType = props.settingInfo.isFundPwd ? 7 : 12
	if (isFirstMobile.value) {
		const { code, message }: any = await smsCode({ operateType })
		if (code === 0) {
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	} else {
		const { code, message }: any = await emailCode({ operateType })
		if (code === 0) {
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	}
}

const submit = async () => {
	if (form.confirmPassword === form.password) {
		if (props.settingInfo.isFundPwd) {
			const res: any = await updateJyPassword({
				oldPassword: form.oldPassword,
				newPassword: form.password,
				code: form.code
			})
			if (res.code === 0) {
				await userStore.initSettingInfo()
				showSuccessToast(res.message)
				show.value = false
			} else {
				showFailToast(res.message)
			}
		} else {
			const res: any = await setJyPassword({
				jyPassword: form.password,
				code: form.code
			})
			if (res.code === 0) {
				await userStore.initSettingInfo()
				showSuccessToast(res.message)
				show.value = false
			} else {
				showFailToast(res.message)
			}
		}
	} else {
		showFailToast(t('register.txt15'))
	}
}
</script>

<template>
	<PopupRight v-model:show="show" :items="items" @back="onBack">
		<div class="py-6 px-4">
			<div class="text-text-primary text-style-web-h3-bold">
				{{ settingInfo.isFundPwd ? t('my.txt153') : t('my.txt116') }}
			</div>
			<Input
				v-if="settingInfo.isFundPwd"
				v-model="form.oldPassword"
				class="mt-3"
				:placeholder="t('text29')" />

			<Input v-model="form.password" class="mt-3" :placeholder="t('my.txt117')" />

			<Input v-model="form.confirmPassword" class="mt-3" :placeholder="t('my.txt118')" />

			<InputCountDown
				v-model="form.code"
				class="mt-3"
				@send="sendCode"
				:placeholder="isFirstMobile ? t('my.txt120') : t('my.txt119')" />

			<Button @click="submit" :disabled="disabled" class="mt-6">{{ t('my.txt87') }}</Button>
		</div>
	</PopupRight>
</template>
