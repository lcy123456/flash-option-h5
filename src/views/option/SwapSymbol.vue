<template>
	<div class="py-[12px] px-[16px] web:hidden">
		<div class="flex items-center justify-between">
			<div>
				<div class="flex items-center" @click="data.showSearch = true">
					<div class="text-web-h4-bold text-text-primary">
						{{ state.symbol }} {{ t('option.txt3') }}
					</div>
					<Icon name="common/chevron-down" :size="18" class="text-text-primary" />
				</div>
				<div class="text-style-web-small-regular text-text-description">
					{{ state.startingData.name }}
				</div>
			</div>
			<!-- <div>
				<img src="/imgs/common/theme-light.svg" class="w-[20px] h-[20px]" />
			</div> -->
		</div>
		<div class="mt-[12px] flex justify-between">
			<div
				class="w-[58px] h-[28px] rounded-[4px] flex items-center justify-center text-style-web-base-medium"
				v-for="(item, i) in state.times"
				:key="item.value"
				@click="updateTimeResolution(item)"
				:class="getClass(item, i)">
				{{ item.label }}
			</div>
		</div>
		<div class="mt-[12px] flex">
			<div class="flex-1">
				<div class="text-style-web-h1-bold text-function-buy">{{ thousandsComma(newPrice) }}</div>
				<div class="text-style-web-small-regular text-text-tertiary">
					<!-- {{ thousandsComma(walletStore.getUSDTPrice(newPrice)) }}
					{{ walletStore.getCurrencyInfo().code }} -->
					No.{{ state.startingData.id }}
				</div>
			</div>
			<div class="text-right">
				<div class="text-style-web-body-medium text-text-primary">
					{{ state.startingData.sTime }}-{{ state.startingData.oTime }} / {{ data.tensDiv }}:{{
						data.onesDiv
					}}
				</div>
				<div class="text-style-web-small-regular text-text-description">
					{{ t('text268') }} / {{ t('option.txt4') }}
				</div>
			</div>
		</div>
	</div>

	<div class="flex">
		<div ref="slideRef" :class="isWeb ? getSlideClass : ''">
			<Quote v-model:show="data.showSearch" :show-close="false" :type="marketSearchEnum.option" />
		</div>
		<div class="flex-1 overflow-hidden">
			<div
				class="flex relative w-full items-center pdph:hidden h-[72px] border-b-[2px] border-border-gutter pl-[16px]">
				<div class="flex items-center flex-1">
					<div class="flex items-center flex-1">
						<div class="flex items-center">
							<div class="text-web-h4-bold text-text-primary">
								{{ state.symbol }} {{ t('option.txt3') }}
							</div>
							<!-- <img src="/imgs/flashoption/coin-down.svg" class="w-[16px] h-[16px] ml-[8px]" /> -->
						</div>
						<div class="text-style-web-h2-bold text-function-buy ml-[24px] min-w-[120px]">
							{{ thousandsComma(newPrice) }}
						</div>
						<div class="ml-[24px] text-text-description text-style-web-body-regular">
							No.{{ state.startingData.id }}
						</div>
					</div>
					<div class="items-center text-right">
						<div class="text-style-web-body-regular text-text-description">
							{{ t('text268') }}/{{ t('option.txt4') }}
						</div>
						<div class="text-style-web-h2-regular text-text-secondary ml-[6px]">
							{{ state.startingData.sTime }}-{{ state.startingData.oTime }}/{{ data.tensDiv }}:{{
								data.onesDiv
							}}
						</div>
					</div>
				</div>
				<div :style="{ width: `${data.orderWidth}px` }"></div>
				<div
					class="absolute left-0 h-[29px] w-3 bg-background-tertiary flex items-center justify-center cursor-pointer"
					style="bottom: -15px"
					@click="data.isCloseSlide = !data.isCloseSlide">
					<Icon name="common/full-arrow" :size="6" class="text-text-primary" />
					<!-- <img src="/imgs/common/full-arrow.svg" class="w-2 h-2" /> -->
				</div>

				<!-- <img
					:src="
						data.isCloseSlide ? '/imgs/common/expand_layout.svg' : '/imgs/common/close_layout.svg'
					"
					class="w-[12px] h-[29px] cursor-pointer absolute left-0"
					style="bottom: -15px"
					@click="data.isCloseSlide = !data.isCloseSlide" /> -->
			</div>
			<van-row id="tvRoot">
				<van-col :span="isWeb ? 24 - data.span : '24'">
					<div class="flex-1 border-b border-border-gutter">
						<chartMain />
					</div>
				</van-col>
				<van-col :span="isWeb ? data.span : '0'">
					<div class="h-[542px] border border-border-gutter pdph:hidden">
						<QuickTrade />
						<div class="px-[16px] mt-[20px] flex bg-background-primary text-always-white">
							<div
								class="flex flex-col w-full justify-between items-center"
								v-if="userStore.loginToken">
								<Button @click="submitOrder('BUY')" size="small" type="buy" class="w-full">
									{{ t('option.txt1') }}
								</Button>
								<Button
									@click="submitOrder('SELL')"
									size="small"
									type="sell"
									class="w-full mt-[16px]">
									{{ t('option.txt2') }}
								</Button>
							</div>
							<div v-else class="flex flex-col w-full justify-between items-center">
								<Button
									@click="routeTo('/login')"
									size="small"
									class="w-full flex h-[39px] border-0 rounded-[50px] bg-brand-main text-always-white text-style-web-body-bold items-center justify-center cursor-pointer">
									{{ t('login.txt1') }}
								</Button>
								<Button
									@click="routeTo('/register')"
									size="small"
									class="mt-3 border border-border-button_strong bg-transparent !text-text-primary text-style-web-body-bold">
									{{ t('home.txt2') }}
								</Button>
							</div>
						</div>
					</div>
				</van-col>
			</van-row>
		</div>
	</div>
