<template>
	<el-popover
		:show-arrow="false"
		v-if="isWeb"
		popper-class="!rounded-[12px] !py-[10px] !px-[16px] !bg-background-window !border-background-primary"
		placement="bottom-end"
		trigger="hover"
		:offset="10"
		style="outline: 0 !important"
		:width="256">
		<template #reference>
			<div
				class="w-full h-[50px] rounded-[6px] px-[8px] border-border-strong border box-border flex items-center cursor-pointer">
				<div class="ml-[10px] flex-1 text-text-primary text-style-web-body-medium">
					{{ item.label }}
				</div>
				<img src="/imgs/common/arrow-down.svg" class="w-[18px] h-[18px]" />
			</div>
		</template>
		<div>
			<div
				@click="handleOk(it)"
				class="flex items-center h-[54px] text-style-web-body-medium cursor-pointer"
				v-for="it in items"
				:key="it.value"
				:class="item.value === it.value ? 'text-brand-main' : 'text-text-primary'">
				{{ it.label }}
			</div>
		</div>
	</el-popover>
	<div class="relative" v-else>
		<div
			@click="data.visible = !data.visible"
			class="w-full h-[50px] rounded-[6px] px-[8px] bg-background-primary border-border-strong border box-border flex items-center">
			<div class="ml-[10px] flex-1 text-text-primary text-style-web-body-medium">
				{{ item.label }}
			</div>
			<img src="/imgs/common/arrow-down.svg" class="w-[18px] h-[18px]" />
		</div>
		<div
			v-if="data.visible && showSelect"
			class="absolute w-[100%] z-1000 bg-background-secondary border border-border-strong rounded-[6px] px-[16px]"
			:style="{ top: '50px', boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.1)' }">
			<div
				@click="handleOk(it)"
				class="flex items-center h-[54px] text-style-web-body-medium cursor-pointer"
				v-for="it in items"
				:key="it.value"
				:class="item.value === it.value ? 'text-brand-main' : 'text-text-primary'">
				{{ it.label }}
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { useDevice } from '@/hooks/useDevice'

const emits = defineEmits(['ok'])
const { isWeb } = useDevice()

// 定义 props
const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	},
	items: {
		type: Array,
		default: () => []
	},
	showSelect: {
		type: Boolean,
		default: false
	}
})

const data = reactive({
	visible: false
})

const handleOk = (it: any) => {
	emits('ok', it)
	data.visible = false
}
</script>
