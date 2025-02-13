<script setup lang="ts">
import { PropType, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

type Items = {
	title: string
	path?: string
	name?: string
}

const props = defineProps({
	items: {
		type: Array as PropType<Items[]>,
		default: () => []
	}
})

const emits = defineEmits(['back'])

const maxIndex = computed(() => props.items.length - 1)

const open = (item: Items) => {
	if (item.path) {
		if (item.name === 'userCenter') {
			router.push({ path: '/user' })
			// appstore.showUserCenter = Date.now()
			// router.push({ path: '/market' })
		} else if (item.path === '-1') {
			router.go(-1)
		} else if (item.path === 'back') {
			emits('back', item)
		} else {
			router.push(item.path)
		}
	}
}
</script>

<template>
	<div class="web:hidden pd:hidden mt-3 py-2 px-3 flex">
		<div v-for="(item, index) in items" :key="index" class="flex items-center" @click="open(item)">
			<div
				:class="[
					maxIndex === index
						? 'text-text-primary text-style-web-body-medium'
						: 'text-text-description text-style-web-body-regular'
				]">
				{{ item.title }}
			</div>
			<svg
				v-if="!(maxIndex === index)"
				class="mx-[2px]"
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none">
				<path d="M6 12L10 8L6 4" stroke="#7A8091" stroke-width="1.33333" stroke-linecap="round" />
			</svg>
		</div>
	</div>

	<div class="ph:hidden mt-[30px] py-2 px-4 flex">
		<div v-for="(item, index) in items" :key="index" class="flex items-center" @click="open(item)">
			<div
				:class="[
					maxIndex === index
						? 'text-text-primary text-style-web-body-medium'
						: 'text-text-description text-style-web-body-regular cursor-pointer'
				]">
				{{ item.title }}
			</div>
			<svg
				v-if="!(maxIndex === index)"
				class="mx-[2px]"
				xmlns="http://www.w3.org/2000/svg"
				width="16"
				height="16"
				viewBox="0 0 16 16"
				fill="none">
				<path d="M6 12L10 8L6 4" stroke="#7A8091" stroke-width="1.33333" stroke-linecap="round" />
			</svg>
		</div>
	</div>
</template>
