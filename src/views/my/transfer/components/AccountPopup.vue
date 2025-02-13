<template>
	<!-- 自定义图标 -->
	<van-popup
		round
		v-model:show="data.show"
		position="bottom"
		:style="{ height: '254px' }"
		class="!bg-background-window">
		<div class="text-text-primary text-style-web-h3-bold h-[64px] flex items-center px-[16px]">
			<div class="flex-1">{{ t('transfer.txt11') }}</div>
			<Icon name="common/close" :size="24" class="text-text-primary" @click="data.show = false" />
		</div>
		<div class="px-[16px] overflow-y-auto">
			<div
				class="h-[54px] flex items-center text-style-web-h4-regular text-text-secondary cursor-pointer"
				v-for="item in list"
				@click="state.currentAccount = item"
				:key="item.value">
				<div class="flex-1">{{ item.label }}</div>
				<Icon
					v-if="state.currentAccount.value === item.value"
					name="common/select-tip"
					:size="15"
					class="text-text-primary" />
			</div>
		</div>
		<div class="fixed w-full b-0 h-[82px] border-t border-border-strong flex items-center px-4">
			<Button
				plain
				@click="data.show = false"
				class="w-[171px] mr-4 h-[42px] rounded-[50px] flex items-center justify-center border-border-button_strong border text-style-web-body-bold text-text-primary">
				{{ t('transfer.txt12') }}
			</Button>
			<Button
				@click="handleChangeAccount"
				class="w-[171px] h-[42px] rounded-[50px] flex items-center justify-center bg-brand-main text-style-web-body-bold text-text-inverse-primary">
				{{ t('transfer.txt4') }}
			</Button>
		</div>
	</van-popup>
</template>
<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTransfer } from '@/hooks/useTransfer'
import { Button } from '@/components/base'

const { t } = useI18n()
const { state } = useTransfer()

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
	show: false
})

const handleChangeAccount = () => {
	if (state.type === 'left') {
		state.leftAccount = state.currentAccount
	} else if (state.type === 'right') {
		state.rightAccount = state.currentAccount
	}
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

const list = computed(() => {
	// let current = state.leftAccount
	// if (state.type === 'right') {
	// 	current = state.rightAccount
	// }
	// if (current.value === 'SPOT') {
	// 	return state.items.filter((item: any) => item.value === 'SPOT')
	// }
	// return state.items.filter((item: any) => item.value !== 'SPOT')
	if (state.type === 'right') {
		return state.items.filter((item: any) => item.value !== state.leftAccount.value)
	}
	return state.items.filter((item: any) => item.value !== state.rightAccount.value)
})
</script>
