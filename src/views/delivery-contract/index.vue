<template>
	<div class="pb-6">
		<Top />
		<div class="web:hidden">
			<!-- <div class="h-[4px] bg-border-subtle"></div>
			<KLine /> -->
			<div class="h-[4px] bg-border-subtle"></div>
			<div id="quick_form">
				<QuickTrade />
			</div>
			<div class="h-[4px] bg-border-subtle"></div>
		</div>
		<Order />
		<div class="web:hidden">
			<div class="h-[36px] bg-border-subtle"></div>
			<div
				class="fixed z-50 bottom-[61px] w-full p-4 border-t border-border-gutter flex bg-background-primary text-always-white"
				:class="isPC ? 'w-[390px] left-[50%] -translate-x-1/2' : ''">
				<template v-if="userStore.loginToken">
					<Button @click="submitOrder('BUY')" size="small" type="buy" class="flex-1 mr-4">
						{{ t('text101') }}
					</Button>
					<Button @click="submitOrder('SELL')" size="small" type="sell" class="flex-1">
						{{ t('text102') }}
					</Button>
				</template>
				<div
					v-else
					@click="routeTo('/login')"
					class="flex-1 flex h-[39px] rounded-[50px] bg-background-cue text-style-web-body-700 items-center justify-center">
					{{ t('trade.txt110') }}
				</div>
			</div>
		</div>
		<ShowResPopup
			v-model="state.visible"
			:direction="state.direction"
			:period="state.timeResolution.name"
			:count="state.amount"
			:time="state.time" />
	</div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount, reactive, onMounted, watch } from 'vue'
import Top from './Top.vue'
// import KLine from './kline/index.vue'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import QuickTrade from './QuickTrade.vue'
import Order from './order/index.vue'
import { addOrder } from '@/apis/dcontract'
import { showToast } from '@/components/base/toast'
import ShowResPopup from './component/ShowResPopup.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { routeTo } from '@/utils/routeTo'
import { useDevice } from '@/hooks/useDevice'
// import { useAppStore } from '@/store/useAppStore'
import { useRoute } from 'vue-router'
import { Button } from '@/components/base'

const { isPC } = useDevice()
const route = useRoute()
const userStore = useUserStore()
const { t } = useI18n()
// const appstore = useAppStore()

const { initData, state } = useDeliveryContract()
let addLoading = false
const data = reactive({
	visible: false,
	direction: '',
	time: 0
})

onMounted(() => {
	const name = route.params.symbol
	if (name.includes('-')) {
		const symbol = name.replace('-', '/')
		state.symbol = symbol
	}
	initData()

	setTimeout(() => {
		window.scrollTo(0, 0)
	}, 600)
})

/**
 * 提交订单
 */
const submitOrder = async (type: string) => {
	if (!state.amount || Number(state.amount) < state.minAmount) {
		showToast(`${t('option.txt25')} ${state.minAmount} USDT`)
		scrollToElement('quick_form')
		state.focusInput = Date.now()
		return
	}
	if (addLoading) {
		return
	}
	addLoading = true
	state.direction = type
	const params = {
		symbol: state.symbol,
		direction: type,
		amount: state.amount,
		amountPercent: state.amountPercent,
		period: state.timeResolution.period,
		optionId: state.currentTimesOption.id
	}
	console.log('params :', params)
	const res = await addOrder(params)
	setTimeout(() => {
		addLoading = false
	}, 3000)
	if (res.code === 0) {
		state.amount = undefined
		state.amountPercent = undefined
		state.addOrderInfo = res.data
		// showToast('下单成功')
		state.time = Math.floor((Number(res.data.optionCloseTime) - Date.now()) / 1000)
		state.visible = true

		state.orderRefreshTime = Date.now() // 刷新订单列表
	}
}

function scrollToElement(id) {
	const element = document.getElementById(id)
	if (element) {
		element.scrollIntoView({ behavior: 'smooth', block: 'start' })

		setTimeout(() => {
			// 获取当前滚动位置
			const currentScrollTop = document.documentElement.scrollTop

			// 向下滚动120px
			window.scrollTo(0, currentScrollTop)
		}, 500)
	}
}

// watch(
// 	() => appstore.visibleState,
// 	() => {
// 		if (Date.now() - state.newPoint.x > 30 * 1000) {
// 			console.log('数据超过30秒未更新，刷新页面')
// 			location.reload()
// 		}
// 		setTimeout(() => {
// 			window.scrollTo(0, 0)
// 		}, 500)
// 	}
// )
</script>
