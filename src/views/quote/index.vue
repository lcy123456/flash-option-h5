<script setup lang="ts">
import { getCuSymbol, replaceToName } from '@/utils/trade'
import { Tabs } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { useTradeStore } from '@/store/modules/trade/index'
import { useSwapStore } from '@/store/modules/swap/index'
import { useVModel } from '@vueuse/core'
import { ref, computed, onMounted, watch } from 'vue'
import { useTradeWsStore } from '@/store/modules/trade/trade-ws'
import { useSwapWsStore } from '@/store/modules/swap/swap-ws'
import { marketSearchEnum } from '@/enums/trade'
import useQuoteStore from '@/hooks/useQuoteStore'
import Recommend from './components/recommend.vue'
import Optional from './components/optional.vue'
import QuoteList from './components/quote-list.vue'
import { useUserStore } from '@/store/useUserStore'
import { useDevice } from '@/hooks/useDevice'

import { useDeliveryContract } from '@/hooks/useDeliveryContract'
import { useRouter, useRoute } from 'vue-router'

const { isPC } = useDevice()
const userStore = useUserStore()

const quoteStore = useQuoteStore()
const tradeWsStore = useTradeWsStore()
const swapWsStore = useSwapWsStore()
const router = useRouter()
const route = useRoute()
const tradeStore = useTradeStore()
const swapStore = useSwapStore()
const { initThumb, state } = useDeliveryContract()
const { t } = useI18n()

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	type: {
		type: String,
		default: marketSearchEnum.trade
	},
	showClose: {
		type: Boolean,
		default: true
	}
})
const emits = defineEmits(['update:show'])
const show = useVModel(props, 'show', emits)
// 监听滑块
const priceHeight = ref()
const headerH: any = ref(160)
// watch(
// 	() => props.show,
// 	() => {
// 		setTimeout(() => {
// 			headerH.value = priceHeight.value.getBoundingClientRect().height // 列表高度
// 			setDefaultActive()
// 		}, 10)
// 	}
// )

const isTrade = computed(() => route.path.indexOf('/trade/') >= 0)
const isSwap = computed(() => route.path.indexOf('/swap/') >= 0)
const getWebTabs = computed(() => {
	if (!userStore.loginToken) return quoteStore?.state?.marketTab.slice(1)
	return quoteStore?.state?.marketTab
})
const checkoutSymbol = () => {
	if (isTrade.value) {
		const symbolThumbList = tradeStore.state.symbolThumbList
		const hasUrl = getCuSymbol(symbolThumbList)
		console.log('symbolThumbList---symbolThumbList', symbolThumbList, hasUrl)
		if (!hasUrl) {
			const firstSymbol = symbolThumbList[0]?.symbol
			const symbol = replaceToName(firstSymbol)
			tradeStore.state.currentSymboy = firstSymbol
			router.push({ name: 'trade', params: { symbol: symbol } })
		} else {
			tradeStore.state.currentSymboy = hasUrl.symbol
		}
		tradeStore.fetchSymboyInfo()
	} else if (isSwap.value) {
		const symbolThumbList = swapStore.state.symbolThumbList
		const hasUrl = getCuSymbol(symbolThumbList)
		if (!hasUrl) {
			const firstSymbol = symbolThumbList[0]?.symbol
			const symbol = replaceToName(firstSymbol)
			swapStore.state.currentSymboy = firstSymbol
			router.push({ name: 'swap', params: { symbol: symbol } })
		} else {
			swapStore.state.currentSymboy = hasUrl.symbol
		}
		swapStore.fetchSymboyInfo()
	}
	swapWsStore.createTradeWs()
	tradeWsStore.createTradeWs()
}
const setDefaultActive = () => {
	// 如果显示推荐页面
	if (isShowComment.value) {
		quoteStore.state.marketActive = props.type
	} else {
		quoteStore.state.marketActive = marketSearchEnum.own
		quoteStore.state.optActive = props.type
	}
}
const initData = async () => {
	quoteStore.state.pageFrom = props.type
	// 判断在那个页面调整请求顺序
	if (isTrade.value) {
		await tradeStore.fetchSymThumb()
		checkoutSymbol()
		await swapStore.fetchSymThumb()
	} else {
		await swapStore.fetchSymThumb()
		checkoutSymbol()
		await tradeStore.fetchSymThumb()
	}
	if (quoteStore.state.pageFrom !== marketSearchEnum.dcontract) {
		initThumb()
	}

	swapStore.fetchFavorFind()
	tradeStore.fetchFavorFind()
}

