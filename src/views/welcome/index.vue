<template>
	<div>
		<Top />
		<PriceScroll class="pdph:hidden" :list="state.data.changeRank" />
		<Swiper class="pdph:hidden" :notices="state.notices" :banners="state.banners" />
		<div class="web:hidden px-[16px]">
			<div class="mt-[41px]">
				<phdSwiper :list="state.banners" />
			</div>
			<div class="mt-[24px]">
				<phdNotices :list="state.notices" />
			</div>
		</div>
		<List :recommends="state.data.recommend" :ranks="state.data.changeRank" />
		<Product />
		<AppDownload />
		<!-- <Footer /> -->
	</div>
</template>
<script lang="ts" setup>
import { onBeforeUnmount } from 'vue'
import Top from './Top.vue'
import PriceScroll from './PriceScroll.vue'
import Swiper from './web/Swiper.vue'
import List from './list/index.vue'
import Product from './Product.vue'
import AppDownload from './AppDownload.vue'
// import Footer from './Footer.vue'
import phdSwiper from './phd/Swip.vue'
import phdNotices from './phd/Notices.vue'
import { useDevice } from '@/hooks/useDevice'
import { useMarketOverView } from '@/hooks/useMarketOverView'

const { isWeb } = useDevice()

const { initData, state, closeWs } = useMarketOverView()
initData(isWeb.value ? 2 : 1)

onBeforeUnmount(() => {
	closeWs()
})
</script>
