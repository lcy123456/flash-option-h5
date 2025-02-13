<template>
	<div>
		<div class="py-[12px] px-[16px] web:hidden">
			<div class="flex items-center">
				<div class="flex items-center flex-1" @click="data.showSearch = true">
					<span class="text-web-h4-bold text-text-primary">{{ state.symbol }}</span>
					<span class="text-style-web-body-regular ml-[4px] text-text-primary">
						{{ t('text130') }}
					</span>
					<img src="/imgs/flashoption/coin-down.svg" class="w-[16px] h-[16px] ml-[8px]" />
				</div>
				<img
					:src="`/imgs/common/${state.isFavor ? 'bookmarked' : 'bookmark'}.svg`"
					class="w-5 h-5"
					@click="favorStatusAction(state.symbol, state.isFavor)" />

				<!--  <img src="/imgs/dcontract/store.svg" class="w-[24px] h-[24px]" /> -->
			</div>
			<div class="mt-[12px] flex">
				<div class="flex-1">
					<div class="text-style-web-h1-bold text-function-buy">{{ thousandsComma(newPrice) }}</div>
					<div
						class="text-style-web-small-regular text-text-tertiary"
						v-if="state.optionData.optionNo">
						No.{{ state.optionData.optionNo }}
						<!-- {{ thousandsComma(walletStore.getUSDTPrice(newPrice)) }}
						{{ walletStore.getCurrencyInfo().code }} -->
					</div>
				</div>
				<div class="text-right">
					<div class="text-style-web-body-medium text-text-primary">
						<span v-if="state.times.length > 0">
							{{ state.times[0].sTime }} - {{ state.times[0].oTime }}
						</span>
						/{{ data.tensDiv }}:{{ data.onesDiv }}
					</div>
					<div class="text-style-web-small-regular text-text-description">
						{{ t('text268') }}/{{ t('option.txt4') }}
					</div>
				</div>
			</div>
		</div>
		<div class="flex">
			<div ref="slideRef" :class="isWeb ? getSlideClass : ''">
				<Quote
					v-model:show="data.showSearch"
					:type="marketSearchEnum.dcontract"
					:showClose="false" />
			</div>
			<div class="flex-1 overflow-hidden">
				<div
					class="flex relative w-full items-center pdph:hidden h-[72px] border-b-[2px] border-border-gutter px-[6px]">
					<div class="flex items-center flex-1">
						<div class="flex items-center flex-1 pl-[16px]">
							<div class="flex items-center">
								<div class="text-web-h4-bold text-text-primary">
									{{ state.symbol }} {{ t('text130') }}
								</div>
								<!-- <img src="/imgs/flashoption/coin-down.svg" class="w-[16px] h-[16px] ml-[8px]" /> -->
							</div>
							<div class="text-style-web-h2-bold text-function-buy ml-[24px] w-[160px]">
								{{ thousandsComma(newPrice) }}
							</div>
							<div
								class="ml-[16px] text-style-web-body-regular text-text-description"
								v-if="state.optionData.optionNo">
								No.{{ state.optionData.optionNo }}
							</div>
						</div>
						<div class="w-[200px] text-right">
							<div class="text-style-web-body-regular text-text-description">
								{{ t('text268') }}/{{ t('option.txt4') }}
							</div>
							<div class="text-style-web-h2-regular text-text-secondary ml-[6px]">
								<span v-if="state.times.length > 0">
									{{ state.times[0].sTime }} - {{ state.times[0].oTime }}
								</span>
								/{{ data.tensDiv }}:{{ data.onesDiv }}
							</div>
						</div>
					</div>
					<div class="w-[320px]"></div>
					<img
						:src="
							data.isCloseSlide ? '/imgs/common/expand_layout.svg' : '/imgs/common/close_layout.svg'
						"
						class="w-[12px] h-[29px] cursor-pointer absolute left-0"
						style="bottom: -15px"
						@click="data.isCloseSlide = !data.isCloseSlide" />
				</div>
				<div class="flex" :class="isWeb ? 'h-[542px]' : ''">
					<div class="flex-1 border border-border-gutter">
						<KLine />
					</div>
					<div class="h-[542px] w-[320px] border border-border-gutter pdph:hidden">
						<QuickTrade />
						<div class="w-full mt-[20px] flex bg-background-primary text-always-white px-[16px]">
							<div
								class="flex flex-col w-full justify-between items-center"
								v-if="userStore.loginToken">
								<Button @click="submitOrder('BUY')" size="small" type="buy" class="w-full">
									{{ t('text101') }}
								</Button>
								<Button
									@click="submitOrder('SELL')"
									size="small"
									type="sell"
									class="w-full mt-[16px]">
									{{ t('text102') }}
								</Button>
							</div>
							<div v-else class="flex flex-col w-full justify-between items-center">
								<Button
									@click="routeTo('/login')"
									size="small"
									class="w-full flex border-0 bg-brand-main text-always-white text-style-web-body-bold items-center justify-center cursor-pointer">
									{{ t('login.txt1') }}
								</Button>
								<div
									@click="routeTo('/register')"
									size="small"
									class="w-full mt-[16px] flex h-[39px] rounded-[50px] text-text-primary border border-border-button_strong text-style-web-body-bold items-center justify-center cursor-pointer">
									{{ t('home.txt2') }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, reactive, watch, onBeforeUnmount, ref } from 'vue'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import Quote from '@/views/quote/index.vue'
