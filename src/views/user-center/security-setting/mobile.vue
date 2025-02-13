<script setup lang="ts">
import { reactive, ref, computed, watchEffect, watch, onBeforeMount } from 'vue'
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
import CountryMenu from '@/components/base/country-menu/index.vue'
import { emailCode, smsCode } from '@/apis/index'
import { isPhone } from '@/utils'
import { useUserStore } from '@/store/useUserStore'
import { useSecuritySetting } from '@/hooks/useSecuritySetting'
import { bindPhone, updatePhone, unbindPhone, openPhone } from '@/apis/user'
import { useThemeStore } from '@/store/useThemeStore'

import { useDevice } from '@/hooks/useDevice'

const open = defineModel('open', { default: false })

const themeStore = useThemeStore()
const { settingInfo, updateSettingInfo } = useSecuritySetting()
const userStore = useUserStore()
const { t } = useI18n()
const { isPh } = useDevice()
const step = ref(1) // 1:绑定 2:已经绑定 3:修改绑定手机
const form = reactive({
	phone: '',
	code: '',
	smsCode: '',
	googleCode: '',
	emailCode: '',
	oldCode: ''
})
const show = ref(false)
const startSmsCountDown = ref(false)
const startNewSmsCountDown = ref(false)
const startEmailCountDown = ref(false)
const startOldSmsCountDown = ref(false)
const checked = ref(true)
const areaCode = ref('')
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
		title: t('my.txt71')
	}
])

watch(
	() => settingInfo.value,
	() => {
		if (settingInfo.value.mobilePhone) {
			step.value = 2
		}
		checked.value = settingInfo.value.isMobileAuth
	},
	{
		deep: true,
		immediate: true
	}
)

