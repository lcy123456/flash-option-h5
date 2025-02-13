<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount, watch } from 'vue'
import { showSuccessToast, showFailToast, showLoadingToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'
import { Breadcrumb, Button, PopupBottom, InputCountDown, InputPaste } from '@/components/base'
import { emailCode, smsCode } from '@/apis/index'
import { googleAuthInfo, closeGoogleAuth, openGoogleAuth } from '@/apis/user'
import { useSecuritySetting } from '@/hooks/useSecuritySetting'
import Menu from '@/views/user-center/components/Menu.vue'
import { useThemeStore } from '@/store/useThemeStore'

import Bind from './Bind.vue'

const themeStore = useThemeStore()
const { settingInfo, updateSettingInfo } = useSecuritySetting()
const { t } = useI18n()
const step = ref(1) // 1:绑定 2:已经绑定 3:修改谷歌验证器
const checked = ref(true)
const show = ref(false)
const startSmsCountDown = ref(false)
const startEmailCountDown = ref(false)
const googleInfo = ref({})
const form = reactive({
	smsCode: '',
	emailCode: '',
	googleCode: ''
})

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
		title: t('text45')
	}
])

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

watch(
	() => settingInfo.value,
	() => {
		if (settingInfo.value.googleDate) {
			step.value = 2
		} else {
			step.value = 1
		}
		checked.value = settingInfo.value.isGoogleAuth
	},
	{
		deep: true,
		immediate: true
	}
)

onBeforeMount(async () => {
	googleAuthInfo().then((res: any) => {
		if (res.code === 0) {
			googleInfo.value = res.data
		}
	})
	const toast: any = showLoadingToast({ message: t('flw.txt113'), loadingType: 'spinner' })
	await updateSettingInfo()
	toast.close()
})

const popupHieght = computed(() => {
	let h = 194
	// if (settingInfo.value.isGoogleAuth) {
	h = h + 66
	// }
	if (settingInfo.value.isMobileAuth) {
		h = h + 66
	}
	if (settingInfo.value.isEmailAuth) {
		h = h + 66
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

const onUpdateChecked = () => {
	show.value = true
}

const cancel = () => {
	show.value = false
	form.googleCode = ''
	form.smsCode = ''
	form.emailCode = ''
	startSmsCountDown.value = false
	startEmailCountDown.value = false
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
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div class="px-4 py-6" v-if="step === 1">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt104') }}</div>
			<Bind :settingInfo="settingInfo" :data="googleInfo" />
		</div>

		<div class="px-4 py-6" v-if="step === 2">
			<div class="text-text-primary text-style-web-h3-bold">{{ t('text45') }}</div>
			<div class="py-3">
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
					inactive-color="#F0F0F0"
					active-color="#1754F8" />
			</div>
			<div @click="step = 1" class="flex justify-between items-center py-5">
				<div class="text-text-tertiary text-style-web-h4-medium">{{ t('text48') }}</div>
				<icon name="user-center/icon26" :size="20" class="text-text-primary" />
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<Menu :active="1" />
		<div class="w-[538px] ml-20 py-10">
			<div class="text-text-primary text-style-web-xlarge-bold mb-4">{{ t('text152') }}</div>
			<Bind :settingInfo="settingInfo" :data="googleInfo" />
		</div>
	</div>

	<PopupBottom :title="t('text33')" :title2="t('text34')" v-model:show="show" :height="popupHieght">
		<div v-if="step === 1">
			<InputPaste v-model="form.googleCode" class="mt-3" :placeholder="t('my.txt138')" />
		</div>

		<div v-if="step === 2">
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

		<div v-if="step === 3">
			<InputCountDown
				v-if="settingInfo.isMobileAuth"
				v-model:start="startSmsCountDown"
				v-model="form.smsCode"
				@send="sendCode(3, 'sms')"
				class="mt-3"
				:placeholder="t('my.txt120')" />
			<InputCountDown
				v-if="settingInfo.isEmailAuth"
				v-model:start="startEmailCountDown"
				v-model="form.emailCode"
				@send="sendCode(16, 'email')"
				class="mt-3"
				:placeholder="t('my.txt119')" />
		</div>
		<template v-slot:bottom>
			<Button size="small" plain class="mr-4" @click="cancel">{{ t('my.txt37') }}</Button>
			<Button v-if="step === 1" size="small">
				{{ t('my.txt38') }}
			</Button>
			<Button v-if="step === 2" :disabled="disabled2_pb" @click="changeGoogle" size="small">
				{{ t('my.txt38') }}
			</Button>
		</template>
	</PopupBottom>
</template>
