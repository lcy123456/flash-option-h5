<script setup lang="ts">
import { computed } from 'vue'
import Input from '../input/index.vue'

const show = defineModel('show', { default: false })

const props = defineProps({
	memorize: {
		type: Boolean,
		default: true
	}
})

const type = computed(() => {
	if (props.memorize) {
		return show.value ? 'text' : 'password'
	}

	return 'text'
})

const inputStyle = computed(() => {
	if (!props.memorize) {
		if (show.value) {
			return ''
		} else {
			return '-webkit-text-security:disc; text-security:disc;'
		}
	}
	return ''
})
</script>

<template>
	<Input v-bind="$attrs" :type="type" :inputStyle="inputStyle">
		<template v-slot:suffix>
			<div @click="show = !show">
				<base-icon v-if="show" name="show" :size="18" class="text-text-disabled" />
				<base-icon v-else name="hide" :size="18" class="text-text-disabled" />
			</div>
		</template>
	</Input>
</template>
