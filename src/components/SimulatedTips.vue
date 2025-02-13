<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from '@/components/base/toast'
import { useUserStore } from '@/store/useUserStore'
import { switchUser } from '@/apis/user'

const { t } = useI18n()
const userStore = useUserStore()
const router = useRouter()

defineProps({
	type: {
		type: String,
		default: 'page'
	}
})

const signOut = async () => {
	const res: any = await switchUser()
	if (res.code === 0) {
		userStore.setUserInfo(res.data)
		userStore.setLoginToken(res.data.token)
		userStore.setSimulatedAccount(res.data.virtual)
		showSuccessToast(res.message)
		router.go(0)
	} else {
		showFailToast(res.message)
	}
}
</script>

<template>
	<div
		v-if="userStore.isSimulatedAccount && userStore.loginToken && type === 'page'"
		class="web:hidden py-2 px-4 bg-background-tertiary flex justify-between items-center">
		<div class="flex items-center">
			<icon name="tip2" class="text-text-description mb-[1px]" :size="16" />
			<div class="ml-1 text-text-secondary text-style-web-small-regular">{{ t('text112') }}</div>
		</div>
		<div
			@click="signOut"
			class="flex items-center h-[24px] px-3 rounded-[50px] bg-text-primary text-always-white text-style-web-base-regular">
			{{ t('text111') }}
		</div>
	</div>

	<div
		v-if="userStore.isSimulatedAccount && userStore.loginToken && type === 'head'"
		class="pdph:hidden py-[6px] px-4 bg-background-tertiary rounded-[25px] flex items-center">
		<icon name="tip2" class="text-text-description mb-[1px]" :size="16" />
		<div class="ml-1 text-text-secondary text-style-web-small-regular">{{ t('text112') }}</div>

		<div
			@click="signOut"
			class="ml-3 cursor-pointer flex items-center h-[24px] px-3 rounded-[50px] bg-text-primary text-always-white text-style-web-base-regular">
			{{ t('text111') }}
		</div>
	</div>
</template>
