<script setup lang="ts">
import { reactive, ref, computed, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { showSuccessToast } from 'vant'
import useClipboard from 'vue-clipboard3'
import { useKyc } from '@/hooks/useKyc'
import { useSecuritySetting } from '@/hooks/useSecuritySetting'

import { Breadcrumb } from '@/components/base'
import ModifyAvatar from './ModifyAvatar.vue'
import ModifyName from './ModifyName.vue'

import { useUserStore } from '@/store/useUserStore'

const router = useRouter()
const { t } = useI18n()
const { kycInfo } = useKyc()
const { settingInfo, updateSettingInfo } = useSecuritySetting()
const { toClipboard } = useClipboard()
const userStore: any = useUserStore()
const avatarShow = ref(false)
const nameShow = ref(false)

const items = reactive([
	{
		title: t('my.txt57'),
		path: '/user'
	},
	{
		title: t('my.txt78')
	}
])

onBeforeMount(() => {
	updateSettingInfo()
})

const kycIcon = computed(() => {
	const active = [
		{ level: 2, icon: 'user-center/icon16' },
		{ level: 1, icon: 'user-center/icon17' },
		{ level: 0, icon: 'user-center/icon18' }
	].find((item) => item.level === kycInfo.value.level)

	return active?.icon || ''
})

const copy = () => {
	toClipboard(String(userStore.userInfo?.id))
	showSuccessToast({
		message: t('register.txt14'),
		zIndex: 9999
	})
}
</script>

<template>
	<Breadcrumb :items="items" />
	<div class="py-6 px-4">
		<div class="border border-border-strong rounded-lg py-6 px-4">
			<div class="flex justify-between items-center">
				<div class="w-[64px] h-[64px] rounded-full overflow-hidden bg-text-primary">
					<img class="w-full h-full object-cover" :src="userStore.userInfo?.avatar" alt="" />
				</div>
				<div @click="avatarShow = true">
					<base-icon name="user-center/icon9" :size="20" class="text-text-primary" />
				</div>
			</div>

			<div class="mt-4 flex justify-between items-center">
				<div class="text-text-description text-style-web-body-medium flex-shrink-0">
					{{ t('my.txt80') }}
				</div>
				<div class="flex flex-1 overflow-hidden ml-1">
					<el-tooltip
						popper-class="max-w-[90vw]"
						:content="userStore.userInfo?.username"
						placement="top">
						<div
							class="flex-1 text-right mr-2 text-text-secondary text-style-web-body-medium text-ellipsis whitespace-nowrap overflow-hidden">
							{{ userStore.userInfo?.username }}
						</div>
					</el-tooltip>
					<div class="flex-shrink-0" @click="nameShow = true">
						<base-icon name="user-center/icon9" :size="20" class="text-text-primary" />
					</div>
				</div>
			</div>

			<div class="mt-4 flex justify-between items-center">
				<div class="text-text-description text-style-web-body-medium">UID</div>
				<div class="flex" @click="copy">
					<div class="mr-2 text-text-secondary text-style-web-body-medium">
						{{ userStore.userInfo?.id }}
					</div>
					<div>
						<base-icon name="copy" :size="20" class="text-text-primary" />
					</div>
				</div>
			</div>

			<div class="mt-4 flex justify-between items-center" @click="router.push('/user/kyc')">
				<div class="text-text-description text-style-web-body-medium">{{ t('my.txt52') }}</div>
				<div class="flex">
					<div class="mr-2 text-style-web-body-medium flex">
						<base-icon :name="kycIcon" :size="20" />
						<div class="ml-2" :class="[kycInfo.textClass]">{{ kycInfo.lable }}</div>
					</div>
					<div>
						<base-icon name="user-center/icon10" :size="20" class="text-text-primary" />
					</div>
				</div>
			</div>

			<div
				class="mt-4 flex justify-between items-center"
				@click="router.push('/user/security-setting')">
				<div class="text-text-description text-style-web-body-medium">{{ t('my.txt82') }}</div>
				<div class="flex">
					<div class="mr-2 flex items-center">
						<base-icon
							name="user-center/icon20"
							:size="20"
							:class="[settingInfo.levelInfo.textClass]" />
						<div class="ml-2 text-style-web-body-medium" :class="[settingInfo.levelInfo.textClass]">
							{{ settingInfo.levelInfo.title }}
						</div>
					</div>
					<div>
						<base-icon name="user-center/icon10" :size="20" class="text-text-primary" />
					</div>
				</div>
			</div>

			<div class="mt-4 flex justify-between items-center">
				<div class="text-text-description text-style-web-body-medium">{{ t('my.txt83') }}</div>
				<div class="flex">
					<div class="mr-2 text-text-secondary text-style-web-body-medium">
						{{ userStore.userInfo?.email }}
					</div>
					<!-- <div>
							<base-icon name="user-center/icon10" :size="20" />
						</div> -->
				</div>
			</div>
		</div>
	</div>

	<ModifyAvatar v-model:show="avatarShow" />

	<ModifyName v-model:show="nameShow" />
</template>
