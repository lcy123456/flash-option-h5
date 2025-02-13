<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { routeTo } from '@/utils/routeTo'
import { Button } from '@/components/base'

import ActivityRules from './components/ActivityRules.vue'
import useCountdown from './useCountdown'

import { useWelfareStore } from '@/store/modules/welfare/index'

const welfareStore = useWelfareStore()

const { t } = useI18n()
const info: any = ref({})
const show = ref(false)
const list1 = ref()
const list2 = ref()
const list3 = ref()

const { formattedTime } = useCountdown()

watch(
	() => welfareStore.data,
	() => {
		if (welfareStore.data) {
			info.value = welfareStore.data
		}
	},
	{
		deep: true,
		immediate: true
	}
)

const splitNumbersAndText = (s: any) => {
	if (!s) return ['', '']
	let numbers = s.match(/\d+.*/)
	if (numbers) {
		numbers = numbers[0].trim()
	} else {
		numbers = ''
	}
	let text = s.replace(numbers, '').trim()
	return [text, numbers]
}

const activeRechargeChallenge = computed(() => {
	if (info.value?.rechargeChallenge) {
		const data = info.value?.rechargeChallenge?.settings || []
		let active = ''
		data.forEach((item: any) => {
			if (info.value?.rechargeChallenge?.amount > item.amount) {
				active = item.amount
			}
		})
		return active
	}
	return ''
})

const activeTradeChallenge = computed(() => {
	if (info.value?.tradeChallenge) {
		const data = info.value?.tradeChallenge?.settings || []
		let active = ''
		data.forEach((item: any) => {
			if (info.value?.tradeChallenge?.amount > item.amount) {
				active = item.amount
			}
		})
		return active
	}
	return ''
})

const activeInviteChallenge = computed(() => {
	if (info.value?.inviteChallenge) {
		const data = info.value?.inviteChallenge?.settings || []
		let active = ''
		data.forEach((item: any) => {
			if (info.value?.inviteChallenge?.amount > item.orderAmountMin) {
				active = item.orderAmountMin
			}
		})
		return active
	}
	return ''
})

const activeDailyRescueFund = computed(() => {
	if (info.value?.dailyRescueFund) {
		const data = info.value?.dailyRescueFund?.settings || []
		let active = ''
		data.forEach((item: any) => {
			if (info.value?.dailyRescueFund?.amount > item.amount) {
				active = item.amount
			}
		})
		return active
	}
	return ''
})

const toDeposit = () => {
	routeTo('/my/deposit?tab=1')
}

const toInvite = () => {
	routeTo('/invite')
}

const toTransaction = () => {
	routeTo('/home/deliveryContract/BTC-USDT')
}

const toActivityLink = () => {
	window.open(info.value?.topBanner.activityLink)
}
</script>

