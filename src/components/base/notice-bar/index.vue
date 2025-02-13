<script setup lang="ts">
const show = defineModel('show', { default: true })

defineProps({
	closeIcon: {
		type: Boolean,
		default: true
	}
})

const close = () => {
	show.value = false
}
</script>

<template>
	<van-notice-bar
		v-if="show"
		class="bg-background-secondary text-text-primary text-style-web-small-regular"
		v-bind="$attrs">
		<template v-slot:left-icon>
			<slot name="prefix">
				<base-icon class="mr-1 text-text-primary" name="components/icon3" :size="16" />
			</slot>
		</template>
		<template v-slot:right-icon>
			<slot name="suffix">
				<base-icon
					v-if="closeIcon"
					@click="close"
					name="components/icon4"
					:size="24"
					class="text-text-primary" />
			</slot>
		</template>
		<slot></slot>
	</van-notice-bar>
</template>