onMounted(() => {
	quoteStore.state.showSymbol = true
	if (!userStore.loginToken) {
		quoteStore.state.marketActive = marketSearchEnum.trade
	}
	initData()
})

const handleTab = (type: any) => {
	quoteStore.state.marketActive = type
}
const symbolList = computed(() => {
	const reg = new RegExp(quoteStore.state.searchValue?.toLocaleLowerCase(), 'gim')
	let list = []
	// tab = 现货
	if (quoteStore?.state.marketActive === marketSearchEnum.trade) {
		list = tradeStore?.state?.symbolThumbList.filter((item: any) =>
			item.symbol?.toLocaleLowerCase().match(reg)
		)
	} else if (quoteStore?.state.marketActive === marketSearchEnum.swap) {
		// tab = 合约
		list = swapStore?.state?.symbolThumbList.filter((item: any) =>
			item.symbol?.toLocaleLowerCase().match(reg)
		)
	} else if (quoteStore?.state.marketActive === marketSearchEnum.option) {
		// tab = 期权
		list = quoteStore?.state?.optionCoinList.filter((item: any) =>
			item.symbol?.toLocaleLowerCase().match(reg)
		)
	} else if (quoteStore?.state.marketActive === marketSearchEnum.dcontract) {
		// tab = 交割合约
		list = state.symbolThumbList.filter((item: any) => item.symbol?.toLocaleLowerCase().match(reg))
	} else if (quoteStore?.state.marketActive === marketSearchEnum.own) {
		switch (quoteStore?.state.optActive) {
			case marketSearchEnum.trade:
				list = tradeFavor.value.filter((item: any) => item.symbol?.toLocaleLowerCase().match(reg))
				break
			case marketSearchEnum.swap:
				list = swapFavor.value.filter((item: any) => item.symbol?.toLocaleLowerCase().match(reg))
				break
			case marketSearchEnum.option:
				list = optionFavor.value.filter((item: any) => item.symbol?.toLocaleLowerCase().match(reg))
				break
			case marketSearchEnum.dcontract:
				list = dcontractFavor.value.filter((item: any) =>
					item.symbol?.toLocaleLowerCase().match(reg)
				)
				break
		}
	}
	return list
})

const close = () => {
	show.value = false
}
// 现货自选
const tradeFavor = computed(() => {
	return tradeStore?.state?.symbolThumbList.filter((key) => key.isFavor) || []
})
// 合约自选
const swapFavor = computed(() => {
	return swapStore?.state?.symbolThumbList.filter((key) => key.isFavor) || []
})
// 期权自选
const optionFavor = computed(() => {
	return quoteStore?.state?.optionCoinList.filter((key) => key.isFavor) || []
})
// 交割合约自选
const dcontractFavor = computed(() => {
	return state.symbolThumbList.filter((key) => key.isFavor) || []
})

