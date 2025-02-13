<script lang="ts" setup>
import { useTradeStore } from '@/store/modules/trade/index'
import { HandicapKeyEnum } from '@/enums/trade'
const tradeStore = useTradeStore()
const props = defineProps({
	modelValue: {
		type: String,
		default: HandicapKeyEnum.ALL
	}
})
const emit = defineEmits(['update:modelValue'])
const typeChange = (type: string) => {
	if (type === HandicapKeyEnum.ALL) {
		tradeStore.state.maxPostion = 6
	} else {
		tradeStore.state.maxPostion = 12
	}
	emit('update:modelValue', type)
}
const setPacity = (type: string) => {
	if (!props.modelValue) return ''
	if (props.modelValue !== type) {
		return 'opacity-60'
	} else {
		return ''
	}
}
</script>
<template>
	<div class="flex items-center">
		<img
			src="/imgs/order-book/oba_light.svg"
			@click="typeChange(HandicapKeyEnum.ALL)"
			alt=""
			class="cursor-pointer w-4 h-4"
			:class="setPacity(HandicapKeyEnum.ALL)" />
		<img
			src="/imgs/order-book/obb_light.svg"
			@click="typeChange(HandicapKeyEnum.BUY)"
			alt=""
			class="cursor-pointer w-4 h-4 mx-4"
			:class="setPacity(HandicapKeyEnum.BUY)" />
		<img
			src="/imgs/order-book/obs_light.svg"
			@click="typeChange(HandicapKeyEnum.SELL)"
			alt=""
			class="cursor-pointer w-4 h-4"
			:class="setPacity(HandicapKeyEnum.SELL)" />
	</div>
</template>
