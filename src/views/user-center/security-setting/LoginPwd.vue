<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'

import PopupRight from '../components/popup-right/index.vue'
import Input from '@/components/base/input/index.vue'
import InputCountDown from '@/components/base/input-count-down/index.vue'
import Tip from '@/components/base/tip/index.vue'
import Button from '@/components/base/button/index.vue'
import { Dialog, PopupBottom, InputPaste } from '@/components/base'

import { useUserStore } from '@/store/useUserStore'
import { useDevice } from '@/hooks/useDevice'

import { updatePassword } from '@/apis/user'
import { emailCode, smsCode } from '@/apis/index'
import { reg } from '@/utils/reg'

const { isPh, isPC } = useDevice()
const { t } = useI18n()
const show = defineModel('show', { default: true })
const emits = defineEmits(['back'])
const userStore = useUserStore()
const verify = ref(false)

const form = reactive({
	oldPassword: '',
	newPassword: '',
	confirmPassword: '',
	code: '',
	googleCode: '',
	smsCode: ''
})

const props = defineProps({
	settingInfo: {
		type: Object,
		default: () => ({})
	}
})

const isMobileAuth = computed(() => props.settingInfo.isMobileAuth)
const isEmailAuth = computed(() => props.settingInfo.isEmailAuth)
const isGoogleAuth = computed(() => props.settingInfo.isGoogleAuth)

const items = reactive([
	{
		title: t('my.txt57'),
		path: '/user'
	},
	{
		title: t('my.txt42'),
		path: 'back'
	},
	{
		title: t('my.txt126')
	}
])

const disabled = computed(() => {
	return !(form.oldPassword && form.newPassword && form.confirmPassword)
})

const disabled1 = computed(() => {
	if (isGoogleAuth.value) {
		if (!form.googleCode) {
			return true
		}
	}
	if (isMobileAuth.value) {
		if (!form.smsCode) {
			return true
		}
	}
	if (isEmailAuth.value) {
		if (!form.code) {
			return true
		}
	}

	if (!(form.oldPassword && form.newPassword && form.confirmPassword)) {
		return true
	}

	// if (isMobileAuth.value && isEmailAuth.value) {
	// 	return !(
	// 		form.oldPassword &&
	// 		form.newPassword &&
	// 		form.confirmPassword &&
	// 		form.code &&
	// 		form.smsCode
	// 	)
	// } else if (isMobileAuth.value) {
	// 	return !(form.oldPassword && form.newPassword && form.confirmPassword && form.smsCode)
	// } else if (isEmailAuth.value) {
	// 	return !(form.oldPassword && form.newPassword && form.confirmPassword && form.code)
	// }
	return false
})

const popupHieght = computed(() => {
	let h = 194
	if (props.settingInfo.isEmailAuth) {
		h = h + 66
	}
	if (props.settingInfo.isMobileAuth) {
		h = h + 66
	}
	if (props.settingInfo.isGoogleAuth) {
		h = h + 66
	}

	return h + 'px'
})

const onBack = (item: any) => {
	show.value = false
	if (item.go === -2) {
		emits('back')
	}
}

