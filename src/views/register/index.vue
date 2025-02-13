<script setup lang="ts">
import { ref, reactive, computed, onBeforeMount, inject } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useRouter, useRoute } from 'vue-router'

import Illustration from '@/components/business/illustration/index.vue'
import { Button } from '@/components/base'
import BaseInput from '@/components/base/input/index.vue'
import InputPassword from '@/components/base/input-password/index.vue'
import InputCountDown from '@/components/base/input-count-down/index.vue'
import Checkbox from '@/components/base/checkbox/index.vue'
// import Collapse from './components/Collapse.vue'
import CountryMenu from '@/components/base/country-menu/index.vue'

import { register, register_phone } from '@/apis/login'
import { getCateOne } from '@/apis/user'

import { emailCode, smsCode } from '@/apis/index'

import { useUserStore } from '@/store/useUserStore'
import { useI18n } from 'vue-i18n'
import { isEmail } from '@/utils'
import { reg } from '@/utils/reg'
import { getItem, removeItem } from '@/utils/storage'

const globalData: any = inject('globalData')
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const userStore: any = useUserStore()

const form = reactive({
	username: '',
	password: '',
	confirm_password: '',
	code: '',
	invite_code: ''
})

const formError = reactive({
	username: '',
	password: '',
	confirm_password: '',
	code: '',
	invite_code: ''
})

const isSendCode = ref(false)
const isAgree = ref(true)
const areaCode = ref('')
const show = ref(false)
const agreementInfo: any = ref()

onBeforeMount(async () => {
	const reg_value = getItem('reg_value')
	if (reg_value) {
		form.username = reg_value
		removeItem('reg_value')
	}
	getCateOne({ cate: 8 }).then((res: any) => {
		if (res.code === 0 && res.data) {
			agreementInfo.value = res.data
		}
	})
	if (route.query.code) {
		show.value = true
		form.invite_code = String(route.query.code)
	}

	if (userStore.countryList && userStore.countryList[0]) {
		areaCode.value = userStore.countryList[0].areaCode
	} else {
		const data = await userStore.initCountryList()
		if (data && data[0]) {
			areaCode.value = data[0].areaCode
		}
	}
})

// 大于等于三位且纯数字
const showCountryMenu = computed(() => /^\d{3,}$/.test(form.username))

const disabled = computed(() => {
	return !!(
		form.username &&
		form.code &&
		form.password &&
		form.confirm_password &&
		form.invite_code
	)
})

const check = () => {
	if (!form.username) {
		formError.username = t('register.txt11')
		return false
	} else {
		formError.username = ''
	}

	if (!form.code) {
		formError.code = t('register.txt12')
		return false
	} else {
		formError.code = ''
	}

	if (!form.password) {
		formError.password = t('register.txt13')
		return false
	} else {
		formError.password = ''
	}

	if (form.password) {
		if (!reg.pwdRegex.test(form.password)) {
			formError.password = t('text55')
			return false
		}
	}

	if (!form.confirm_password) {
		formError.confirm_password = t('register.txt17')
		return false
	} else {
		formError.confirm_password = ''
	}

	if (form.password !== form.confirm_password) {
		formError.confirm_password = t('register.txt15')
		return false
	} else {
		formError.confirm_password = ''
	}

	if (!isAgree.value) {
		showFailToast(t('register.txt18'))
		return false
	}
	// if (!form.invite_code) {
	// 	formError.invite_code = ''
	// }
	return true
}

const submit = async () => {
	if (check()) {
		const params: any = {
			password: form.password,
			code: form.code,
			promotion: form.invite_code || 'root'
		}
		if (!showCountryMenu.value) {
			params.email = form.username
			if (!isEmail(form.username)) {
				showFailToast(t('text38'))
				return
			}
			const { code, message, data }: any = await register(params)
			if (code === 0) {
				userStore.setUserInfo(data)
				userStore.setLoginToken(data.token)
				showSuccessToast(message)
				router.push('/')
			} else {
				showFailToast(message)
				isSendCode.value = false
			}
		} else {
			// const country: any = userStore.countryList.find(
			// 	(item: any) => item.areaCode === areaCode.value
			// )
			params.phone = form.username
			params.country = areaCode.value || ''
			const { code, message, data }: any = await register_phone(params)
			if (code === 0) {
				userStore.setUserInfo(data)
				userStore.setLoginToken(data.token)
				showSuccessToast(message)
				router.push('/')
				// showSuccessToast(message)
				// router.push('/login')
			} else {
				showFailToast(message)
				isSendCode.value = false
			}
		}
	}
}

