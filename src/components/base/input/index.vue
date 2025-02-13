<script setup lang="ts">
import { computed, ref, defineModel } from 'vue'
const _focus = ref(false)

const modelValue: any = defineModel()

const emits = defineEmits(['blur', 'focus'])

const props = defineProps({
	placeholder: {
		type: String,
		default: ''
	},
	className: {
		type: String,
		default: ''
	},
	error: {
		type: String,
		default: ''
	},
	text: {
		type: String,
		default: ''
	},
	maxlength: {
		type: Number,
		default: 100
	},
	size: {
		type: String,
		default: 'normal'
	},
	type: {
		type: String,
		default: 'text'
	},
	autocomplete: {
		type: String,
		default: ''
	},
	inputClass: {
		type: String,
		default: ''
	},
	inputStyle: {
		type: String,
		default: ''
	},
	// 将满足此正则的内容替换
	replace: {
		type: RegExp,
		default: new RegExp('')
	},
	disabled: {
		type: Boolean,
		default: false
	}
})

const borderClass = computed(() => {
	if (props.error) {
		return 'border-text-error'
	}
	if (_focus.value) {
		return 'border-border-button_strong'
	}

	return 'border-border-strong'
})

const sizeClass = computed(() => {
	if (props.size === 'normal') {
		return 'h-[50px]  py-[15px]'
	}
	if (props.size === 'small') {
		return 'h-[44px]  py-[12px]'
	}
	return 'h-[50px]  py-[15px]'
})

const onFocus = () => {
	_focus.value = true
	emits('focus')
}

const onBlur = () => {
	_focus.value = false
	emits('blur')
}

const validateInput = () => {
	if (props.replace.toString() !== new RegExp('').toString()) {
		modelValue.value = String(modelValue.value).replace(props.replace, '')
	}
}
</script>

<template>
	<div :class="className">
		<div
			class="border px-4 box-border rounded-[6px] overflow-hidden flex items-center"
			:class="[borderClass, sizeClass, inputClass]">
			<slot name="prefix" />
			<div class="flex-1">
				<input
					:disabled="disabled"
					v-model.trim="modelValue"
					:placeholder="placeholder"
					:autocomplete="autocomplete"
					:maxlength="maxlength"
					class="w-[100%] text-ellipsis block outline-none text-text-primary text-style-web-body-medium bg-transparent"
					:style="[inputStyle]"
					@focus="onFocus"
					@blur="onBlur"
					@input="validateInput"
					:type="type" />
			</div>
			<slot name="suffix" />
		</div>
		<div v-if="error" class="mt-1 text-text-error text-style-web-small-regular">{{ error }}</div>
		<div v-if="text" class="mt-1 text-text-description text-style-web-small-regular">
			{{ text }}
		</div>
	</div>
</template>

<style lang="scss" scoped>
input::placeholder {
	color: var(--color-text-tips);
}
</style>
