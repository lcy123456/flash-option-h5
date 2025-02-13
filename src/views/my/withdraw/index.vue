<script setup lang="ts">
import { reactive, ref, onBeforeMount, computed, watch, h } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import Breadcrumb from '@/components/base/breadcrumb/index.vue'
import Select from '@/components/base/select/index.vue'
import BaseInput from '@/components/base/input/index.vue'
import Popup from '@/components/base/popup-bottom/index.vue'
import InputCountDown from '@/components/base/input-count-down/index.vue'
import { InputPaste, InputNumber, Table, Copy, Dialog, Button } from '@/components/base'

import {
	getWithdrawCoinList,
	withdrawApply,
	getDepositMainnetList,
	spotAssetList
} from '@/apis/wallet'
import { emailCode, smsCode } from '@/apis/index'
import { withdrawRecord } from '@/apis/wallet'
import { useSecuritySetting } from '@/hooks/useSecuritySetting'
import { formatTime } from '@/utils/date'
import { useDevice } from '@/hooks/useDevice'
import { canWithdraw } from '@/apis/wallet'
import { mul, div, minus } from '@/utils'
import { useAppStore } from '@/store/useAppStore'
import { routeTo } from '@/utils/routeTo'

import Menu from '../components/Menu.vue'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()
const { t } = useI18n()
const { isPh } = useDevice()
const coinList = ref([])
const coin = ref('')
const show = ref(false)
const spotList = ref([])
const activeCoinInfo: any = ref({})

const startSmsCountDown = ref(false)
const startEmailCountDown = ref(false)
const activeTab = route.query?.tab || 1

const list: any = ref([])
const finished = ref(false)
const loading = ref(true)
const pagination = reactive({
	pageNo: 1,
	pageSize: 10
})
const isTransfer = ref(false)
const canInfo: any = ref({})
const transferShow = ref(false)
const adequateWaterFlow = ref(true)
const canWithdrawInfo: any = ref()

const form = reactive({
	mainnetList: [],
	googleCode: '',
	smsCode: '',
	emailCode: '',
	mainnet: '',
	address: '',
	count: ''
})

const columns = reactive([
	{
		title: t('text141'),
		key: 'logo',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h('img', { src: item?.coin?.logo, class: 'w-[24px] h-[24px] rounded-full mr-2' }),
				h('div', { class: 'text-text-primary text-style-web-body-medium' }, item.unit)
			])
		}
	},
	{
		title: t('trade.txt31'),
		key: 'createTimeLong',
		render(item: any) {
			return h('span', {}, formatTime(item?.createTimeLong))
		}
	},
	{
		title: t('my.txt25'),
		key: 'totalAmount'
	},
	{
		title: t('text4'),
		key: 'mainnet'
	},
	{
		title: t('option.txt19'),
		key: 'fee',
		render(item: any) {
			return h('div', {}, item?.fee + ' USDT')
		}
	},
	{
		title: t('text5'),
		key: 'address',
		render(item: any) {
			return h(
				'div',
				{},
				h(Copy, {
					iconSize: 14,
					textClass: 'text-text-tertiary text-style-web-small-medium mr-[2px]',
					text: item?.address,
					brief: true
				})
			)
		}
	},
	{
		title: 'TxID',
		key: 'transactionNumber',
		render(item: any) {
			return h(
				'div',
				{},
				item?.transactionNumber
					? h(Copy, {
							iconSize: 14,
							textClass: 'text-text-tertiary text-style-web-small-medium mr-[2px]',
							text: item?.transactionNumber,
							brief: true
						})
					: '--'
			)
		}
	},
	{
		title: t('my.txt34'),
		key: 'my.txt1',
		render() {
			return h('div', {}, t('my.txt1'))
		}
	},
	{
		width: '60px',
		title: t('text124'),
		align: 'right',
		key: 'my.txt1',
		render(item: any) {
			const state: any = {
				0: t('text7'),
				1: t('text8'),
				2: t('text9'),
				3: t('text10'),
				4: t('text11'),
				5: t('text12'),
				6: t('text13'),
				7: t('text14'),
				8: t('text15')
			}
			return h('div', { class: 'text-text-success' }, state[item.status])
		}
	}
])

