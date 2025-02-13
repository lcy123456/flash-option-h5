<script setup lang="ts">
defineProps({
	sort: {
		type: String,
		default: ''
	},
	content: {
		type: String,
		default: ''
	},
	containerClass: {
		type: String,
		default: ''
	}
})

const emits = defineEmits(['updateChangeSort'])

const handleChangeSort = (sort: string) => {
	emits('updateChangeSort', sort)
}
</script>

<template>
	<div class="flex items-center" :class="containerClass">
		<div class="text-style-web-small-regular text-text-description">{{ content }}</div>
		<img
			v-if="sort === 'asc'"
			class="w-4 h-4 cursor-pointer"
			@click="handleChangeSort('desc')"
			src="/imgs/common/asc.svg" />
		<img
			v-else-if="sort === 'desc'"
			class="w-4 h-4 cursor-pointer"
			@click="handleChangeSort('asc')"
			src="/imgs/common/desc.svg" />
		<img
			v-else
			class="w-4 h-4 cursor-pointer"
			@click="handleChangeSort('asc')"
			src="/imgs/common/sort.svg" />
	</div>
</template>
