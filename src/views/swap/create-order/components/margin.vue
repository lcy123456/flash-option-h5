<script setup lang="ts">
import { useVModel } from '@vueuse/core'
import { computed, ref, watch } from 'vue'
import { modifyType } from '@/apis/swap'
import { showFailToast, showSuccessToast } from '@/components/base/toast'
import { positionList } from '@/utils/trade'
import { useSwapStore } from '@/store/modules/swap/index'
import { Dialog, Button } from '@/components/base'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
import { Popup } from 'vant'
const swapStore = useSwapStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})
const emits = defineEmits(['update:show'])
const show = useVModel(props, 'show', emits)

const marginList = computed(() => {
	return positionList
})

const positionType = ref(swapStore.state.currentUserInfo?.positionType)

watch(
	() => swapStore.state.currentUserInfo?.positionType,
	() => {
		positionType.value = swapStore.state.currentUserInfo?.positionType
	}
)

const changeMargin = (margin: any) => {
	positionType.value = margin
}
const handleMargin = async () => {
	const res: any = await modifyType({ positionType: positionType.value })
	const isSuccess = res.code === 0
	if (isSuccess) {
		show.value = false
		swapStore.fetchPostionList()
	}
	isSuccess ? showSuccessToast(t('trade.txt117')) : showFailToast(t('trade.txt118'))
}
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
		:width="isPC && 'width:390px'"
		:title="t('trade.txt116')"
		class="rounded-t-[20px]">
		<div class="pt-5 w-full bg-background-window rounded-t-[20px]">
			<div class="px-4 flex items-center justify-between pb-[22px]" v-if="!isPC">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt116') }}</div>
				<div class="">
					<Icon name="close" :size="24" class="text-text-primary" @click="show = false" />
				</div>
			</div>
			<div class="px-4 text-style-web-body-medium mb-3">
				<div class="grid grid-cols-2 gap-[4px]">
					<div
						v-for="margin in marginList"
						:key="margin.value"
						@click="changeMargin(margin.value)"
						class="h-10 text-center rounded flex items-center justify-center bg-background-secondary cursor-pointer"
						:class="[
							positionType === margin.value
								? 'border border-border-brand text-text-brand '
								: 'text-text-description'
						]">
						{{ margin.label }}
					</div>
				</div>
				<p class="my-4 text-text-secondary">{{ t('trade.txt115') }}</p>
				<div class="text-text-tertiary bg-background-secondary p-2 rounded mb-6">
					{{ t('trade.txt114') }}
				</div>
			</div>
			<div class="border-t border-border-subtle py-5 px-4">
				<Button type="small" @click="handleMargin">
					{{ t('trade.txt4') }}
				</Button>
			</div>
		</div>
	</component>
</template>
