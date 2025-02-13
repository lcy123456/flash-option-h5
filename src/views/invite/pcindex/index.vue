<template>
	<div>
		<div class="px-[166px] flex justify-between items-center mt-[93px]">
			<div class="text-style-web-oversize-bold text-text-primary flex-1">
				<div>{{ t('invite.txt5') }}</div>
				<div class="mt-[30px]">
					{{ t('text180') }} {{ data.highestRate }} {{ t('invite.txt19') }}
				</div>
			</div>
			<div class="bg-background-secondary w-[400px] rounded-[8px] p-[30px] ml-[60px]">
				<div class="text-text-description text-style-web-base-regular">{{ t('invite.txt2') }}</div>
				<div class="text-text-primary text-style-web-h1-bold">{{ data.commissionRate }}</div>
				<div class="h-[1px] bg-border-strong my-[20px]"></div>
				<div class="flex items-center">
					<div class="flex-1 text-style-web-h5-medium text-text-description">
						{{ t('invite.txt3') }}
					</div>
					<div class="text-style-web-base-medium text-text-primary">{{ data.promotionCode }}</div>
					<Icon
						name="common/copy"
						:size="16"
						class="text-text-primary ml-[2px]"
						@click="copy(data.promotionCode)" />
				</div>

				<div class="flex items-center mt-[20px]">
					<div class="flex-1 text-style-web-h5-medium text-text-description">
						{{ t('invite.txt4') }}
					</div>
					<div class="text-style-web-base-medium text-text-primary">{{ data.promotionUrl }}</div>
					<Icon
						name="common/copy"
						:size="16"
						class="text-text-primary ml-[2px]"
						@click="copy(data.promotionUrl)" />
				</div>
				<Button
					@click="handleGetInviteUrl"
					class="m-auto h-[42px] mt-[24px] bg-brand-main text-style-web-body-bold text-always-white">
					{{ t('invite.txt5') }}
				</Button>
			</div>
		</div>
		<div class="mt-[120px] px-[156px]">
			<div>
				<div class="flex items-center px-4 border-b border-border-subtle">
					<div
						class="py-[10px] px-3 text-style-web-body-medium cursor-pointer"
						:class="[
							data2.active === item.name
								? 'text-text-primary border-b-2 border-border-button_strong '
								: 'text-text-description'
						]"
						v-for="item in tabList"
						:key="item.name"
						@click="data2.active = item.name">
						{{ item.label }}
					</div>
				</div>
			</div>
			<div v-show="data2.active === 'current'" class="mt-[44px]">
				<div class="text-text-primary text-style-web-h2-bold">{{ t('invite.txt6') }}</div>
				<div
					class="mt-[20px] h-[172px] bg-background-secondary border border-border-strong rounded-[8px] flex items-center justify-between px-[30px] text-text-primary">
					<div>
						<div class="text-style-web-h1-bold">
							{{ thousandsComma(data.todayCommission.rechargeUserCount) }}
						</div>
						<div class="mt-[4px] text-text-description text-style-web-body-regular">
							{{ t('invite.txt7') }}
						</div>
					</div>

					<div>
						<div class="text-style-web-h1-bold">
							{{ thousandsComma(data.todayCommission.rechargeAmount) }}
						</div>
						<div class="mt-[4px] text-text-description text-style-web-body-regular">
							{{ t('invite.txt8') }}(USDT)
						</div>
					</div>

					<div>
						<div class="text-style-web-h1-bold">
							{{ thousandsComma(data.todayCommission.orderAmount) }}
						</div>
						<div class="mt-[4px] text-text-description text-style-web-body-regular">
							{{ t('invite.txt9') }}(USDT)
						</div>
					</div>

					<div>
						<div class="text-style-web-h1-bold">
							{{ thousandsComma(data.todayCommission.commission) }}
						</div>
						<div class="mt-[4px] text-text-description text-style-web-body-regular">
							{{ t('invite.txt10') }}(USDT)
						</div>
					</div>
				</div>
			</div>
			<div v-show="data2.active === 'history'" class="mt-[44px]">
				<div class="text-text-primary text-style-web-h2-bold">{{ t('invite.txt6') }}</div>
				<div class="mt-[20px]">
					<Table
						:columns="columns"
						:dataSource="data2.list"
						slide
						v-model:loading="data2.loading"
						v-model:finished="data2.noData"
						@load="onLoad" />
				</div>
			</div>
		</div>
		<div class="mt-[50px] flex justify-between px-[156px]">
			<div class="w-[479px] h-[238px] px-[60px] py-[30px]">
				<div class="flex items-center">
					<div
						class="relative w-[44px] h-[44px] bg-[url('/imgs/invite/lev.svg')] bg-cover bg-center">
						<div
							class="absolute right-[12px] bottom-[10px] text-always-white text-style-web-base-regular">
							{{ data.teamLevel }}
						</div>
					</div>
					<div class="ml-[10px] text-text-primary text-style-web-xlarge-bold">
						Lv{{ data.teamLevel }}
					</div>
				</div>
				<div class="mt-[16px] text-text-primary text-style-web-h2-bold">
					{{ t('invite.txt11') }}{{ data.nextLevel.teamLevel }}{{ t('invite.txt20')
					}}{{ data.nextLevel.commissionRate }}
				</div>
				<div
					class="mt-[30px] w-[359px] h-[36px] bg-background-secondary rounded-[6px] p-[10px] flex items-center">
					<div class="flex-1 text-style-web-base-medium text-text-secondary">
						{{ t('invite.txt16') }}
					</div>
					<div class="text-style-web-xxsmall-regular text-text-description">
						{{ data.cycleStart }} - {{ data.cycleEnd }}({{ t('invite.txt17') }})
					</div>
				</div>
			</div>
			<div class="flex-1 p-[30px] w-[718px]">
				<div class="text-text-secondary text-style-web-h4-bold">{{ t('invite.txt12') }}</div>
				<div class="mt-[24px]">
					<div class="flex">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('text113') }}
						</div>
						<div class="text-style-web-base-medium text-text-primary">
							<span class="text-text-brand">
								{{ thousandsComma(data.todayCommission.rechargeUserCount) }}
							</span>
							<span>/{{ thousandsComma(data.nextLevel.rechargeUserCount) }}</span>
						</div>
					</div>
					<div class="mt-[14px]">
						<div class="h-[6px] rounded-[19px] bg-background-tertiary overflow-hidden">
							<div
								class="bg-brand-blue rounded-[19px] h-[6px]"
								:style="{ width: `${data.rechargeUserCountPercent}%` }"></div>
						</div>
					</div>
				</div>

				<div class="mt-[24px]">
					<div class="flex">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('invite.txt14') }}
						</div>
						<div class="text-style-web-base-medium text-text-primary">
							<span class="text-text-brand">
								{{ thousandsComma(data.todayCommission.rechargeAmount) }}
							</span>
							<span>/{{ thousandsComma(data.nextLevel.rechargeAmount) }}</span>
						</div>
					</div>
					<div class="mt-[14px]">
						<div class="h-[6px] rounded-[19px] bg-background-tertiary overflow-hidden">
							<div
								class="bg-brand-blue rounded-[19px] h-[6px]"
								:style="{ width: `${data.rechargeAmountPercent}%` }"></div>
						</div>
					</div>
				</div>

				<div class="mt-[24px]">
					<div class="flex">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('invite.txt15') }}
						</div>
						<div class="text-style-web-base-medium text-text-primary">
							<span class="text-text-brand">
								{{ thousandsComma(data.todayCommission.orderAmount) }}
							</span>
							<span>/{{ thousandsComma(data.nextLevel.orderAmount) }}</span>
						</div>
					</div>
					<div class="mt-[14px]">
						<div class="h-[6px] rounded-[19px] bg-background-tertiary overflow-hidden">
							<div
								class="bg-brand-blue rounded-[19px] h-[6px]"
								:style="{ width: `${data.orderAmountPercent}%` }"></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { showSuccessToast } from '@/components/base/toast'