</template>
<script setup lang="ts">
import { computed, reactive, watch, onBeforeUnmount, ref, onMounted } from 'vue'
import { useFlashOption } from '@/hooks/useFlashOption'
import Quote from '@/views/quote/index.vue'
import { queryOptionPeriod } from '@/apis/option'
import { marketSearchEnum } from '@/enums/trade'
import { useI18n } from 'vue-i18n'
import { thousandsComma } from '@/utils/trade'
import { useWalletStore } from '@/store/modules/wallet'
import chartMain from './chart/index.vue'
import { useDevice } from '@/hooks/useDevice'
import QuickTrade from './QuickTrade.vue'
import { routeTo } from '@/utils/routeTo'
import { addOrder } from '@/apis/option'
import { showToast } from '@/components/base/toast'
import { useUserStore } from '@/store/useUserStore'
import { useAppStore } from '@/store/useAppStore'
import { Button } from '@/components/base'

const walletStore = useWalletStore()
const { t } = useI18n()
const { state, updateTimeResolution, getStartingTime } = useFlashOption()
const { isWeb } = useDevice()
const userStore = useUserStore()
const slideRef = ref()
const appstore = useAppStore()

const data = reactive({
	downTime: 0,
	hundredsDiv: '00',
	tensDiv: '00',
	onesDiv: '00',
	showSearch: false,
	visible: false,
	direction: '',
	isCloseSlide: false,
	span: 6,
	orderWidth: 320
})
const newPrice = computed(() => {
	if (state.newPoint.y > 0) return state.newPoint.y
	return state.list.length > 0 ? state.list[0].p : 0
})

const initData = async () => {
	const res = await queryOptionPeriod()
	if (res.code === 0) {
		res.data = res.data || []
		state.times = res.data.map((item: any) => {
			const newItem = {
				label: item.name,
				value: item.period
			}
			const str = newItem.value.split('_')[1]
			if (/^0/.test(str)) {
				const num = Number(str)
				const time = 1000 * num
				newItem.time = time
			} else if (/^[1-9]/.test(str)) {
				const num = Number(str)
				const time = 1000 * 60 * num
				newItem.time = time
			}
			return newItem
		})
		if (state.times.length > 0) {
			state.timeResolution = state.times[0]
		}
	}
}
initData()

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
	if (state.timeResolution.value === item.value) {
		cls += ' bg-background-tertiary text-text-primary border border-border-button_strong'
	} else {
		cls += ' border-0 bg-background-secondary text-text-description'
	}
	return cls
}

const getSlideClass = computed(() => {
	if (data.isCloseSlide) {
		return `w-[360px] h-[614px] border-t border-b border-r-[2px] border-border-gutter hidden`
	}
	return `show w-[360px] h-[614px] border-t border-b border-r-[2px] border-border-gutter`
})
watch(
	() => state.startingData.downTime,
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
					// location.reload()
					getStartingTime()
				}
				isChecking = false
			}, 3000)
		}
	}
}

// 开始定时检查
checkCount = setInterval(checkIfZero, 3000)
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

onMounted(() => {
	calculateChildSpan()
})
onBeforeUnmount(() => {
	if (checkCount) {
		clearInterval(checkCount)
	}
})

watch(
	() => appstore.resize,
	() => {
		calculateChildSpan()
	}
)

function calculateChildSpan() {
	const parent = document.getElementById('tvRoot')
	// 获取父元素的宽度
	const parentWidth = parent.offsetWidth

	// 计算每份的宽度
	const spanWidth = parentWidth / 24

	// 计算子元素需要占据的份数
	data.span = Math.ceil(320 / spanWidth)
	data.orderWidth = data.span * spanWidth
}
</script>
<style scoped>
.show {
	transition: transform 3s ease-in-out;
	transform: translateX(0); /* 初始位置 */
}

.hidden {
	transform: translateX(-100%); /* 隐藏时从右往左消失 */
}
</style>