const disabled = computed(() => !isPhone(form.phone))
const disabled1 = computed(() => {
	if (settingInfo.value.isGoogleAuth) {
		return !(form.code && form.emailCode && form.googleCode)
	}
	return !(form.code && form.emailCode)
})
const disabled2 = computed(() => {
	if (settingInfo.value.isGoogleAuth) {
		return !(form.code && form.emailCode && form.googleCode)
	}
	return !(form.code && form.emailCode)
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

	if (settingInfo.value.isEmailAuth) {
		flag = !form.emailCode
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
	if (step.value === 1 || step.value === 2) {
		h = h + 66 * 2
	}
	if (step.value === 3) {
		h = h + 66 * 2
		if (settingInfo.value.isEmailAuth) {
			h = h + 66
		}
	}
	if (settingInfo.value.isGoogleAuth) {
		h = h + 66
	}
	return h + 'px'
})

onBeforeMount(async () => {
	console.log('1111')
	userStore.initCountryList()
	if (isPh) {
		const toast: any = showLoadingToast({ message: t('flw.txt113'), loadingType: 'spinner' })
		await updateSettingInfo()
		toast.close()
	} else {
		await updateSettingInfo()
	}
})

watchEffect(() => {
	const list: any = userStore.countryList
	if (Array.isArray(list) && list.length) {
		areaCode.value = list[0].areaCode
	}
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

const sendNewSmsCode = async (operateType: number) => {
	const params: any = {
		operateType,
		phone: form.phone,
		country: areaCode.value
	}
	const { code, message }: any = await smsCode(params)
	if (code === 0) {
		showSuccessToast(message)
	} else {
		startNewSmsCountDown.value = false
		showFailToast(message)
	}
}

const sendOldSmsCode = async (operateType: number) => {
	const params = {
		operateType
	}
	const { code, message }: any = await smsCode(params)
	if (code === 0) {
		showSuccessToast(message)
	} else {
		startOldSmsCountDown.value = false
		showFailToast(message)
	}
}

const cancel = () => {
	show.value = false
	form.googleCode = ''
	form.code = ''
	form.emailCode = ''
	form.oldCode = ''
	form.phone = ''
	form.smsCode = ''
	startSmsCountDown.value = false
	startNewSmsCountDown.value = false
	startEmailCountDown.value = false
	startOldSmsCountDown.value = false
}

const addMobilePhone = async () => {
	const params: any = {
		country: areaCode.value,
		phone: form.phone,
		code: form.code,
		emailCode: form.emailCode
	}
	if (settingInfo.value.isGoogleAuth) {
		params.googleCode = form.googleCode
	}
	const { code, message }: any = await bindPhone(params)
	if (code === 0) {
		await updateSettingInfo()
		cancel()
		open.value = false
		showSuccessToast(message)
	} else {
		showFailToast(message)
	}
}

const updateMobilePhone = async () => {
	const params: any = {
		oldCode: form.oldCode,
		phone: form.phone,
		code: form.code,
		country: areaCode.value
	}
	if (settingInfo.value.isEmailAuth) {
		params.emailCode = form.emailCode
	}
	if (settingInfo.value.isGoogleAuth) {
		params.googleCode = form.googleCode
	}
	const { code, message }: any = await updatePhone(params)
	if (code === 0) {
		await updateSettingInfo()
		cancel()
		open.value = false
		showSuccessToast(message)
	} else {
		showFailToast(message)
	}
}

const changeMobilePhone = async () => {
	if (checked.value) {
		const params: any = {
			smsCode: form.code,
			code: form.emailCode
		}
		if (settingInfo.value.isGoogleAuth) {
			params.googleCode = form.googleCode
		}
		const { code, message }: any = await unbindPhone(params)
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
			code: form.code,
			emailCode: form.emailCode
		}
		if (settingInfo.value.isGoogleAuth) {
			params.googleCode = form.googleCode
		}
		const { code, message }: any = await openPhone(params)
		if (code === 0) {
			await updateSettingInfo()
			cancel()
			open.value = false
			showSuccessToast(message)
		} else {
			showFailToast(message)
		}
	}
}

const onUpdateChecked = () => {
	if (checked.value && !settingInfo.value.isEmailAuth) {
		showToast(t('text39'))
	} else {
		console.log('s', step.value)
		show.value = true
	}
}

const onCancel = () => {
	if (step.value === 3) {
		step.value = 2
	}
	open.value = false
	cancel()
}
</script>

<template>
	<div v-if="isPh">
		<Breadcrumb :items="items" />

		<div class="px-4 py-6" v-if="step === 1">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt136') }}</div>
			<Input v-model="form.phone" class="mt-3" :placeholder="t('my.txt137')">
				<template v-slot:prefix>
					<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
				</template>
			</Input>
			<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
		</div>

		<div class="px-4 py-6" v-if="step === 2">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt71') }}</div>
			<div class="py-3">
				<div class="flex justify-center">
					<icon
						:name="themeStore.theme === 'light' ? 'user-center/icon28' : 'user-center/icon28_dark'"
						:size="64"
						class="text-text-brand" />
				</div>
				<div class="pt-6 flex justify-center text-text-description text-style-web-small-regular">
					{{ t('text31') }}
				</div>
				<div class="pt-[10px] text-center text-text-primary text-style-web-h3-medium">
					{{ settingInfo.mobilePhone }}
				</div>
			</div>
			<div class="flex justify-between items-center py-5">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('my.txt71') }}</div>
				<van-switch
					:model-value="checked"
					@update:model-value="onUpdateChecked"
					:size="16"
					active-color="text-text-brand" />
			</div>
			<div class="flex justify-between items-center py-5" @click="step = 3">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('text32') }}</div>
				<icon name="user-center/icon26" :size="20" class="text-text-primary" />
			</div>
		</div>

		<div class="px-4 py-6" v-if="step === 3">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt155') }}</div>
			<Tip class="mt-3" width="100%" type="warning">
				{{ t('my.txt157') }}
			</Tip>
			<Input v-model="form.phone" class="mt-3" :placeholder="t('my.txt159')">
				<template v-slot:prefix>
					<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
				</template>
			</Input>
			<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
		</div>

		<PopupBottom
			:title="t('text33')"
			:title2="t('text34')"
			v-model:show="show"
			:height="popupHieght">
			<div v-if="step === 1">
				<InputCountDown
					v-model:start="startNewSmsCountDown"
					v-model="form.code"
					@send="sendNewSmsCode(3)"
					class="mt-3"
					:placeholder="t('my.txt120')" />
				<InputCountDown
					v-model:start="startEmailCountDown"
					v-model="form.emailCode"
					@send="sendCode(16, 'email')"
					class="mt-3"
					:placeholder="t('my.txt119')" />

				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />
			</div>

			<div v-if="step === 2">
				<InputCountDown
					v-model:start="startSmsCountDown"
					v-model="form.code"
					@send="sendCode(checked ? 17 : 14, 'sms')"
					class="mt-3"
					:placeholder="t('my.txt120')" />
				<InputCountDown
					v-model:start="startEmailCountDown"
					v-model="form.emailCode"
					@send="sendCode(checked ? 13 : 18, 'email')"
					class="mt-3"
					:placeholder="t('my.txt119')" />

				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />
			</div>

			<div v-if="step === 3">
				<InputCountDown
					v-model:start="startOldSmsCountDown"
					v-model="form.oldCode"
					@send="sendOldSmsCode(4)"
					class="mt-3"
					:placeholder="t('my.txt158')" />
				<InputCountDown
					v-model:start="startNewSmsCountDown"
					v-model="form.code"
					@send="sendNewSmsCode(3)"
					class="mt-3"
					:placeholder="t('my.txt160')" />
				<InputCountDown
					v-if="settingInfo.isEmailAuth"
					v-model:start="startEmailCountDown"
					v-model="form.emailCode"
					@send="sendCode(15, 'email')"
					class="mt-3"
					:placeholder="t('my.txt119')" />

				<InputPaste
					v-if="settingInfo.isGoogleAuth"
					v-model="form.googleCode"
					class="mt-3"
					:placeholder="t('my.txt138')" />
			</div>

			<template v-slot:bottom>
				<Button size="small" plain class="mr-4" @click="cancel">{{ t('my.txt37') }}</Button>
				<Button v-if="step === 1" :disabled="disabled1" @click="addMobilePhone" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 2" :disabled="disabled2" @click="changeMobilePhone" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 3" :disabled="disabled3" @click="updateMobilePhone" size="small">
					{{ t('my.txt38') }}
				</Button>
			</template>
		</PopupBottom>
	</div>
	<div v-else-if="open">
		<Dialog :show="step === 1 && !show" :title="t('my.txt136')" width="390px" @cancel="onCancel">
			<div class="p-4">
				<Input v-model="form.phone" :placeholder="t('my.txt137')">
					<template v-slot:prefix>
						<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
					</template>
				</Input>
				<Button :disabled="disabled" @click="show = true" class="mt-6">{{ t('my.txt67') }}</Button>
			</div>
		</Dialog>

		<Dialog :show="step === 2 && !show" :title="t('my.txt71')" width="390px" @cancel="onCancel">
			<div class="p-4">
				<div class="pb-3">
					<div class="flex justify-center">
						<icon
							:name="
								themeStore.theme === 'light' ? 'user-center/icon28' : 'user-center/icon28_dark'
							"
							:size="64"
							class="text-text-brand" />
					</div>
					<div class="pt-6 flex justify-center text-text-description text-style-web-small-regular">
						{{ t('text31') }}
					</div>
					<div class="pt-[10px] text-center text-text-primary text-style-web-h3-medium">
						{{ settingInfo.mobilePhone }}
					</div>
				</div>
				<div class="flex justify-between items-center py-5">
					<div class="text-text-tertiary text-style-web-h4-medium">{{ t('my.txt71') }}</div>
					<van-switch
						:model-value="checked"
						@update:model-value="onUpdateChecked"
						:size="16"
						active-color="text-text-brand" />
				</div>
				<div class="flex justify-between items-center py-5" @click="step = 3">
					<div class="text-text-tertiary text-style-web-h4-medium">{{ t('text32') }}</div>
					<icon name="user-center/icon26" :size="20" class="text-text-primary" />
				</div>
			</div>
		</Dialog>

		<Dialog :show="step === 3 && !show" :title="t('my.txt155')" width="390px" @cancel="onCancel">
			<div class="p-4 pt-1">
				<Tip width="100%" type="warning">
					{{ t('my.txt157') }}
				</Tip>
				<Input v-model="form.phone" class="mt-3" :placeholder="t('my.txt159')">
					<template v-slot:prefix>
						<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
					</template>
				</Input>
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
						v-model:start="startNewSmsCountDown"
						v-model="form.code"
						@send="sendNewSmsCode(3)"
						:placeholder="t('my.txt120')" />
					<InputCountDown
						v-model:start="startEmailCountDown"
						v-model="form.emailCode"
						@send="sendCode(16, 'email')"
						class="mt-3"
						:placeholder="t('my.txt119')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />
				</div>

				<div v-if="step === 2">
					<InputCountDown
						v-model:start="startSmsCountDown"
						v-model="form.code"
						@send="sendCode(checked ? 17 : 14, 'sms')"
						:placeholder="t('my.txt120')" />
					<InputCountDown
						v-model:start="startEmailCountDown"
						v-model="form.emailCode"
						@send="sendCode(checked ? 13 : 18, 'email')"
						class="mt-3"
						:placeholder="t('my.txt119')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />
				</div>

				<div v-if="step === 3">
					<InputCountDown
						v-model:start="startOldSmsCountDown"
						v-model="form.oldCode"
						@send="sendOldSmsCode(4)"
						:placeholder="t('my.txt158')" />
					<InputCountDown
						v-model:start="startNewSmsCountDown"
						v-model="form.code"
						@send="sendNewSmsCode(3)"
						class="mt-3"
						:placeholder="t('my.txt160')" />
					<InputCountDown
						v-if="settingInfo.isEmailAuth"
						v-model:start="startEmailCountDown"
						v-model="form.emailCode"
						@send="sendCode(15, 'email')"
						class="mt-3"
						:placeholder="t('my.txt119')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />
				</div>
			</div>
			<div class="py-5 px-4 border-t border-border-strong flex">
				<Button size="small" plain class="mr-2" @click="cancel">{{ t('my.txt37') }}</Button>
				<Button v-if="step === 1" :disabled="disabled1" @click="addMobilePhone" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 2" :disabled="disabled2" @click="changeMobilePhone" size="small">
					{{ t('my.txt38') }}
				</Button>
				<Button v-if="step === 3" :disabled="disabled3" @click="updateMobilePhone" size="small">
					{{ t('my.txt38') }}
				</Button>
			</div>
		</Dialog>
	</div>
</template>
