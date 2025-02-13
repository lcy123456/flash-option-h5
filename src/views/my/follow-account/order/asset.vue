<script setup lang="ts">
import { reactive, watch, ref, onBeforeMount, h } from 'vue'

import { followWallet } from '@/apis/follow'
import { toFixed } from '@/utils/index'
import Empty from '@/components/empty.vue'
import { useI18n } from 'vue-i18n'
import { Loading, Table } from '@/components/base'
import { useAppStore } from '@/store/useAppStore'
import { routeTo } from '@/utils/routeTo'

const appStore = useAppStore()

const { t } = useI18n()

const list: any = ref([])
const loading = ref(true)

const columns = reactive([
	{
		title: t('text141'),
		key: 'symbol',
		render(item: any) {
			return h('div', { class: 'flex items-center' }, [
				h('img', { src: item.logo, class: 'w-10 h-10 rounded-full mr-3' }),
				h('div', {}, [
					h('div', { class: 'text-text-primary text-style-web-body-medium' }, item.coin),
					h('div', { class: 'text-text-description text-style-web-small-regular' }, item.name)
				])
			])
		}
	},
	{
		title: t('flwaccount.txt26'),
		key: 'balance'
	},
	{
		title: t('flwaccount.txt27'),
		key: 'frozenBalance'
	}
])

onBeforeMount(async () => {
	getData()
})

watch(
	() => appStore.refreshTransfer,
	() => {
		getData()
		// 划转成功，刷新数据
	}
)

const getData = async () => {
	loading.value = true
	const res: any = await followWallet()
	if (res.code === 0) {
		const freeUSDT = toFixed(res?.data.balance, 2)
		list.value = [
			{
				logo: '/imgs/common/usdt.svg',
				coin: 'USDT',
				balance: freeUSDT,
				frozenBalance: toFixed(res?.data.frozenBalance, 2)
			}
		]
	}
	loading.value = false
}

const toFollow = () => {
	routeTo('/home/follow')
}
</script>
<template>
	<div class="web:hidden pb-20">
		<div v-for="item in list" :key="item.id" class="border-t border-border-subtle py-[16px] flex">
			<img src="/imgs/common/usdt.svg" class="w-[24px] h-[24px]" />
			<div class="ml-[12px] flex-1">
				<div class="flex items-center">
					<div class="flex-1 text-text-primary text-style-web-body-medium">
						{{ item.coin }}
					</div>
					<Icon
						@click="toFollow"
						class="text-text-primary"
						name="common/chevron-right"
						:size="18" />
				</div>
				<div class="flex items-center mt-[2px]">
					<div class="flex-1 text-text-description text-style-web-base-regular">
						{{ t('flwaccount.txt26') }}
					</div>
					<div class="text-text-description text-style-web-xsmall-regular">
						{{ item.balance }}
					</div>
				</div>
				<div class="flex items-center mt-[2px]">
					<div class="flex-1 text-text-description text-style-web-base-regular">
						{{ t('flwaccount.txt27') }}
					</div>
					<div class="text-text-description text-style-web-xsmall-regular">
						{{ item.frozenBalance }}
					</div>
				</div>
			</div>
		</div>
		<Loading v-model:loading="loading" />
		<Empty v-if="list.length === 0 && !loading" />
	</div>

	<div class="pdph:hidden">
		<Table :columns="columns" :dataSource="list" v-model:loading="loading" />
	</div>
</template>