const sendCode = async () => {
	if (form.username) {
		if (showCountryMenu.value) {
			// const country: any = userStore.countryList.find(
			// 	(item: any) => item.areaCode === areaCode.value
			// )
			const { code, message }: any = await smsCode({
				phone: form.username,
				operateType: 1,
				country: areaCode.value
			})
			if (code === 0) {
				showSuccessToast(message)
			} else {
				showFailToast(message)
				isSendCode.value = false
			}
		} else {
			if (isEmail(form.username)) {
				const { code, message }: any = await emailCode({ email: form.username, operateType: 1 })
				if (code === 0) {
					showSuccessToast(message)
				} else {
					showFailToast(message)
					isSendCode.value = false
				}
			} else {
				isSendCode.value = false
				showFailToast(t('text38'))
			}
		}
	} else {
		formError.username = t('register.txt11')
		isSendCode.value = false
	}
}

const toAgreement = () => {
	if (agreementInfo.value) {
		if (agreementInfo.value?.pageUrl) {
			window.open(agreementInfo.value?.pageUrl, '_blank')
		} else {
			router.push('/register-agreement')
		}
	} else {
		showFailToast(t('text51'))
	}
}
</script>

<template>
	<div class="web:hidden pd:hidden px-4 py-[30px]">
		<div class="text-style-web-h1-bold mb-[32px] text-text-primary">{{ t('register.txt1') }}</div>
		<BaseInput
			class="mb-4"
			v-model="form.username"
			:error="formError.username"
			:placeholder="t('register.txt2')">
			<template v-if="showCountryMenu" v-slot:prefix>
				<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
			</template>
		</BaseInput>

		<InputCountDown
			class="mb-4"
			v-model="form.code"
			autocomplete="new-password"
			:error="formError.code"
			v-model:start="isSendCode"
			@send="sendCode"
			:placeholder="t('register.txt3')" />

		<InputPassword
			class="mb-4"
			:memorize="false"
			v-model="form.password"
			:error="formError.password"
			:placeholder="t('register.txt4')" />

		<InputPassword
			class="mb-4"
			:memorize="false"
			v-model="form.confirm_password"
			:error="formError.confirm_password"
			:placeholder="t('register.txt5')" />

		<!-- <Collapse v-model:show="show" :title="t('register.txt6')">
			<BaseInput class="mb-4" v-model="form.invite_code" :placeholder="t('register.txt7')" />
		</Collapse> -->
		<BaseInput class="mb-4" v-model="form.invite_code" :placeholder="t('register.txt7')" />

		<van-button
			@click="submit"
			:disabled="!disabled"
			class="w-full rounded-[50px] h-[50px] text-text-inverse-primary text-style-web-h5-bold"
			type="primary">
			{{ t('register.txt8') }}
		</van-button>

		<Checkbox v-model="isAgree" class="mt-4">
			<div class="flex">
				<div class="text-brand-blue text-style-web-body-regular">{{ t('text50') }}</div>
				<div @click.stop="toAgreement" class="text-brand-blue text-style-web-body-regular">
					《{{ t('text49') }}》
				</div>
			</div>
		</Checkbox>
	</div>

	<div class="ph:hidden flex h-[calc(100vh-65px)]">
		<Illustration />
		<div class="w-[60vw] h-[100%]">
			<div class="w-[420px] pt-[120px] mx-auto">
				<div class="text-text-primary text-style-web-mega-bold pb-6">{{ t('register.txt1') }}</div>
				<BaseInput
					class="mb-6"
					v-model="form.username"
					:error="formError.username"
					:placeholder="t('register.txt2')">
					<template v-if="showCountryMenu" v-slot:prefix>
						<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
					</template>
				</BaseInput>

				<InputCountDown
					class="mb-6"
					v-model="form.code"
					autocomplete="new-password"
					:error="formError.code"
					v-model:start="isSendCode"
					@send="sendCode"
					:placeholder="t('register.txt3')" />

				<InputPassword
					class="mb-6"
					:memorize="false"
					v-model="form.password"
					:error="formError.password"
					:placeholder="t('register.txt4')" />

				<InputPassword
					class="mb-6"
					:memorize="false"
					v-model="form.confirm_password"
					:error="formError.confirm_password"
					:placeholder="t('register.txt5')" />

				<BaseInput class="mb-6" v-model="form.invite_code" :placeholder="t('register.txt7')" />

				<Checkbox v-model="isAgree" class="mb-6">
					<div class="flex">
						<div class="text-brand-blue text-style-web-body-regular">{{ t('text50') }}</div>
						<div @click.stop="toAgreement" class="text-brand-blue text-style-web-body-regular">
							《{{ t('text49') }}》
						</div>
					</div>
				</Checkbox>

				<Button
					@click="submit"
					:disabled="!disabled"
					class="w-full text-text-inverse-primary text-style-web-h5-bold">
					{{ t('home.txt2') }}
				</Button>

				<div class="flex items-center justify-center pt-6">
					<div class="text-text-description text-style-web-base-regular">
						{{ t('text117', { num: globalData?.appNameUpper }) }}
					</div>
					<div class="w-[1px] h-[10px] bg-border-button_line mx-4"></div>
					<div
						@click="router.push('/login')"
						class="text-brand-main text-style-web-base-regular cursor-pointer">
						{{ t('text116') }}
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
