<script setup lang="ts">
import { reactive, computed, ref, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'

import Illustration from '@/components/business/illustration/index.vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useUserStore } from '@/store/useUserStore'
import { Button } from '@/components/base'
import Input from '@/components/base/input/index.vue'
import InputCountDown from '@/components/base/input-count-down/index.vue'
import CountryMenu from '@/components/base/country-menu/index.vue'
import { Verify } from '@/components/business'
import { reg } from '@/utils/reg'

import { reset_password } from '@/apis/login'

import { emailCode, smsCode } from '@/apis/index'
import { useI18n } from 'vue-i18n'
import { isEmail } from '@/utils'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

const form = reactive({
	username: '',
	code: '',
	password: '',
	newpassword: ''
})
const formError = reactive({
	username: '',
	code: '',
	password: '',
	newpassword: ''
})
const areaCode = ref('')
const isSendCode = ref(false)
const step = ref(1)

onBeforeMount(async () => {
	const data = await userStore.initCountryList()
	if (data && data[0]) {
		areaCode.value = data[0].areaCode
	}
})

// 大于等于三位且纯数字
const showCountryMenu = computed(() => /^\d{3,}$/.test(form.username))

const nextDisabled = computed(() => !(form.username && form.code))

const disabled2 = computed(() => !(form.password && form.newpassword))

const next = () => {
	if (!showCountryMenu.value) {
		if (!isEmail(form.username)) {
			showFailToast(t('text38'))
			return
		}
	}
	step.value = 2
}

const sendCode = async () => {
	if (form.username) {
		if (showCountryMenu.value) {
			// const country: any = userStore.countryList.find(
			// 	(item: any) => item.areaCode === areaCode.value
			// )
			const { code, message }: any = await smsCode({
				phone: form.username,
				operateType: 2,
				country: areaCode.value
			})
			if (code === 0) {
				showSuccessToast(message)
			} else {
				isSendCode.value = false
			}
		} else {
			const { code, message }: any = await emailCode({ email: form.username, operateType: 2 })
			if (code === 0) {
				showSuccessToast(message)
			} else {
				isSendCode.value = false
			}
		}
	} else {
		formError.username = t('register.txt11')
		isSendCode.value = false
	}
}

const submit = async () => {
	if (form.password && form.newpassword) {
		if (form.password === form.newpassword) {
			if (!reg.pwdRegex.test(form.password)) {
				showFailToast(t('text55'))
				return
			}
			const data: any = await reset_password({
				email: form.username,
				code: form.code,
				password: form.password
			})
			if (data.code === 0) {
				showSuccessToast(data.message)
				router.push('/login')
			} else {
				form.password = ''
				form.newpassword = ''
				step.value = 1
				isSendCode.value = false
			}
		} else {
			showFailToast(t('register.txt15'))
		}
	}
}
</script>

<template>
	<div class="web:hidden pd:hidden py-[30px] px-4">
		<div class="text-text-primary text-style-web-h1-bold">{{ t('my.txt90') }}</div>
		<div class="mt-[32px] mb-3 bg-text-warning-10 py-[6px] px-3 flex rounded">
			<base-icon name="tip" :size="16" />
			<div class="pl-1 flex-1 text-text-warning text-style-web-small-regular">
				{{ t('my.txt91') }}
			</div>
		</div>

		<Input
			v-if="step === 1"
			class="mb-4"
			v-model="form.username"
			:error="formError.username"
			:placeholder="t('register.txt2')">
			<template v-if="showCountryMenu" v-slot:prefix>
				<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
			</template>
		</Input>
		<Input class="mb-4" v-model="form.password" v-else :placeholder="t('register.txt16')" />

		<InputCountDown
			v-if="step === 1"
			class="mb-4"
			v-model="form.code"
			:error="formError.code"
			v-model:start="isSendCode"
			@send="sendCode"
			:placeholder="t('register.txt3')" />
		<Input class="mb-4" v-else v-model="form.newpassword" :placeholder="t('my.txt118')" />

		<van-button v-if="step === 1" :disabled="nextDisabled" round block type="primary" @click="next">
			{{ t('my.txt92') }}
		</van-button>
		<van-button v-else round block type="primary" @click="submit">{{ t('my.txt90') }}</van-button>
	</div>

	<div class="ph:hidden flex h-[calc(100vh-65px)]">
		<Illustration />
		<div class="w-[60vw] h-[100%]">
			<div class="h-20 px-4 flex items-center">
				<div class="flex items-center" @click="router.push('/login')">
					<icon name="user-center/icon29" :size="20" class="text-text-primary" />
					<div class="pl-4 text-text-secondary text-style-h4-700 cursor-pointer">
						{{ t('my.txt103') }}
					</div>
				</div>
			</div>
			<div class="w-[480px] pt-10 m-auto">
				<div class="text-text-primary text-style-web-mega-bold">
					{{ t('my.txt90') }}
				</div>
				<div class="pt-2 text-text-primary text-style-web-h4-regular">
					{{ t('my.txt91') }}
				</div>

				<Input
					v-if="step === 1"
					class="my-6"
					v-model="form.username"
					:error="formError.username"
					:placeholder="t('register.txt2')">
					<template v-if="showCountryMenu" v-slot:prefix>
						<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
					</template>
				</Input>
				<Input class="my-6" v-model="form.password" v-else :placeholder="t('register.txt16')" />

				<InputCountDown
					v-if="step === 1"
					class="mb-6"
					v-model="form.code"
					:error="formError.code"
					:text="isSendCode ? `已将验证码发送到您的 ${form.username}` : ''"
					v-model:start="isSendCode"
					@send="sendCode"
					:placeholder="t('register.txt3')" />
				<Input class="mb-6" v-else v-model="form.newpassword" :placeholder="t('my.txt118')" />

				<Button v-if="step === 1" :disabled="nextDisabled" @click="next">
					{{ t('my.txt92') }}
				</Button>
				<Button v-else :disabled="disabled2" @click="submit">
					{{ t('my.txt90') }}
				</Button>
			</div>
		</div>
	</div>
	<Verify />
</template>