const sendCode = async (operateType: number, type: string) => {
	const params = { operateType }
	if (type === 'sms') {
		const { code, message }: any = await smsCode(params)
		if (code === 0) {
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	} else {
		const { code, message }: any = await emailCode(params)
		if (code === 0) {
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	}
}

const submit = async () => {
	if (form.confirmPassword === form.newPassword) {
		const params: any = {
			oldPassword: form.oldPassword,
			newPassword: form.newPassword
		}
		if (isMobileAuth.value) {
			params.smsCode = form.smsCode
		}
		if (isEmailAuth.value) {
			params.code = form.code
		}
		if (isGoogleAuth.value) {
			params.googleCode = form.googleCode
		}
		const res: any = await updatePassword(params)
		if (res.code === 0) {
			showSuccessToast(res.message)
			userStore.logout()
		} else {
			showFailToast(res.message)
		}
	} else {
		showFailToast(t('register.txt15'))
	}
}

const cancel = () => {
	verify.value = false
	form.code = ''
	form.confirmPassword = ''
	form.newPassword = ''
	form.oldPassword = ''
	form.smsCode = ''
	form.googleCode = ''
}

const onVerify = () => {
	if (form.newPassword !== form.confirmPassword) {
		showFailToast(t('register.txt15'))
		return
	}
	if (!reg.pwdRegex.test(form.newPassword)) {
		showFailToast(t('text55'))
		return
	}
	if (isPC.value) {
		show.value = false
	}
	verify.value = true
}
</script>

<template>
	<div v-if="isPh">
		<PopupRight v-model:show="show" :items="items" @back="onBack">
			<div class="py-6 px-4">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt126') }}</div>

				<Tip class="mt-3" width="100%" type="warning">
					{{ t('my.txt127') }}
				</Tip>

				<Input v-model="form.oldPassword" class="mt-3" :placeholder="t('my.txt128')" />

				<Input v-model="form.newPassword" class="mt-3" :placeholder="t('my.txt129')" />

				<Input v-model="form.confirmPassword" class="mt-3" :placeholder="t('my.txt118')" />

				<!-- <InputCountDown
				v-if="isMobileAuth"
				v-model="form.smsCode"
				@send="sendCode(6, 'sms')"
				class="mt-3"
				:placeholder="t('my.txt143')" />

			<InputCountDown
				v-if="isEmailAuth"
				v-model="form.code"
				@send="sendCode(6, 'email')"
				class="mt-3"
				:placeholder="t('my.txt119')" /> -->

				<Button @click="onVerify" :disabled="disabled" class="mt-6">
					{{ t('my.txt130') }}
				</Button>
			</div>
		</PopupRight>
		<PopupBottom
			:title="t('text33')"
			:title2="t('text34')"
			v-model:show="verify"
			:height="popupHieght">
			<InputPaste
				v-if="settingInfo.isGoogleAuth"
				v-model="form.googleCode"
				class="mt-3"
				:placeholder="t('my.txt138')" />

			<InputCountDown
				v-if="isMobileAuth"
				v-model="form.smsCode"
				@send="sendCode(6, 'sms')"
				class="mt-3"
				:placeholder="t('my.txt143')" />

			<InputCountDown
				v-if="isEmailAuth"
				v-model="form.code"
				@send="sendCode(6, 'email')"
				class="mt-3"
				:placeholder="t('my.txt119')" />
			<template v-slot:bottom>
				<Button size="small" plain class="mr-4" @click="cancel">{{ t('my.txt37') }}</Button>
				<Button :disabled="disabled1" @click="submit" size="small">
					{{ t('my.txt38') }}
				</Button>
			</template>
		</PopupBottom>
	</div>

	<div v-else>
		<Dialog v-model:show="show" :title="t('my.txt126')" width="390px" @cancel="cancel">
			<div class="p-4 pt-0">
				<Tip width="100%" type="warning">
					{{ t('my.txt127') }}
				</Tip>

				<Input v-model="form.oldPassword" class="mt-3" :placeholder="t('my.txt128')" />

				<Input v-model="form.newPassword" class="mt-3" :placeholder="t('my.txt129')" />

				<Input v-model="form.confirmPassword" class="mt-3" :placeholder="t('my.txt118')" />

				<Button @click="onVerify" :disabled="disabled" class="mt-6" size="small">
					{{ t('my.txt130') }}
				</Button>
			</div>
		</Dialog>

		<Dialog :title="t('text33')" v-model:show="verify" width="390px" @cancel="cancel">
			<div class="px-4 py-6 relative">
				<div class="text-text-description text-style-web-small-regular absolute -top-[10px]">
					{{ t('text34') }}
				</div>
				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />

				<InputCountDown
					v-if="isMobileAuth"
					v-model="form.smsCode"
					@send="sendCode(6, 'sms')"
					class="mt-3"
					:placeholder="t('my.txt143')" />

				<InputCountDown
					v-if="isEmailAuth"
					v-model="form.code"
					@send="sendCode(6, 'email')"
					class="mt-3"
					:placeholder="t('my.txt119')" />
			</div>
			<div class="py-5 px-4 border-t border-border-strong flex">
				<Button size="small" plain class="mr-2" @click="cancel">{{ t('my.txt37') }}</Button>
				<Button :disabled="disabled1" @click="submit" size="small">
					{{ t('my.txt38') }}
				</Button>
			</div>
		</Dialog>
	</div>
</template>
