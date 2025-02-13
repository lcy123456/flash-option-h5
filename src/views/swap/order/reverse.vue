<script setup lang="ts">
import { actionTypeEnum } from '@/enums/swap'
import {
	fixD,
	thousandsComma,
	macthPosition,
	macthDirectionType,
	directionColor
} from '@/utils/trade'
import { useSwapStore } from '@/store/modules/swap/index'
import { Button, Dialog } from '@/components/base'
import { closeAndOpen } from '@/apis/swap'
import { useVModel } from '@vueuse/core'
import { computed } from 'vue'
import { Popup } from 'vant'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	// 操作项
	currentItem: {
		type: Object,
		default: () => {}
	}
})
const emits = defineEmits(['update:show'])
const show = useVModel(props, 'show', emits)
const close = () => {
	show.value = false
}
//当前最新价格
const wsPrice = computed(() => {
	const price = swapStore.mathWsSymboy(props.currentItem.coin.symbol)?.close || {}
	return fixD(price, props.currentItem.coin.coinScale)
})
const directionRevere = computed(() => {
	return props.currentItem.direction === actionTypeEnum.BUY
		? actionTypeEnum.SELL
		: actionTypeEnum.BUY
})

const handleRevere = async () => {
	const res: any = await closeAndOpen({
		positionId: props.currentItem.id
	})
	const isSuccess = res.code === 0
	if (isSuccess) {
		close()
		swapStore.fetchPostionList()
	}
	isSuccess ? showSuccessToast(t('trade.txt85')) : showFailToast(t('trade.txt86'))
}
const renderTem = computed(() => {
	if (!isPC.value) {
		return Popup
	}
	return Dialog
})
</script>
<template>
	<component
		:is="renderTem"
		v-model:show="show"
		:position="isPC ? 'center' : 'bottom'"
		:title="t('trade.txt83')"
		@close="close"
		class="bg-background-window"
		round>
		<div class="mt-5 mb-[30px] px-4 relative pb-[75px]">
			<div class="flex items-center justify-between mb-[22px]" v-if="!isPC">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt83') }}</div>
				<div class="">
					<Icon name="close" :size="24" class="text-text-primary" @click="close" />
				</div>
			</div>
			<div>
				<div>
					<span class="text-style-web-body-700 text-text-primary">
						{{ currentItem.coin.symbol }}
					</span>
					<span
						class="text-style-web-small-regular text-text-tertiary bg-background-tertiary px-[6px] py-[1px] mx-2">
						{{ t('trade.txt13') }}
					</span>
					<span
						class="text-style-web-small-regular text-text-tertiary bg-background-tertiary px-[6px] py-[1px]">
						{{ macthPosition(currentItem.type) }}
					</span>
					<span
						class="ml-1 rounded-[3px] py-[1px] px-[6px] text-style-web-small-regular"
						:class="[
							directionColor(currentItem.direction)?.lightBg,
							directionColor(currentItem.direction)?.textColor
						]">
						{{ macthDirectionType(currentItem.direction, 'key') }}{{ t('trade.txt88')
						}}{{ macthDirectionType(directionRevere, 'key') }}
					</span>
				</div>
				<div class="flex justify-between mt-[6px] border-border-strong border-b pb-2">
					<span class="text-text-description text-style-web-base-regular">
						{{ t('trade.txt79') }}
					</span>
					<span class="text-style-web-base-medium text-text-tertiary">
						{{ thousandsComma(wsPrice) }} USDT
					</span>
				</div>
				<div class="flex items-center justify-between mt-6 mb-[26px]">
					<div class="text-style-web-body-regular text-text-primary">
						{{ t('trade.txt87') }}{{ macthDirectionType(currentItem.direction, 'key') }}
						<span
							class="ml-[2px] rounded-[3px] py-[1px] px-[6px] text-style-web-small-regular"
							:class="[
								directionColor(currentItem.direction)?.lightBg,
								directionColor(currentItem.direction)?.textColor
							]">
							{{ macthDirectionType(currentItem.direction, 'key') }}{{ currentItem.leverage }}X
						</span>
					</div>
					<div class="flex">
						<div>
							<div class="text-style-web-small-regular text-text-description">
								{{ t('trade.txt89') }}
							</div>
							<div class="text-style-web-body-regular text-text-primary mt-0.5 text-center">
								{{ thousandsComma(currentItem.availablePosition) }}
								{{ currentItem.coin.coinSymbol }}
							</div>
						</div>
						<div class="ml-[30px]">
							<div class="text-style-web-small-regular text-text-description">
								{{ t('trade.txt90') }}
							</div>
							<div class="text-style-web-body-regular text-text-primary mt-0.5 text-right">
								{{ t('trade.txt91') }}
							</div>
						</div>
					</div>
				</div>
				<div class="flex border-t border-border-gutter relative mb-[22px] w-full justify-center">
					<span
						class="absolute bottom-[-13px] bg-background-secondary py-[5px] px-[13px] text-style-web-base-regular text-text-secondary rounded-[23px]">
						{{ t('trade.txt94') }}{{ macthDirectionType(directionRevere, 'key') }}
					</span>
				</div>
				<div class="flex items-center justify-between mt-6 mb-[26px]">
					<div class="text-style-web-body-regular text-text-primary">
						{{ t('trade.txt87') }}{{ macthDirectionType(directionRevere, 'key') }}
						<span
							class="ml-[2px] rounded-[3px] py-[1px] px-[6px] text-style-web-small-regular"
							:class="[
								directionColor(directionRevere)?.lightBg,
								directionColor(directionRevere)?.textColor
							]">
							{{ macthDirectionType(directionRevere, 'key') }}{{ currentItem.leverage }}X
						</span>
					</div>
					<div class="flex">
						<div>
							<div class="text-style-web-small-regular text-text-description">
								{{ t('trade.txt92') }}
							</div>
							<div class="text-style-web-body-regular text-text-primary mt-0.5 text-center">
								{{ thousandsComma(currentItem.availablePosition) }}
								{{ currentItem.coin.coinSymbol }}
							</div>
						</div>
						<div class="ml-[30px]">
							<div class="text-style-web-small-regular text-text-description">
								{{ t('trade.txt44') }}
							</div>
							<div class="text-style-web-body-regular text-text-primary mt-0.5 text-right">
								{{ t('trade.txt91') }}
							</div>
						</div>
					</div>
				</div>
				<div class="text-style-web-small-regular text-text-description">
					{{ t('trade.txt93') }}
				</div>
			</div>
		</div>
		<div
			class="fixed z-50 bottom-0 w-full p-4 border-t border-border-strong flex text-always-white">
			<Button size="small" @click="handleRevere">
				{{ t('trade.txt94') }}{{ macthDirectionType(directionRevere, 'key') }}
			</Button>
		</div>
	</component>
</template>
