<script setup lang="ts">
import { reactive, ref, onBeforeMount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { showSuccessToast } from '@/components/base/toast'

import { Breadcrumb } from '@/components/base'
// import NoticeBar from '@/components/base/notice-bar/index.vue'
// import Dialog from '@/components/base/dialog/index.vue'
// import Button from '@/components/base/button/index.vue'
import FundPwd from './FundPwd.vue'
import LoginPwd from './LoginPwd.vue'

import { useSecuritySetting } from '@/hooks/useSecuritySetting'
import { useUserStore } from '@/store/useUserStore'
import router from '@/router'

import ModifyAvatar from '@/views/user-center/overview/ModifyAvatar.vue'
import ModifyName from '@/views/user-center/overview/ModifyName.vue'
import Menu from '@/views/user-center/components/Menu.vue'

import Mobile from './mobile.vue'
import Email from './email.vue'
import GoogleValidator from './google/web/Validator.vue'
import { useDevice } from '@/hooks/useDevice'

const { toClipboard } = useClipboard()
const { t } = useI18n()
const { isPh, isPC } = useDevice()
const show = defineModel('show', { default: true })

const fundPwdShow = ref(false)
const loginPwdShow = ref(false)
const avatarShow = ref(false)
const nameShow = ref(false)
const mobileShow = ref(false)
const emailShow = ref(false)
const googleShow = ref(false)
// const noticeBarShow = ref(true)
// const googleBindTipShow = ref(false)
const userStore: any = useUserStore()

const { settingInfo, updateSettingInfo } = useSecuritySetting()

const items = reactive([
	{
		title: t('my.txt57'),
		path: '/user'
	},
	{
		title: t('my.txt56')
	}
])

// watchEffect(() => {
// 	noticeBarShow.value = !settingInfo.value.isGoogleAuth
// })

watch(
	() => show.value,
	() => {
		if (!show.value) {
			fundPwdShow.value = false
			loginPwdShow.value = false
		}
	}
)

onBeforeMount(() => {
	userStore.initCountryList()
	updateSettingInfo()
})

const mobileEdit = () => {
	if (isPh.value) {
		router.push('/user/security-setting/mobile')
	} else {
		mobileShow.value = true
	}
}

const emailEdit = () => {
	if (isPh.value) {
		router.push('/user/security-setting/email')
	} else {
		emailShow.value = true
	}
}

const googleEdit = () => {
	if (isPh.value) {
		router.push('/user/security-setting/google')
	} else {
		if (settingInfo.value.googleDate) {
			googleShow.value = true
		} else {
			router.push('/user/security-setting/google')
		}
	}
}

const copy = () => {
	toClipboard(String(userStore.userInfo?.id))
	showSuccessToast({
		message: t('register.txt14'),
		zIndex: 9999
	})
}
</script>

<template>
	<div class="web:hidden w-full pb-[60px]">
		<!-- <NoticeBar v-model:show="noticeBarShow" class="bg-brand-main-20">
			<template v-slot:prefix>
				<base-icon name="user-center/icon22" :size="16" class="mr-1" />
			</template>
			<div class="text-text-secondary text-style-web-small-regular">{{ t('my.txt161') }}</div>
			<template v-slot:suffix>
				<div class="flex items-center">
					<div
						@click="bindGoogleShow = true"
						class="mr-1 py-1 px-3 rounded-[50px] bg-brand-main text-always-white text-style-web-small-medium">
						{{ t('my.txt67') }}
					</div>
					<base-icon @click="noticeBarShow = false" name="close" :size="24" />
				</div>
			</template>
		</NoticeBar> -->
		<Breadcrumb :items="items" />
		<div class="px-4">
			<div class="py-6 text-text-primary text-style-web-h1-medium">{{ t('my.txt56') }}</div>

			<div>
				<div class="flex">
					<div class="text-text-tertiary text-style-web-h5-medium mr-2">{{ t('my.txt58') }}</div>
					<div class="text-style-web-h5-medium" :class="[settingInfo.levelInfo.textClass]">
						{{ settingInfo.levelInfo.title }}
					</div>
				</div>
				<div class="mt-3 flex justify-between">
					<div
						class="flex-1 h-1 mr-2 bg-background-tertiary"
						:class="[settingInfo.levelInfo.bgClass]"></div>
					<div
						class="flex-1 h-1 mr-2 bg-background-tertiary"
						:class="[settingInfo.securityLevel > 1 ? settingInfo.levelInfo.bgClass : '']"></div>
					<div
						class="flex-1 h-1 mr-2 bg-background-tertiary"
						:class="[settingInfo.securityLevel > 2 ? settingInfo.levelInfo.bgClass : '']"></div>
				</div>
			</div>

			<div class="pt-[52px] pb-[32px] text-text-primary text-style-web-h1-medium">
				{{ t('my.txt62') }}
			</div>

			<div class="mb-10">
				<div class="flex items-center">
					<base-icon name="user-center/icon5" :size="24" />
					<div class="pl-3 text-text-primary text-style-web-h2-medium">{{ t('my.txt63') }}</div>
					<div
						class="ml-1 bg-text-success-0.05 px-2 py-[2px] text-text-success text-style-web-body-medium">
						{{ t('my.txt64') }}
					</div>
				</div>
				<div class="pl-[36px] py-3 text-text-description text-style-web-body-regular">
					{{ t('my.txt65') }}
				</div>
				<div class="flex justify-between items-center pl-[36px]">
					<div v-if="settingInfo.isGoogleAuth" class="flex items-center">
						<base-icon name="user-center/icon14" :size="24" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt68') }}
						</div>
					</div>
					<div v-else class="flex items-center">
						<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt66') }}
						</div>
					</div>

					<div
						@click="googleEdit"
						class="py-2 px-4 rounded-[50px] min-w-[90px] text-center bg-background-tertiary text-text-primary text-style-web-body-bold">
						{{ t('text19') }}
					</div>
				</div>
			</div>

			<div class="mb-10">
				<div class="flex items-center">
					<base-icon name="user-center/icon7" :size="24" class="text-text-primary" />
					<div class="pl-3 text-text-primary text-style-web-h2-medium">{{ t('my.txt69') }}</div>
				</div>
				<div class="pl-[36px] py-3 text-text-description text-style-web-body-regular">
					{{ t('my.txt70') }}
				</div>
				<div class="flex justify-between items-center pl-[36px]">
					<div v-if="settingInfo.isEmailAuth" class="flex items-center">
						<base-icon name="user-center/icon14" :size="24" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ settingInfo.data.email }}
						</div>
					</div>
					<div v-else class="flex items-center">
						<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt66') }}
						</div>
					</div>

					<div class="flex">
						<div
							@click="emailEdit"
							class="py-2 px-4 rounded-[50px] min-w-[90px] text-center bg-background-tertiary text-text-primary text-style-web-body-bold">
							{{ t('text19') }}
						</div>
					</div>
				</div>
			</div>

			<div>
				<div class="flex items-center">
					<base-icon name="user-center/icon8" :size="24" class="text-text-primary" />
					<div class="pl-3 text-text-primary text-style-web-h2-medium">{{ t('my.txt71') }}</div>
				</div>
				<div class="pl-[36px] py-3 text-text-description text-style-web-body-regular">
					{{ t('my.txt72') }}
				</div>
				<div class="flex justify-between items-center pl-[36px]">
					<div v-if="settingInfo.isMobileAuth" class="flex items-center">
						<base-icon name="user-center/icon14" :size="24" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ settingInfo.data.mobilePhone }}
						</div>
					</div>
					<div v-else class="flex items-center">
						<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt66') }}
						</div>
					</div>

					<div class="flex">
						<div
							@click="mobileEdit"
							class="py-2 px-4 rounded-[50px] min-w-[90px] text-center bg-background-tertiary text-text-primary text-style-web-body-bold">
							{{ t('text19') }}
						</div>
					</div>
				</div>
			</div>

			<div class="pt-[40px] pb-[32px] text-text-primary text-style-web-h1-medium">
				{{ t('my.txt121') }}
			</div>
			<div>
				<div class="flex items-center">
					<base-icon name="user-center/icon15" :size="24" class="text-text-primary" />
					<div class="pl-3 text-text-primary text-style-web-h2-medium">{{ t('text20') }}</div>
				</div>
				<div class="pl-[36px] py-3 text-text-description text-style-web-body-regular">
					{{ t('my.txt122') }}
				</div>
				<div class="flex justify-between items-center pl-[36px]">
					<div v-if="settingInfo.isLoginAuth" class="flex items-center">
						<base-icon name="user-center/icon14" :size="24" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt134') }}
						</div>
					</div>
					<div v-else class="flex items-center">
						<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt66') }}
						</div>
					</div>

					<div
						@click="loginPwdShow = true"
						class="py-2 px-4 rounded-[50px] min-w-[90px] text-center bg-background-tertiary text-text-primary text-style-web-body-bold">
						{{ t('my.txt123') }}
					</div>
				</div>
			</div>

			<!-- <div class="mb-10">
				<div class="flex items-center">
					<base-icon name="user-center/icon15" :size="24" />
					<div class="pl-3 text-text-primary text-style-web-h2-medium">{{ t('my.txt124') }}</div>
				</div>
				<div class="pl-[36px] py-3 text-text-description text-style-web-body-regular">
					{{ t('my.txt125') }}
				</div>
				<div class="flex justify-between items-center pl-[36px]">
					<div v-if="settingInfo.isFundPwd" class="flex items-center">
						<base-icon name="user-center/icon14" :size="24" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt134') }}
						</div>
					</div>
					<div v-else class="flex items-center">
						<base-icon name="user-center/icon6" :size="24" />
						<div class="pl-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('my.txt135') }}
						</div>
					</div>

					<div
						@click="fundPwdShow = true"
						class="py-2 px-4 rounded-[50px] min-w-[90px] text-center bg-background-tertiary text-text-primary text-style-web-body-bold">
						{{ settingInfo.isFundPwd ? t('my.txt123') : t('text19') }}
					</div>
				</div>
			</div> -->
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<Menu :active="1" />
		<div class="w-[800px] ml-20 pt-10">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('my.txt42') }}</div>
			<div class="pt-10">
				<div class="text-text-primary text-style-web-h2-bold">{{ t('text149') }}</div>
				<div class="pt-4">
					<div
						class="flex justify-between items-center h-[82px] border-b border-border-strong box-border">
						<div class="text-text-description text-style-web-h3-medium">UID</div>
						<div class="flex items-center">
							<div class="mr-6 text-text-secondary text-style-web-h3-medium">
								{{ userStore.userInfo?.id }}
							</div>
							<base-icon @click="copy" name="copy" :size="20" class="text-text-primary" />
						</div>
					</div>

					<div
						class="flex justify-between items-center h-[82px] border-b border-border-strong box-border">
						<div class="text-text-description text-style-web-h3-medium">{{ t('text150') }}</div>
						<div class="flex items-center">
							<div class="w-[40px] h-[40px] rounded-full overflow-hidden bg-text-primary mr-[30px]">
								<img class="w-full h-full object-cover" :src="userStore.userInfo?.avatar" alt="" />
							</div>
							<base-icon
								name="user-center/icon9"
								@click="avatarShow = true"
								:size="20"
								class="text-text-primary" />
						</div>
					</div>

					<div
						class="flex justify-between items-center h-[82px] border-b border-border-strong box-border">
						<div class="text-text-description text-style-web-h3-medium">{{ t('my.txt80') }}</div>
						<div class="flex items-center">
							<div class="mr-[30px] text-text-secondary text-style-web-h3-medium">
								{{ userStore.userInfo?.username }}
							</div>
							<base-icon
								name="user-center/icon9"
								@click="nameShow = true"
								:size="20"
								class="text-text-primary" />
						</div>
					</div>
				</div>
			</div>

			<div class="pt-10">
				<div class="text-text-primary text-style-web-h2-bold">{{ t('text151') }}</div>
				<div class="border border-border-strong rounded-[12px] py-6 px-4 mt-3">
					<div class="flex">
						<div class="text-text-tertiary text-style-web-h5-medium mr-2">{{ t('my.txt58') }}</div>
						<div class="text-style-web-h5-medium" :class="[settingInfo.levelInfo.textClass]">
							{{ settingInfo.levelInfo.title }}
						</div>
					</div>
					<div class="mt-3 flex justify-between">
						<div
							class="flex-1 h-1 mr-2 bg-background-tertiary"
							:class="[settingInfo.levelInfo.bgClass]"></div>
						<div
							class="flex-1 h-1 mr-2 bg-background-tertiary"
							:class="[settingInfo.securityLevel > 1 ? settingInfo.levelInfo.bgClass : '']"></div>
						<div
							class="flex-1 h-1 bg-background-tertiary"
							:class="[settingInfo.securityLevel > 2 ? settingInfo.levelInfo.bgClass : '']"></div>
					</div>
				</div>

				<div class="pt-4">
					<!-- 谷歌 -->
					<div class="py-[30px] flex justify-between border-b border-border-strong">
						<div>
							<div class="flex items-center">
								<base-icon name="user-center/icon5" :size="24" />
								<div class="pl-4 text-text-primary text-style-web-h3-medium">
									{{ t('my.txt63') }}
								</div>
							</div>
							<div class="w-[500px] ml-10 mt-2 text-text-description text-style-web-small-regular">
								{{ t('my.txt65') }}
							</div>
						</div>
						<div class="flex items-center">
							<div class="mr-[30px]">
								<div v-if="!settingInfo.isGoogleAuth" class="flex items-center">
									<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt135') }}
									</div>
								</div>
								<div v-else class="flex items-center">
									<base-icon name="user-center/icon14" :size="24" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt134') }}
									</div>
								</div>
							</div>
							<div
								@click="googleEdit"
								class="h-[36px] cursor-pointer py-2 px-4 rounded-[50px] bg-background-tertiary text-style-web-body-bold text-text-primary">
								{{ t('text19') }}
							</div>
						</div>
					</div>
					<!-- 邮箱 -->
					<div class="py-[30px] flex justify-between border-b border-border-strong">
						<div>
							<div class="flex items-center">
								<base-icon name="user-center/icon7" :size="24" class="text-text-primary" />
								<div class="pl-4 text-text-primary text-style-web-h3-medium">
									{{ t('my.txt69') }}
								</div>
							</div>
							<div class="w-[500px] ml-10 mt-2 text-text-description text-style-web-small-regular">
								{{ t('my.txt70') }}
							</div>
						</div>
						<div class="flex items-center">
							<div class="mr-[30px]">
								<div v-if="!settingInfo.isEmailAuth" class="flex items-center">
									<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt135') }}
									</div>
								</div>
								<div v-else class="flex items-center">
									<base-icon name="user-center/icon14" :size="24" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt134') }}
									</div>
								</div>
							</div>
							<div
								@click="emailEdit"
								class="h-[36px] cursor-pointer py-2 px-4 rounded-[50px] bg-background-tertiary text-style-web-body-bold text-text-primary">
								{{ t('text19') }}
							</div>
						</div>
					</div>
					<!-- 手机 -->
					<div class="py-[30px] flex justify-between border-b border-border-strong">
						<div>
							<div class="flex items-center">
								<base-icon name="user-center/icon8" :size="24" class="text-text-primary" />
								<div class="pl-4 text-text-primary text-style-web-h3-medium">
									{{ t('my.txt71') }}
								</div>
							</div>
							<div class="w-[500px] ml-10 mt-2 text-text-description text-style-web-small-regular">
								{{ t('my.txt72') }}
							</div>
						</div>
						<div class="flex items-center">
							<div class="mr-[30px]">
								<div v-if="!settingInfo.isMobileAuth" class="flex items-center">
									<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt135') }}
									</div>
								</div>
								<div v-else class="flex items-center">
									<base-icon name="user-center/icon14" :size="24" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt134') }}
									</div>
								</div>
							</div>
							<div
								@click="mobileEdit"
								class="h-[36px] cursor-pointer py-2 px-4 rounded-[50px] bg-background-tertiary text-style-web-body-bold text-text-primary">
								{{ t('text19') }}
							</div>
						</div>
					</div>
					<!-- 登陆 -->
					<div class="py-[30px] flex justify-between border-b border-border-strong">
						<div>
							<div class="flex items-center">
								<base-icon name="user-center/icon15" :size="24" class="text-text-primary" />
								<div class="pl-4 text-text-primary text-style-web-h3-medium">
									{{ t('text20') }}
								</div>
							</div>
							<div class="w-[500px] ml-10 mt-2 text-text-description text-style-web-small-regular">
								{{ t('my.txt122') }}
							</div>
						</div>
						<div class="flex items-center">
							<div class="mr-[30px]">
								<div v-if="!settingInfo.isLoginAuth" class="flex items-center">
									<base-icon name="user-center/icon6" :size="24" class="text-text-disabled" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt135') }}
									</div>
								</div>
								<div v-else class="flex items-center">
									<base-icon name="user-center/icon14" :size="24" />
									<div class="ml-[6px] text-text-tertiary text-style-web-h4-regular">
										{{ t('my.txt134') }}
									</div>
								</div>
							</div>
							<div
								@click="loginPwdShow = true"
								class="h-[36px] cursor-pointer py-2 px-4 rounded-[50px] bg-background-tertiary text-style-web-body-bold text-text-primary">
								{{ t('text19') }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<FundPwd v-model:show="fundPwdShow" :settingInfo="settingInfo" @back="show = false" />
	<LoginPwd v-model:show="loginPwdShow" :settingInfo="settingInfo" @back="show = false" />

	<ModifyAvatar v-model:show="avatarShow" />

	<ModifyName v-model:show="nameShow" />

	<Mobile v-if="isPC" v-model:open="mobileShow" />
	<Email v-if="isPC" v-model:open="emailShow" />
	<GoogleValidator v-if="isPC" v-model:show="googleShow" />

	<!-- <Dialog v-model:show="googleBindTipShow" :title="t('my.txt161')">
		<div class="py-6 text-text-description text-style-web-body-regular">
			{{ t('my.txt162') }}
		</div>
		<Button @click="bindGoogle">{{ t('my.txt163') }}</Button>
	</Dialog> -->
</template>
