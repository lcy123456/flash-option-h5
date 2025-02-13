<template>
	<div class="pb-6">
		<!-- <Header /> -->
		<SwapSymbol />
		<div class="web:hidden">
			<!-- <div class="h-[4px] bg-border-subtle"></div>
			<KLine />
			<HighchartsComponent /> -->
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
				class="fixed z-50 bottom-[61px] w-full p-4 border-t border-border-gutter flex bg-background-primary text-always-white">
				<template v-if="userStore.loginToken">
					<Button
						@click="submitOrder('BUY')"
						size="small"
						type="buy"
						class="flex-1 mr-4 border-0 text-style-web-body-700">
						{{ t('option.txt1') }}
					</Button>
					<Button
						@click="submitOrder('SELL')"
						size="small"
						type="sell"
						class="flex-1 py-[11px] border-0 rounded-[50px] bg-function-sell text-style-web-body-700">
						{{ t('option.txt2') }}
					</Button>
				</template>
				<Button
					v-else
					@click="routeTo('/login')"
					class="flex-1 h-[39px] rounded-[50px] bg-brand-main text-style-web-body-700 border-0">
					{{ t('trade.txt110') }}
				</Button>
			</div>
		</div>

		<ShowResPopup
			v-model="state.showResVisible"
			:direction="state.orderDirection"
			:period="state.timeResolution.label"
			:count="state.amount"
			:time="state.orderCountDownTime" />
	</div>
</template>
<script lang="ts" setup>
import { onMounted, watch } from 'vue'
// import Header from '@/components/Header.vue'
import SwapSymbol from './SwapSymbol.vue'
// import KLine from './KLine.vue'
import { useFlashOption } from '@/hooks/useFlashOption'
// import HighchartsComponent from './component/HighchartsComponent.vue'
import QuickTrade from './QuickTrade.vue'
import Order from './order/index.vue'
import { addOrder } from '@/apis/option'
import { showToast } from '@/components/base/toast'
import ShowResPopup from './component/ShowResPopup.vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { routeTo } from '@/utils/routeTo'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/base'

const userStore = useUserStore()
const { t } = useI18n()
const appstore = useAppStore()

const { initData, state } = useFlashOption()
let addLoading = false

onMounted(() => {
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
	state.orderDirection = type
	const res = await addOrder({
		symbol: state.symbol,
		direction: type,
		amount: state.amount,
		period: state.timeResolution.value
		// time: Date.now()
	})
	setTimeout(() => {
		addLoading = false
	}, 3000)
	if (res.code === 0) {
		state.amount = undefined
		state.addOrderInfo = res.data
		// showToast('下单成功')
		state.orderCountDownTime = Math.floor((Number(res.data.optionCloseTime) - Date.now()) / 1000)
		state.showResVisible = true

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

watch(
	() => appstore.visibleState,
	() => {
		if (Date.now() - state.newPoint.x > 30 * 1000) {
			console.log('数据超过30秒未更新，刷新页面')
			location.reload()
		}
		setTimeout(() => {
			window.scrollTo(0, 0)
		}, 500)
	}
)
</script>