import { getSystemConfig, commissionDetails } from '@/apis/invite'
import { thousandsComma } from '@/utils/trade'
import { useRouter } from 'vue-router'
import { toFixed } from '@/utils'
import { Table } from '@/components/base'
import { Button } from '@/components/base'

const { t } = useI18n()
const { toClipboard } = useClipboard()
const router = useRouter()

const props = defineProps({
	data: {
		type: Object,
		default: () => ({ todayCommission: {} })
	}
})

const data2 = reactive({
	shareUrl: '',
	active: 'current',
	list: [],
	loading: false,
	noData: false,

	type: 30, // 1=今天；7=7天内；30=30天内
	pageNo: 1,
	pageSize: 20
})
const columns = reactive([
	{
		title: t('trade.txt31'),
		key: 'itemDates'
		// render(item: any) {
		// 	return h('div', { class: 'flex items-center' }, [
		// 		h('span', { class: 'text-text-tertiary text-style-web-small-medium' }, item.symbol),
		// 		h(
		// 			'span',
		// 			{
		// 				class: `py-[1px] px-[6px] ml-[8px] text-style-web-small-regular rounded-[3px] min-w-[36px] ${directionTypeBgColor(item.direction)} ${directionTypeColor(item.direction)}`
		// 			},
		// 			item.direction === 'SELL' ? t('option.txt12') : t('option.txt11')
		// 		)
		// 	])
		// }
	},
	{
		title: t('invite.txt8'), // 充值金额
		key: 'rechargeAmount'
	},

	{
		title: t('invite.txt9'), // 交易金额
		key: 'orderAmount'
	},
	{
		title: t('invite.txt10'), // 返佣金额
		key: 'bonusAmount'
	},
	{
		title: t('other.txt4'), // 返佣比例
		key: 'rate'
	}
])

