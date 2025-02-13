<script setup lang="ts">
import { PropType, computed } from 'vue'

const modelValue = defineModel('value', { default: 1 })

type Options = {
	id: number
	title: string
}

defineProps({
	options: {
		type: Array as PropType<Options[]>,
		default: () => []
	}
})

const active = computed(
	() => (id: number) =>
		modelValue.value === id
			? 'bg-background-tertiary text-text-primary'
			: 'bg-background-secondary text-text-description'
)
</script>

<template>
	<div class="flex flex-wrap">
		<div
			v-for="item in options"
			@click="modelValue = item.id"
			:key="item.title"
			class="py-1 px-2 rounded text-style-web-small-regular mr-2 mb-[10px] cursor-pointer"
			:class="[active(item.id)]">
			{{ item.title }}
		</div>
	</div>
</template>
