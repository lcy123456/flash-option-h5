<template>
	<div>
		<van-swipe @change="onChange" :show-indicators="false" :autoplay="3000" lazy-render>
			<van-swipe-item v-for="item in list" :key="item.serialNumber" @click="handleToBulletin(item)">
				<div class="flex justify-center">
					<img class="w-full object-fit-contain rounded-[6px]" :src="item.url" />
				</div>
			</van-swipe-item>
		</van-swipe>

		<div class="flex justify-center items-center mt-[12px]">
			<div
				class="w-[6px] h-[6px] rounded-[3px] ml-[4px]"
				v-for="(_, index) in list"
				:key="index"
				:class="state.position === index ? 'bg-brand-blue' : 'bg-indicators'"></div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { routeTo } from '@/utils/routeTo'

// 声明 props 类型
const props = defineProps({
	list: {
		type: Array as () => any[],
		default: () => []
	}
})

const state = reactive({
	position: 0
})

const onChange = (index: number) => {
	state.position = index
}
const handleToBulletin = (row: any) => {
	if (row.linkUrl.includes('http://') || row.linkUrl.includes('https://')) {
		window.open(row.linkUrl, '_blank')
		return
	}
	routeTo('advertiseDetail', { params: { id: row.serialNumber } })
}
</script>
<style lang="scss" scoped>
.bg-indicators {
	background-color: #edeff3;
}
</style>
