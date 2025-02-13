<script setup lang="ts">
import { PropType } from 'vue'
import Breadcrumb from '@/components/base/breadcrumb/index.vue'
const show = defineModel('show', { default: true })

defineProps({
	items: {
		type: Array as PropType<any[]>,
		default: () => {}
	}
})

const emits = defineEmits(['back'])

const onBack = (item: any) => {
	emits('back', item)
}
</script>

<template>
	<van-popup
		v-model:show="show"
		:overlay="false"
		position="right"
		:style="{ width: '100%', height: '100%', background: 'transparent', pointerEvents: 'none' }">
		<div class="h-[100%] flex flex-col overflow-hidden">
			<div class="!h-[60px] w-full pointer-events-none"></div>
			<div class="flex-1 pointer-events-auto bg-background-primary overflow-y-auto">
				<slot name="top" />
				<Breadcrumb @back="onBack" :items="items" />

				<slot />
			</div>
		</div>
	</van-popup>
</template>
