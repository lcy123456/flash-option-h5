<template>
	<div class="flex items-center" v-if="list.length > 0">
		<img src="/imgs/welcome/icon1.svg" class="w-[16px] h-[16px]" />
		<div
			class="grow basis-0 flex-shrink-0 overflow-hidden whitespace-nowrap text-ellipsis text-style-web-base-regular text-text-tertiary ml-[12px]">
			{{ list[state.position].title }}
		</div>
		<div
			class="w-[76px] ml-[12px] text-right text-style-web-base-medium border-l border-border-strong text-text-tips cursor-pointer"
			@click="goNotice">
			{{ t('home.txt12') }}
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { routeTo } from '@/utils/routeTo'

const { t } = useI18n()

// 声明 props 类型
const props = defineProps({
	list: {
		type: Array as () => any[],
		default: () => []
	}
})
let intervernalId
const state = reactive({
	position: 0
	// list: [
	// 	'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
	// 	'https://fastly.jsdelivr.net/npm/@vant/assets/apple-2.jpeg',
	// 	'https://fastly.jsdelivr.net/npm/@vant/assets/apple-3.jpeg',
	// 	'https://fastly.jsdelivr.net/npm/@vant/assets/apple-4.jpeg'
	// ]
})
// const onChange = (index) => {
// 	state.value = index
// }

const goNotice = () => {
	routeTo('/notice')
}

onMounted(() => {
	intervernalId = setInterval(() => {
		if (state.position < props.list.length - 1) {
			state.position++
		} else {
			state.position = 0
		}
	}, 5000)
})
onBeforeUnmount(() => {
	if (intervernalId) {
		clearInterval(intervernalId)
		intervernalId = null
	}
})
</script>
<style lang="scss" scoped>
.bg-indicators {
	background-color: '#EDEFF3';
}
</style>
