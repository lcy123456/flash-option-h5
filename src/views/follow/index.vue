<script setup lang="ts">
import { reactive, onBeforeMount, shallowRef, ref, watch, watchEffect, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import NoticeBar from '@/components/base/notice-bar/index.vue'
import { Button, Input } from '@/components/base'
import { routeTo } from '@/utils/routeTo'
import Card from './components/card/index.vue'
import { ListView, Loading } from '@/components/base'
import Segmented from './components/segmented/index.vue'
import Empty from '@/components/empty.vue'
import SearchPage from './components/SearchPage.vue'

import { traderList, getOverview } from '@/apis/follow'
import { getAdvertise } from '@/apis/market'
import { useUserStore } from '@/store/useUserStore'
import { useFollowStore } from '@/store/modules/follow'
// import { thousandsComma, formatNumUnit } from '@/utils/trade'
import { useIsApp } from '@/hooks/useIsApp'
// import { toFixed } from '@/utils'
import income from '@/assets/icon/follow/income.svg'
import applyTraderIcon from '@/assets/icon/follow/applyTrader.svg'
import { toLogin } from '@/utils/routeTo'

import { useCache } from '@/hooks/useCache'
import illustration from '@/assets/icon/follow/illustration.svg'

const cache = useCache()
const globalData: any = inject('globalData')
const { isApp } = useIsApp()
const { t } = useI18n()
const router = useRouter()
const userStore: any = useUserStore()
const followStore = useFollowStore()

const shiningStarList: any = shallowRef(cache.get('follow_shiningStarList') || [])
const shiningStarFinished = ref(false)
const shiningStarLoading = ref(false)

const allTraderList: any = shallowRef(cache.get('follow_allTraderList') || [])
const allTraderFinished = ref(false)
const allTraderLoading = ref(false)
const searchNickName = ref('')
const isSearch = ref(false)
const orderById = ref(1)
const isTrader = ref(false)
const overview: any = ref(
	cache.get('follow_overview') || {
		count: 0,
		amount: 0
	}
)
const advertise: any = ref(cache.get('follow_index_advertise'))
const searchPageShow = ref(false)

const options = reactive([
	{
		title: t('flw.txt1'),
		value: 10,
		id: 1
	},
	{
		title: t('flw.txt2'),
		value: 20,
		id: 2
	},
	{
		title: t('flw.txt3'),
		value: 30,
		id: 3
	},
	{
		title: t('flw.txt4'),
		value: 40,
		id: 4
	}
])

const pagination = reactive({
	pageNo: 1,
	pageSize: 12
})

const allPagination = reactive({
	pageNo: 1,
	pageSize: 12
})

watchEffect(() => {
	isTrader.value = userStore.userInfo?.isTrader === 1
})

watch(
	() => searchNickName.value,
	() => {
		if (!searchNickName.value) {
			isSearch.value = false
			allPagination.pageNo = 1
			allPagination.pageSize = 12
			getAllListData()
		}
	}
)

onBeforeMount(async () => {
	followStore.init()
	getListData()
	getAllListData()
	fetchAdvertise()
	getOverview().then((res: any) => {
		if (res.code === 0) {
			cache.set('follow_overview', res.data)
			overview.value = res.data
		}
	})
})

watch(
	() => orderById.value,
	() => {
		allPagination.pageNo = 1
		allPagination.pageSize = 12
		allTraderList.value = []
		allTraderFinished.value = false
		getAllListData()
	}
)

const pcShiningStarList = computed(() => shiningStarList.value.slice(0, 9))
const pcAllTraderList = computed(() => allTraderList.value.slice(0, 9))

const fetchAdvertise = async () => {
	const res: any = await getAdvertise({
		sysAdvertiseLocation: 4
	})
	if (res.code === 0 && res.data && res.data[0]) {
		cache.set('follow_index_advertise', res.data[0])
		advertise.value = res.data[0]
	}
}

const getListData = async () => {
	shiningStarLoading.value = true
	const res: any = await traderList({
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize,
		level: 3
	})

	if (res.code === 0) {
		shiningStarList.value = res.data.records
		cache.set('follow_shiningStarList', res.data.records)
		const max = pagination.pageSize
		if (res.data.total <= max) {
			shiningStarFinished.value = true
		}
		shiningStarLoading.value = false
	}
}

const getAllListData = async () => {
	allTraderLoading.value = true
	const params: any = {
		pageNo: allPagination.pageNo,
		pageSize: allPagination.pageSize
	}
	if (searchNickName.value) {
		params.nickName = searchNickName.value
	} else {
		params.orderBy = options.find((item) => item.id === orderById.value)?.value
	}
	const res: any = await traderList(params)
	if (res.code === 0) {
		allTraderList.value = res.data.records
		cache.set('follow_allTraderList', res.data.records)
		const max = allPagination.pageSize
		if (res.data.total <= max) {
			allTraderFinished.value = true
		}
		allTraderLoading.value = false
	}
}

const onLoad = (type: number) => {
	if (type === 1) {
		pagination.pageSize = pagination.pageSize + 10
		getListData()
	} else {
		allPagination.pageSize = allPagination.pageSize + 10
		getAllListData()
	}
}

const update = () => {
	followStore.init()
	getListData()
	getAllListData()
}

const handleToBulletin = (row: any) => {
	if (row.linkUrl.includes('http://') || row.linkUrl.includes('https://')) {
		window.open(row.linkUrl, '_blank')
		return
	}
	routeTo('advertiseDetail', { params: { id: row.serialNumber } })
}

const toMyFollow = () => {
	if (isApp.value && !userStore.loginToken) {
		if (window.callFlutterAppMethod) {
			window.callFlutterAppMethod('appLogin', '')
		}
		return
	}
	router.push('/my-follow')
}

const toBecomeTrader = () => {
	if (isApp.value && !userStore.loginToken) {
		if (window.callFlutterAppMethod) {
			window.callFlutterAppMethod('appLogin', '')
		}
		return
	}
	router.push('/become-trader')
}

const toTrader = () => {
	router.push('/trader')
}

const searchTrader = () => {
	if (searchNickName.value) {
		allTraderList.value = []
		allPagination.pageNo = 1
		allPagination.pageSize = 12
		getAllListData()
		isSearch.value = true
	}
}
</script>

<template>
	<div class="web:hidden pb-8">
		<NoticeBar v-if="advertise && !isApp">
			<div @click="handleToBulletin(advertise)" class="text-text-primary">
				{{ advertise.name }}
			</div>
		</NoticeBar>

		<div class="py-[32px] px-4">
			<div class="flex justify-between items-center">
				<div class="text-text-primary text-style-web-xlarge-bold">{{ t('flw.txt7') }}</div>
				<div
					@click="searchPageShow = true"
					class="w-[36px] h-[36px] bg-background-tertiary rounded-full flex items-center justify-center">
					<Icon name="search" :size="20" class="text-text-primary" />
				</div>
			</div>
			<div class="text-text-tertiary text-style-web-small-regular pt-1">{{ t('flw.txt8') }}</div>

			<!-- <div class="flex py-5">
				<div class="mr-10">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ thousandsComma(overview?.count) }}
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt9') }}
					</div>
				</div>
				<div>
					<div class="flex">
						<div class="text-function-buy text-style-web-h1-bold">
							{{ formatNumUnit(toFixed(overview?.amount, 2)) }}
						</div>
						<div class="text-function-buy text-style-web-body-medium ml-1 mt-2">USDT</div>
					</div>
					<div class="mt-1 text-text-description text-style-web-small-regular">
						{{ t('flw.txt10') }}
					</div>
				</div>
			</div> -->
			<div class="pt-5"></div>

			<div v-if="isTrader">
				<Button @click="toTrader" size="small">{{ t('text17') }}</Button>
			</div>
			<div v-else class="flex justify-between">
				<div
					@click="toMyFollow"
					class="mr-2 flex-1 pb-[10px] rounded-[12px] bg-background-secondary">
					<div class="mt-4 ml-4 text-text-primary text-style-web-h3-bold">{{ t('flw.txt11') }}</div>
					<div class="mt-[6px] ml-4 flex justify-between">
						<div class="text-text-description text-style-web-small-regular">{{ t('text282') }}</div>
						<img class="w-[54px] h-[44px] mr-[10px]" :src="income" alt="" />
					</div>
				</div>
				<div
					@click="toBecomeTrader"
					class="flex-1 pb-[10px] rounded-[12px] bg-background-secondary">
					<div class="mt-4 ml-4 text-text-primary text-style-web-h3-bold">{{ t('flw.txt12') }}</div>
					<div class="mt-[6px] ml-4 flex justify-between">
						<div class="text-text-description text-style-web-small-regular">{{ t('text283') }}</div>
						<img class="w-[41px] h-[44px] mr-[10px]" :src="applyTraderIcon" alt="" />
					</div>
				</div>
				<!-- <Button @click="toMyFollow" size="small" class="!w-[173px]">
					{{ t('flw.txt11') }}
				</Button>
				<Button @click="toBecomeTrader" size="small" plain class="flex-1">
					{{ t('flw.txt12') }}
				</Button> -->
			</div>

			<ListView
				:title="t('flw.txt13')"
				direction="x"
				@load="onLoad(1)"
				v-model:loading="shiningStarLoading"
				v-model:finished="shiningStarFinished">
				<Card
					v-for="item in shiningStarList"
					:key="item.id"
					:item="item"
					is-vote
					bg
					@update="update"
					class="w-[92%] mr-3 flex-shrink-0" />
			</ListView>

			<ListView
				y-class="min-h-[800px]"
				:title="t('flw.txt15')"
				@load="onLoad(2)"
				v-model:loading="allTraderLoading"
				v-model:finished="allTraderFinished">
				<Segmented class="mb-2" :options="options" v-model:value="orderById" />
				<Card
					class="mb-3"
					v-for="item in allTraderList"
					:key="item.id"
					:item="item"
					@update="update" />
			</ListView>
		</div>

		<SearchPage :allTraderList="allTraderList" v-model:show="searchPageShow" />
	</div>

	<div class="ph:hidden pd:hidden w-[1200px] mx-auto py-[64px]">
		<div class="flex justify-between">
			<div>
				<div class="text-text-primary text-style-web-mega-bold">{{ t('flw.txt7') }}</div>
				<div class="text-text-tertiary text-style-web-small-regular mt-3">{{ t('flw.txt8') }}</div>
				<!-- <div class="flex mt-4">
					<div class="mr-10">
						<div class="text-text-primary text-style-web-h1-bold">
							{{ thousandsComma(overview?.count) }}
						</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							{{ t('flw.txt9') }}
						</div>
					</div>
					<div>
						<div class="flex">
							<div class="text-function-buy text-style-web-h1-bold">
								{{ formatNumUnit(toFixed(overview?.amount, 2)) }}
							</div>
							<div class="mt-2 ml-1 text-style-web-body-medium text-function-buy">USDT</div>
						</div>
						<div class="mt-1 text-text-description text-style-web-small-regular">
							{{ t('flw.txt10') }}
						</div>
					</div>
				</div> -->
				<div class="pt-4">
					<div v-if="isTrader">
						<Button @click="toTrader" size="small">{{ t('text17') }}</Button>
					</div>
					<div v-else class="flex justify-between">
						<Button
							v-if="!userStore.loginToken"
							@click="toLogin"
							size="small"
							class="!min-w-[114px] mr-3">
							{{ t('text116') }}
						</Button>
						<Button v-else @click="toMyFollow" size="small" class="!min-w-[114px] mr-3">
							{{ t('flw.txt11') }}
						</Button>
						<Button @click="toBecomeTrader" size="small" plain class="!min-w-[114px]">
							{{ t('flw.txt12') }}
						</Button>
					</div>
				</div>
				<div
					v-if="advertise && !isApp"
					@click="handleToBulletin(advertise)"
					class="pt-[30px] flex items-center cursor-pointer">
					<Icon name="follow/user" :size="20" class="text-text-primary" />
					<div class="ml-2 text-text-primary text-style-web-body-medium">{{ advertise.name }}</div>
				</div>
			</div>
			<div
				style="align-self: flex-start"
				class="min-w-[460px] max-w-[470px] h-[180px] py-[31px] px-6 box-border border-[2px] border-border-strong rounded-lg flex items-center justify-between">
				<div class="mr-[8px]">
					<div class="text-text-primary text-style-web-h1-bold">
						{{ t('text285', { num: globalData.appName }) }}
					</div>
					<div class="pt-3 text-text-tertiary text-style-web-h4-regular">
						{{ t('text286') }}
					</div>
				</div>
				<div class="flex-shrink-0">
					<img :src="illustration" alt="" class="w-[131px] h-[89px]" />
				</div>
			</div>
		</div>

		<!-- <NoticeBar v-if="advertise && !isApp" class="mt-[35px]">
			<div @click="handleToBulletin(advertise)">{{ advertise.name }}</div>
		</NoticeBar> -->

		<div>
			<div class="pt-[40px] flex justify-between">
				<div
					class="h-[38px] text-text-primary box-border border-b-[2px] border-border-button_strong px-3 flex items-center">
					{{ t('text153') }}
				</div>
				<div class="flex items-center">
					<Input
						v-model="searchNickName"
						class="w-[288px]"
						:placeholder="t('text154')"
						inputClass="rounded-[41px] bg-background-secondary border-background-secondary h-[38px] py-[5px] px-4 text-text-disabled text-style-web-body-regular">
						<template v-slot:prefix>
							<Icon name="search" :size="16" class="mr-[10px] flex-shrink-0 text-text-primary" />
						</template>
						<template v-slot:suffix>
							<Button
								:disabled="!userStore.loginToken"
								@click="searchTrader"
								size="mini"
								class="px-4 border-none w-auto">
								{{ t('text155') }}
							</Button>
						</template>
					</Input>
				</div>
			</div>
			<div v-if="!isSearch" class="pt-[40px]">
				<div class="flex justify-between items-center">
					<div class="text-text-primary text-style-web-h1-bold">{{ t('flw.txt13') }}</div>
					<div
						v-if="shiningStarList.length > 9"
						@click="router.push(`/trader-list?tab=1`)"
						class="flex items-center cursor-pointer">
						<div class="text-text-tertiary text-style-medium-500">{{ t('text133') }}</div>
						<icon name="follow/right" :size="16" class="text-text-tertiary" />
					</div>
				</div>
				<div class="pt-6 flex flex-wrap">
					<Card
						v-for="item in pcShiningStarList"
						:key="item.id"
						:item="item"
						is-vote
						bg
						@update="update"
						class="w-[391px] mr-3 mb-6 flex-shrink-0 card" />
				</div>
			</div>

			<div class="pt-[36px]">
				<div class="flex justify-between items-center">
					<div class="text-text-primary text-style-web-h1-bold">{{ t('flw.txt15') }}</div>
					<div
						v-if="allTraderList.length > 9"
						@click="router.push(`/trader-list?tab=2`)"
						class="flex items-center cursor-pointer">
						<div class="text-text-tertiary text-style-medium-500">{{ t('text133') }}</div>
						<icon name="follow/right" :size="16" class="text-text-tertiary" />
					</div>
				</div>
				<Segmented v-if="!isSearch" class="mt-4" :options="options" v-model:value="orderById" />
				<div v-else class="mt-4"></div>
				<div class="min-h-[900px]">
					<div v-if="pcAllTraderList.length" class="pt-[6px] flex flex-wrap">
						<Card
							v-for="item in pcAllTraderList"
							:key="item.id"
							:item="item"
							@update="update"
							class="w-[396px] mr-[6px] mb-6 flex-shrink-0 card" />
					</div>
					<Loading v-model:loading="allTraderLoading" />
					<Empty v-if="pcAllTraderList.length === 0 && !allTraderLoading" />
				</div>
				<!-- <div v-else class="pt-[6px] flex flex-wrap">
					<Loading v-model:loading="allTraderLoading" />
				</div> -->
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.card {
	&:nth-of-type(3n + 0) {
		margin-right: 0 !important;
	}
}
</style>
