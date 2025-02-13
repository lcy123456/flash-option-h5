<template>
	<div>
		<van-field
			v-bind="$attrs"
			ref="inputRef"
			autocomplete="off"
			v-model:model-value="inputValue"
			value-class="text-text-primary text-style-web-body-medium "
			:labelWidth="labelWidth"
			:formatter="formatter"
			format-trigger="onChange"
			:disabled="disabled"
			:readonly="readonly"
			type="number"
			:autofocus="true"
			label-class="text-text-description text-style-web-body-regular "
			:label="label"
			class="bg-background-secondary border border-border-strong rounded-md w-full customer-filed"
			:placeholder="iPlaceholder"
			@click-input="clickInput"
			:input-align="!textAlign ? 'right' : textAlign">
			<template #input v-if="inputText">
				<div class="!text-text-primary text-style-web-body-medium">{{ inputText }}</div>
			</template>
			<template #right-icon v-if="rightText">
				<template v-if="Array.isArray(rightText)">
					<NtDropdown
						v-model:select-value="selectVal"
						:option-list="rightText"
						:drop-icon="'chevron-down'"
						@update:select-value="handleDrop" />
				</template>
				<div v-else class="text-text-primary text-style-web-body-medium">{{ rightText }}</div>
			</template>
		</van-field>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import NtDropdown from '@/components/NtDropdown/index.vue'
const props = defineProps({
	modelValue: {
		type: [Number, String],
		default: ''
	},
	labelWidth: {
		type: [Number, String],
		default: ''
	},
	rightText: {
		type: [String, Array],
		defalut: ''
	},
	iPlaceholder: {
		type: String,
		defalut: ''
	},
	label: {
		type: String,
		defalut: ''
	},
	disabled: {
		type: Boolean,
		defalut: false
	},
	readonly: {
		type: Boolean,
		defalut: false
	},
	decimal: {
		type: Number,
		default: null
	},
	// 输入框
	inputText: {
		type: [Number, String],
		default: ''
	},
	selectValue: {
		type: [String, Number],
		defalut: ''
	},
	textAlign: {
		type: String,
		defalut: 'right'
	},
	focusInput: {
		type: Number,
		default: null
	}
})

const emits = defineEmits(['update:modelValue', 'update:drag-start', 'update:selectValue'])
const transferValue = (value: any) => {
	if (Number(props.decimal) === 0) {
		const fomVal = value.replace(/\D/g, '')
		return fomVal
	}
	const re2 = new RegExp('([0-9]+.[0-9]{' + props.decimal + '})[0-9]*', '')
	const fomVal = value.toString().replace(re2, '$1')
	return fomVal
}
const formatter = (value: any) => {
	if (props.decimal || props.decimal === 0) {
		return transferValue(value)
	} else {
		return value
	}
}
const inputValue = computed({
	get() {
		return props.modelValue
	},
	set(val) {
		let formatValue = val
		if (props.decimal || props.decimal === 0) {
			emits('update:modelValue', transferValue(formatValue))
		} else {
			console.log(val)
			emits('update:modelValue', val)
		}
	}
})
const selectVal = computed({
	get() {
		return props.selectValue
	},
	set(val) {
		let formatValue = val
	}
})

const handleDrop = (val: any) => {
	emits('update:selectValue', val)
}
const inputRef = ref()
const clickInput = () => {
	emits('update:modelValue', props.modelValue)
	setTimeout(() => {
		inputRef.value.focus()
	})
}

watch(
	() => props.focusInput,
	() => {
		clickInput()
	}
)
</script>
<style scoped lang="scss">
.customer-filed {
	line-height: 22px;
}
::v-deep .van-field__control {
	color: var(--color-text-primary) !important;
}
</style>
