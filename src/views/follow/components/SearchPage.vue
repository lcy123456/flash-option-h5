<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { ListView } from '@/components/base'
import Card from './card/index.vue'

import { traderList } from '@/apis/follow'
import { useFollowStore } from '@/store/modules/follow'
import { useUserStore } from '@/store/useUserStore'

const show = defineModel('show', { default: false })
const userStore = useUserStore()

const props = defineProps({
	allTraderList: {
		type: Array,
		default: () => []
	}
})

const followStore = useFollowStore()
const { t } = useI18n()
const searchNickName = ref('')

const pagination = reactive({
	pageNo: 1,
	pageSize: 12
})
const loading = ref(false)
const finished = ref(false)
const list: any = ref(props.allTraderList)

watch(
	() => props.allTraderList,
	() => {
		list.value = props.allTraderList
	}
)

watch(
	() => searchNickName.value,
	() => {
		if (!searchNickName.value) {
			finished.value = false
			list.value = []
			pagination.pageNo = 1
			pagination.pageSize = 12
			updateList()
		}
	}
)

const searchTrader = () => {
	if (searchNickName.value) {
		finished.value = false
		list.value = []
		pagination.pageNo = 1
		pagination.pageSize = 12
		updateList()
	}
}

const onLoad = () => {
	pagination.pageSize = pagination.pageSize + 10
	updateList()
}

const updateList = async () => {
	loading.value = true
	const params: any = {
		pageNo: pagination.pageNo,
		pageSize: pagination.pageSize
	}
	if (searchNickName.value) {
		params.nickName = searchNickName.value
	}
	const res: any = await traderList(params)
	if (res.code === 0) {
		list.value = res.data.records

		const max = pagination.pageSize
		if (res.data.total <= max) {
			finished.value = true
		}
		loading.value = false
	}
}

const update = () => {
	followStore.init()
	updateList()
}
</script>

<template>
	<van-popup v-model:show="show" :overlay="false" position="right">
		<div class="px-4 bg-background-primary w-[100vw] h-[100vh]">
			<div class="h-[70px] flex items-center">
				<Input
					v-model="searchNickName"
					class="flex-1"
					:placeholder="t('text154')"
					inputClass="rounded-[27px] bg-background-secondary border-background-secondary h-[38px] py-[5px] px-4 pr-[10px] text-text-disabled text-style-web-body-regular">
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

				<div @click="show = false" class="flex flex-shrink-0 ml-[10px]">
					<Icon name="close" :size="24" class="text-text-primary" />
				</div>
			</div>
			<div class="h-[calc(100%-80px)] overflow-y-auto">
				<ListView
					:title="t('flw.txt15')"
					direction="y"
					@load="onLoad()"
					v-model:loading="loading"
					v-model:finished="finished">
					<Card class="mb-3" v-for="item in list" :key="item.id" :item="item" @update="update" />
				</ListView>
			</div>
		</div>
	</van-popup>
</template>
