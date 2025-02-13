<script setup lang="ts">
import { PropType } from 'vue'
import { PopupPosition } from 'vant'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const show = defineModel('show', { default: false })

defineProps({
	position: {
		type: String as PropType<PopupPosition | undefined>,
		default: 'bottom'
	},
	height: {
		type: String,
		default: '30%'
	},
	title: {
		type: String,
		default: ''
	},
	title2: {
		type: String,
		default: ''
	},
	bottom: {
		type: Boolean,
		default: true
	}
})

const emits = defineEmits(['ok'])

const onOk = () => {
	emits('ok')
}
</script>

<template>
	<van-popup
		v-model:show="show"
		:position="position"
		:style="{ height: height }"
		class="rounded-t-[16px] !bg-background-window">
		<div class="relative h-[100%] overflow-hidden">
			<div class="py-5 px-4">
				<div class="flex justify-between items-center">
					<div class="text-text-primary text-style-web-h3-bold">{{ title }}</div>
					<div @click="show = !show">
						<base-icon name="close" :size="24" class="text-text-primary" />
					</div>
				</div>
				<div v-if="title2" class="text-text-description mt-[10px] text-style-web-small-regular">
					{{ title2 }}
				</div>
			</div>

			<div class="px-4 overflow-y-auto" :class="[bottom ? 'my-center-bottom' : 'my-center']">
				<slot />
			</div>

			<div
				v-if="bottom"
				class="py-5 px-4 absolute left-0 bottom-0 w-full border-t border-border-strong flex justify-between box-border">
				<slot name="bottom">
					<van-button
						@click="show = !show"
						plain
						type="primary"
						class="w-[171px] !h-[42px] !text-text-primary text-style-web-body-bold">
						{{ t('my.txt37') }}
					</van-button>
					<van-button
						@click="onOk"
						round
						block
						type="primary"
						class="w-[171px] !h-[42px] bg-brand-main text-text-inverse-primary text-style-web-body-bold">
						{{ t('my.txt38') }}
					</van-button>
				</slot>
			</div>
		</div>
	</van-popup>
</template>

<style lang="scss" scoped>
.my-center {
	height: calc(100% - 64px);
}
.my-center-bottom {
	height: calc(100% - 64px - 83px);
}
</style>
