<script setup lang="ts">
import { reactive, ref, onBeforeMount, watch, computed, h } from 'vue'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import useClipboard from 'vue-clipboard3'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'

import Breadcrumb from '@/components/base/breadcrumb/index.vue'
import Select from '@/components/base/select/index.vue'
import { Table, Copy } from '@/components/base'

import { getDepositCoinList, getDepositMainnetList, getAddress } from '@/apis/wallet'
import { rechargeList } from '@/apis/wallet'
import { formatTime } from '@/utils/date'

import Menu from '../components/Menu.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { toClipboard } = useClipboard()

const list: any = ref([])
const finished = ref(false)
const loading = ref(true)
const pagination = reactive({
	pageNo: 1,
	pageSize: 10
})

const coinList = ref([])
const coin = ref('')
const mainnetList = ref([])
const mainnet = ref('')
const addressInfo = ref<Record<string, any> | null>(null)
const activeTab = route.query?.tab || 1

const items = reactive([
	{
		title: t('my.txt12'),
		path: '/home/my/wallet'
	},
	{
		title: t('my.txt7')
	}
])

const columns = reactive([
	{
		title: t('text141'),
		key: 'logo',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h('img', { src: item?.logo, class: 'w-[30px] h-[30px] rounded-full mr-2' }),
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
		title: t('text3'),
		key: 'amount'
	},
	{
		title: t('text4'),
		key: 'mainnet'
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
		key: 'txid',
		render(item: any) {
			return h(
				'div',
				{},
				h(Copy, {
					iconSize: 14,
					textClass: 'text-text-tertiary text-style-web-small-medium mr-[2px]',
					text: item?.txid,
					brief: true
				})
			)
		}
	},
	{
		title: t('text6'),
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
		render() {
			return h('div', { class: 'text-text-success' }, t('text16'))
		}
	}
])

onBeforeMount(async () => {
	updateList()
	const res: any = await getDepositCoinList()
	if (res.code === 0 && res.data.length) {
		coinList.value = res.data.map((item: any) => ({
			...item,
			label: item.unit,
			value: item.name
		}))
	}
})

watch(
	() => coin.value,
	() => {
		addressInfo.value = null
		mainnet.value = ''
		getMainnet()
	}
)

watch(
	() => [coin.value, mainnet.value],
	() => {
		if (coin.value !== '' && mainnet.value !== '') {
			getAddress({ coinName: coin.value, mainCoinType: mainnet.value }).then((res: any) => {
				if (res.data) {
					addressInfo.value = res.data
				} else {
					addressInfo.value = null
					showFailToast(res?.message)
				}
			})
		}
	}
)

const step = computed(() => {
	let _step = 0
	if (coin.value) {
		++_step
	}
	if (mainnet.value !== '') {
		++_step
	}
	if (addressInfo.value) {
		++_step
	}
	return _step
})

const coinItem: any = computed(() => coinList.value.find((item: any) => item.value === coin.value))

const mainnetItem: any = computed(() =>
	mainnetList.value.find((item: any) => item.value === mainnet.value)
)

const getMainnet = async () => {
	const res: any = await getDepositMainnetList({ coinName: coin.value })
	if (res.code === 0 && res.data.length) {
		mainnetList.value = res.data.map((item: any) => ({
			...item,
			label: item.mainnet,
			value: item.mainCoinType
		}))
	} else {
		mainnetList.value = []
	}
}

const copy = () => {
	toClipboard(addressInfo.value?.address)
	showSuccessToast({
		message: t('register.txt14')
	})
}

