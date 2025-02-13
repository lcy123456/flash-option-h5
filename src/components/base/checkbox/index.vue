<script setup lang="ts">
import { computed } from 'vue'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const modelValue = defineModel('value')

defineProps({
	shape: {
		type: String,
		default: 'square' // round
	}
})

const roundIcon = computed(() => (checked: boolean) => {
	if (checked) {
		return themeStore.theme === 'light' ? 'vant/round_yes' : 'vant/round_yes_dark'
	}
	return themeStore.theme === 'light' ? 'vant/round_no' : 'vant/round_no_dark'
})

const squareIcon = computed(() => (checked: boolean) => {
	if (checked) {
		return themeStore.theme === 'light' ? 'vant/square_yes' : 'vant/square_yes_dark'
	}
	return themeStore.theme === 'light' ? 'vant/square_no' : 'vant/square_no_dark'
})
</script>

<template>
	<van-checkbox v-model="modelValue" v-bind="$attrs">
		<slot></slot>
		<template #icon="props">
			<base-icon
				v-if="shape === 'square'"
				class="text-border-strong"
				:name="squareIcon(props.checked)"
				:size="16" />
			<base-icon v-else class="text-border-strong" :name="roundIcon(props.checked)" :size="16" />
		</template>
	</van-checkbox>
</template>

<style lang="scss" scoped>
.van-checkbox {
	:deep(.van-checkbox__icon) {
		display: flex;
		align-items: center;
	}
}
</style>
