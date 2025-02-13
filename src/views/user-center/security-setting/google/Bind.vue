<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import useClipboard from 'vue-clipboard3'

import Button from '@/components/base/button/index.vue'
import InputPaste from '@/components/base/input-paste/index.vue'
import InputCountDown from '@/components/base/input-count-down/index.vue'

import { emailCode, smsCode } from '@/apis/index'
import { bindGoogleAuth } from '@/apis/user'
import { useUserStore } from '@/store/useUserStore'
import { useDevice } from '@/hooks/useDevice'
import { routeTo } from '@/utils/routeTo'

const { isWeb } = useDevice()
const { t } = useI18n()
const { toClipboard } = useClipboard()

const props = defineProps({
	data: {
		type: Object,
		default: () => ({})
	},
	settingInfo: {
		type: Object,
		default: () => ({})
	}
})

// const googleCode = ref('')
// const password = ref('')
const form = reactive({
	smsCode: '',
	googleCode: '',
	emailCode: ''
})
const startSmsCountDown = ref(false)
const startEmailCountDown = ref(false)
const userStore = useUserStore()

const copy = () => {
	toClipboard(props.data.secret)
	showSuccessToast(t('register.txt14'))
}

const disabled = computed(() => {
	let flag = false
	flag = !form.googleCode
	if (flag) {
		return true
	}
	if (props.settingInfo.isMobileAuth) {
		flag = !form.smsCode
		if (flag) {
			return true
		}
	}
	if (props.settingInfo.isEmailAuth) {
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

const submit = async () => {
	const params: any = {
		codes: form.googleCode,
		secret: props.data.secret
		// password: password.value
	}
	if (props.settingInfo.isMobileAuth) {
		params.smsCode = form.smsCode
	}
	if (props.settingInfo.isEmailAuth) {
		params.emailCode = form.emailCode
	}
	const res: any = await bindGoogleAuth(params)
	if (res.code === 0) {
		showSuccessToast(res.message)
		await userStore.initSettingInfo()
		if (isWeb.value) {
			routeTo('/user/security-setting')
		}
	}
}
</script>

<template>
	<div>
		<div class="pt-6">
			<div class="flex items-center">
				<div
					class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center bg-brand-blue">
					1
				</div>
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt105') }}</div>
			</div>
			<div class="flex">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('my.txt106') }}
					</div>
					<div class="flex mt-3">
						<div
							class="w-[134px] mr-2 border border-border-strong rounded-[6px] p-3 flex items-center box-border">
							<base-icon name="apple" :size="24" class="text-text-primary" />
							<div class="ml-2 text-text-primary text-style-web-body-bold">App Store</div>
						</div>

						<div
							class="w-[139px] border border-border-strong rounded-[6px] p-3 flex items-center box-border">
							<base-icon name="google" :size="24" class="text-text-primary" />
							<div class="ml-2 text-text-primary text-style-web-body-bold">Google Play</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div
					class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center bg-brand-blue">
					2
				</div>
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt107') }}</div>
			</div>
			<div class="flex">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('my.txt108') }}
					</div>
					<div class="py-3 text-text-warning text-style-web-base-regular">
						{{ t('my.txt109') }}
					</div>
					<div class="w-[120px] h-[120px]">
						<img :src="data.qrBarcode" alt="" />
					</div>
					<div class="py-2 text-text-description text-style-web-body-regular">
						{{ t('my.txt110') }}
					</div>
					<div class="flex items-center" @click="copy">
						<div class="text-text-primary text-style-web-body-regular mr-3">
							{{ data.secret }}
						</div>
						<base-icon name="copy" :size="20" class="text-text-primary" />
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div
					class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center bg-brand-blue">
					3
				</div>
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt111') }}</div>
			</div>
			<div class="flex">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1">
					<InputPaste
						v-model="form.googleCode"
						class="mt-3"
						inputClass="bg-background-secondary"
						:placeholder="t('my.txt112')" />
					<InputCountDown
						v-if="settingInfo.isMobileAuth"
						v-model="form.smsCode"
						class="mt-3"
						inputClass="bg-background-secondary"
						v-model:start="startSmsCountDown"
						@send="sendCode(5, 'sms')"
						:placeholder="t('my.txt120')" />
					<InputCountDown
						v-if="settingInfo.isEmailAuth"
						v-model="form.emailCode"
						class="mt-3"
						inputClass="bg-background-secondary"
						v-model:start="startEmailCountDown"
						@send="sendCode(5, 'email')"
						:placeholder="t('my.txt119')" />

					<!-- <Input
						v-model="password"
						class="mt-3"
						inputClass="bg-background-secondary"
						:placeholder="t('my.txt114')" /> -->

					<Button :disabled="disabled" @click="submit" class="mt-3">{{ t('my.txt67') }}</Button>
				</div>
			</div>
		</div>
	</div>
</template>