import { showToast } from '@/components/base/toast'
import { marketSearchEnum } from '@/enums/trade'
import { useI18n } from 'vue-i18n'
import { thousandsComma } from '@/utils/trade'
import { useWalletStore } from '@/store/modules/wallet'
import { useDevice } from '@/hooks/useDevice'
import KLine from './KLine.vue'
import { useUserStore } from '@/store/useUserStore'
import QuickTrade from './QuickTrade.vue'
import { addOrder } from '@/apis/dcontract'
import { routeTo } from '@/utils/routeTo'
import { Button } from '@/components/base'

const walletStore = useWalletStore()
const { t } = useI18n()
const { state, favorStatusAction, updateTimeOption } = useDeliveryContract()
const { isWeb } = useDevice()
const slideRef = ref()
const userStore = useUserStore()

const data = reactive({
	times: [],
	downTime: 0,
	hundredsDiv: '00',
	tensDiv: '00',
	onesDiv: '00',
	showSearch: false,
	isCloseSlide: false
})
const newPrice = computed(() => {
	return state.openPrice
})
const getSlideClass = computed(() => {
	if (data.isCloseSlide) {
		return `w-[320px] h-[614px] border-t border-b border-r-[2px] border-border-gutter hidden`
	}
	return `show w-[320px] h-[614px] border-t border-b border-r-[2px] border-border-gutter`
})
// const initData = async () => {
// 	const res = await queryOptionPeriod()
// 	if (res.code === 0) {
// 		res.data = res.data || []
// 		state.times = res.data.map((item: any) => {
// 			const newItem = {
// 				label: item.name,
// 				value: item.period
// 			}
// 			const str = newItem.value.split('_')[1]
// 			if (/^0/.test(str)) {
// 				const num = Number(str)
// 				const time = 1000 * num
// 				newItem.time = time
// 			} else if (/^[1-9]/.test(str)) {
// 				const num = Number(str)
// 				const time = 1000 * 60 * num
// 				newItem.time = time
// 			}
// 			return newItem
// 		})
// 		if (state.times.length > 0) {
// 			state.timeResolution = state.times[0]
// 		}
// 	}
// }
// initData()

let timerId
function startTimer() {
	if (timerId) {
		clearInterval(timerId)
	}
	// 定时器
	timerId = setInterval(() => {
		let countdown = data.downTime
		if (countdown < 0) {
			data.hundredsDiv = '00'
			data.tensDiv = '00'
			data.onesDiv = '00'

			clearInterval(timerId) // 停止定时器
			return
		}
		const hour = parseInt(countdown / 3600)
		const min = parseInt((countdown / 60) % 60)
		const sec = Math.round(countdown % 60)

		// 更新DOM元素
		data.hundredsDiv = addZero(hour)
		data.tensDiv = addZero(min)
		data.onesDiv = addZero(sec)

		// 减少总秒数
		data.downTime--

		// 检查是否倒计时结束
		if (countdown < 0) {
			clearInterval(timerId) // 停止定时器
		}
	}, 1000)
}

function addZero(num) {
	if (num < 10) {
		return '0' + num
	}
	return num
}

function getClass(item, index) {
	let cls = ''
	if (index > 0) {
		cls = 'ml-[12px]'
	}
	if (state.timeResolution.period === item.value) {
		cls += ' bg-background-tertiary text-text-primary border border-border-button_strong'
	} else {
		cls += ' border-0 bg-background-secondary text-text-description'
	}
	return cls
}
watch(
	() => state.optionData.downTime,
	(newVal: { val: number }) => {
		data.downTime = newVal.val
		console.log('刷新倒计时:', data.downTime)
		startTimer()
	}
)

let checkCount = null // 用于存储定时器的引用
let isChecking = false // 标记是否已经开始检查

function checkIfZero() {
	if (data.downTime < 1) {
		if (!isChecking) {
			isChecking = true
			setTimeout(() => {
				if (data.downTime < 1) {
					updateTimeOption()
				}
				// isChecking = false
			}, 3000)
		}
	}
}

// 开始定时检查
checkCount = setInterval(checkIfZero, 5000)

onBeforeUnmount(() => {
	if (checkCount) {
		clearInterval(checkCount)
	}
})

let addLoading = false

/**
 * 提交订单
 */
const submitOrder = async (type: string) => {
	if (!state.amount || Number(state.amount) < state.minAmount) {
		showToast(`${t('option.txt25')} ${state.minAmount} USDT`)
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
		// time: Date.now()
	}
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
</script>
