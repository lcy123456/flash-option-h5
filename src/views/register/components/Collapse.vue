<script setup lang="ts">
const show = defineModel('show', { default: false })
defineProps({
	title: {
		type: String,
		default: ''
	}
})
</script>

<template>
	<div>
		<div class="flex items-center mb-4" @click="show = !show">
			<div class="text-style-web-body-medium text-text-tertiary mr-2">
				{{ title }}
			</div>
			<base-icon
				:name="show ? 'triangle-up' : 'triangle-down'"
				:size="8"
				class="text-text-secondary" />
		</div>

		<div v-if="show" class="mb-4">
			<slot></slot>
		</div>
	</div>
</template>
