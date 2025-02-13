<template>
	<Breadcrumb :items="items" />

	<div class="mt-[24px] px-[16px]">
		<div class="flex items-center">
			<div class="flex-1 text-text-primary text-style-web-h3-bold">{{ t('other.txt2') }}</div>
			<div class="relative">
				<div
					@click="handleVisible"
					class="min-w-[66px] h-[28px] rounded-[20px] text-style-web-small-regular text-text-primary flex items-center justify-center border border-border-strong py-[6px] px-[12px]">
					<span>{{ data.typeLabel }}</span>
					<img src="/imgs/common/chevron-down.svg" class="ml-[4px] w-[14px] h-[14px]" />
				</div>

				<div
					v-if="data.visible"
					class="absolute z-1000 min-w-[144px] h-[122px] top-[40px] right-0 rounded-[6px] bg-background-primary border border-border-subtle px-[16px] py-[16px] text-app-medium-400 text-text-primary drop-shadow">
					<div class="flex flex-col items-center">
						<div class="cursor-pointer" @click="changeType(1)">{{ t('invite.txt18') }}</div>
						<div class="cursor-pointer mt-[24px]" @click="changeType(7)">
							7 {{ t('other.txt3') }}
						</div>
						<div class="cursor-pointer mt-[24px]" @click="changeType(30)">
							30 {{ t('other.txt3') }}
						</div>
					</div>
				</div>
			</div>
		</div>
		<ListView v-model:loading="data.loading" v-model:finished="data.noData" @load="onLoad">
			<div class="mt-[24px]" v-for="item in data.list" :key="item.id">
				<div class="flex items-center">
					<div class="text-text-primary text-style-web-h2-bold">{{ item.itemDates[2] }}</div>
					<div class="text-text-description text-style-web-body-regular">
						/{{ item.itemDates[1] }}
					</div>
				</div>
				<div class="min-h-[144px] p-[16px] border border-border-subtle mt-[10px]">
					<div class="flex items-center">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('invite.txt7') }}
						</div>
						<div class="text-text-primary text-style-web-base-regular">
							{{ thousandsComma(item.rechargeUserCount) }}
						</div>
					</div>
					<div class="flex items-center mt-[8px]">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('invite.txt8') }}(USDT)
						</div>
						<div class="text-text-primary text-style-web-base-regular">
							{{ thousandsComma(item.rechargeAmount) }}
						</div>
					</div>
					<div class="flex items-center mt-[8px]">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('invite.txt9') }}
						</div>
						<div class="text-text-primary text-style-web-base-regular">
							{{ thousandsComma(item.orderAmount) }}
						</div>
					</div>
					<div class="flex items-center mt-[8px]">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('invite.txt10') }}(USDT)
						</div>
						<div class="text-text-primary text-style-web-base-regular">
							{{ thousandsComma(item.bonusAmount) }}
						</div>
					</div>
					<div class="flex items-center mt-[8px]">
						<div class="flex-1 text-text-description text-style-web-base-regular">
							{{ t('other.txt4') }}
						</div>
						<div class="text-text-primary text-style-web-base-regular">{{ item.rate }}%</div>
					</div>
				</div>
			</div>
		</ListView>
	</div>
	<!-- <Empty v-if="data.list.length === 0 && data.noData" /> -->
</template>
<script lang="ts" setup>
import { reactive } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { commissionDetails } from '@/apis/invite'
// import Empty from '@/components/empty.vue'
import { thousandsComma } from '@/utils/trade'
import { toFixed } from '@/utils'
import ListView from '@/components/base/list-view/index.vue'

const { t } = useI18n()

const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('invite.txt23'),
		path: '/invite'
	},
	{
		title: t('other.txt2')
	}
])

const data = reactive({
	visible: false,
	typeLabel: t('invite.txt18'),
	type: 1, // 1=今天；7=7天内；30=30天内
	pageNo: 1,
	pageSize: 20,
	list: [],
	loading: true,
	noData: false
})

const handleVisible = () => {
	data.visible = !data.visible
}

const changeType = (n: number) => {
	if (n === 1) {
		data.typeLabel = t('invite.txt18')
	} else if (n === 7) {
		data.typeLabel = '7' + t('other.txt3')
	} else if (n === 30) {
		data.typeLabel = '30' + t('other.txt3')
	}
	data.type = n
	data.visible = false
	data.loading = true
	data.noData = false
	data.pageNo = 1
	data.list = []
	loadData()
}
const loadData = async () => {
	const res = await commissionDetails({
		type: data.type,
		pageNo: data.pageNo,
		pageSize: data.pageSize
	})
	data.loading = false

	if (res.code === 0) {
		const array = res.data.content.map((item: any) => {
			item.itemDates = item.itemDate.split('-') || []
			item.rechargeAmount = toFixed(Number(item.rechargeAmount), 2)
			item.rechargeFeeAmount = toFixed(Number(item.rechargeFeeAmount), 2)
			item.orderAmount = toFixed(Number(item.orderAmount), 2)

			item.orderFeeAmount = toFixed(Number(item.orderFeeAmount), 2)
			item.bonusAmount = toFixed(Number(item.bonusAmount), 2)

			return item
		})
		if (array.length > 0) {
			data.list.push(...array)
		}
		if (res.data.content.length === 0) {
			data.noData = true
		}
	}
}

loadData()

const onLoad = () => {
	data.pageNo = data.pageNo + 1
	loadData()
}
</script>
<style scoped>
.drop-shadow {
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.25);
}
</style>
