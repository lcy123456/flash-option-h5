<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import {
	showSuccessToast,
	showFailToast,
	showLoadingToast,
	showToast
} from '@/components/base/toast'
import {
	Breadcrumb,
	Input,
	Button,
	PopupBottom,
	InputCountDown,
	InputPaste,
	Tip,
	Dialog
} from '@/components/base'
import { isEmail } from '@/utils'
import { emailCode, smsCode } from '@/apis/index'
import { unbindEmail, openEmail, updateEmail, bindEmail } from '@/apis/user'
import { useSecuritySetting } from '@/hooks/useSecuritySetting'

import { useDevice } from '@/hooks/useDevice'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const open = defineModel('open', { default: false })

const { settingInfo, updateSettingInfo } = useSecuritySetting()

const { isPh } = useDevice()
const { t } = useI18n()
const step = ref(1) // 1:绑定 2:已经绑定 3:修改绑定邮箱
const form = reactive({
	email: '',
	code: '',
	smsCode: '',
	emailCode: '',
	googleCode: '',
	oldCode: ''
})
const show = ref(false)
const startSmsCountDown = ref(false)
const startEmailCountDown = ref(false)

const startOldEmailCountDown = ref(false)
const startNewEmailCountDown = ref(false)
const checked = ref(true)
const items = reactive([
	{
		title: t('my.txt57'),
		path: '/user'
	},
	{
		title: t('my.txt42'),
		path: '/user/security-setting'
	},
	{
		title: t('my.txt69')
	}
])

onBeforeMount(async () => {
	const toast: any = showLoadingToast({ message: t('flw.txt113'), loadingType: 'spinner' })
	await updateSettingInfo()
	toast.close()
})

watch(
	() => settingInfo.value,
	() => {
		if (settingInfo.value.email) {
			step.value = 2
		}
		checked.value = settingInfo.value.isEmailAuth
	},
	{
		deep: true,
		immediate: true
	}
)
watch(
	() => show.value,
	() => {
		if (!show.value) {
			form.code = ''
			form.smsCode = ''
			form.emailCode = ''
			form.googleCode = ''
			form.oldCode = ''
		}
	}
)

