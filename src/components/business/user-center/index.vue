<script setup lang="ts">
import { reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Copy } from '@/components/base'
import { useUserStore } from '@/store/useUserStore'
import { useSimulation } from '@/hooks/useSimulation'

const { t } = useI18n()
const userStore: any = useUserStore()
const simulation = useSimulation()
const router = useRouter()

const items = reactive([
	{
		title: t('my.txt42'),
		path: '/user/security-setting'
	},
	{
		title: t('my.txt74'),
		path: '/user/kyc'
	},
	{
		title: t('my.txt43'),
		path: '/invite'
	},
	{
		title: t('text110'),
		type: 'simulation'
	},
	{
		title: t('my.txt53'),
		path: '/activitycenter'
	}
])

const logout = async () => {
	await userStore.logout()
	window.location.href = '/login'
}

const change = (item: any) => {
	if (item.type === 'simulation') {
		simulation.changeUser()
		return
	}
	router.push(item.path)
}
</script>

<template>
	<!-- 	:visible="true" -->
	<el-popover
		:show-arrow="false"
		popper-class="!rounded-[12px] !py-[30px] !px-[0px] !bg-background-window !border-background-primary"
		placement="bottom-end"
		style="outline: 0 !important"
		trigger="hover"
		:offset="20"
		:width="300">
		<div>
			<div class="px-[30px] flex items-center">
				<img
					class="flex-shrink-0 w-[50px] h-[50px] object-cover rounded-full overflow-hidden"
					:src="userStore.userInfo?.avatar"
					alt="" />
				<div class="ml-[10px] flex-1 overflow-hidden">
					<el-tooltip
						popper-class="max-w-[90vw]"
						:content="userStore.userInfo?.username"
						placement="top">
						<div class="text-text-primary overflow-hidden whitespace-nowrap text-ellipsis">
							{{ userStore.userInfo?.username }}
						</div>
					</el-tooltip>
					<div class="mt-1 flex text-text-description text-style-web-small-regular">
						UID:
						<Copy
							textClass="text-text-description text-style-web-small-regular mr-[2px]"
							:iconSize="14"
							:text="String(userStore.userInfo?.id)"></Copy>
					</div>
				</div>
			</div>

			<!-- <div class="mt-[17px] h-[43px] bg-border-subtle rounded"></div> -->

			<div class="mt-[17px]">
				<div
					v-for="item in items"
					@click="change(item)"
					:key="item.title"
					class="py-4 px-[30px] text-text-primary text-style-web-body-medium cursor-pointer hover:bg-background-secondary">
					{{ item.title }}
				</div>
				<div
					@click="logout"
					class="py-4 px-[30px] text-text-error text-style-web-body-medium cursor-pointer hover:bg-background-secondary">
					{{ t('text111') }}
				</div>
			</div>
		</div>
		<template #reference>
			<slot />
		</template>
	</el-popover>
</template>
