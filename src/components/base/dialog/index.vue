<script setup lang="ts">
import { useDevice } from '@/hooks/useDevice'
const show = defineModel('show', { default: false })
const emits = defineEmits(['cancel'])

const { isPh } = useDevice()

const props = defineProps({
	title: {
		type: String,
		default: ''
	},
	width: {
		type: String,
		default: ''
	},
	onBeforeClose: {
		type: Function,
		default: null
	}
})

const onCancel = () => {
	if (props.onBeforeClose) {
		props.onBeforeClose()
		return
	}
	show.value = false
	emits('cancel')
}
</script>

<template>
	<van-dialog
		v-if="isPh"
		v-model:show="show"
		:show-confirm-button="false"
		class="w-[332px] !rounded-lg !bg-background-window"
		:style="{ width }">
		<div class="py-[30px] px-6">
			<div class="flex justify-between items-center">
				<div class="text-text-primary text-style-web-h2-bold">{{ title }}</div>
				<base-icon
					@click="onCancel"
					name="user-center/icon23"
					:size="24"
					class="text-text-primary" />
			</div>
			<div>
				<slot />
			</div>
		</div>
	</van-dialog>

	<van-dialog
		v-else
		v-model:show="show"
		:show-confirm-button="false"
		class="w-[560px] !rounded-[12px] !bg-background-window"
		:style="{ width }">
		<div>
			<div class="py-5 px-4 flex justify-between items-center">
				<div class="text-text-primary text-style-web-h3-bold">{{ title }}</div>
				<div>
					<base-icon
						@click="onCancel"
						name="user-center/icon23"
						:size="24"
						class="text-text-primary" />
				</div>
			</div>
			<slot />
		</div>
	</van-dialog>
</template>
