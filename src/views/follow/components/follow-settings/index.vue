<script setup lang="ts">
import { reactive, ref, computed, watch } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { isEmpty } from 'lodash'
import { useI18n } from 'vue-i18n'
import { routeTo } from '@/utils/routeTo'

import { PopupBottom, Button, Tabs, InputNumber, Dialog, Input } from '@/components/base'
import { getLangContrast } from '@/utils'
import { useFollowStore } from '@/store/modules/follow'
import { followSettings, unfollow } from '@/apis/follow'
import { toFixed, colorChange } from '@/utils'
import { useIsApp } from '@/hooks/useIsApp'
import { useDevice } from '@/hooks/useDevice'
import { useAppStore } from '@/store/useAppStore'
import { useUserStore } from '@/store/useUserStore'

const { isApp } = useIsApp()
const { isPh } = useDevice()
const { t } = useI18n()
const show = defineModel('show', { default: false })
const emits = defineEmits(['update'])
const followStore: any = useFollowStore()
const appStore = useAppStore()
const userStore = useUserStore()

const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	},
	editInfo: {
		type: Object,
		default: () => ({})
	}
})
const activeSymbol: any = ref([])
const ratio: any = ref('')
const amount: any = ref('')

const isEdit = ref(false)

const activeTab = ref(3)
const items = reactive([
	{
		title: t('flw.txt105'),
		id: 3
	}
	// {
	// 	title: t('flw.txt23'),
	// 	id: 1
	// },
	// {
	// 	title: t('flw.txt24'),
	// 	id: 2
	// }
])

watch(
	() => props.editInfo,
	(info: any) => {
		if (!isEmpty(info)) {
			activeTab.value = info.tradingMode
			if (activeTab.value === 1) {
				ratio.value = toFixed(Number(info.tradingAmount), 2)
			} else {
				amount.value = toFixed(Number(info.tradingAmount), 2)
			}
			activeSymbol.value = info.symbols
			isEdit.value = true
		}
	},
	{
		deep: true,
		immediate: true
	}
)

const tagList = computed(() => {
	if (props.item?.taglist && props.item?.taglist.length) {
		return props.item?.taglist.map((tag: any) => {
			return {
				label: tag[getLangContrast()]
			}
		})
	}
	return []
})

const disabled = computed(() => {
	if (activeTab.value === 1 && ratio.value && activeSymbol.value.length) {
		return false
	}
	if (activeTab.value === 2 && amount.value && activeSymbol.value.length) {
		return false
	}
	if (activeTab.value === 3 && activeSymbol.value.length) {
		return false
	}
	return true
})

const maxAmount = computed(() => {
	const current = Number(followStore.walletInfo?.balance)
	return current
})

const clickSymbol = (item: any) => {
	if (activeSymbol.value.includes(item.symbol)) {
		activeSymbol.value = activeSymbol.value.filter((symbol: any) => symbol !== item.symbol)
	} else {
		activeSymbol.value.push(item.symbol)
	}
}

const submit = async () => {
	if (props.item.minFollowAmount > followStore.walletInfo?.balance) {
		showFailToast(t('text378'))
		return
	}

	const params: any = {
		traderId: props.item.id,
		symbols: activeSymbol.value.join(','),
		tradingMode: activeTab.value,
		tradingAmount: activeTab.value === 1 ? ratio.value : amount.value
	}
	if (activeTab.value === 3) {
		params.tradingAmount = 0
	}
	const res: any = await followSettings(params)
	if (res.code === 0) {
		emits('update', { type: 'add' })
		show.value = false
		showSuccessToast(t('flw.txt111'))
	}
}

const cancel = async () => {
	const res: any = await unfollow({ traderId: props.item.id })
	if (res.code === 0) {
		emits('update', { type: 'cancel' })
		show.value = false
		showSuccessToast(t('flw.txt111'))
	}
}

const onMax = () => {
	amount.value = maxAmount.value
}

watch(
	() => appStore.refreshTransfer,
	() => {
		followStore.init()
		// 划转成功，刷新数据
	}
)

const transfer = () => {
	if (!userStore.loginToken) {
		routeTo('/login')
		return
	}
	routeTo('/my/transfer')
}
</script>

