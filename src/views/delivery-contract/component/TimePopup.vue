<template>
	<!-- 自定义图标 -->
	<van-popup round v-model:show="data.show" position="bottom" :style="{ height: '360px' }">
		<div class="relative">
			<div class="text-text-primary text-style-web-h3-bold h-[64px] flex items-center px-[16px]">
				<div class="flex-1">{{ t('text106') }}</div>
				<img src="/imgs/common/close.svg" class="w-6 h-6" @click="data.show = false" />
			</div>
			<div class="px-[16px] pb-[24px]">
				<div
					class="h-[54px] flex items-center text-style-web-h4-regular text-text-secondary cursor-pointer"
					v-for="item in state.times"
					@click="handleChange(item)"
					:key="item.optionNo">
					<div class="flex-1">{{ item.name }}</div>
					<img
						v-if="state.currentTimesOption.optionNo === item.optionNo"
						src="/imgs/common/select-tip.svg" />
				</div>
			</div>
			<!-- <div
				class="fixed bottom-0 left-0 right-0 w-full h-[82px] bg-background-primary border-t border-border-strong flex items-center px-[8px] justify-between">
				<div
					@click="data.show = false"
					class="w-[171px] h-[42px] rounded-[50px] flex items-center justify-center border-border-button_strong border text-style-web-body-bold text-text-primary">
					{{ t('my.txt37') }}
				</div>
				<div
					@click="handleChangeLange"
					class="w-[171px] h-[42px] rounded-[50px] flex items-center justify-center bg-brand-main text-style-web-body-bold text-text-inverse-primary">
					{{ t('my.txt38') }}
				</div>
			</div> -->
		</div>
	</van-popup>
</template>
<script lang="ts" setup>
import { reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'

const { t } = useI18n()
const { state } = useDeliveryContract()

// const times = [
// 	{ label: '12:23 - 12:24', value: 1 },
// 	{ label: '12:23 - 12:25', value: 2 },
// 	{ label: '12:23 - 12:30', value: 3 }
// ]
// 定义 props
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})
// 定义 emits
const emit = defineEmits(['update:show'])

const data = reactive({
	show: false,
	items: [{}],
	currentLan: 1
})

const handleChange = (item: any) => {
	// changeLang(data.currentLan)
	state.currentTimesOption = item
	data.show = false
}

// 监听 show 的变化
watch(
	() => props.show,
	(newValue) => {
		data.show = newValue
	}
)

// 监听内部状态的变化
watch(
	() => data.show,
	(newValue) => {
		emit('update:show', newValue)
	}
)
</script>