const { settingInfo, updateSettingInfo } = useSecuritySetting()

const items = reactive([
	{
		title: t('my.txt12'),
		path: '/home/my/wallet'
	},
	{
		title: t('my.txt8')
	}
])

onBeforeMount(async () => {
	updateList()
	getSpotAssetList()
	getWithdrawCoinList().then((res: any) => {
		if (res.code === 0 && res.data.length) {
			coinList.value = res.data.map((item: any) => ({
				...item,
				label: item.name,
				value: item.name
			}))
		}
	})
	updateSettingInfo()
})

watch(
	() => coin.value,
	() => {
		form.mainnet = ''
		form.address = ''
		form.count = ''
		form.googleCode = ''
		form.smsCode = ''
		form.emailCode = ''

		getMainnet()
		activeCoinInfo.value = spotList.value.find((item: any) => item.coin === coinItem.value?.unit)
	}
)

const step = computed(() => {
	let _step = 0
	if (coin.value) {
		++_step
	}
	if (!disabled.value) {
		++_step
	}
	return _step
})

const coinItem: any = computed(() => coinList.value.find((item: any) => item.value === coin.value))

const mainnetItem: any = computed(() => {
	if (coinItem.value) {
		return form.mainnetList.find((item: any) => item.value === form.mainnet)
	}
	return {}
})

const actualCount: any = computed(() => {
	if (adequateWaterFlow.value) {
		if (form.count && coinItem.value) {
			// 提币数量 - (提币数量 * maxTxFee) / 100
			const fee = div(mul(Number(form.count), coinItem.value.maxTxFee).toNumber(), 100).toNumber()
			return {
				count: minus(Number(form.count), fee),
				serviceFee: fee
			}
		}
	} else {
		if (form.count && coinItem.value) {
			// 提币数量 - (提币数量 * maxTxFee) / 100
			const fee = div(
				mul(Number(form.count), coinItem.value.insufficientFlowFeeRate).toNumber(),
				100
			).toNumber()
			return {
				count: minus(Number(form.count), fee),
				serviceFee: fee
			}
		}
	}
	return {
		count: 0,
		serviceFee: 0
	}
})

const disabled = computed(() => {
	let flag = false
	flag = !(form.mainnet !== '')
	if (flag) {
		return true
	}
	flag = !form.address
	if (flag) {
		return true
	}
	flag = !form.count
	if (flag) {
		return true
	}
	if (settingInfo.value.isEmailAuth) {
		flag = !form.emailCode
		if (flag) {
			return true
		}
	}
	if (settingInfo.value.isMobileAuth) {
		flag = !form.smsCode
		if (flag) {
			return true
		}
	}
	if (settingInfo.value.isGoogleAuth) {
		flag = !form.googleCode
		if (flag) {
			return true
		}
	}
	return flag
})

const getSpotAssetList = async () => {
	const res: any = await spotAssetList()
	if (res.code === 0) {
		spotList.value = res.data

		if (coinItem.value) {
			activeCoinInfo.value = spotList.value.find((item: any) => item.coin === coinItem.value?.unit)
		}
	}
}

const onMax = () => {
	if (coinItem.value) {
		form.count = activeCoinInfo.value?.balance || 0
	}
}

const confirm = async () => {
	if (form.count > activeCoinInfo.value?.balance) {
		showFailToast(t('text202'))
		return
	}
	const res: any = await canWithdraw({ amount: form.count })

	if (res.code === 0) {
		canWithdrawInfo.value = res.data
		isTransfer.value = res.data.canWithdraw
		adequateWaterFlow.value = res.data.canWithdraw
		canInfo.value = res.data
		if (res.data.canWithdraw) {
			show.value = true
		} else {
			show.value = true
			// transferShow.value = true
		}
	}
}

const cancel = () => {
	show.value = false
	coin.value = ''
	form.mainnetList = []
	form.googleCode = ''
	form.smsCode = ''
	form.emailCode = ''
	form.mainnet = ''
	form.address = ''
	form.count = ''
}