<template>
	<PopupBottom
		v-if="isPh"
		:title="t('flw.txt25')"
		v-model:show="show"
		height="610px"
		v-bind="$attrs">
		<div>
			<div class="flex">
				<div class="w-10 h-10 rounded-full overflow-hidden">
					<img class="w-[100%] h-[100%] object-cover" :src="item?.avatar" alt="" />
				</div>
				<div class="pl-3">
					<div class="flex items-center">
						<div class="text-text-primary text-style-web-h4-medium mr-[2px]">
							{{ item?.nickname }}
						</div>
						<img class="w-4 h-4 object-cover" :src="item?.traderLevel?.avatar" alt="" />
					</div>
					<div class="flex mt-[2px]">
						<div
							v-for="tag in tagList"
							:key="tag.label"
							class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
							{{ tag.label }}
						</div>
					</div>
				</div>
			</div>

			<div class="py-4" v-if="item?.description">
				<div class="py-[6px] px-[10px] rounded-[6px] bg-background-secondary flex items-center">
					<base-icon name="follow/icon3" :size="16" class="text-text-brand w-4 shrink-0" />
					<div
						class="ml-[2px] text-text-tertiary text-style-web-small-regular overflow-hidden text-ellipsis whitespace-nowrap">
						{{ item?.description }}
					</div>
				</div>
			</div>
			<div v-else class="h-4"></div>

			<div class="border border-border-strong rounded-[6px] p-4 flex justify-between">
				<div>
					<div class="h-5 text-text-secondary text-style-web-body-medium">
						{{ item?.registerDays }}
					</div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt26') }}</div>
				</div>
				<div>
					<div class="h-5 text-text-secondary text-style-web-body-medium">
						{{ item?.following }}
					</div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt27') }}</div>
				</div>
				<div>
					<div class="h-5 text-style-web-body-medium" :class="[colorChange(item?.day30Amount)]">
						{{ item?.day30Amount }}
					</div>
					<div class="text-text-description text-style-web-small-regular">
						{{ t('flw.txt39') }}(USDT)
					</div>
				</div>
			</div>

			<Tabs class="mt-4" :items="items" v-model:active="activeTab">
				<template v-slot="props">
					<div v-if="props.active === 1">
						<InputNumber
							v-model="ratio"
							class="mt-4"
							inputClass="bg-background-secondary"
							size="small"
							:min="1"
							:max="500"
							:placeholder="`${t('flw.txt28')}1-500`">
							<template v-slot:suffix>
								<div class="text-text-secondary text-style-web-body-medium">
									<!-- {{ t('flw.txt29') }} -->
									%
								</div>
							</template>
						</InputNumber>
						<div class="mt-1 flex justify-end items-center">
							<div class="text-text-description text-style-web-small-regular mr-1">
								{{ t('flw.txt30') }}
							</div>
							<div class="text-text-primary text-style-web-small-medium mr-1">
								{{ followStore.walletInfo?.balance }} USDT
							</div>
							<base-icon
								v-if="!isApp"
								@click="routeTo('/my/transfer')"
								name="follow/icon4"
								:size="16"
								class="text-function-buy" />
						</div>
					</div>

					<div v-if="props.active === 2">
						<InputNumber
							v-model="amount"
							class="mt-4"
							inputClass="bg-background-secondary"
							size="small"
							check
							:max="maxAmount"
							:placeholder="`${t('flw.txt31')}`">
							<template v-slot:suffix>
								<div class="flex items-center">
									<div class="text-text-secondary text-style-web-body-medium">USDT</div>
									<div class="w-[1px] h-3 bg-border-button_line mx-[10px]"></div>
									<div @click="onMax" class="text-text-brand text-style-web-body-medium">MAX</div>
								</div>
							</template>
						</InputNumber>
						<div class="mt-1 flex justify-end items-center">
							<div class="text-text-description text-style-web-small-regular mr-1">
								{{ t('my.txt26') }}
							</div>
							<div class="text-text-primary text-style-web-small-medium mr-1">
								{{ followStore.walletInfo?.balance }} USDT
							</div>
							<base-icon
								v-if="!isApp"
								@click="routeTo('/my/transfer')"
								name="follow/icon4"
								:size="16"
								class="text-function-buy" />
						</div>
					</div>

					<div v-if="props.active === 3">
						<Input
							disabled
							class="mt-4"
							inputClass="bg-background-secondary"
							size="small"
							:placeholder="t('text341')"></Input>
						<div class="mt-1 flex justify-end items-center">
							<div class="text-text-description text-style-web-small-regular mr-1">
								{{ t('flw.txt30') }}
							</div>
							<div class="text-text-primary text-style-web-small-medium mr-1">
								{{ followStore.walletInfo?.balance }} USDT
							</div>
							<base-icon
								v-if="!isApp"
								@click="routeTo('/my/transfer')"
								name="follow/icon4"
								:size="16"
								class="text-function-buy" />
						</div>
					</div>
				</template>
			</Tabs>

			<div class="my-4 pt-3 pb-1 px-4 border border-border-strong rounded-[6px]">
				<div class="flex justify-between items-center">
					<div class="text-text-primary text-style-web-body-medium">{{ t('flw.txt33') }}</div>
					<!-- <base-icon name="follow/icon5" :size="18" class="text-function-buy" /> -->
				</div>
				<div class="pt-[10px] flex flex-wrap">
					<div
						v-for="item in followStore.symbolList"
						:key="item.symbol"
						@click="clickSymbol(item)"
						class="_symbol w-[calc(33.33%-5.33px)] mr-2 mb-2 py-[6px] px-2 bg-background-secondary rounded flex items-center justify-between">
						<div class="text-text-secondary text-style-web-small-regular">{{ item.symbol }}</div>
						<base-icon
							v-if="activeSymbol.includes(item.symbol)"
							name="vant/round_yes"
							dark-name="vant/round_yes_dark"
							:size="14" />
						<base-icon v-else name="vant/round_no" dark-name="vant/round_no_dark" :size="14" />
					</div>
				</div>
			</div>
		</div>

		<template v-slot:bottom>
			<div v-if="isEdit" class="flex justify-between">
				<Button @click="cancel" size="small" plain class="mr-2 w-[175px]">
					{{ t('flw.txt112') }}
				</Button>
				<Button :disabled="disabled" @click="submit" size="small" class="w-[175px]">
					{{ t('my.txt38') }}
				</Button>
			</div>
			<div v-else class="w-full">
				<Button :disabled="disabled" @click="submit" size="small">{{ t('my.txt38') }}</Button>
			</div>
		</template>
	</PopupBottom>

	<Dialog v-else v-model:show="show" :title="t('flw.txt25')">
		<div class="px-4">
			<div class="flex pb-4">
				<div class="w-10 h-10 rounded-full overflow-hidden">
					<img class="w-[100%] h-[100%] object-cover" :src="item?.avatar" alt="" />
				</div>
				<div class="pl-3">
					<div class="flex items-center">
						<div class="text-text-primary text-style-web-h4-medium mr-[2px]">
							{{ item?.nickname }}
						</div>
						<img class="w-4 h-4 object-cover" :src="item?.traderLevel?.avatar" alt="" />
					</div>
					<div class="flex mt-[2px]">
						<div
							v-for="tag in tagList"
							:key="tag.label"
							class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
							{{ tag.label }}
						</div>
					</div>
				</div>
			</div>
			<div class="pb-4" v-if="item?.description">
				<div class="py-[6px] px-[10px] rounded-[6px] bg-background-secondary flex items-center">
					<base-icon name="follow/icon3" :size="16" class="text-text-brand w-4 shrink-0" />
					<div
						class="ml-[2px] text-text-tertiary text-style-web-small-regular overflow-hidden text-ellipsis whitespace-nowrap">
						{{ item?.description }}
					</div>
				</div>
			</div>

			<div class="pb-4 min-h-[30px] flex items-center">
				<div class="flex items-center mr-6">
					<div class="text-text-secondary text-style-web-body-medium">{{ item?.registerDays }}</div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt26') }}</div>
				</div>
				<div class="flex items-center mr-6">
					<div class="text-text-secondary text-style-web-body-medium">{{ item?.following }}</div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt27') }}</div>
				</div>
				<div class="flex items-center">
					<div class="text-style-web-body-medium" :class="[colorChange(item?.day30Amount)]">
						{{ item?.day30Amount }}
					</div>
					<div class="text-text-description text-style-web-small-regular">
						{{ t('flw.txt39') }}(USDT)
					</div>
				</div>
			</div>

			<Tabs :items="items" v-model:active="activeTab">
				<template v-slot="props">
					<div v-if="props.active === 1">
						<InputNumber
							v-model="ratio"
							class="mt-4"
							inputClass="bg-background-secondary"
							size="small"
							:min="1"
							:max="500"
							:placeholder="`${t('flw.txt28')}1-500`">
							<template v-slot:suffix>
								<div class="text-text-secondary text-style-web-body-medium">
									<!-- {{ t('flw.txt29') }} -->
									%
								</div>
							</template>
						</InputNumber>
						<div class="mt-1 flex justify-end items-center">
							<div class="text-text-description text-style-web-small-regular mr-1">
								{{ t('flw.txt30') }}
							</div>
							<div class="text-text-primary text-style-web-small-medium mr-1">
								{{ followStore.walletInfo?.balance }} USDT
							</div>
							<base-icon
								v-if="!isApp"
								@click="transfer"
								name="follow/transfer"
								:size="16"
								class="text-text-brand" />
						</div>
					</div>

					<div v-if="props.active === 2">
						<InputNumber
							v-model="amount"
							class="mt-4"
							inputClass="bg-background-secondary"
							size="small"
							check
							:max="maxAmount"
							:placeholder="`${t('flw.txt31')}`">
							<template v-slot:suffix>
								<div class="flex items-center">
									<div class="text-text-secondary text-style-web-body-medium">USDT</div>
									<div class="w-[1px] h-3 bg-border-button_line mx-[10px]"></div>
									<div @click="onMax" class="text-text-brand text-style-web-body-medium">MAX</div>
								</div>
							</template>
						</InputNumber>
						<div class="mt-1 flex justify-end items-center">
							<div class="text-text-description text-style-web-small-regular mr-1">
								{{ t('my.txt26') }}
							</div>
							<div class="text-text-primary text-style-web-small-medium mr-1">
								{{ followStore.walletInfo?.balance }} USDT
							</div>
							<base-icon
								v-if="!isApp"
								@click="transfer"
								name="follow/transfer"
								:size="16"
								class="text-text-brand" />
						</div>
					</div>

					<div v-if="props.active === 3">
						<Input
							class="mt-4"
							inputClass="bg-background-secondary"
							size="small"
							disabled
							:placeholder="t('text341')"></Input>
						<div class="mt-1 flex justify-end items-center">
							<div class="text-text-description text-style-web-small-regular mr-1">
								{{ t('flw.txt30') }}
							</div>
							<div class="text-text-primary text-style-web-small-medium mr-1">
								{{ followStore.walletInfo?.balance }} USDT
							</div>
							<base-icon
								v-if="!isApp"
								@click="transfer"
								name="follow/transfer"
								:size="16"
								class="text-text-brand" />
						</div>
					</div>
				</template>
			</Tabs>

			<div class="my-4 pt-3 pb-1 px-4 border border-border-strong rounded-[6px]">
				<div class="flex justify-between items-center">
					<div class="text-text-primary text-style-web-body-medium">{{ t('flw.txt33') }}</div>
				</div>
				<div class="pt-[10px] flex flex-wrap">
					<div
						v-for="item in followStore.symbolList"
						:key="item.symbol"
						@click="clickSymbol(item)"
						class="_symbol w-[158px] mr-2 mb-2 py-[6px] px-2 bg-background-secondary rounded flex items-center justify-between cursor-pointer">
						<div class="text-text-secondary text-style-web-small-regular">{{ item.symbol }}</div>
						<base-icon
							v-if="activeSymbol.includes(item.symbol)"
							name="vant/round_yes"
							dark-name="vant/round_yes_dark"
							:size="14" />
						<base-icon v-else name="vant/round_no" dark-name="vant/round_no_dark" :size="14" />
					</div>
				</div>
			</div>
		</div>

		<div class="mt-[28px] border-t border-border-strong px-4 py-5">
			<div v-if="isEdit" class="flex justify-between">
				<Button @click="cancel" size="small" plain class="mr-2 w-[259px]">
					{{ t('flw.txt112') }}
				</Button>
				<Button :disabled="disabled" @click="submit" size="small" class="w-[259px]">
					{{ t('my.txt38') }}
				</Button>
			</div>
			<div v-else class="w-full">
				<Button :disabled="disabled" @click="submit" size="small">{{ t('my.txt38') }}</Button>
			</div>
		</div>
	</Dialog>
</template>

<style scoped lang="scss">
._symbol:nth-child(3n + 3) {
	margin-right: 0;
}
</style>
