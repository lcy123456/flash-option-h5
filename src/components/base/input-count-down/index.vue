<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import Input from '../input/index.vue'

const start = defineModel('start', { default: false })
const emits = defineEmits(['send', 'finish'])

const { t } = useI18n()
const send = () => {
	start.value = true
	emits('send')
}

const finish = () => {
	start.value = false
	emits('finish')
}
</script>

<template>
	<Input v-bind="$attrs">
		<template v-slot:suffix>
			<div class="ml-1 flex-shrink-0">
				<div
					v-if="!start"
					@click="send"
					class="text-brand-blue text-style-web-body-medium cursor-pointer">
					{{ t('register.txt10') }}
				</div>
				<div v-else>
					<van-count-down
						class="text-text-disabled text-style-web-body-medium"
						:time="60000"
						format="sss"
						@finish="finish" />
				</div>
			</div>
		</template>
	</Input>
</template>