const disabled = computed(() => !isEmail(form.email))
const disabled1 = computed(() => {
	if (settingInfo.value.isGoogleAuth) {
		return !(form.emailCode && form.smsCode && form.googleCode)
	}
	return !(form.emailCode && form.smsCode)
})
const disabled2 = computed(() => {
	if (settingInfo.value.isGoogleAuth) {
		return !(form.emailCode && form.smsCode && form.googleCode)
	}
	return !(form.emailCode && form.smsCode)
})
const disabled3 = computed(() => {
	let flag = false
	flag = !form.oldCode
	if (flag) {
		return true
	}
	flag = !form.code
	if (flag) {
		return true
	}
	if (settingInfo.value.isMobileAuth) {
		flag = !form.smsCode
		if (flag) {
			return true
		}
	}
	if (settingInfo.value.isGoogleAuth) {
		flag = !form.googleCode
		if (flag) {
			return true
		}
	}
	return flag
})
const popupHieght = computed(() => {
	let h = 194
	if (step.value === 3) {
		h = h + 66 * 2
		if (settingInfo.value.isMobileAuth) {
			h = h + 66
		}
		if (settingInfo.value.isGoogleAuth) {
			h = h + 66
		}
	}
	if (step.value === 2 || step.value === 1) {
		h = h + 66 * 2
		if (settingInfo.value.isGoogleAuth) {
			h = h + 66
		}
	}
	return h + 'px'
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

const sendOldEmailCode = async (operateType: number) => {
	const params: any = { operateType }
	const { code, message }: any = await emailCode(params)
	if (code === 0) {
		showSuccessToast(message)
	} else {
		startOldEmailCountDown.value = false
		showFailToast(message)
	}
}

const sendNewEmailCode = async (operateType: number) => {
	const params: any = { operateType, email: form.email }
	const { code, message }: any = await emailCode(params)
	if (code === 0) {
		showSuccessToast(message)
	} else {
		startNewEmailCountDown.value = false
		showFailToast(message)
	}
}

const cancel = () => {
	show.value = false
	form.googleCode = ''
	form.code = ''
	form.email = ''
	form.emailCode = ''
	form.smsCode = ''
	form.oldCode = ''
}

const onUpdateChecked = () => {
	console.log('settingInfo.isMobileAuth', settingInfo.value.isMobileAuth)
	if (checked.value && !settingInfo.value.isMobileAuth) {
		showToast(t('text39'))
	} else {
		show.value = true
	}
}

const addEmail = async () => {
	const params: any = {
		email: form.email,
		code: form.emailCode,
		smsCode: form.smsCode
	}
	if (settingInfo.value.isGoogleAuth) {
		params.googleCode = form.googleCode
	}
	const { code, message }: any = await bindEmail(params)
	if (code === 0) {
		await updateSettingInfo()
		cancel()
		open.value = false
		showSuccessToast(message)
	} else {
		showFailToast(message)
	}
}

const modifyEmail = async () => {
	const params: any = {
		oldCode: form.oldCode,
		email: form.email,
		code: form.code
	}
	if (settingInfo.value.isGoogleAuth) {
		params.googleCode = form.googleCode
	}
	if (settingInfo.value.isMobileAuth) {
		params.smsCode = form.smsCode
	}
	const { code, message }: any = await updateEmail(params)
	if (code === 0) {
		await updateSettingInfo()
		cancel()
		open.value = false
		showSuccessToast(message)
	} else {
		showFailToast(message)
	}
}

const changeEmail = async () => {
	if (checked.value) {
		const params: any = {
			code: form.smsCode,
			emailCode: form.emailCode
		}
		if (settingInfo.value.isGoogleAuth) {
			params.googleCode = form.googleCode
		}
		const { code, message }: any = await unbindEmail(params)
		if (code === 0) {
			await updateSettingInfo()
			cancel()
			open.value = false
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	} else {
		const params: any = {
			smsCode: form.smsCode,
			code: form.emailCode
		}
		if (settingInfo.value.isGoogleAuth) {
			params.googleCode = form.googleCode
		}
		const { code, message }: any = await openEmail(params)
		if (code === 0) {
			await updateSettingInfo()
			cancel()
			open.value = false
			show.value = false
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	}
}

const onCancel = () => {
	if (step.value === 3) {
		step.value = 2
	}
	open.value = false
	show.value = false
	cancel()
}
</script>

<template>
	<div v-if="isPh">
		<Breadcrumb :items="items" />

		<div class="px-4 py-6" v-if="step === 1">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt145') }}</div>
			<Input v-model="form.email" class="mt-3" :placeholder="t('my.txt150')" />
			<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
		</div>

		<div class="px-4 py-6" v-if="step === 2">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt69') }}</div>
			<div class="py-3">
				<div class="flex justify-center">
					<icon
						:name="themeStore.theme === 'light' ? 'user-center/icon25' : 'user-center/icon25_dark'"
						:size="64"
						class="text-text-brand" />
				</div>
				<div class="pt-6 flex justify-center text-text-description text-style-web-small-regular">
					{{ t('text35') }}
				</div>
				<div class="pt-[10px] text-center text-text-primary text-style-web-h3-medium">
					{{ settingInfo.email }}
				</div>
			</div>
			<div class="flex justify-between items-center py-5">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('my.txt69') }}</div>
				<van-switch
					:model-value="checked"
					@update:model-value="onUpdateChecked"
					:size="16"
					inactive-color="#F0F0F0"
					active-color="#1754F8" />
			</div>
			<div @click="step = 3" class="flex justify-between items-center py-5">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('text36') }}</div>
				<icon name="user-center/icon26" :size="20" class="text-text-primary" />
			</div>
		</div>

		<div class="px-4 py-6" v-if="step === 3">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt144') }}</div>
			<Tip class="mt-3" width="100%" type="warning">
				{{ t('my.txt147') }}
			</Tip>
			<Input v-model="form.email" class="mt-3" :placeholder="t('my.txt149')" />
			<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
		</div>

		<PopupBottom
			:title="t('text33')"
			:title2="t('text34')"
			v-model:show="show"
			:height="popupHieght">
			<div v-if="step === 1">
				<InputCountDown
					v-model:start="startNewEmailCountDown"
					v-model="form.emailCode"
					@send="sendNewEmailCode(3)"
					class="mt-3"
					:placeholder="t('my.txt151')" />
				<InputCountDown
					v-model:start="startSmsCountDown"
					v-model="form.smsCode"
					@send="sendCode(16, 'sms')"
					class="mt-3"
					:placeholder="t('my.txt120')" />

				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />
			</div>

			<div v-if="step === 2">
				<InputCountDown
					v-model:start="startEmailCountDown"
					v-model="form.emailCode"
					@send="sendCode(checked ? 17 : 14, 'email')"
					class="mt-3"
					:placeholder="t('my.txt119')" />
				<InputCountDown
					v-model:start="startSmsCountDown"
					v-model="form.smsCode"
					@send="sendCode(checked ? 13 : 18, 'sms')"
					class="mt-3"
					:placeholder="t('my.txt120')" />

				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />
			</div>

			<div v-if="step === 3">
				<InputCountDown
					v-model:start="startOldEmailCountDown"
					v-model="form.oldCode"
					@send="sendOldEmailCode(4)"
					class="mt-3"
					:placeholder="t('my.txt148')" />
				<InputCountDown
					v-model:start="startNewEmailCountDown"
					v-model="form.code"
					@send="sendNewEmailCode(3)"
					class="mt-3"
					:placeholder="t('my.txt151')" />
				<InputCountDown
					v-if="settingInfo.isMobileAuth"
					v-model:start="startSmsCountDown"
					v-model="form.smsCode"
					@send="sendCode(15, 'sms')"
					class="mt-3"
					:placeholder="t('my.txt120')" />

				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />
			</div>
			<template v-slot:bottom>
				<Button size="small" plain class="mr-4" @click="cancel">{{ t('my.txt37') }}</Button>
				<Button v-if="step === 1" :disabled="disabled1" @click="addEmail" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 2" :disabled="disabled2" @click="changeEmail" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 3" :disabled="disabled3" @click="modifyEmail" size="small">
					{{ t('my.txt38') }}
				</Button>
			</template>
		</PopupBottom>
	</div>
	<div v-else-if="open">
		<Dialog :show="step === 1 && !show" :title="t('my.txt145')" width="390px" @cancel="onCancel">
			<div class="p-4">
				<Input v-model="form.email" :placeholder="t('my.txt150')" />
				<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
			</div>
		</Dialog>

		<Dialog :show="step === 2 && !show" :title="t('my.txt69')" width="390px" @cancel="onCancel">
			<div class="p-4">
				<div class="pb-3">
					<div class="flex justify-center">
						<icon
							:name="
								themeStore.theme === 'light' ? 'user-center/icon25' : 'user-center/icon25_dark'
							"
							:size="64"
							class="text-text-brand" />
					</div>
					<div class="pt-6 flex justify-center text-text-description text-style-web-small-regular">
						{{ t('text35') }}
					</div>
					<div class="pt-[10px] text-center text-text-primary text-style-web-h3-medium">
						{{ settingInfo.email }}
					</div>
				</div>
				<div class="flex justify-between items-center py-5">
					<div class="text-text-tertiary text-style-web-h4-medium">{{ t('my.txt69') }}</div>
					<van-switch
						:model-value="checked"
						@update:model-value="onUpdateChecked"
						:size="16"
						inactive-color="#F0F0F0"
						active-color="#1754F8" />
				</div>
				<div @click="step = 3" class="flex justify-between items-center py-5">
					<div class="text-text-tertiary text-style-web-h4-medium">{{ t('text36') }}</div>
					<icon name="user-center/icon26" :size="20" class="text-text-primary" />
				</div>
			</div>
		</Dialog>

		<Dialog :show="step === 3 && !show" :title="t('my.txt144')" width="390px" @cancel="onCancel">
			<div class="p-4 pt-0">
				<Tip width="100%" type="warning">
					{{ t('my.txt147') }}
				</Tip>
				<Input v-model="form.email" class="mt-3" :placeholder="t('my.txt149')" />
				<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
			</div>
		</Dialog>

		<Dialog :title="t('text33')" v-model:show="show" width="390px" @cancel="onCancel">
			<div class="px-4 py-6 relative">
				<div class="text-text-description text-style-web-small-regular absolute -top-[10px]">
					{{ t('text34') }}
				</div>
				<div v-if="step === 1">
					<InputCountDown
						v-model:start="startNewEmailCountDown"
						v-model="form.emailCode"
						@send="sendNewEmailCode(3)"
						class="mt-3"
						:placeholder="t('my.txt151')" />
					<InputCountDown
						v-model:start="startSmsCountDown"
						v-model="form.smsCode"
						@send="sendCode(16, 'sms')"
						class="mt-3"
						:placeholder="t('my.txt120')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />
				</div>

				<div v-if="step === 2">
					<InputCountDown
						v-model:start="startEmailCountDown"
						v-model="form.emailCode"
						@send="sendCode(checked ? 17 : 14, 'email')"
						class="mt-3"
						:placeholder="t('my.txt119')" />
					<InputCountDown
						v-model:start="startSmsCountDown"
						v-model="form.smsCode"
						@send="sendCode(checked ? 13 : 18, 'sms')"
						class="mt-3"
						:placeholder="t('my.txt120')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />
				</div>

				<div v-if="step === 3">
					<InputCountDown
						v-model:start="startOldEmailCountDown"
						v-model="form.oldCode"
						@send="sendOldEmailCode(4)"
						class="mt-3"
						:placeholder="t('my.txt148')" />
					<InputCountDown
						v-model:start="startNewEmailCountDown"
						v-model="form.code"
						@send="sendNewEmailCode(3)"
						class="mt-3"
						:placeholder="t('my.txt151')" />
					<InputCountDown
						v-if="settingInfo.isMobileAuth"
						v-model:start="startSmsCountDown"
						v-model="form.smsCode"
						@send="sendCode(15, 'sms')"
						class="mt-3"
						:placeholder="t('my.txt120')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />
				</div>
			</div>
			<div class="py-5 px-4 border-t border-border-strong flex">
				<Button size="small" plain class="mr-4" @click="cancel">{{ t('my.txt37') }}</Button>
				<Button v-if="step === 1" :disabled="disabled1" @click="addEmail" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 2" :disabled="disabled2" @click="changeEmail" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 3" :disabled="disabled3" @click="modifyEmail" size="small">
					{{ t('my.txt38') }}
				</Button>
			</div>
		</Dialog>
	</div>
</template>