const updateList = async () => {
	loading.value = true
	const res: any = await rechargeList({
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
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt16') }}</div>
			</div>
			<div class="flex">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1">
					<Select
						class="z-10"
						v-model:value="mainnet"
						:options="mainnetList"
						:placeholder="t('my.txt16')" />
					<div class="px-3 py-2 mt-2" v-if="mainnet !== ''">
						<div class="text-text-description text-style-web-small-regular">
							<div v-html="t('my.txt39', { num: coinItem?.unit })"></div>
						</div>
						<div class="mt-2 text-text-description text-style-web-small-regular">
							<div class="flex">
								<div v-html="t('my.txt40', { num: `(${mainnetItem?.label})` })"></div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex items-center">
				<div
					class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center"
					:class="step >= 3 ? 'bg-brand-blue' : 'bg-background-inverse-primary'">
					3
				</div>
				<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt17') }}</div>
			</div>
			<div class="flex" v-if="addressInfo">
				<div class="w-[26px] h-auto mr-3">
					<div
						class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
				</div>
				<div class="pt-3 pb-6 flex-1 overflow-hidden">
					<div class="py-3">
						<div class="w-[120px] h-[120px]">
							<img :src="addressInfo?.addressQRCode" alt="" />
						</div>
						<div class="py-2 text-text-description text-style-web-body-regular">
							{{ t('my.txt18') }}
						</div>
						<div class="flex items-center justify-between" @click="copy">
							<div class="text-text-primary text-style-web-body-regular mr-3 break-all">
								{{ addressInfo?.address }}
							</div>
							<base-icon name="copy" :size="20" class="text-text-primary" />
						</div>
						<div class="mt-3 py-2 px-3 bg-background-secondary">
							<div class="flex justify-between mb-2">
								<div class="text-text-description text-style-web-small-regular">
									{{ t('my.txt19') }}
								</div>
								<div class="text-text-secondary text-style-web-small-medium">
									{{ addressInfo?.minRechargeAmount }}{{ coinItem?.unit }}
								</div>
							</div>
							<div class="flex justify-between">
								<div class="text-text-description text-style-web-small-regular">
									{{ t('my.txt20') }}
								</div>
								<div class="text-text-secondary text-style-web-small-medium">
									{{ addressInfo?.blockConfirm }}
								</div>
							</div>
						</div>
					</div>
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
						{{ t('home.txt17') }}
					</div>
				</div>
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
					<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt16') }}</div>
				</div>
				<div class="flex">
					<div class="w-[26px] h-auto mr-3">
						<div
							class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
					</div>
					<div class="pt-3 pb-6 flex-1">
						<Select
							class="z-10"
							v-model:value="mainnet"
							:options="mainnetList"
							:placeholder="t('my.txt16')" />
						<div class="px-3 py-2 mt-2 bg-background-secondary rounded-[6px]" v-if="mainnet !== ''">
							<div class="text-text-description text-style-web-small-regular">
								<div v-html="t('my.txt39', { num: coinItem?.unit })"></div>
							</div>
							<div class="mt-2 text-text-description text-style-web-small-regular">
								<div class="flex">
									<div v-html="t('my.txt40', { num: `(${mainnetItem?.label})` })"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<div class="flex items-center">
					<div
						class="mr-3 w-[26px] h-[26px] rounded-full text-text-inverse-primary text-style-web-h5-medium flex items-center justify-center"
						:class="step >= 3 ? 'bg-brand-blue' : 'bg-background-inverse-primary'">
						3
					</div>
					<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt17') }}</div>
				</div>
				<div class="flex" v-if="addressInfo">
					<div class="w-[26px] h-auto mr-3">
						<div
							class="mt-1 h-[100%] border-r border-dashed border-border-button_strong w-[1px] mx-auto"></div>
					</div>
					<div class="pt-3 pb-6 flex-1 overflow-hidden">
						<div class="py-3">
							<div class="w-[120px] h-[120px]">
								<img :src="addressInfo?.addressQRCode" alt="" />
							</div>
							<div class="py-2 text-text-description text-style-web-body-regular">
								{{ t('my.txt18') }}
							</div>
							<div class="flex items-center justify-between" @click="copy">
								<div class="text-text-primary text-style-web-body-regular mr-3 break-all">
									{{ addressInfo?.address }}
								</div>
								<base-icon name="copy" :size="20" class="text-text-primary" />
							</div>
							<div class="mt-3 py-2 px-3 bg-background-secondary rounded-[6px]">
								<div class="flex justify-between mb-2">
									<div class="text-text-description text-style-web-small-regular">
										{{ t('my.txt19') }}
									</div>
									<div class="text-text-secondary text-style-web-small-medium">
										{{ addressInfo?.minRechargeAmount }}{{ coinItem?.unit }}
									</div>
								</div>
								<div class="flex justify-between">
									<div class="text-text-description text-style-web-small-regular">
										{{ t('my.txt20') }}
									</div>
									<div class="text-text-secondary text-style-web-small-medium">
										{{ addressInfo?.blockConfirm }}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="mt-10">
				<div class="text-text-primary text-style-web-h2-bold mb-5">{{ t('text144') }}</div>
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
</template>