const loadData = async () => {
	const res = await commissionDetails({
		type: data2.type,
		pageNo: data2.pageNo,
		pageSize: data2.pageSize
	})
	data2.loading = false

	if (res.code === 0) {
		const array = res.data.content.map((item: any) => {
			item.itemDates = item.itemDate.split('-') || []
			item.rechargeAmount = thousandsComma(toFixed(Number(item.rechargeAmount), 2))
			item.rechargeFeeAmount = thousandsComma(toFixed(Number(item.rechargeFeeAmount), 2))
			item.orderAmount = thousandsComma(toFixed(Number(item.orderAmount), 2))

			item.orderFeeAmount = thousandsComma(toFixed(Number(item.orderFeeAmount), 2))
			item.bonusAmount = thousandsComma(toFixed(Number(item.bonusAmount), 2))

			return item
		})
		if (array.length > 0) {
			data2.list.push(...array)
		}
		if (array.length < data2.pageSize) {
			data2.noData = true
		}
	}
}

loadData()

const onLoad = () => {
	data2.pageNo = data2.pageNo + 1
	loadData()
}

const copy = (content: string) => {
	toClipboard(content)
	showSuccessToast({
		message: t('invite.txt24'),
		zIndex: 9999
	})
}

const handleGetInviteUrl = async () => {
	if (data2.shareUrl) {
		copy(data2.shareUrl)
		return
	}
	const res = await getSystemConfig()
	if (res.code === 0) {
		data2.shareUrl = res.data.promotionPrefix + props.data.promotionCode
		copy(data2.shareUrl)
	}
}

const goDetail = () => {
	router.push('/invite/detail')
}

const tabList = computed(() => {
	return [
		{ label: t('text134'), name: 'current' },
		{ label: t('other.txt2'), name: 'history' }
	]
})
</script>