const submit = async () => {
	const params: any = {
		coinName: coin.value,
		address: form.address,
		mainCoinType: form.mainnet,
		amount: form.count,
		mainnet: mainnetItem.value?.label,
		forced: !adequateWaterFlow.value
	}
	if (settingInfo.value.isEmailAuth) {
		params.emailCode = form.emailCode
	}
	if (settingInfo.value.isMobileAuth) {
		params.smsCode = form.smsCode
	}
	if (settingInfo.value.isGoogleAuth) {
		params.googleCode = form.googleCode
	}
	const res: any = await withdrawApply(params)
	if (res.code === 0) {
		showSuccessToast(res.message)
		getSpotAssetList()
		updateList()
		cancel()
	} else {
		showFailToast(res.message)
	}
}

const sendCode = async (operateType: number, type?: string) => {
	const params: any = { operateType }
	if (type === 'sms') {
		const { code, message }: any = await smsCode(params)
		if (code === 0) {
			showSuccessToast(message)
		} else {
			startSmsCountDown.value = false
			showFailToast(message)
		}
	} else {
		const { code, message }: any = await emailCode(params)
		if (code === 0) {
			showSuccessToast(message)
		} else {
			startEmailCountDown.value = false
			showFailToast(message)
		}
	}
}

const getMainnet = async () => {
	const res: any = await getDepositMainnetList({ coinName: coin.value })
	if (res.code === 0 && res.data.length) {
		form.mainnetList = res.data.map((item: any) => ({
			...item,
			label: item.mainnet,
			value: item.mainCoinType
		}))
	} else {
		form.mainnetList = []
	}
}

const updateList = async () => {
	loading.value = true
	const res: any = await withdrawRecord({
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	})
	if (res.code === 0) {
		const max = pagination.pageSize
		if (res.data.totalElements <= max) {
			finished.value = true
		}
		list.value = res.data.content
		loading.value = false
	}
}

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	updateList()
}

watch(
	() => appStore.refreshTransfer,
	() => {
		getSpotAssetList()
		// followStore.init()
		console.log('sss 划转成功')
		// 划转成功，刷新数据
	}
)

