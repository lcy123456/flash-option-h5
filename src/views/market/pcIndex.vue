<template>
	<div>
		<Top />
		<PriceScroll
			v-if="state.data.changeRank.length > 0"
			class="pdph:hidden"
			:list="state.data.changeRank" />
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
import Top from '@/views/welcome/Top.vue'
import PriceScroll from '@/views/welcome/PriceScroll.vue'
import Swiper from '@/views/welcome/web/Swiper.vue'
import List from '@/views/welcome/list/index.vue'
import Product from '@/views/welcome/Product.vue'
import AppDownload from '@/views/welcome/AppDownload.vue'
import phdSwiper from '@/views/welcome/phd/Swip.vue'
import phdNotices from '@/views/welcome/phd/Notices.vue'
import { useMarketOverView } from '@/hooks/useMarketOverView'

const { state } = useMarketOverView()
</script>
