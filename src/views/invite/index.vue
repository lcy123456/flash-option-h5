<template>
	<div>
		<div class="web:hidden">
			<Breadcrumb :items="items" />
			<div class="py-[34px] px-[16px]">
				<div class="flex items-center justify-center text-text-primary text-style-web-h2-bold">
					{{ t('invite.txt1') }} {{ data.highestRate }} {{ t('invite.txt19') }}
				</div>
				<div class="flex items-center justify-center h-[168px] mt-[24px]">
					<img src="/imgs/invite/invite_top.svg" class="w-[165px] object-fit-contain" />
				</div>
				<div class="mt-[16px]">
					<div
						class="min-h-[246px] w-full bg-background-secondary rounded-[8px] py-[20px] px-[16px]">
						<div class="text-text-description text-style-web-base-regular">
							{{ t('invite.txt2') }}
						</div>
						<div class="text-text-primary text-style-web-h1-bold mt-[4px]">
							{{ data.commissionRate }}
						</div>

						<div class="my-[20px] h-[1px] bg-border-strong"></div>

						<div>
							<div class="flex items-center">
								<div class="flex-1 text-text-description text-style-web-base-regular">
									{{ t('invite.txt3') }}
								</div>
								<div class="text-style-web-base-medium text-text-primary">
									{{ data.promotionCode }}
								</div>
								<Icon
									name="common/copy"
									:size="16"
									class="text-text-primary ml-[2px]"
									@click="copy(data.promotionCode)" />
							</div>
							<div class="flex items-center mt-[20px]">
								<div class="flex-1 text-text-description text-style-web-base-regular">
									{{ t('invite.txt4') }}
								</div>
								<div class="text-style-web-base-medium text-text-primary">
									{{ data.promotionUrl }}
								</div>
								<Icon
									name="common/copy"
									:size="16"
									class="text-text-primary ml-[2px]"
									@click="copy(data.promotionUrl)" />
							</div>
							<div class="flex justify-center mt-[24px]">
								<van-button
									@click="handleGetInviteUrl"
									class="h-[42px] w-[326px] border-0 bg-brand-main text-style-web-body-bold text-always-white">
									{{ t('invite.txt5') }}
								</van-button>
							</div>
						</div>
					</div>
					<div class="mt-[30px]">
						<div class="flex items-center">
							<div class="text-text-primary text-style-web-h3-bold flex-1">
								{{ t('invite.txt6') }}
							</div>
							<div class="text-style-web-small-regular text-text-primary">
								{{ formatTime(Date.now(), 'YYYY-MM-DD') }}
							</div>
							<!-- <div
						class="min-w-[66px] h-[28px] rounded-[20px] text-style-web-small-regular text-text-primary flex items-center justify-center border border-border-strong py-[6px] px-[12px]">
						<span>{{ t('invite.txt18') }}</span>
						<img src="/imgs/common/chevron-down.svg" class="ml-[4px] w-[14px] h-[14px]" />
					</div>  -->
						</div>
					</div>
					<div class="mt-[20px] min-h-[154px] p-[20px] border border-border-subtle">
						<div class="flex items-center justify-start">
							<div class="flex-1">
								<div class="text-text-primary text-style-web-h3-medium">
									{{ thousandsComma(data.todayCommission.rechargeUserCount) }}
								</div>
								<div class="mt-[4px] text-text-description text-style-web-small-regular">
									{{ t('invite.txt7') }}
								</div>
							</div>
							<div class="flex-1">
								<div class="text-text-primary text-style-web-h3-medium">
									{{ thousandsComma(data.todayCommission.rechargeAmount) }}
								</div>
								<div class="mt-[4px] text-text-description text-style-web-small-regular">
									{{ t('invite.txt8') }}(USDT)
								</div>
							</div>
						</div>
						<div class="flex items-center justify-start mt-[30px]">
							<div class="flex-1">
								<div class="text-text-primary text-style-web-h3-medium">
									{{ thousandsComma(data.todayCommission.orderAmount) }}
								</div>
								<div class="mt-[4px] text-text-description text-style-web-small-regular">
									{{ t('invite.txt9') }}(USDT)
								</div>
							</div>
							<div class="flex-1">
								<div class="text-text-primary text-style-web-h3-medium">
									{{ thousandsComma(data.todayCommission.commission) }}
								</div>
								<div class="mt-[4px] text-text-description text-style-web-small-regular">
									{{ t('invite.txt10') }}(USDT)
								</div>
							</div>
						</div>
						<div
							@click="goDetail"
							class="mt-[30px] h-[42px] rounded-[50px] cursor-pointer flex items-center justify-center border border-border-button_line text-text-primary text-style-web-body-bold">
							{{ t('invite.txt21') }}
						</div>
					</div>
					<div
						class="mt-[30px] h-[416px] py-[20px] px-[16px] rounded-[8px] bg-background-primary border border-border-strong">
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
						<div class="mt-[16px] text-text-description text-style-web-base-regular">
							{{ t('invite.txt11') }}{{ data.nextLevel.teamLevel }}{{ t('invite.txt20')
							}}{{ data.nextLevel.commissionRate }}
						</div>
						<div class="h-[1px] bg-border-subtle my-[20px]"></div>
						<div class="text-style-web-h4-bold text-text-secondary">{{ t('invite.txt12') }}</div>
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

						<div
							class="mt-[24px] h-[36px] bg-background-secondary rounded-[6px] p-[10px] flex items-center justify-between">
							<div class="text-style-web-base-medium text-text-secondary">
								{{ t('invite.txt16') }}
							</div>
							<div class="text-style-web-xxsmall-regular text-text-description">
								{{ data.cycleStart }} - {{ data.cycleEnd }}({{ t('invite.txt17') }})
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class="pdph:hidden">
			<pcindex :data="data" />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'
