<template>
	<div>
		<div class="pb-[60px] web:hidden">
			<div v-if="!userStore.loginToken" class="flex justify-center px-[16px] mt-[30px] mb-[24px]">
				<LoginGuid />
			</div>
			<div v-else class="px-[16px]">
				<div class="mt-[20px]">
					<Assets />
				</div>
				<div class="mt-[24px]">
					<Swip :list="state.banners" />
				</div>
				<div class="mt-[10px]">
					<Notices :list="state.notices" />
				</div>
			</div>
			<div class="my-[24px]">
				<Brand />
			</div>
			<div>
				<Hot :list="state.data.recommend" />
			</div>
			<div class="px-[16px] my-[17px]">
				<List :list="state.data.changeRank" />
			</div>
		</div>
		<div v-if="isWeb">
			<pcIndex />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, onBeforeMount } from 'vue'
// import { useI18n } from 'vue-i18n'
import { getItem } from '@/utils/storage'
import { StorageKeyEnum } from '@/enums'
import LoginGuid from './LoginGuide.vue'
import Brand from './Brand.vue'
import Hot from './Hot.vue'
import List from './List.vue'

import Assets from './Assets.vue'
import Swip from './Swip.vue'
import Notices from './Notices.vue'
import { useUserStore } from '@/store/useUserStore'
import { useMarketOverView } from '@/hooks/useMarketOverView'
import { useWalletStore } from '@/store/modules/wallet'
// const { locale } = useI18n()
import { useDevice } from '@/hooks/useDevice'
import pcIndex from './pcIndex.vue'

const walletStore = useWalletStore()
const userStore = useUserStore()
const { state, initData, closeWs } = useMarketOverView()
const { isWeb } = useDevice()

onBeforeMount(() => {
	initData(isWeb.value ? 2 : 1)
	// loadNoticeAndBanner(isWeb.value ? 2 : 1)
	if (getItem(StorageKeyEnum.token)) {
		// 已登录，加载用户资产信息
		walletStore.initAsset()
	}
})

onBeforeUnmount(() => {
	closeWs()
})
// watch(locale, () => {
// 	if (userStore.loginToken) {
// 		// 登录状态下调用
// 		console.log('刷新通知。。。')
// 		loadNoticeAndBanner()
// 	}
// })
</script>
<style lang="scss" scoped>
$primary-color: #1a82f7;
.test {
	color: $primary-color;
}
</style>
