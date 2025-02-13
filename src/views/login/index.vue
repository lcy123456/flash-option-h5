<script setup lang="ts">
import { ref, computed, inject, onBeforeMount } from 'vue'
import { onKeyStroke } from '@vueuse/core'

import Illustration from '@/components/business/illustration/index.vue'
import { showSuccessToast } from '@/components/base/toast'
import { useRoute, useRouter } from 'vue-router'
import BaseInput from '@/components/base/input/index.vue'
import InputPassword from '@/components/base/input-password/index.vue'
import { Button } from '@/components/base'
import { login } from '@/apis/login'
import { useUserStore } from '@/store/useUserStore'
import { useI18n } from 'vue-i18n'
import CountryMenu from '@/components/base/country-menu/index.vue'

const globalData: any = inject('globalData')
const { t } = useI18n()
const username = ref('')
const password = ref('')
const areaCode = ref('')
const userStore: any = useUserStore()
const router = useRouter()
const route = useRoute()

onBeforeMount(async () => {
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
const showCountryMenu = computed(() => /^\d{3,}$/.test(username.value))

const submit = async () => {
	const params: any = {
		username: username.value,
		password: password.value
	}
	if (showCountryMenu.value) {
		params.country = areaCode.value || ''
	}
	const data: any = await login(params)
	if (data.code === 0) {
		userStore.setUserInfo(data.data)
		userStore.setLoginToken(data.data.token)
		showSuccessToast(data.message)
		const redirect: unknown = route.query.redirect
		if (redirect) {
			router.push(redirect)
		} else {
			router.push('/')
		}
	} else {
		// showFailToast(data.message)
	}
}

const disabled = computed(() => !(username.value && password.value))

onKeyStroke('Enter', () => {
	if (!disabled.value) {
		submit()
	}
})

const openForgetpwd = () => {
	router.push('/forgetpwd')
}
</script>

<template>
	<div class="web:hidden px-4 py-[30px]">
		<div class="text-text-primary text-style-web-h1-bold">{{ t('login.txt1') }}</div>

		<div class="py-[32px]">
			<div class="text-text-secondary text-style-web-small-regular mb-4">
				{{ t('login.txt2') }}
			</div>
			<div
				@click="router.push('/')"
				class="py-[10px] rounded bg-background-tertiary flex justify-center">
				<div class="text-brand-blue text-style-web-base-regular">www.</div>
				<div class="text-text-primary text-style-web-base-regular">{{ globalData.webName }}</div>
			</div>
		</div>

		<div class="login-form">
			<BaseInput
				v-model="username"
				class="mb-4"
				input-class="_inputClass"
				:placeholder="t('login.txt3')">
				<template v-if="showCountryMenu" v-slot:prefix>
					<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
				</template>
			</BaseInput>
			<InputPassword
				v-model="password"
				autocomplete="new-password"
				class="mb-4"
				input-class="_inputClass"
				:placeholder="t('login.txt4')" />

			<Button :disabled="disabled" @click="submit" class="text-always-white">
				{{ t('login.txt5') }}
			</Button>

			<div
				@click="openForgetpwd"
				class="mt-4 text-brand-blue text-style-web-body-regular text-center">
				{{ t('login.txt6') }}
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex h-[calc(100vh-65px)]">
		<Illustration />
		<div class="w-[60vw] h-[100%] flex justify-center pt-[113px]">
			<div class="w-[420px]">
				<div class="text-text-primary text-web-mega-bold">{{ t('login.txt1') }}</div>
				<div class="pt-[30px]">
					<div
						class="h-[38px] text-text-primary text-style-web-h5-medium py-[10px] px-3 inline-block box-border border-b-[2px] border-border-button_strong">
						{{ t('text52') }}
					</div>
					<div class="login-form">
						<BaseInput
							v-model="username"
							class="mt-6"
							input-class="_inputClass"
							:placeholder="t('login.txt3')">
							<template v-if="showCountryMenu" v-slot:prefix>
								<CountryMenu v-model:value="areaCode" :list="userStore.countryList" />
							</template>
						</BaseInput>
						<InputPassword
							v-model="password"
							autocomplete="new-password"
							class="mt-6"
							input-class="_inputClass"
							:placeholder="t('login.txt4')" />
					</div>
					<div class="mt-4 flex justify-end text-text-description text-style-web-base-regular">
						<div class="cursor-pointer" @click="openForgetpwd">{{ t('login.txt6') }}</div>
					</div>
					<Button class="mt-[32px] !text-always-white" :disabled="disabled" @click="submit">
						{{ t('login.txt5') }}
					</Button>

					<div class="py-6 flex justify-center items-center">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('text53', { num: globalData?.appNameUpper }) }}
						</div>
						<div class="w-[1px] h-[10px] bg-border-button_line mx-4"></div>
						<div
							@click="router.push('/register')"
							class="text-brand-main text-style-web-base-regular cursor-pointer">
							{{ t('other.txt17') }}
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.login-form {
	:deep(._inputClass) {
		input {
			background-color: transparent;
			background-image: none;
			transition: background-color 50000s ease-in-out 0s;
			&:-webkit-autofill {
				-webkit-text-fill-color: var(--color-text-primary) !important;
			}
		}
	}
}
</style>