const transfer = () => {
	routeTo('/my/transfer')
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />

		<div class="px-4 py-[26px]">
			<div class="flex items-center">
				<div
					class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center"
					:class="step >= 1 ? 'bg-brand-blue' : 'bg-background-inverse-primary'">
					1
				</div>
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt15') }}</div>
			</div>
			<div class="flex">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1">
					<Select
						class="z-11"
						v-model:value="coin"
						:options="coinList"
						imgField="logo"
						:placeholder="t('my.txt15')" />
				</div>
			</div>

			<div class="flex items-center">
				<div
					class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center"
					:class="step >= 2 ? 'bg-brand-blue' : 'bg-background-inverse-primary'">
					2
				</div>
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt23') }}</div>
			</div>
			<div class="flex">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1" v-if="coinItem">
					<Select
						class="z-10"
						v-model:value="form.mainnet"
						:options="form.mainnetList"
						:placeholder="t('my.txt16')" />

					<BaseInput
						v-model="form.address"
						class="mt-3"
						inputClass="bg-background-secondary"
						:placeholder="t('my.txt24')" />

					<InputNumber
						v-model="form.count"
						class="mt-3"
						inputClass="bg-background-secondary"
						:max="activeCoinInfo?.balance || 0"
						:placeholder="t('my.txt25')">
						<template #suffix>
							<div class="flex items-center">
								<div class="text-text-secondary text-style-web-body-medium">
									{{ coinItem?.value }}
								</div>
								<div class="w-[1px] h-3 bg-border-button_line mx-[10px]"></div>
								<div @click="onMax" class="text-text-brand text-style-web-body-medium">MAX</div>
							</div>
						</template>
					</InputNumber>

					<InputCountDown
						v-if="settingInfo.isMobileAuth"
						v-model="form.smsCode"
						class="mt-3"
						inputClass="bg-background-secondary"
						v-model:start="startSmsCountDown"
						@send="sendCode(10, 'sms')"
						:placeholder="t('my.txt120')" />

					<InputCountDown
						v-if="settingInfo.isEmailAuth"
						v-model="form.emailCode"
						class="mt-3"
						inputClass="bg-background-secondary"
						v-model:start="startEmailCountDown"
						@send="sendCode(10, 'email')"
						:placeholder="t('my.txt119')" />

					<InputPaste
						v-if="settingInfo.isGoogleAuth"
						v-model="form.googleCode"
						class="mt-3"
						:placeholder="t('my.txt138')" />

					<div class="py-3 border-b border-border-strong">
						<div class="flex justify-between items-center">
							<div class="text-text-description text-style-web-base-regular">
								{{ t('option.txt23') }}
							</div>
							<div class="flex items-center">
								<div class="mr-1 text-text-tertiary text-style-web-base-medium">
									{{ activeCoinInfo?.balance || 0 }} {{ coinItem?.unit }}
								</div>
								<base-icon
									@click="transfer"
									name="follow/transfer"
									:size="16"
									class="text-text-brand" />
							</div>
						</div>
						<!-- <div class="flex justify-between items-center mt-2">
							<div class="text-text-description text-style-web-base-regular">24小时可用限额</div>
							<div class="flex">
								<div class="text-text-tertiary text-style-web-base-medium">1000 USDT</div>
								<div class="text-text-tips text-style-web-base-medium">/ 5000 USDT</div>
							</div>
						</div> -->
					</div>

					<div class="py-3">
						<div class="text-text-tertiary text-style-web-small-regular">{{ t('my.txt27') }}</div>
						<div class="py-2 text-text-primary text-style-web-h4-medium">
							{{ actualCount.count }}{{ coinItem?.unit }}
						</div>
						<div class="text-text-description text-style-web-small-regular">
							{{ t('option.txt19') }} {{ actualCount.serviceFee }} {{ coinItem?.unit }}
						</div>
					</div>

					<van-button
						:disabled="disabled"
						@click="confirm"
						round
						block
						type="primary"
						class="text-always-white text-style-web-h5-bold">
						{{ t('my.txt8') }}
					</van-button>
				</div>
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<div class="w-[268px] flex-shrink-0 h-[calc(100vh-64px)] border-r border-border-strong pt-10">
			<Menu :active="Number(activeTab)" />
		</div>
		<div class="flex-1 pt-10 px-20">
			<div class="w-[538px]">
				<div class="flex items-center mb-[30px]" @click="router.back()">
					<Icon name="back" :size="30" class="text-text-primary" />
					<div class="text-text-primary text-style-web-xlarge-bold ml-[10px]">
						{{ t('text145') }}
					</div>
				</div>
				<div>
					<div class="flex items-center">
						<div
							class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center"
							:class="step >= 1 ? 'bg-brand-blue' : 'bg-background-inverse-primary'">
							1
						</div>
						<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt15') }}</div>
					</div>
					<div class="flex">
						<div class="w-[26px] h-auto mr-3">
							<div
								class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
						</div>
						<div class="pt-3 pb-6 flex-1">
							<Select
								class="z-11"
								v-model:value="coin"
								:options="coinList"
								imgField="logo"
								:placeholder="t('my.txt15')" />
						</div>
					</div>

					<div class="flex items-center">
						<div
							class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center"
							:class="step >= 2 ? 'bg-brand-blue' : 'bg-background-inverse-primary'">
							2
						</div>
						<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt23') }}</div>
					</div>
					<div class="flex">
						<div class="w-[26px] h-auto mr-3">
							<div
								class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
						</div>
						<div class="pt-3 pb-6 flex-1" v-if="coinItem">
							<Select
								class="z-10"
								v-model:value="form.mainnet"
								:options="form.mainnetList"
								:placeholder="t('my.txt16')" />

							<BaseInput
								v-model="form.address"
								class="mt-3"
								inputClass="bg-background-secondary"
								:placeholder="t('my.txt24')" />

							<InputNumber
								v-model="form.count"
								class="mt-3"
								inputClass="bg-background-secondary"
								:max="activeCoinInfo?.balance || 0"
								:placeholder="t('my.txt25')">
								<template #suffix>
									<div class="flex items-center">
										<div class="text-text-secondary text-style-web-body-medium">
											{{ coinItem?.value }}
										</div>
										<div class="w-[1px] h-3 bg-border-button_line mx-[10px]"></div>
										<div @click="onMax" class="text-text-brand text-style-web-body-medium">MAX</div>
									</div>
								</template>
							</InputNumber>

							<InputCountDown
								v-if="settingInfo.isMobileAuth"
								v-model="form.smsCode"
								class="mt-3"
								inputClass="bg-background-secondary"
								v-model:start="startSmsCountDown"
								@send="sendCode(10, 'sms')"
								:placeholder="t('my.txt120')" />

							<InputCountDown
								v-if="settingInfo.isEmailAuth"
								v-model="form.emailCode"
								class="mt-3"
								inputClass="bg-background-secondary"
								v-model:start="startEmailCountDown"
								@send="sendCode(10, 'email')"
								:placeholder="t('my.txt119')" />

							<InputPaste
								v-if="settingInfo.isGoogleAuth"
								v-model="form.googleCode"
								class="mt-3"
								:placeholder="t('my.txt138')" />

							<div class="py-3 border-b border-border-strong">
								<div class="flex justify-between items-center">
									<div class="text-text-description text-style-web-base-regular">
										{{ t('option.txt23') }}
									</div>
									<div class="flex items-center">
										<div class="mr-1 text-text-tertiary text-style-web-base-medium">
											{{ activeCoinInfo?.balance || 0 }} {{ coinItem?.unit }}
										</div>
										<base-icon
											@click="transfer"
											name="follow/transfer"
											:size="16"
											class="text-text-brand" />
									</div>
								</div>
								<!-- <div class="flex justify-between items-center mt-2">
							<div class="text-text-description text-style-web-base-regular">24小时可用限额</div>
							<div class="flex">
								<div class="text-text-tertiary text-style-web-base-medium">1000 USDT</div>
								<div class="text-text-tips text-style-web-base-medium">/ 5000 USDT</div>
							</div>
						</div> -->
							</div>

							<div class="py-3">
								<div class="text-text-tertiary text-style-web-small-regular">
									{{ t('my.txt27') }}
								</div>
								<div class="py-2 text-text-primary text-style-web-h4-medium">
									{{ actualCount.count }}{{ coinItem?.unit }}
								</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('option.txt19') }} {{ actualCount.serviceFee }} {{ coinItem?.unit }}
								</div>
							</div>

							<Button :disabled="disabled" @click="confirm" size="small">
								{{ t('my.txt8') }}
							</Button>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-10">
				<div class="text-text-primary text-style-web-h2-bold mb-5">{{ t('text146') }}</div>
				<Table
					slide
					:columns="columns"
					:dataSource="list"
					v-model:loading="loading"
					v-model:finished="finished"
					@load="onLoad" />
			</div>
		</div>
	</div>

	<Popup v-if="isPh" v-model:show="show" :title="t('my.txt29')" @ok="submit" height="390px">
		<div class="py-3">
			<div class="flex justify-between">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt30') }}
				</div>
				<div
					class="max-w-[240px] text-text-tertiary text-style-web-body-medium break-all text-right">
					{{ form.address }}
				</div>
			</div>

			<div class="flex justify-between mt-2">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt31') }}
				</div>
				<div
					class="max-w-[240px] text-text-tertiary text-style-web-body-medium break-all text-right">
					{{ mainnetItem?.label }}
				</div>
			</div>

			<div v-if="!adequateWaterFlow" class="mt-2">
				<div class="text-text-description text-style-web-body-regular break-all">
					{{ t('text370', { num: canWithdrawInfo.diff, num2: coinItem.insufficientFlowFeeRate }) }}
				</div>
			</div>

			<div class="flex justify-between mt-2">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt32') }}
				</div>
				<div class="flex justify-end flex-wrap">
					<div class="text-text-tertiary text-style-web-body-medium break-all text-right">
						{{ t('my.txt33') }}{{ actualCount.count }}{{ coinItem?.unit }}
					</div>
					<div class="text-text-description text-style-web-body-medium break-all text-right">
						（{{ t('my.txt28') }}
						{{ actualCount.serviceFee }}
						{{ coinItem?.unit }}）
					</div>
				</div>
			</div>

			<div class="flex justify-between mt-2">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt34') }}
				</div>
				<div
					class="max-w-[240px] text-text-tertiary text-style-web-body-medium break-all text-right">
					{{ t('my.txt1') }}
				</div>
			</div>

			<div
				class="mt-2 p-2 bg-background-tertiary rounded text-text-tertiary text-style-web-small-regular">
				<div>{{ t('my.txt35') }}</div>
				<div>{{ t('my.txt36') }}</div>
			</div>
		</div>
	</Popup>

	<Dialog v-else v-model:show="show" width="390px" :title="t('my.txt29')">
		<div class="py-3 px-4">
			<div class="flex justify-between">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt30') }}
				</div>
				<div
					class="max-w-[240px] text-text-tertiary text-style-web-body-medium break-all text-right">
					{{ form.address }}
				</div>
			</div>

			<div class="flex justify-between mt-2">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt31') }}
				</div>
				<div
					class="max-w-[240px] text-text-tertiary text-style-web-body-medium break-all text-right">
					{{ mainnetItem?.label }}
				</div>
			</div>

			<div v-if="!adequateWaterFlow" class="mt-2">
				<div class="text-text-description text-style-web-body-regular break-all">
					{{ t('text370', { num: canWithdrawInfo.diff, num2: coinItem.insufficientFlowFeeRate }) }}
				</div>
			</div>

			<div class="flex justify-between mt-2">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt32') }}
				</div>
				<div class="flex justify-end flex-wrap">
					<div class="text-text-tertiary text-style-web-body-medium break-all text-right">
						{{ t('my.txt33') }}{{ actualCount.count }}{{ coinItem?.unit }}
					</div>
					<div class="text-text-description text-style-web-body-medium break-all text-right">
						（{{ t('my.txt28') }}
						{{ actualCount.serviceFee }}
						{{ coinItem?.unit }}）
					</div>
				</div>
			</div>

			<div class="flex justify-between mt-2">
				<div class="text-text-description text-style-web-body-regular whitespace-nowrap">
					{{ t('my.txt34') }}
				</div>
				<div
					class="max-w-[240px] text-text-tertiary text-style-web-body-medium break-all text-right">
					{{ t('my.txt1') }}
				</div>
			</div>

			<div
				class="mt-2 p-2 bg-background-tertiary rounded text-text-tertiary text-style-web-small-regular">
				<div>{{ t('my.txt35') }}</div>
				<div>{{ t('my.txt36') }}</div>
			</div>
		</div>
		<div class="py-5 px-4 border-t border-border-strong flex">
			<Button plain size="small" class="mr-4" @click="show = false">{{ t('my.txt37') }}</Button>
			<Button size="small" @click="submit">{{ t('my.txt38') }}</Button>
		</div>
	</Dialog>

	<Dialog v-model:show="transferShow" :title="t('text197')" :width="isPh ? '370px' : '390px'">
		<div class="web:p-4 pt-0 pdph:pt-[20px]">
			<div v-if="isTransfer">
				<div class="h-[28px] flex items-center">
					<div class="w-[20px]"></div>
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text196') }} {{ canInfo?.rechargeAmount }} USDT
					</div>
				</div>
				<div class="h-[28px] flex items-center mt-5">
					<Icon name="wallet/yes" :size="20" class="text-text-brand" />
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text198') }} {{ canInfo?.diff }} / {{ canInfo?.transactionAmount }} USDT
					</div>
				</div>

				<!-- <Button @click="toWithdraw" size="small" class="mt-6">{{ t('text200') }}</Button> -->
			</div>
			<div v-else>
				<div class="h-[28px] flex items-center">
					<div class="w-[20px]"></div>
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text196') }} {{ canInfo?.rechargeAmount }} USDT
					</div>
				</div>
				<div class="h-[28px] flex items-center mt-5">
					<Icon name="wallet/no" :size="20" class="text-text-brand" />
					<div class="ml-2 text-text-primary text-style-web-base-medium">
						{{ t('text198') }} {{ canInfo?.diff }} / {{ canInfo?.transactionAmount }} USDT
					</div>
				</div>

				<Button :disabled="true" size="small" class="mt-6">{{ t('text201') }}</Button>
			</div>
		</div>
	</Dialog>
</template>
