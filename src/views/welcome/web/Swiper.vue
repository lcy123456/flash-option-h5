<template>
	<div class="mt-[60px] flex justify-start w-[1200px] mx-auto">
		<div class="w-full">
			<div class="w-full">
				<van-swipe
					@change="onChange"
					:show-indicators="false"
					:autoplay="3000"
					lazy-render
					class="w-full flex overflow-hidden rounded-[8px]">
					<van-swipe-item v-for="(item, index) in data.bannerList" :key="index" class="flex-1 flex">
						<img
							v-for="item1 in item.imgs"
							@click="handleToBulletin(item1)"
							:key="item1.serialNumber"
							:src="item1.url"
							class="w-[388px] rounded-[8px] ml-[18px] cursor-pointer object-fit-contain" />
					</van-swipe-item>
				</van-swipe>
			</div>
			<div class="mt-[20px] flex items-center justify-between">
				<div class="flex-1 flex items-center ml-[18px] min-w-[100px]">
					<img src="/imgs/welcome/bell.png" class="w-[16px] h-[16px]" v-if="notices.length > 0" />
					<div
						class="text-style-web-base-regular text-text-tertiary cursor-pointer"
						v-if="notices.length > 0"
						@click="goNotice(notices[data.currentNoticeIndex])">
						{{ notices[data.currentNoticeIndex].title }}
					</div>
				</div>
				<div class="flex items-center">
					<div
						class="w-[9px] h-[3px] rounded-[8px] bg-background-disabled ml-[3px]"
						v-for="(item, index) in data.bannerList"
						:key="index"
						:class="
							data.currentBannerIndex === index ? 'bg-background-primary' : 'bg-background-disabled'
						"></div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, defineProps, onMounted, onBeforeUnmount, computed, watch } from 'vue'
import { routeTo } from '@/utils/routeTo'

let intervernalId
const data = reactive({
	currentNoticeIndex: 0,
	currentBannerIndex: 0,
	bannerList: []
})

// 声明 props 类型
const props = defineProps({
	notices: {
		type: Array as () => any[],
		default: () => []
	},
	banners: {
		type: Array as () => any[],
		default: () => []
	}
})

const handleToBulletin = (row: any) => {
	if (row.linkUrl.includes('http://') || row.linkUrl.includes('https://')) {
		window.open(row.linkUrl, '_blank')
		return
	}
	routeTo('advertiseDetail', { params: { id: row.serialNumber } })
}

const onChange = (index: number) => {
	data.currentBannerIndex = index
}

onMounted(() => {
	intervernalId = setInterval(() => {
		if (data.currentNoticeIndex < props.notices.length - 1) {
			data.currentNoticeIndex++
		} else {
			data.currentNoticeIndex = 0
		}

		// if (data.currentBannerIndex < data.bannerList.length - 1) {
		// 	data.currentBannerIndex++
		// } else {
		// 	data.currentBannerIndex = 0
		// }
	}, 5000)
})
onBeforeUnmount(() => {
	if (intervernalId) {
		clearInterval(intervernalId)
		intervernalId = null
	}
})

watch(
	() => props.banners,
	() => {
		data.bannerList = []
		const length = Math.ceil(props.banners.length / 3)
		for (let i = 0; i < length; i++) {
			data.bannerList.push({ imgs: props.banners.slice(i * 3, (i + 1) * 3) })
		}
	}
)

const goNotice = (item: any) => {
	routeTo('noticeDetail', { params: { id: item.id } })
}
</script>
