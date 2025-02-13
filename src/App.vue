<template>
	<div>
		<router-view></router-view>
		<div v-if="isWeb">
			<TransferPopup
				v-if="appStore.transferVisible"
				v-model:show="appStore.transferVisible"
				@ok="handleRefresh" />
			<NoticeDialog v-if="appStore.noticeVisible" v-model:show="appStore.noticeVisible" />
			<ActivitycenterDialog
				v-if="appStore.activityVisible"
				v-model:show="appStore.activityVisible" />
		</div>
		<!-- <div
			v-if="showClientService"
			ref="draggableDiv"
			@click="goClient"
			class="cursor-pointer flex items-center justify-center w-[44px] h-[44px] rounded-[8px] bg-brand-blue fixed z-1000"
			:class="isWeb ? 'bottom-[60px] right-[40px]' : 'bottom-[80px] right-[2px]'">
			<img src="/imgs/common/client.svg" style="width: 24px; height: 24px" />
		</div> -->
		<!-- <van-button
			v-if="showClientService"
			type="primary"
			class="fixed z-1000 bottom-[60px] right-[40px] w-[44px] h-[44px] rounded-[8px]">
			<template #icon>
				<img src="/imgs/common/client.svg" style="width: 24px; height: 24px" />
			</template>
		</van-button> -->
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount, watch, onBeforeUnmount, computed, onMounted, ref } from 'vue'
import { useWalletStore } from '@/store/modules/wallet/index'
import { useUserStore } from '@/store/useUserStore'
import { useI18n } from 'vue-i18n'
import { showFailToast } from '@/components/base/toast'
import { useAppStore } from '@/store/useAppStore'
import { useTradeWsStore } from '@/store/modules/trade/trade-ws'
import TransferPopup from '@/views/my/transfer/dialogs/index.vue'
import { useDevice } from '@/hooks/useDevice'
import NoticeDialog from '@/views/notice/dialog/index.vue'
import ActivitycenterDialog from '@/views/activitycenter/dialog/index.vue'
import { useRoute } from 'vue-router'
import { CLIENT_SERVICE, SHOW_CLIENT_PATH } from '@/constants'
import { useThemeStore } from '@/store/useThemeStore'
import { useDraggable } from '@/hooks/useDraggable'

const walletStore = useWalletStore()
const userStore = useUserStore()
const appStore = useAppStore()
const { t } = useI18n()
const tradeWsStore = useTradeWsStore()
const { isWeb } = useDevice()
const route = useRoute()
const themeStore = useThemeStore()

const draggableDiv = useDraggable()

tradeWsStore.createTradeWs()

watch(
	() => isWeb.value,
	() => {
		if (isWeb.value) {
			document.body.classList.add('body-pc-width')
		} else {
			document.body.classList.remove('body-pc-width')
		}
	},
	{
		immediate: true
	}
)

onMounted(() => {
	themeStore.init()
})

onBeforeMount(() => {
	if (userStore.loginToken) {
		userStore.getUserInfo()
	}
	walletStore.initExchangeRate()
})

// watch(
// 	() => appStore.httpCode,
// 	(val: number) => {
// 		if (val === 1) {
// 			showFailToast(t('common.txt1'))
// 		} else if (val === 2) {
// 			showFailToast(t('common.txt2'))
// 		}
// 		appStore.httpCode = -1
// 	}
// )

const updateScreenWidth = () => {
	setTimeout(() => {
		appStore.resize = window.innerWidth
	}, 500)
}

window.addEventListener('resize', updateScreenWidth)

onBeforeUnmount(() => {
	window.removeEventListener('resize', updateScreenWidth)
})

const handleRefresh = () => {
	appStore.refreshTransfer = Date.now()
}

const showClientService = computed(() => {
	if (!CLIENT_SERVICE) {
		return false
	}
	const index = SHOW_CLIENT_PATH.findIndex((item) => route.path.includes(item))
	return index !== -1
})

const goClient = () => {
	window.open(CLIENT_SERVICE, '_blank')
}
</script>
