<script setup lang="ts">
import { PropType, computed, shallowRef, watch } from 'vue'
import { forEach } from 'lodash'
const active = defineModel('active', { default: 1 })

const headRef = shallowRef()

type Item = {
	title: string
	id: number
}

const props = defineProps({
	items: {
		type: Array as PropType<Item[]>,
		default: () => []
	},
	line: {
		type: Boolean,
		default: false
	},
	line_b: {
		type: Boolean,
		default: false
	},
	headClass: {
		type: String,
		default: ''
	}
})

const activeClass = computed(
	() => (id: number) =>
		active.value === id
			? 'text-text-primary border-b-[2px] border-border-button_strong'
			: 'text-text-description'
)

const lineClass = computed(() => {
	if (props.line) {
		return 'border-t border-b border-border-strong'
	}
	if (props.line_b) {
		return 'border-b border-border-strong'
	}
	return ''
})

watch(
	() => active.value,
	(id: any) => {
		forEach(headRef.value.childNodes, (child) => {
			if (child.dataset?.id == id) {
				const parentNode = child.parentNode
				child.parentNode.scrollLeft =
					child.offsetLeft - parentNode.clientWidth / 2 + child.clientWidth / 2
				return false
			}
		})
	}
)
</script>

<template>
	<div>
		<div class="flex h-[38px] overflow-hidden box-content relative" :class="[lineClass, headClass]">
			<div
				class="flex-1 flex h-[140%] overflow-x-auto overflow-y-hidden"
				style="scroll-behavior: smooth; scrollbar-width: none; -ms-overflow-style: none"
				ref="headRef">
				<div
					v-for="item in items"
					@click="active = item.id"
					:key="item.id"
					:data-id="item.id"
					class="flex-shrink-0 h-[38px] py-[10px] px-3 text-style-web-h5-medium box-border cursor-pointer"
					:class="[activeClass(item.id)]">
					{{ item.title }}
				</div>
			</div>
			<div>
				<slot name="suffix" />
			</div>
		</div>

		<div>
			<slot :active="active" />
		</div>
	</div>
</template>
