<script setup lang="ts">
import { onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import moment from 'moment'
import LineChart from './LineChart.vue'
import { trader14DayProfit } from '@/apis/follow'
import { colorChange } from '@/utils'

const { t } = useI18n()
const data: any = ref([])
const route = useRoute()
defineProps({
	info: {
		type: Object,
		default: () => ({})
	}
})

onBeforeMount(async () => {
	const params: any = {}
	if (route.query.traderId) {
		params.traderId = route.query.traderId
	}
	const res: any = await trader14DayProfit(params)
	if (res.code === 0) {
		data.value = res.data.map((item: any) => {
			return {
				...item,
				value: Number(item.todayProfit),
				name: moment(item.statsDate).format('MM/DD')
			}
		})
	}
})
</script>

<template>
	<div class="web:hidden">
		<div class="py-5 px-4 border-border-subtle">
			<div class="flex justify-between">
				<div class="text-text-description text-style-web-small-medium">{{ t('text37') }}</div>
				<div class="text-text-description text-style-web-small-medium">{{ t('flw.txt109') }}</div>
			</div>
			<div class="pt-1 pb-2 flex justify-between">
				<div class="text-style-web-h3-medium" :class="[colorChange(info?.dayYield30)]">
					{{ info?.dayYield30 || 0 }}%
				</div>
				<div class="text-style-web-h3-medium" :class="[colorChange(info?.day30Amount)]">
					{{ info?.day30Amount || 0 }}
				</div>
			</div>

			<div class="pt-2 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt100') }}</div>
				<div class="text-text-description text-style-web-base-regular">
					{{ info?.profitAmount || 0 }}
				</div>
			</div>
			<div class="pt-2 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt26') }}</div>
				<div class="text-text-description text-style-web-base-regular">
					{{ info?.registerDays }}
				</div>
			</div>
			<div class="pt-2 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt66') }}</div>
				<div class="text-text-description text-style-web-base-regular">
					{{ info?.totalFollowAmount }}
				</div>
			</div>
			<div class="pt-2 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt67') }}</div>
				<div class="text-text-description text-style-web-base-regular">
					{{ info?.minFollowAmount }}
				</div>
			</div>
		</div>

		<LineChart :data="data" />
	</div>

	<div class="ph:hidden pd:hidden flex pt-5">
		<div class="w-[390px] mr-4 py-5 px-4 rounded-[12px] border border-border-strong">
			<div class="text-text-primary text-style-web-h3-medium">{{ t('text134') }}</div>
			<div class="py-4 flex justify-between items-center">
				<div>
					<div class="text-text-description text-style-web-small-medium">{{ t('text37') }}</div>
					<div class="mt-1 text-style-web-h3-medium" :class="[colorChange(info?.dayYield30)]">
						{{ info?.dayYield30 || 0 }}%
					</div>
				</div>
				<div>
					<div class="text-text-description text-right text-style-web-small-medium">
						{{ t('flw.txt109') }}
					</div>
					<div class="mt-1 text-style-web-h3-medium" :class="[colorChange(info?.day30Amount)]">
						{{ info?.day30Amount || 0 }}
					</div>
				</div>
			</div>

			<div class="flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt100') }}</div>
				<div class="text-text-tertiary text-style-web-base-regular">
					{{ info?.profitAmount || 0 }}
				</div>
			</div>

			<div class="pt-4 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt26') }}</div>
				<div class="text-text-tertiary text-style-web-base-regular">
					{{ info?.registerDays }}
				</div>
			</div>

			<div class="pt-4 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt66') }}</div>
				<div class="text-text-tertiary text-style-web-base-regular">
					{{ info?.totalFollowAmount }}
				</div>
			</div>

			<div class="pt-4 flex justify-between">
				<div class="text-text-description text-style-web-base-regular">{{ t('flw.txt67') }}</div>
				<div class="text-text-tertiary text-style-web-base-regular">
					{{ info?.minFollowAmount }}
				</div>
			</div>
		</div>

		<div class="w-[794px] py-5 px-4 rounded-[12px] border border-border-strong">
			<LineChart :data="data" />
		</div>
	</div>
</template>
