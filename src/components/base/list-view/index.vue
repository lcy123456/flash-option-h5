<script setup lang="ts">
import { ref } from 'vue'
import { throttle } from 'lodash'
import { useI18n } from 'vue-i18n'
import Empty from '@/components/empty.vue'

const { t } = useI18n()
// const slots = defineSlots()
defineProps({
	title: {
		type: String,
		default: ''
	},
	direction: {
		type: String,
		default: 'y'
	},
	tips: {
		type: String,
		default: ''
	},
	yClass: {
		type: String,
		default: ''
	},
	pt: {
		type: String,
		default: 'pt-6'
	}
})

const finished = defineModel('finished', { default: false })
const loading = defineModel('loading', { default: false })

const emits = defineEmits(['load'])

const scrollBox = ref()
const onLoad = () => {
	emits('load')
}

const scrollToTheBottom = (ele: HTMLElement, callback: () => void, dis = 0, delay = 10) => {
	const scrollFn = () => {
		const sh = ele.scrollWidth - dis

		const ch = ele.clientWidth
		const st = ele.scrollLeft
		if (ch + st >= sh) {
			callback()
		}
	}

	const th = throttle(scrollFn, delay)

	ele.addEventListener('scroll', th)
	return {
		remove: () => {
			ele.removeEventListener('scroll', th)
		}
	}
}

const toLoadMore = () => {
	scrollToTheBottom(scrollBox.value, () => {
		if (!loading.value && !finished.value) {
			loading.value = true
			onLoad()
		}
	})
}
</script>

<template>
	<div :class="pt">
		<div v-if="title" class="pb-3 text-text-primary text-style-web-h3-bold">{{ title }}</div>
		<div>
			<div
				v-if="direction === 'x'"
				class="flex overflow-x-auto overflow-y-hidden"
				style="scrollbar-width: none; -ms-overflow-style: none"
				ref="scrollBox"
				@scroll="toLoadMore">
				<slot>
					<div v-if="finished" class="van-list__finished-text whitespace-nowrap flex items-center">
						{{ t('trade.txt125') }}
					</div>
				</slot>
				<div v-if="loading && !finished" class="flex items-center">
					<van-loading size="16" />
					<div class="van-loading__text whitespace-nowrap">{{ t('flw.txt113') }}</div>
				</div>
			</div>
			<div v-if="direction === 'y'" :class="[yClass]">
				<!-- 	:finished-text="slots.default()[0].children.length ? '没有更多了' : ''" -->
				<van-list
					v-model:loading="loading"
					:finished="finished"
					:offset="50"
					:loading-text="t('flw.txt113')"
					@load="onLoad">
					<slot>
						<Empty v-if="finished" :tips="tips" />
					</slot>
				</van-list>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.xList {
	:deep(.van-list__finished-text) {
		white-space: nowrap;
		width: auto;
		display: flex;
		align-items: center;
	}
}
</style>
