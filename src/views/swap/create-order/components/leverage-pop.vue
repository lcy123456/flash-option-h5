<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { modifyLeverage } from '@/apis/swap'
import { showToast, showSuccessToast, showFailToast } from '@/components/base/toast'
import { useSwapStore } from '@/store/modules/swap/index'
import NtIInput from '@/components/NtIInput/index.vue'
import { Dialog, Button } from '@/components/base'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
import { Popup } from 'vant'
import { mul } from '@/utils'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { thousandsComma, macthPosition } from '@/utils/trade'
const swapStore = useSwapStore()
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	leverage: {
		type: [Number, String],
		default: 20
	}
})
const emits = defineEmits(['update:show', 'update:leverage','getLeverage'])
const show = useVModel(props, 'show', emits)
const leverage = useVModel(props, 'leverage', emits)

const lever = ref(leverage.value)
watch(
	() => leverage.value,
	() => {
		lever.value = leverage.value
	}
)
const levelList = computed(() => {
	const lever = swapStore.state.currentUserInfo?.leverageList
	return lever
})

const changeMargin = (margin: any) => {
	lever.value = margin
}
const handleLeverage = async () => {
	const res: any = await modifyLeverage({
		contractId: swapStore.state.currentCoinInfo.id,
		leverage: lever.value
	})
	const isSuccess = res.code === 0
	if (isSuccess) {
		leverage.value = lever.value
		show.value = false
		emits('getLeverage')
	}
	isSuccess ? showSuccessToast(res.message) : showFailToast(res.message)
}
// 对应杠杆最高可开 =maxTotalShare * 杠杆倍数
const canMaxLever = computed(() => {
	const { maxTotalShare } = swapStore.state.currentCoinInfo
	return mul(maxTotalShare, lever.value)
})
// 渲染选择的组件
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
		v-bind:position="isPC ? 'center' : 'bottom'"
		:title="t('trade.txt111')"
		class="rounded-t-[20px]">
		<div class="pt-5 w-full bg-background-window rounded-t-[20px]">
			<div class="px-4 flex items-center justify-between pb-[22px]" v-if="!isPC">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt111') }}</div>
				<div class="">
					<Icon name="close" :size="24" class="text-text-primary" @click="show = false" />
				</div>
			</div>
			<div class="px-4 text-style-web-base-medium mb-3">
				<div class="text-style-web-small-regular text-text-primary">
					<span class="text-style-web-body-700">{{ swapStore.state.currentSymboy }}</span>
					<span
						class="bg-background-secondary text-text-tertiary py-[1px] px-[6px] mx-2 rounded-[3px]">
						{{ macthPosition(swapStore.state.currentUserInfo.positionType) }}
					</span>
					<span
						class="bg-function-buy-light-background text-function-buy rounded-[3px] py-[1px] px-[6px]">
						{{ leverage }}X
					</span>
				</div>
				<NtIInput
					:label="t(`trade.txt154`)"
					v-model="lever"
					right-text="X"
					:decimal="0"
					readonly
					class="my-4" />
				<div class="grid grid-cols-5 gap-[10px]">
					<div
						v-for="margin in levelList"
						:key="margin"
						@click="changeMargin(margin)"
						class="h-[28px] flex justify-center items-center text-center rounded bg-background-secondary cursor-pointer"
						:class="[
							Number(lever) === margin
								? 'border border-border-brand  text-text-primary '
								: 'text-text-secondary'
						]">
						{{ margin }}X
					</div>
				</div>
				<p class="my-4 text-text-secondary text-style-web-body-medium">
					{{ t('trade.txt112') }}
					<span class="text-text-brand">{{ thousandsComma(canMaxLever) }} USDT</span>
				</p>
				<div
					class="text-text-tertiary bg-background-secondary text-style-web-body-medium p-2 rounded mb-6 flex">
					<img src="/imgs/common/information-yellow.svg" class="w-4 h-4 mr-[10px]" />
					{{ t('trade.txt113') }}
				</div>
			</div>
			<div class="border-t border-border-subtle py-5 px-4">
				<Button type="small" @click="handleLeverage">
					{{ t('trade.txt4') }}
				</Button>
			</div>
		</div>
	</component>
</template>
