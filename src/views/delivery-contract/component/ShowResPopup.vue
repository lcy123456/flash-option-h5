<template>
	<van-popup
		v-model:show="data.visible"
		round
		class="w-[332px] px-[24px] py-[30px]"
		:close-on-click-overlay="false"
		:close-on-popstate="false">
		<div class="flex flex-col items-center">
			<div
				v-if="isWinOrLose(data.result) || data.count > 3"
				class="h-[40px] rounded-[48px] min-w-[83px] box-border py-[8px] px-[16px] flex items-center justify-center text-web-h2-bold text-always-white"
				:class="data.result === 'WIN' ? 'bg-function-buy' : 'bg-text-secondary'">
				{{ data.result }}
			</div>
			<div class="text-web-h2-bold text-text-primary" :class="data.result ? 'mt-[24px]' : 'mt-0'">
				{{ data.downTime < 1 ? t('other.txt9') : t('option.txt8') }}
			</div>

			<div class="flex mt-[24px]">
				<div
					class="w-[50px] h-[62px] flex items-center justify-center bg-background-tertiary rounded-[6px] text-web-mega-bold text-text-brand">
					{{ data.thousandsDiv }}
				</div>
				<div
					class="w-[50px] h-[62px] ml-[4px] flex items-center justify-center bg-background-tertiary rounded-[6px] text-web-mega-bold text-text-brand">
					{{ data.hundredsDiv }}
				</div>
				<span class="w-[20px] h-[62px] flex items-center justify-center">:</span>
				<div
					class="w-[50px] h-[62px] ml-[4px] flex items-center justify-center bg-background-tertiary rounded-[6px] text-web-mega-bold text-text-brand">
					{{ data.tensDiv }}
				</div>
				<div
					class="w-[50px] h-[62px] ml-[4px] flex items-center justify-center bg-background-tertiary rounded-[6px] text-web-mega-bold text-text-brand">
					{{ data.onesDiv }}
				</div>
			</div>
			<div class="text-style-web-body-regular text-text-description mt-[8px]">
				{{ t('option.txt9') }}
			</div>
			<div class="mt-[24px]">
				<div class="flex w-[284px] justify-between items-center">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('option.txt10') }}
					</span>
					<div
						class="h-[18px] text-style-web-small-regular min-w-[36px] flex items-center justify-center px-[6px] rounded-[3px]"
						:class="
							props.direction === 'BUY'
								? 'text-function-buy bg-[#E5F7F1]'
								: 'text-function-sell bg-[#FFECED]'
						">
						{{ props.direction === 'BUY' ? t('option.txt11') : t('option.txt12') }}
					</div>
				</div>
				<div class="flex w-[284px] justify-between items-center mt-[8px]">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('option.txt13') }}（USDT）
					</span>
					<div class="text-style-web-base-medium text-text-tertiary">
						{{ state.addOrderInfo.amount }}
					</div>
				</div>
				<div
					class="flex w-[284px] justify-between items-center mt-[8px]"
					v-if="isWinOrLose(data.result)">
					<span class="text-style-web-base-regular text-text-description">
						{{ t('flw.txt100') }}（USDT）
					</span>
					<div class="text-style-web-base-medium text-text-tertiary">
						{{ toFixed(data.rewardAmount, 2) }}
					</div>
				</div>

				<div
					@click="handleConfirm"
					class="mt-[24px] w-[284px] h-[50px] rounded-[50px] flex items-center justify-center border border-border-button_line text-style-web-h5-bold text-text-primary">
					{{ t('option.txt14') }}
				</div>
			</div>
		</div>
	</van-popup>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { queryOrderById } from '@/apis/dcontract'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { useI18n } from 'vue-i18n'
import { toFixed } from '@/utils/index'

const { t } = useI18n()

const { state } = useDeliveryContract()

const props = defineProps({
	modelValue: {
		type: Boolean,
		default: false
	},
	direction: {
		type: String,
		default: 'BUY'
	},
	count: {
		type: Number,
		default: 0
	},
	time: {
		type: Number,
		default: 0
	},
	period: {
		type: String,
		default: ''
	}
})
const emits = defineEmits(['update:modelValue'])

const data = reactive({
	downTime: -1,
	visible: false,
	thousandsDiv: 0,
	hundredsDiv: 0,
	tensDiv: 0,
	onesDiv: 0,

	result: '',
	count: 0,
	rewardAmount: 0
})
let timerId
function startTimer() {
	// 定时器
	timerId = setInterval(() => {
		let countdown = data.downTime
		if (countdown < 0) {
			clearInterval(timerId) // 停止定时器
			return
		}
		const hour = parseInt(countdown / 3600)
		const min = parseInt((countdown / 60) % 60)
		const sec = Math.round(countdown % 60)

		// 更新DOM元素
		const hourT = addZero(hour)
		const minT = addZero(min)
		const secT = addZero(sec)

		// 更新DOM元素
		data.thousandsDiv = minT.split('')[0]
		data.hundredsDiv = minT.split('')[1]
		data.tensDiv = secT.split('')[0]
		data.onesDiv = secT.split('')[1]

		// 减少总秒数
		data.downTime--

		// 检查是否倒计时结束
		if (countdown <= 0) {
			clearInterval(timerId) // 停止定时器
			data.count = 0

			queryRes()
		}
	}, 1000)
}

function addZero(num) {
	if (num < 10) {
		return '0' + num
	}
	return `${num}`
}

watch(
	() => props.modelValue,
	(newVal: boolean, oldVal: boolean) => {
		if (newVal) {
			data.result = ''
			data.downTime = props.time
			data.visible = true
			if (timerId) {
				clearInterval(timerId)
			}
			startTimer()
		}
	}
)

// 监听 visible 变化
watch(
	() => data.visible,
	(newVal: boolean) => {
		if (!newVal) {
			data.result = ''
			emits('update:modelValue', false)
		}
	}
)

const handleConfirm = () => {
	data.result = ''
	data.visible = false
}

async function queryRes() {
	if (data.count > 3) {
		return
	}
	data.count++

	const res = await queryOrderById({ id: state.addOrderInfo.orderId })
	if (Date.now() - state.orderRefreshTime > 5000) {
		state.orderRefreshTime = Date.now() // 刷新订单列表
	}

	if (res.code === 0 && res.data) {
		data.result = res.data.result

		if (isWinOrLose(data.result)) {
			data.rewardAmount = res.data.rewardAmount
			data.count = 0
		} else {
			setTimeout(() => {
				queryRes()
			}, 1500)
		}
	}
}

function isWinOrLose(str: string) {
	const pattern = /^(WIN|LOSE)$/i
	return pattern.test(str)
}
</script>
