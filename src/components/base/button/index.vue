<script setup lang="ts">
import { computed } from 'vue'
const props = defineProps({
	type: {
		type: String,
		default: 'primary'
	},
	size: {
		type: String,
		default: 'normal'
	},
	plain: {
		type: Boolean,
		default: false
	},
	disabled: {
		type: Boolean,
		default: false
	},
	class: {
		type: String,
		default: ''
	}
})

const styleClass = computed(() => {
	if (props.size === 'normal') {
		return 'h-[50px] text-text-inverse-primary text-style-web-h5-bold'
	}
	if (props.size === 'small') {
		return 'h-[42px] text-always-white text-style-web-body-bold'
	}
	if (props.size === 'mini') {
		return 'h-[28px] text-text-inverse-primary text-style-web-small-medium'
	}
	return ''
})

const typeClass = computed(() => {
	if (props.type === 'buy') {
		return 'bg-function-buy border-function-buy'
	}
	if (props.type === 'sell') {
		return 'bg-function-sell border-function-sell'
	}
	return ''
})

const plainClass = computed(() => {
	if (props.plain) {
		return '!text-text-primary'
	}
	return ''
})

const cursorClass = computed(() => {
	if (props.disabled) {
		return 'cursor-not-allowed'
	}
	return 'cursor-pointer'
})
</script>

<template>
	<van-button
		round
		block
		type="primary"
		:disabled="disabled"
		:plain="plain"
		:class="[styleClass, plainClass, cursorClass, typeClass, props.class]"
		class="hover:opacity-80 active:opacity-100"
		v-bind="$attrs">
		<slot></slot>
	</van-button>
</template>
