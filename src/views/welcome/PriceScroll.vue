<template>
	<div
		class="scroll-container h-[36px] bg-brand-blue text-style-web-small-bold text-always-white mt-[80px]"
		@mouseover="pauseAnimation"
		@mouseout="resumeAnimation">
		<div class="scroll-content" ref="content">
			<span
				v-for="(item, index) in messages"
				:key="index"
				class="cursor-pointer message"
				@click="goTrade(item.symbol)">
				{{ item.label }}
			</span>
			<!-- 复制一份内容实现无缝循环 -->
			<span
				v-for="(item, index) in messages"
				:key="'copy-' + index"
				class="cursor-pointer message"
				@click="goTrade(item.symbol)">
				{{ item.label }}
			</span>
		</div>
	</div>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineProps } from 'vue'
import { routeTo } from '@/utils/routeTo'
import { replaceToName } from '@/utils/trade'

const props = defineProps({
	list: {
		type: Array as () => any[],
		default: () => []
	}
})

const content = ref<HTMLDivElement | null>(null)

const messages = ref<{ label: string; symbol: string }[]>([])
props.list.forEach((item: any) => {
	messages.value.push({
		label: `${item.symbol} ${item.close}(${item.chgDesc})`,
		symbol: item.symbol
	})
})

onMounted(() => {
	// 动态设置动画时间，使其根据内容长度调整滚动速度
	const contentWidth = content.value?.scrollWidth || 0
	content.value!.style.animationDuration = `${contentWidth / 50}s`
})

const goTrade = (symbol: string) => {
	routeTo('trade', { params: { symbol: replaceToName(symbol) } })
}

// 暂停动画
const pauseAnimation = () => {
	if (content.value) {
		content.value.style.animationPlayState = 'paused'
	}
}

// 恢复动画
const resumeAnimation = () => {
	if (content.value) {
		content.value.style.animationPlayState = 'running'
	}
}
</script>

<style scoped>
.scroll-container {
	overflow: hidden;
	white-space: nowrap;
	display: flex;
	align-items: center;
	width: 100%;
	box-sizing: border-box;
}

.scroll-content {
	display: inline-flex;
	align-items: center;
	animation: scroll-left linear infinite;
	animation-play-state: running; /* 默认动画为运行状态 */
}

@keyframes scroll-left {
	0% {
		transform: translateX(0);
	}
	100% {
		transform: translateX(-50%);
	}
}

.message {
	padding: 0 30px;
	font-size: 18px;
}
</style>
