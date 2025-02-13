<template>
	<van-popover
		v-model:show="showPopover"
		:show-arrow="false"
		:theme="themeStore.theme"
		overlay-class="!bg-background-window overflow-hidden">
		<div
			v-for="opt in optionList"
			class="text-style-web-small-regular px-4 py-2 cursor-pointer !bg-background-window"
			:key="opt.value"
			@click="handleSelect(opt)"
			:class="[opt.key === selectValue ? selectClass : 'text-text-description']">
			{{ opt.label }}
		</div>
		<template #reference>
			<div
				:class="[selectLabel ? selectClass : 'text-text-description']"
				class="text-style-web-small-regular flex cursor-pointer items-center">
				{{ selectLabel ? selectLabel : t('home.txt12') }}
				<Icon :name="`common/${props.dropIcon}`" :size="20" class="text-text-secondary" />
				<!-- <img :src="`/imgs/common/${props.dropIcon}.svg`" class="flex" /> -->
			</div>
		</template>
	</van-popover>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const props = defineProps({
	optionList: {
		type: Array<any>,
		default: () => []
	},
	selectValue: {
		type: [String, Number],
		default: ''
	},
	selectClass: {
		type: String,
		default: 'text-text-primary'
	},
	// 下拉图标
	dropIcon: {
		type: String,
		default: 'dropdown'
	}
})
const showPopover = ref(false)
const emits = defineEmits(['update:selectValue'])
const selectLabel = computed(
	() => props.optionList.find((item) => item.key === props.selectValue)?.label
)
const handleSelect = (opt: any) => {
	showPopover.value = false
	emits('update:selectValue', opt.value, opt)
}
</script>
<style scoped lang="scss"></style>