// 判断显示 推荐页面
const isShowComment = computed(() => {
	const tradeList = tradeFavor.value
	const swapList = swapFavor.value
	const dcontractFavorList = dcontractFavor.value
	if (tradeList.length > 0 || swapList.length > 0 || dcontractFavorList.length > 0) {
		return false
	} else {
		return true
	}
})
watch(
	() => route.path,
	() => {
		if (route.path.includes('/swap')) {
			quoteStore.state.marketActive = marketSearchEnum.swap
		} else if (route.path.includes('/option')) {
			quoteStore.state.marketActive = marketSearchEnum.option
		} else if (route.path.includes('/trade')) {
			quoteStore.state.marketActive = marketSearchEnum.trade
		}
	},
	{
		immediate: true
	}
)
</script>
<template>
	<van-popup
		v-model:show="show"
		position="bottom"
		class="web:hidden rounded-t-[20px] bg-background-window"
		v-bind="$attrs"
		:style="{ height: '88%' }">
		<div class="mb-[50px]">
			<div class="pt-5 fixed w-full bg-background-window rounded-t-[20px]" ref="priceHeight">
				<div class="px-4 flex items-center justify-between pb-[22px]">
					<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt8') }}</div>
					<div class="">
						<!-- <img src="/imgs/common/close.svg" @click="show = false" class="w-6 h-6" /> -->
						<Icon name="common/close" :size="24" class="text-text-primary" @click="show = false" />
					</div>
				</div>
				<div class="px-4">
					<van-field
						v-model="quoteStore.state.searchValue"
						:placeholder="t('trade.txt7')"
						value-class="text-text-primary text-style-web-body-medium"
						class="border border-border-strong bg-background-window rounded-md h-[44px] box-border flex items-center">
						<template #left-icon>
							<Icon name="common/search" :size="24" class="text-text-primary mr-[6px]" />

							<!-- <img src="/imgs/common/search.svg" class="w-5 h-5 mr-[6px]" /> -->
						</template>
					</van-field>
				</div>
				<Tabs
					class="mt-3"
					:items="quoteStore.state?.marketTab"
					v-model:active="quoteStore.state.marketActive"
					:headClass="'px-4'"
					:line_b="true">
					<!-- <template v-slot="props">

					</template> -->
				</Tabs>
			</div>
			<div class="bg-background-window" :style="{ paddingTop: `${headerH}px` }">
				<div v-if="marketSearchEnum.own === quoteStore.state.marketActive">
					<Optional v-if="!isShowComment" />
					<Recommend v-if="isShowComment" />
					<QuoteList v-else :list="symbolList" @close-show="close" />
				</div>
				<QuoteList v-else :list="symbolList" @close-show="close" />
			</div>
		</div>
	</van-popup>
	<div
		class="pdph:hidden relative w-2 h-[542px]"
		:class="[
			quoteStore.state.showSymbol
				? 'w-[320px] border-r border-border-gutter'
				: ' w-3 overflow-hidden'
		]">
		<div v-if="quoteStore.state.showSymbol">
			<div class="rounded-t-[20px]" ref="priceHeight" :class="[isPC ? 'pt-4' : 'pt-5']">
				<div class="px-4">
					<van-field
						v-model="quoteStore.state.searchValue"
						:placeholder="t('trade.txt7')"
						value-class="text-text-primary text-style-web-body-medium"
						class="border border-border-strong customer !h-[40px] w-[288px] rounded-[41px] bg-background-secondary">
						<template #left-icon>
							<Icon name="common/search" :size="24" class="text-text-primary" />
							<!-- <img src="/imgs/common/search.svg" class="w-5 h-5" /> -->
						</template>
					</van-field>
				</div>
				<Tabs
					class="mt-4"
					:items="getWebTabs"
					v-model:active="quoteStore.state.marketActive"
					:headClass="'px-4'"
					:line_b="true" />
			</div>
			<div class="h-[500px] overflow-y-auto customize-crollbar">
				<div v-if="marketSearchEnum.own === quoteStore.state.marketActive">
					<Optional v-if="!isShowComment" />
					<Recommend v-if="isShowComment" />
					<QuoteList v-else :list="symbolList" @close-show="close" />
				</div>
				<QuoteList v-else :list="symbolList" @close-show="close" />
			</div>
		</div>
		<div
			v-if="showClose"
			class="absolute z-10 top-[96px] h-[29px] w-3 bg-background-tertiary flex items-center justify-center cursor-pointer"
			:class="[quoteStore.state.showSymbol ? 'right-[-12px]' : 'right-0']"
			@click="quoteStore.state.showSymbol = !quoteStore.state.showSymbol">
			<Icon name="common/full-arrow" :size="6" class="text-text-primary" />
			<!-- <img src="/imgs/common/full-arrow.svg" class="w-2 h-2" /> -->
		</div>
	</div>
</template>

<style scoped>
::-webkit-scrollbar {
	scrollbar-color: red;
	width: 4px;
}

/* 设置滚动条轨道的样式 */
::-webkit-scrollbar-track {
	background: transparent;
}

/* 设置滚动滑块的样式 */
::-webkit-scrollbar-thumb {
	background: var(--color-background-disabled) !important;
	border-radius: 10px;
}

/* 当鼠标悬停在滚动滑块上时的样式 */
::-webkit-scrollbar-thumb:hover {
	cursor: pointer;
}
::v-deep .van-field__control {
	color: var(--color-text-primary) !important;
}
</style>
