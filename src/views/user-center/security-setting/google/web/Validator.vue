<script setup lang="ts">
import { ref, watch, reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Dialog, Button, InputCountDown, InputPaste } from '@/components/base'
import { showSuccessToast, showFailToast } from '@/components/base/toast'

import { useSecuritySetting } from '@/hooks/useSecuritySetting'
import { emailCode, smsCode } from '@/apis/index'
import { closeGoogleAuth, openGoogleAuth } from '@/apis/user'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const router = useRouter()
const { t } = useI18n()
const { settingInfo, updateSettingInfo } = useSecuritySetting()

const verify = ref(false)
const checked = ref(true)
const startSmsCountDown = ref(false)
const startEmailCountDown = ref(false)
const form = reactive({
	smsCode: '',
	emailCode: '',
	googleCode: ''
})

watch(
	() => settingInfo.value,
	() => {
		checked.value = settingInfo.value.isGoogleAuth
	},
	{
		deep: true,
		immediate: true
	}
)

const show = defineModel('show', { default: false })

const onUpdateChecked = () => {
	show.value = false
	verify.value = true
}

const disabled2_pb = computed(() => {
	let flag = false

	flag = !form.googleCode
	if (flag) {
		return true
	}
	if (settingInfo.value.isMobileAuth) {
		flag = !form.smsCode
		if (flag) {
			return true
		}
	}
	if (settingInfo.value.isEmailAuth) {
		flag = !form.emailCode
		if (flag) {
			return true
		}
	}
	return flag
})

const sendCode = async (operateType: number, type?: string) => {
	const params: any = { operateType }
	if (type === 'sms') {
		const { code, message }: any = await smsCode(params)
		if (code === 0) {
			showSuccessToast(message)
		} else {
			startSmsCountDown.value = false
			showFailToast(message)
		}
	} else {
		const { code, message }: any = await emailCode(params)
		if (code === 0) {
			showSuccessToast(message)
		} else {
			startEmailCountDown.value = false
			showFailToast(message)
		}
	}
}

const reset = () => {
	router.push('/user/security-setting/google')
}

const cancel = () => {
	verify.value = false
	form.emailCode = ''
	form.googleCode = ''
	form.smsCode = ''
}

const changeGoogle = async () => {
	if (checked.value) {
		const params: any = {
			codes: form.googleCode
		}
		if (settingInfo.value.isMobileAuth) {
			params.smsCode = form.smsCode
		}
		if (settingInfo.value.isEmailAuth) {
			params.emailCode = form.emailCode
		}
		const { code, message }: any = await closeGoogleAuth(params)
		if (code === 0) {
			await updateSettingInfo()
			cancel()
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	} else {
		const params: any = {
			codes: form.googleCode
		}
		if (settingInfo.value.isMobileAuth) {
			params.smsCode = form.smsCode
		}
		if (settingInfo.value.isEmailAuth) {
			params.emailCode = form.emailCode
		}
		const { code, message }: any = await openGoogleAuth(params)
		if (code === 0) {
			await updateSettingInfo()
			cancel()
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	}
}
</script>

<template>
	<Dialog v-model:show="show" :title="t('text45')" width="390px">
		<div class="p-4">
			<div class="pb-3">
				<div class="flex justify-center">
					<icon
						:name="themeStore.theme === 'light' ? 'user-center/icon27' : 'user-center/icon27_dark'"
						:size="64"
						class="text-text-brand" />
				</div>
				<div class="pt-6 flex justify-center text-text-description text-style-web-small-regular">
					{{ t('text46') }}
				</div>
				<div class="pt-[10px] text-center text-text-primary text-style-web-h3-medium">
					{{ t('text47') }} {{ settingInfo.googleDate }}
				</div>
			</div>
			<div class="flex justify-between items-center py-5">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('my.txt63') }}</div>
				<van-switch
					:model-value="checked"
					@update:model-value="onUpdateChecked"
					:size="16"
					inactive-color="#303030"
					active-color="#1754F8" />
			</div>
			<div @click="reset" class="flex justify-between items-center py-5">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('text48') }}</div>
				<icon name="user-center/icon26" :size="20" class="text-text-primary" />
			</div>
		</div>
	</Dialog>

	<Dialog :title="t('text33')" v-model:show="verify" width="390px" @cancel="cancel">
		<div class="px-4 py-6 relative">
			<div class="text-text-description text-style-web-small-regular absolute -top-[10px]">
				{{ t('text34') }}
			</div>
			<InputPaste v-model="form.googleCode" class="mt-3" :placeholder="t('my.txt138')" />
			<InputCountDown
				v-if="settingInfo.isMobileAuth"
				v-model:start="startSmsCountDown"
				v-model="form.smsCode"
				@send="sendCode(checked ? 20 : 21, 'sms')"
				class="mt-3"
				:placeholder="t('my.txt120')" />
			<InputCountDown
				v-if="settingInfo.isEmailAuth"
				v-model:start="startEmailCountDown"
				v-model="form.emailCode"
				@send="sendCode(checked ? 20 : 21, 'email')"
				class="mt-3"
				:placeholder="t('my.txt119')" />
		</div>
		<div class="py-5 px-4 border-t border-border-strong flex">
			<Button size="small" plain class="mr-4" @click="cancel">{{ t('my.txt37') }}</Button>
			<Button size="small" @click="changeGoogle" :disabled="disabled2_pb">
				{{ t('my.txt38') }}
			</Button>
		</div>
	</Dialog>
</template>
