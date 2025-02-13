<script setup lang="ts">
import Input from '../input/index.vue'

const modelValue = defineModel()

const props = defineProps({
	max: {
		type: Number,
		default: 0
	},
	min: {
		type: Number,
		default: 0
	}
})

const onBlur = () => {
	if (props.min !== 0 || props.max !== 0) {
		if (modelValue.value !== '' && modelValue.value !== undefined) {
			const num = Number(modelValue.value)
			if (num < props.min) {
				modelValue.value = props.min
			}
			if (num > props.max) {
				modelValue.value = props.max
			}
		}
	}
}
</script>

<template>
	<Input v-model="modelValue" @blur="onBlur" type="number" v-bind="$attrs">
		<template v-slot:prefix>
			<slot name="prefix" />
		</template>
		<template v-slot:suffix>
			<slot name="suffix" />
		</template>
	</Input>
</template>
