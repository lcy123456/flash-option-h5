<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import { onClickOutside } from '@vueuse/core'

import Checkbox from '../checkbox/index.vue'

const modelValue = defineModel('value', { default: '' })

const open = defineModel('open', { default: false })

const emits = defineEmits(['change'])
const target = ref(null)

const props = defineProps({
	options: {
		type: Array as PropType<any[]>,
		default: () => []
	},
	listHeight: {
		type: Number,
		default: 288
	},
	disabled: {
		type: Boolean,
		default: false
	},
	imgField: {
		type: String,
		default: ''
	},
	closeOnClickOutside: {
		type: Boolean,
		default: false
	},
	placeholder: {
		type: String,
		default: ''
	}
})

onClickOutside(target, () => {
	if (props.closeOnClickOutside) {
		open.value = false
	}
})

const activeItem = computed(() =>
	props.options.find((item: any) => item.value === modelValue.value)
)

const borderClass = computed(() => (open.value ? '!border-border-button_strong' : ''))
const disabledClass = computed(() => (props.disabled ? 'text-text-disabled' : ''))

const change = (item: any) => {
	modelValue.value = item.value
	open.value = false
	emits('change', item)
}

const expandChange = () => {
	if (props.disabled) return
	open.value = !open.value
}
</script>

<template>
	<div class="relative z-999" ref="target">
		<div
			@click="expandChange"
			class="flex cursor-pointer justify-between items-center h-[50px] py-[10px] px-4 border border-border-strong rounded-[6px]"
			:class="[borderClass]">
			<div class="flex items-center">
				<slot name="icon" />
				<div
					v-if="imgField && activeItem"
					class="w-[30px] h-[30px] rounded-full overflow-hidden mr-[10px]">
					<img v-if="activeItem?.[imgField]" :src="activeItem?.[imgField]" alt="" />
				</div>
				<div class="text-text-primary text-style-web-body-medium" :class="[disabledClass]">
					{{ activeItem?.label }}
				</div>
				<div v-if="!activeItem?.label" class="text-text-tips text-style-web-body-medium">
					{{ placeholder }}
				</div>
			</div>
			<div>
				<base-icon v-if="!open" name="components/icon1" :size="18" class="text-text-disabled" />
				<base-icon v-else name="components/icon2" :size="18" class="text-text-secondary" />
			</div>
		</div>

		<div
			class="options w-[100%] absolute top-[54px] bg-background-window rounded-[6px] overflow-y-auto z-1000"
			:style="{
				maxHeight: open ? listHeight + 'px' : '0px',
				boxShadow: '0px 0px 8px 0px rgba(0, 0, 0, 0.25)'
			}">
			<slot>
				<div
					v-for="item in options"
					:key="item.value"
					@click="change(item)"
					class="flex cursor-pointer justify-between items-center p-3">
					<div class="flex items-center">
						<div v-if="imgField" class="w-6 h-6 rounded-full overflow-hidden mr-[10px]">
							<img v-if="item[imgField]" :src="item[imgField]" alt="" />
						</div>
						<div class="text-text-primary text-style-web-body-medium">{{ item.label }}</div>
					</div>
					<Checkbox shape="round" :value="modelValue === item.value" />
				</div>
			</slot>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.options {
	transition: height 0.2s ease;
}
</style>