import useClipboard from 'vue-clipboard3'
import { showSuccessToast } from 'vant'
import { invitationOverview, getSystemConfig } from '@/apis/invite'
import { thousandsComma } from '@/utils/trade'
import { useRouter } from 'vue-router'
import { formatTime } from '@/utils/date'
import { toFixed } from '@/utils'
import pcindex from './pcindex/index.vue'

const { t } = useI18n()
const { toClipboard } = useClipboard()
const router = useRouter()

const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('invite.txt23')
	}
])

const data = reactive({
	todayCommission: {},
	nextLevel: {},
	shareUrl: ''
})
const copy = (content: string) => {
	toClipboard(content)
	showSuccessToast({
		message: t('invite.txt24'),
		zIndex: 9999
	})
}

const loadData = async () => {
	const res = await invitationOverview()
	if (res.code === 0) {
		const d = res.data
		d.todayCommission.rechargeAmount = toFixed(Number(d.todayCommission.rechargeAmount), 2)
		d.todayCommission.orderAmount = toFixed(Number(d.todayCommission.orderAmount), 2)
		d.todayCommission.commission = toFixed(Number(d.todayCommission.commission), 2)

		for (let key in d) {
			data[key] = d[key]
		}
		data.rechargeUserCountPercent = Math.floor(
			(data.todayCommission.rechargeUserCount / data.nextLevel.rechargeUserCount) * 100
		)
		data.rechargeAmountPercent = Math.floor(
			(data.todayCommission.rechargeAmount / data.nextLevel.rechargeAmount) * 100
		)
		data.orderAmountPercent = Math.floor(
			(data.todayCommission.orderAmount / data.nextLevel.orderAmount) * 100
		)
	}
}

loadData()

const handleGetInviteUrl = async () => {
	if (data.shareUrl) {
		copy(data.shareUrl)
		return
	}
	const res = await getSystemConfig()
	if (res.code === 0) {
		data.shareUrl = res.data.promotionPrefix + data.promotionCode
		copy(data.shareUrl)
	}
}

const goDetail = () => {
	router.push('/invite/detail')
}
</script>