<template>
	<div class="pdph:hidden">
		<div>
			<div class="w-[1200px] mx-auto flex justify-between" v-if="info?.topBanner">
				<div class="pl-10 pt-[108px]">
					<div class="text-text-primary text-style-web-xlarge-medium">
						{{ info?.topBanner?.title }}
					</div>
					<div class="pt-[30px] flex items-center">
						<div class="text-text-secondary text-style-web-oversize-bold mr-[12px]">
							{{ splitNumbersAndText(info?.topBanner?.subTitle)[0] }}
						</div>
						<div class="text-function-buy text-style-web-oversize-bold">
							{{ splitNumbersAndText(info?.topBanner?.subTitle)[1] }}
						</div>
					</div>
					<div class="mt-10 flex">
						<div
							class="rounded-[12px] py-[14px] px-[30px] bg-background-secondary text-text-primary text-style-web-h5-medium mr-3">
							{{ t('text364') }}：{{ formattedTime }}
						</div>
						<div
							class="flex items-center text-text-description text-style-web-body-regular bg-background-secondary rounded-[12px] px-[6px]">
							<div
								@click="show = true"
								class="cursor-pointer py-[14px] px-5 hover:text-text-primary">
								{{ t('text181') }}
							</div>
							<div
								v-if="info?.topBanner?.activityLink"
								class="bg-text-description w-[1px] h-[15px]"></div>
							<div
								v-if="info?.topBanner?.activityLink"
								@click="toActivityLink"
								class="cursor-pointer py-[14px] px-5 hover:text-text-primary">
								{{ t('text182') }}
							</div>
						</div>
					</div>
				</div>
				<div class="pt-[64px] flex-shrink-0">
					<img
						v-if="info?.topBanner?.bannerImageUrl"
						class="w-[279px] h-[260px]"
						:src="info?.topBanner?.bannerImageUrl"
						alt="" />
				</div>
			</div>
		</div>
		<div class="w-[1200px] mx-auto flex pt-[100px]">
			<div class="w-[377px] flex">
				<div v-if="info?.newChallenge">
					<div class="flex items-center">
						<div class="w-[5px] h-[22px] bg-text-brand flex-shrink-0 mr-4"></div>
						<div class="text-text-primary text-style-web-h1-bold">
							{{ info?.newChallenge?.title }}
						</div>
					</div>
					<div class="pl-5">
						<div class="pt-3 text-text-tertiary text-style-web-body-regular">
							<!-- {{ t('text184') }} 9999 USDT -->
							{{ info?.newChallenge?.subTitle }}
						</div>
						<div class="mt-3 bg-background-secondary rounded-[12px] py-5 px-4 flex">
							<div
								class="bg-background-primary rounded-[12px] border border-border-strong w-[56px] h-[56px] box-border flex items-center justify-center">
								<!-- <img src="/imgs/welfare/icon1.svg" alt="" /> -->
								<Icon name="welfare/icon6" dark-name="welfare/icon6_dark" :size="56" />
							</div>
							<div class="pl-4">
								<div class="flex items-center">
									<div class="text-text-primary text-style-web-h1-bold mr-[5px]">
										{{ info?.newChallenge?.bonusAmount }}
									</div>
									<div class="text-text-tertiary text-style-web-body-regular">
										/ {{ info?.newChallenge?.amount }} USDT
									</div>
								</div>
								<div class="pt-[6px] text-text-tertiary text-style-web-body-regular">
									{{ t('text185') }}
								</div>
							</div>
						</div>
						<div class="pt-4 pr-[23px] text-text-tertiary text-style-web-body-regular">
							{{ t('text186') }}
						</div>
					</div>
				</div>
			</div>

			<div class="w-[783px] ml-10">
				<!-- 充值挑战 -->
				<div v-if="info?.rechargeChallenge">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ info?.rechargeChallenge?.title }}
					</div>
					<div class="py-[30px] flex justify-between items-center">
						<div class="flex">
							<div
								class="bg-background-secondary w-[56px] h-56px border border-border-strong rounded-[12px] flex justify-center items-center">
								<Icon name="welfare/icon1" :size="32" class="cursor-default text-text-primary" />
							</div>
							<div class="pl-4">
								<div class="flex items-center">
									<div class="text-text-primary text-style-web-h1-bold">
										{{ info?.rechargeChallenge?.bonusAmount }}
									</div>
									<div class="ml-[5px] text-text-tertiary text-style-web-body-regular">
										/{{ info?.rechargeChallenge?.amount }} USDT
									</div>
								</div>
								<div class="mt-[6px] text-text-tips text-style-web-body-regular">
									{{ t('text185') }}
								</div>
							</div>
						</div>
						<Button @click="toDeposit" class="w-auto !px-6" size="small">{{ t('text188') }}</Button>
					</div>
					<div class="border border-border-strong rounded-[12px] p-6 pb-0 flex">
						<div class="mr-[18px] flex-shrink-0">
							<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text189') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text190') }}
							</div>
						</div>
						<div ref="list1" class="flex overflow-x-auto overflow-y-hidden relative z-100 pb-6">
							<div
								v-for="(item, key) in info?.rechargeChallenge?.settings"
								:key="key"
								:data-active="activeRechargeChallenge === item.amount"
								class="relative z-1000">
								<div
									v-if="activeRechargeChallenge === item.amount"
									class="mr-[30px] py-[6px] px-3 bg-always-black rounded-[33px] w-[100px] flex justify-center items-center">
									<Icon name="welfare/icon2" :size="16" class="text-always-white" />
									<div class="pl-[6px] text-always-white text-style-web-body-medium">
										{{ item.bonusAmount }}
									</div>
								</div>
								<div
									v-else
									class="mr-[30px] py-[6px] px-3 bg-background-secondary rounded-[33px] w-[100px] flex justify-center items-center">
									<Icon name="welfare/icon2" :size="16" class="text-text-primary" />
									<div class="pl-[6px] text-text-secondary text-style-web-body-medium">
										{{ item.bonusAmount }}
									</div>
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
									{{ item.amount }}
								</div>
								<div
									v-if="activeRechargeChallenge === item.amount"
									class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
									<Icon name="welfare/icon5" :size="20" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 交易挑战 -->
				<div class="pt-[60px]" v-if="info?.tradeChallenge">
					<div class="flex items-center justify-between">
						<div class="text-text-primary text-style-web-h1-bold">
							{{ info?.tradeChallenge?.title }}
						</div>
						<!-- <div class="text-text-secondary text-style-web-h3-medium">
							{{ t('text364') }}：{{ formattedTime }}
						</div> -->
					</div>
					<div class="py-[30px] flex justify-between items-center">
						<div class="flex">
							<div
								class="bg-background-secondary w-[56px] h-56px rounded-[12px] flex justify-center items-center">
								<Icon
									name="welfare/icon3"
									dark-name="welfare/icon3_dark"
									:size="56"
									class="!text-border-strong cursor-default" />
							</div>
							<div class="pl-4">
								<div class="flex items-center">
									<div class="text-text-primary text-style-web-h1-bold">
										{{ info?.tradeChallenge?.bonusAmount }}
									</div>
									<div class="ml-[5px] text-text-tertiary text-style-web-body-regular">
										/{{ info?.tradeChallenge?.amount }} USDT
									</div>
								</div>
								<div class="mt-[6px] text-text-tips text-style-web-body-regular">
									{{ t('text185') }}
								</div>
							</div>
						</div>
						<Button @click="toTransaction" class="w-auto !px-6" size="small">
							{{ t('text192') }}
						</Button>
					</div>
					<div class="border border-border-strong rounded-[12px] p-6 pb-0 flex">
						<div class="mr-[18px] flex-shrink-0">
							<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text189') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('home.txt8') }}
							</div>
						</div>
						<div ref="list2" class="flex overflow-x-auto overflow-y-hidden pb-6 relative">
							<div
								v-for="(item, key) in info?.tradeChallenge?.settings"
								:key="key"
								:data-active="activeTradeChallenge === item.amount"
								class="relative z-100">
								<div
									v-if="activeTradeChallenge === item.amount"
									class="mr-[30px] py-[6px] px-3 bg-always-black rounded-[33px] w-[100px] flex justify-center items-center">
									<Icon name="welfare/icon2" :size="16" class="text-always-white" />
									<div class="pl-[6px] text-always-white text-style-web-body-medium">
										{{ item.bonusAmount }}
									</div>
								</div>
								<div
									v-else
									class="mr-[30px] py-[6px] px-3 bg-background-secondary rounded-[33px] w-[100px] flex justify-center items-center">
									<Icon name="welfare/icon2" :size="16" class="text-text-primary" />
									<div class="pl-[6px] text-text-secondary text-style-web-body-medium">
										{{ item.bonusAmount }}
									</div>
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
									{{ item.amount }}
								</div>
								<div
									v-if="activeTradeChallenge === item.amount"
									class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
									<Icon name="welfare/icon5" :size="20" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 每日救援金 -->
				<div class="pt-[60px]" v-if="info?.dailyRescueFund">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ info?.dailyRescueFund?.title }}
					</div>
					<div class="py-[30px] flex justify-between items-center">
						<div class="flex">
							<div
								class="bg-background-secondary w-[56px] h-56px rounded-[12px] flex justify-center items-center border border-border-strong">
								<!-- <Icon name="welfare/icon3" :size="56" class="!text-border-strong cursor-default" /> -->
								<Icon name="welfare/icon1" :size="32" class="cursor-default text-text-primary" />
							</div>
							<div class="pl-4">
								<div class="flex items-center">
									<div class="text-text-primary text-style-web-h1-bold">
										{{ info?.dailyRescueFund?.bonusAmount }}
									</div>
									<div class="ml-[5px] text-text-tertiary text-style-web-body-regular">
										/{{ info?.dailyRescueFund?.amount }} USDT
									</div>
								</div>
								<div class="mt-[6px] text-text-tips text-style-web-body-regular">
									{{ t('text185') }}
								</div>
							</div>
						</div>
						<Button @click="toTransaction" class="w-auto !px-6" size="small">
							{{ t('text192') }}
						</Button>
					</div>
					<div class="border border-border-strong rounded-[12px] p-6 pb-0 flex">
						<div class="mr-[18px] flex-shrink-0">
							<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text189') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text338') }}
							</div>
						</div>
						<div ref="list2" class="flex overflow-x-auto overflow-y-hidden pb-6 relative">
							<div
								v-for="(item, key) in info?.dailyRescueFund?.settings"
								:key="key"
								:data-active="activeDailyRescueFund === item.amount"
								class="relative z-100">
								<div
									v-if="activeDailyRescueFund === item.amount"
									class="mr-[30px] py-[6px] px-3 bg-always-black rounded-[33px] w-[100px] flex justify-center items-center">
									<Icon name="welfare/icon2" :size="16" class="text-always-white" />
									<div class="pl-[6px] text-always-white text-style-web-body-medium">
										{{ item.bonusAmount }}
									</div>
								</div>
								<div
									v-else
									class="mr-[30px] py-[6px] px-3 bg-background-secondary rounded-[33px] w-[100px] flex justify-center items-center">
									<Icon name="welfare/icon2" :size="16" class="text-text-primary" />
									<div class="pl-[6px] text-text-secondary text-style-web-body-medium">
										{{ item.bonusAmount }}
									</div>
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
									{{ item.amount }}USDT
								</div>
								<div
									v-if="activeDailyRescueFund === item.amount"
									class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
									<Icon name="welfare/icon5" :size="20" />
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- 邀请返佣挑战 -->
				<div class="pt-[60px]" v-if="info?.inviteChallenge">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ info?.inviteChallenge?.title }}
					</div>
					<div class="py-[30px] flex justify-between items-center">
						<div class="flex">
							<div
								class="bg-background-secondary w-[56px] h-56px rounded-[12px] flex justify-center items-center">
								<Icon
									name="welfare/icon4"
									dark-name="welfare/icon4_dark"
									:size="56"
									class="!text-border-strong cursor-default" />
							</div>
							<div class="pl-4">
								<div class="flex items-center">
									<div class="text-text-primary text-style-web-h1-bold">
										{{ info?.inviteChallenge?.bonusAmount }}
									</div>
									<div class="ml-[5px] text-text-tertiary text-style-web-body-regular">
										/{{ info?.inviteChallenge?.amount }} USDT
									</div>
								</div>
								<div class="mt-[6px] text-text-tips text-style-web-body-regular">
									{{ t('text185') }}
								</div>
							</div>
						</div>
						<Button @click="toInvite" class="w-auto !px-6 min-w-[90px]" size="small">
							{{ t('text194') }}
						</Button>
					</div>
					<div class="border border-border-strong rounded-[12px] p-6 pb-0 flex">
						<div class="mr-[18px] flex-shrink-0">
							<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text195') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text196') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text18') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('other.txt4') }}
							</div>
							<div
								class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
								{{ t('text324') }}
							</div>
						</div>
						<div ref="list3" class="flex overflow-x-auto overflow-y-hidden pb-6">
							<div
								v-for="(item, key) in info?.inviteChallenge?.settings"
								:key="key"
								:data-active="activeInviteChallenge === item.orderAmountMin"
								class="relative z-100">
								<div class="mr-[30px] h-[32px] w-[100px] flex justify-center items-center">
									<div class="text-text-secondary text-style-web-body-medium">
										{{ item.rechargeUserCountMin }}
									</div>
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
									{{ item.rechargeAmountMin }}
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
									{{ item.orderAmountMin }}
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-primary text-style-web-body-bold">
									{{ item.scale }}%
								</div>
								<div
									class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-primary text-style-web-body-bold">
									{{ item.bonusWithdrawTradeFlow }}%
								</div>
								<div
									v-if="activeInviteChallenge === item.orderAmountMin"
									class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
									<Icon name="welfare/icon5" :size="20" />
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="web:hidden pb-[30px]">
		<div class="px-4 pt-[30px]">
			<div class="flex justify-between px-2" v-if="info?.topBanner">
				<div>
					<div class="text-text-primary text-style-web-body-medium">
						{{ info?.topBanner?.title }}
					</div>
					<div class="text-text-primary text-style-web-large-black mt-3">
						{{ splitNumbersAndText(info?.topBanner?.subTitle)[0] }}
					</div>
					<div class="text-function-buy text-style-web-large-black mt-1">
						{{ splitNumbersAndText(info?.topBanner?.subTitle)[1] }}
					</div>
				</div>
				<div class="w flex-shrink-0 w-[107px] h-[100px]">
					<img
						v-if="info?.topBanner?.bannerImageUrl"
						class="w-[107px] h-[100px]"
						:src="info?.topBanner?.bannerImageUrl"
						alt="" />
				</div>
			</div>

			<div
				class="text-center mt-[30px] rounded-[12px] py-[10px] px-[30px] bg-background-secondary text-text-primary text-style-web-body-medium">
				{{ t('text364') }}：{{ formattedTime }}
			</div>

			<div
				v-if="info?.topBanner"
				class="mt-[10px] py-[12px] px-4 flex items-center bg-background-secondary rounded-[12px]">
				<div
					@click="show = true"
					class="flex-1 text-text-description text-style-web-small-regular flex items-center justify-center">
					{{ t('text181') }}
				</div>
				<div
					v-if="info?.topBanner?.activityLink"
					class="h-[10px] w-[1px] bg-text-disabled flex-shrink-0"></div>
				<div
					v-if="info?.topBanner?.activityLink"
					@click="toActivityLink"
					class="flex-1 text-text-description text-style-web-small-regular flex items-center justify-center">
					{{ t('text182') }}
				</div>
			</div>
		</div>

		<div class="mt-[30px]" v-if="info?.newChallenge">
			<div class="flex items-center">
				<div class="w-[5px] h-[22px] bg-text-brand flex-shrink-0 mr-[11px]"></div>
				<div class="text-text-primary text-style-web-h3-bold">{{ info?.newChallenge?.title }}</div>
			</div>
			<div class="px-4 pt-2">
				<div class="text-text-tertiary text-style-web-small-regular">
					{{ info?.newChallenge?.subTitle }}
				</div>
				<div class="mt-4 bg-background-secondary rounded-[12px] py-5 px-4 flex">
					<div class="w-[56px] h-[56px] box-border flex items-center justify-center flex-shrink-0">
						<!-- <img src="/imgs/welfare/icon1.svg" alt="" /> -->
						<Icon name="welfare/icon6" dark-name="welfare/icon6_dark" :size="56" />
					</div>
					<div class="pl-4">
						<div class="flex items-center">
							<div class="text-text-primary text-style-web-h1-bold mr-[5px]">
								{{ info?.newChallenge?.bonusAmount }}
							</div>
							<div class="text-text-tertiary text-style-web-body-regular">
								/ {{ info?.newChallenge?.amount }} USDT
							</div>
						</div>
						<div class="pt-[6px] text-text-tertiary text-style-web-body-regular">
							{{ t('text185') }}
						</div>
					</div>
				</div>
				<div class="mt-4 text-text-tips text-style-web-small-regular">{{ t('text186') }}</div>
			</div>
		</div>

		<div class="mt-[30px]" v-if="info?.rechargeChallenge">
			<div class="flex items-center">
				<div class="w-[5px] h-[22px] flex-shrink-0 mr-[11px]"></div>
				<div class="text-text-primary text-style-web-h3-bold">
					{{ info?.rechargeChallenge?.title }}
				</div>
			</div>
			<div class="px-4">
				<div class="py-6 flex justify-between">
					<div class="flex">
						<div
							class="bg-background-secondary w-[56px] h-56px border border-border-strong rounded-[12px] flex justify-center items-center">
							<Icon name="welfare/icon1" :size="32" class="text-text-primary" />
						</div>
						<div class="pl-4">
							<div class="flex items-center">
								<div class="text-text-primary text-style-web-h2-bold">
									{{ info?.rechargeChallenge?.bonusAmount }}
								</div>
								<div class="ml-[5px] text-text-tertiary text-style-web-small-regular">
									/{{ info?.rechargeChallenge?.amount }} USDT
								</div>
							</div>
							<div class="mt-[6px] text-text-tips text-style-web-small-regular">
								{{ t('text185') }}
							</div>
						</div>
					</div>
					<Button @click="toDeposit" class="w-auto !px-6 flex-shrink-0" size="small">
						{{ t('text188') }}
					</Button>
				</div>
				<div class="border border-border-strong rounded-[12px] p-4 pb-0 flex">
					<div class="mr-[18px] flex-shrink-0">
						<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text189') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text190') }}
						</div>
					</div>
					<div
						class="flex overflow-x-auto overflow-y-hidden relative z-100 pb-4"
						style="scrollbar-width: none; -ms-overflow-style: none">
						<div
							v-for="(item, key) in info?.rechargeChallenge?.settings"
							:key="key"
							class="relative z-1000">
							<div
								v-if="activeRechargeChallenge === item.amount"
								class="mr-[30px] py-[6px] px-3 bg-always-black rounded-[33px] w-[100px] flex justify-center items-center">
								<Icon name="welfare/icon2" :size="16" class="text-always-white" />
								<div class="pl-[6px] text-always-white text-style-web-body-medium">
									{{ item.bonusAmount }}
								</div>
							</div>
							<div
								v-else
								class="mr-[30px] py-[6px] px-3 bg-background-secondary rounded-[33px] w-[100px] flex justify-center items-center">
								<Icon name="welfare/icon2" :size="16" class="text-always-white" />
								<div class="pl-[6px] text-text-secondary text-style-web-body-medium">
									{{ item.bonusAmount }}
								</div>
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
								{{ item.amount }}
							</div>
							<div
								v-if="activeRechargeChallenge === item.amount"
								class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
								<Icon name="welfare/icon5" :size="20" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-[30px]" v-if="info?.tradeChallenge">
			<div class="flex items-center">
				<div class="w-[5px] h-[22px] flex-shrink-0 mr-[11px]"></div>
				<div class="flex flex-1 justify-between items-center pr-4">
					<div class="text-text-primary text-style-web-h3-bold">
						{{ info?.tradeChallenge?.title }}
					</div>
					<!-- <div class="text-text-secondary text-style-web-h3-medium">
						{{ t('text364') }}：{{ formattedTime }}
					</div> -->
				</div>
			</div>
			<div class="px-4">
				<div class="py-6 flex justify-between">
					<div class="flex">
						<div
							class="bg-background-secondary w-[56px] h-56px rounded-[12px] flex justify-center items-center">
							<Icon
								name="welfare/icon3"
								dark-name="welfare/icon3_dark"
								:size="56"
								class="!text-border-strong" />
						</div>
						<div class="pl-4">
							<div class="flex items-center">
								<div class="text-text-primary text-style-web-h2-bold">
									{{ info?.tradeChallenge?.bonusAmount }}
								</div>
								<div class="ml-[5px] text-text-tertiary text-style-web-small-regular">
									/{{ info?.tradeChallenge?.amount }} USDT
								</div>
							</div>
							<div class="mt-[6px] text-text-tips text-style-web-small-regular">
								{{ t('text185') }}
							</div>
						</div>
					</div>
					<Button @click="toTransaction" class="w-auto !px-6 flex-shrink-0" size="small">
						{{ t('text192') }}
					</Button>
				</div>
				<div class="border border-border-strong rounded-[12px] p-4 pb-0 flex">
					<div class="mr-[18px] flex-shrink-0">
						<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text189') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('home.txt8') }}
						</div>
					</div>
					<div
						class="flex overflow-x-auto overflow-y-hidden pb-4 relative"
						style="scrollbar-width: none; -ms-overflow-style: none">
						<div
							v-for="(item, key) in info?.tradeChallenge?.settings"
							:key="key"
							class="relative z-999">
							<div
								v-if="activeTradeChallenge === item.amount"
								class="mr-[30px] py-[6px] px-3 bg-always-black rounded-[33px] w-[100px] flex justify-center items-center">
								<Icon name="welfare/icon2" :size="16" class="text-always-white" />
								<div class="pl-[6px] text-always-white text-style-web-body-medium">
									{{ item.bonusAmount }}
								</div>
							</div>
							<div
								v-else
								class="mr-[30px] py-[6px] px-3 bg-background-secondary rounded-[33px] w-[100px] flex justify-center items-center">
								<Icon name="welfare/icon2" :size="16" class="text-text-primary" />
								<div class="pl-[6px] text-text-secondary text-style-web-body-medium">
									{{ item.bonusAmount }}
								</div>
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
								{{ item.amount }}
							</div>
							<div
								v-if="activeTradeChallenge === item.amount"
								class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
								<Icon name="welfare/icon5" :size="20" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- 每日救援金 -->
		<div class="mt-[30px]" v-if="info?.dailyRescueFund">
			<div class="flex items-center">
				<div class="w-[5px] h-[22px] flex-shrink-0 mr-[11px]"></div>
				<div class="text-text-primary text-style-web-h3-bold">
					{{ info?.dailyRescueFund?.title }}
				</div>
			</div>
			<div class="px-4">
				<div class="py-6 flex justify-between">
					<div class="flex">
						<div
							class="bg-background-secondary w-[56px] h-56px rounded-[12px] flex justify-center items-center border border-border-strong">
							<Icon name="welfare/icon1" :size="32" class="cursor-default text-text-primary" />
						</div>
						<div class="pl-4">
							<div class="flex items-center">
								<div class="text-text-primary text-style-web-h2-bold">
									{{ info?.dailyRescueFund?.bonusAmount }}
								</div>
								<div class="ml-[5px] text-text-tertiary text-style-web-small-regular">
									/{{ info?.dailyRescueFund?.amount }} USDT
								</div>
							</div>
							<div class="mt-[6px] text-text-tips text-style-web-small-regular">
								{{ t('text185') }}
							</div>
						</div>
					</div>
					<Button @click="toTransaction" class="w-auto !px-6 flex-shrink-0" size="small">
						{{ t('text192') }}
					</Button>
				</div>
				<div class="border border-border-strong rounded-[12px] p-4 pb-0 flex">
					<div class="mr-[18px] flex-shrink-0">
						<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text189') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text338') }}
						</div>
					</div>
					<div
						class="flex overflow-x-auto overflow-y-hidden pb-4 relative"
						style="scrollbar-width: none; -ms-overflow-style: none">
						<div
							v-for="(item, key) in info?.dailyRescueFund?.settings"
							:key="key"
							class="relative z-999">
							<div
								v-if="activeDailyRescueFund === item.amount"
								class="mr-[30px] py-[6px] px-3 bg-always-black rounded-[33px] w-[100px] flex justify-center items-center">
								<Icon name="welfare/icon2" :size="16" class="text-always-white" />
								<div class="pl-[6px] text-always-white text-style-web-body-medium">
									{{ item.bonusAmount }}
								</div>
							</div>
							<div
								v-else
								class="mr-[30px] py-[6px] px-3 bg-background-secondary rounded-[33px] w-[100px] flex justify-center items-center">
								<Icon name="welfare/icon2" :size="16" class="text-text-primary" />
								<div class="pl-[6px] text-text-secondary text-style-web-body-medium">
									{{ item.bonusAmount }}
								</div>
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
								{{ item.amount }}USDT
							</div>
							<div
								v-if="activeDailyRescueFund === item.amount"
								class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
								<Icon name="welfare/icon5" :size="20" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-[30px]" v-if="info?.inviteChallenge">
			<div class="flex items-center">
				<div class="w-[5px] h-[22px] flex-shrink-0 mr-[11px]"></div>
				<div class="text-text-primary text-style-web-h3-bold">
					{{ info?.inviteChallenge?.title }}
				</div>
			</div>
			<div class="px-4">
				<div class="py-6 flex justify-between">
					<div class="flex">
						<div
							class="bg-background-secondary w-[56px] h-56px rounded-[12px] flex justify-center items-center">
							<Icon
								name="welfare/icon4"
								dark-name="welfare/icon4_dark"
								:size="56"
								class="!text-border-strong" />
						</div>
						<div class="pl-4">
							<div class="flex items-center">
								<div class="text-text-primary text-style-web-h2-bold">
									{{ info?.inviteChallenge?.bonusAmount }}
								</div>
								<div class="ml-[5px] text-text-tertiary text-style-web-small-regular">
									/{{ info?.inviteChallenge?.amount }} USDT
								</div>
							</div>
							<div class="mt-[6px] text-text-tips text-style-web-small-regular">
								{{ t('text185') }}
							</div>
						</div>
					</div>
					<Button @click="toInvite" class="w-auto !px-6 min-w-[90px]" size="small">
						{{ t('text194') }}
					</Button>
				</div>
				<div
					class="border border-border-strong rounded-[12px] p-4 pb-0 flex overflow-y-hidden overflow-x-auto"
					style="scrollbar-width: none; -ms-overflow-style: none">
					<div class="mr-[18px] flex-shrink-0">
						<div class="h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text195') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text196') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text18') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('other.txt4') }}
						</div>
						<div
							class="mt-[11px] h-[32px] flex items-center text-text-tertiary text-style-web-body-bold">
							{{ t('text324') }}
						</div>
					</div>
					<div class="flex pb-4">
						<div
							v-for="(item, key) in info?.inviteChallenge?.settings"
							:key="key"
							class="relative z-100">
							<div class="mr-[30px] h-[32px] w-[100px] flex justify-center items-center">
								<div class="text-text-secondary text-style-web-body-medium">
									{{ item.rechargeUserCountMin }}
								</div>
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
								{{ item.rechargeAmountMin }}
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-description text-style-web-body-regular">
								{{ item.orderAmountMin }}
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-primary text-style-web-body-bold">
								{{ item.scale }}%
							</div>
							<div
								class="mt-[11px] mr-[30px] h-[32px] w-[100px] flex justify-center items-center text-text-primary text-style-web-body-bold">
								{{ item.bonusWithdrawTradeFlow }}%
							</div>
							<div
								v-if="activeInviteChallenge === item.orderAmountMin"
								class="z-100 w-[20px] h-[20px] flex items-center justify-center absolute -bottom-[25px] left-[calc(50%-15px)] -translate-x-1/2">
								<Icon name="welfare/icon5" :size="20" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<ActivityRules v-model:show="show" :content="info?.topBanner?.content" />
</template>
