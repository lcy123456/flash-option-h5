<script setup lang="ts">
import { computed, h, reactive, watch } from 'vue'
import { geLimitList } from '@/apis/swap'
import { Dialog } from '@/components/base'
import { useDevice } from '@/hooks/useDevice'
import { actionTypeEnum } from '@/enums/swap'
import { useVModel } from '@vueuse/core'
import { Table } from '@/components/base'
import { fixD, thousandsComma, macthOrderType, PONTextColor } from '@/utils/trade'
import { mul, minus } from '@/utils/index'
import { formatTime } from '@/utils/date'
const { isPC } = useDevice()
import Popup from 'vant'
import { useI18n } from 'vue-i18n'
import { useSwapStore } from '@/store/modules/swap/index'
const swapStore = useSwapStore()
const { t } = useI18n()

const props = defineProps({
	show: {
		type: Boolean,
		default: false
	},
	// 操作项
	currentItem: {
		type: Object,
		default: () => {}
	}
})
const emits = defineEmits(['update:show'])
const show = useVModel(props, 'show', emits)

const handleClose = () => {
	show.value = false
	state.loading = false
}
// 渲染选择的组件
const renderTem = computed(() => {
	if (!isPC.value) {
		return Popup
	}
	return Dialog
})

const handleCancel = (data: any) => {
	swapStore.fetchCancelOrder({
		entrustId: data.id
	})
}
/**
 * 预估盈利
 * 做空= 数量 * (开仓价 -用户输入价格)
 * 做多= 数量 * (用户输入价格 - 开仓价)
 */
const estimatedProft = computed(() => {
	return function (item: any) {
		const { usdtOpenPrice, direction, lossPrice, volume } = item
		const price = lossPrice
		if (!price || !volume) return '--'
		const amount =
			direction === actionTypeEnum.BUY ? minus(usdtOpenPrice, price) : minus(price, usdtOpenPrice)
		return fixD(mul(volume, amount), 4)
	}
})
const columns = reactive([
	{
		title: `${t('trade.txt206')}`,
		key: 'optionName',
		render(item: any) {
			return h('div', { class: 'flex items-center  text-style-web-small-regular' }, [
				h('div', [h('p', {}, macthOrderType(item.type, 'name', 'type'))])
			])
		}
	},
	{
		title: t('trade.txt50'),
		key: 'orderPrice',
		render(item: any) {
			return h('span', { class: 'flex items-center ' }, `${item.volume}${item.coinSymbol}`)
		}
	},
	{
		title: `${t('trade.txt48')}/${t('trade.txt47')}`,
		key: 'direction',
		width: '120px',
		render(item: any) {
			return h(
				'div',
				{ class: `flex items-center` },
				`${thousandsComma(fixD(item.entrustPrice, item.decimalScale))}/${thousandsComma(fixD(item.triggerPrice, item.decimalScale))}`
			)
		}
	},
	{
		title: t('trade.txt31'),
		key: 'optionName',
		render(item: any) {
			return h('div', { class: 'flex items-center  text-style-web-small-regular' }, [
				h('div', [
					h('p', {}, formatTime(item.createTime, 'YYYY-MM-DD')),
					h('p', {}, formatTime(item.createTime, 'HH:mm:ss'))
				])
			])
		}
	},
	{
		title: t('text304'),
		key: 'orderPrice',
		width: '120px',
		render(item: any) {
			return h(
				'span',
				{ class: `flex items-center ${PONTextColor(estimatedProft.value(item))} ` },
				`${estimatedProft.value(item)}(USDT)`
			)
		}
	},

	{
		title: '',
		render(item: any) {
			return h(
				'div',
				{
					class:
						'flex items-center h-full  text-text-brand text-style-web-small-regular cursor-pointer '
				},
				[
					h(
						'div',
						{
							onClick: () => {
								handleCancel(item)
							}
						},
						`${t('text118')}`
					)
				]
			)
		}
	}
])
const state = reactive({
	showClose: false,
	currentItem: {},
	loading: false,
	finished: true,
	limitList: [],
	pageInfo: {
		pageSize: 20,
		pageNo: 1,
		total: 0
	}
})
watch(
	() => props.show,
	(newVal: any) => {
		if (newVal) {
			getList()
		}
	}
)

const getList = async () => {
	console.log(props.currentItem, 'props.currentItem=====')
	const params = {
		// pageSize: state.pageInfo.pageSize,
		// pageNo: state.pageInfo.pageNo,
		positionId: props.currentItem.id
	}
	state.loading = true
	const res: any = await geLimitList(params)
	state.loading = false
	state.pageInfo.total = res && res.data?.totalElements
	state.pageInfo.pageNo++
	const result = res && res?.data
	state.limitList = result
}
const onLoad = () => {
	getList()
}
</script>
<template>
	<div>
		<component
			:is="renderTem"
			v-model:show="show"
			v-bind:position="!isPC ? 'bottom' : 'center'"
			:title="t('trade.txt82')"
			width="680px"
			round>
			<div class="mt-5 mb-3 px-4">
				<div class="flex items-center justify-between mb-[22px]" v-if="!isPC">
					<div class="text-text-primary text-style-web-h3-bold">{{ t('trade.txt82') }}</div>
					<div class="">
						<img src="/imgs/common/close.svg" @click="handleClose" class="w-6 h-6" />
					</div>
				</div>
				<Table
					:columns="columns"
					:dataSource="state.limitList"
					slide
					v-model:loading="state.loading"
					v-model:finished="state.finished"
					@load="onLoad" />
			</div>
			<div class="flex items-center border-t border-border-gutter py-5 px-4">
				<Button
					type="small"
					class="flex-1 border-border-button_strong bg-transparent !text-text-primary"
					@click="handleClose">
					{{ t('trade.txt71') }}
				</Button>
			</div>
		</component>
	</div>
</template>
