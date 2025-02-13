<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
	type: {
		type: String,
		default: 'success'
	},
	width: {
		type: String,
		default: ''
	}
})

const className = computed(() => {
	if (props.type === 'success') {
		return 'text-text-success'
	}
	if (props.type === 'error') {
		return 'text-text-error'
	}
	if (props.type === 'warning') {
		return 'text-text-warning'
	}
	return ''
})

const bgClassName = computed(() => {
	if (props.type === 'success') {
		return 'bg-text-success-10'
	}
	if (props.type === 'error') {
		return 'bg-text-error-10'
	}
	if (props.type === 'warning') {
		return 'bg-text-warning-10'
	}
	return ''
})

const icon = computed(() => {
	if (props.type === 'success') {
		return 'user-center/icon13'
	}
	if (props.type === 'error') {
		return 'user-center/icon13'
	}
	if (props.type === 'warning') {
		return 'user-center/icon19'
	}
	return ''
})
</script>

<template>
	<div class="flex justify-center">
		<div class="inline-block" :style="{ width }">
			<div class="py-[6px] px-3 flex items-center rounded" :class="[bgClassName]">
				<slot name="icon">
					<base-icon :class="[className]" :name="icon" :size="16" />
				</slot>
				<div class="ml-1 text-style-web-small-regular" :class="[className]">
					<slot></slot>
				</div>
			</div>
		</div>
	</div>
</template>
