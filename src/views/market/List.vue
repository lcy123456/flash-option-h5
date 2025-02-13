<template>
	<div>
		<van-row class="flex items-center text-web-small-regular text-text-description">
			<van-col span="8">{{ t('trade.txt1') }}</van-col>
			<van-col span="8" class="text-right">{{ t('trade.txt2') }}</van-col>
			<van-col span="8" class="text-right">{{ t('trade.txt3') }}</van-col>
		</van-row>
		<van-row
			v-for="(item, index) in list"
			:key="index"
			@click="goPage(item)"
			class="h-[57px] flex items-center text-style-web-body-bold text-text-primary">
			<van-col span="8" class="flex items-center">
				<img class="w-[24px] h-[24px] rounded-full mr-2" :src="item.iconUrl" alt="" />
				<span>{{ item.symbol }}</span>
			</van-col>
			<van-col span="8" class="flex justify-end">
				{{ thousandsComma(item.close) }}
			</van-col>
			<van-col span="8" class="flex justify-end">
				<div
					class="h-[32px] rounded-[4px] px-[6px] min-w-[72px] box-border flex items-center justify-center text-always-white text-style-web-body-medium"
					:class="getChgBgClass(item.chg)">
					{{ item.chgDesc }}
				</div>
			</van-col>
		</van-row>
	</div>
</template>
<script lang="ts" setup>
import { thousandsComma } from '@/utils/trade'
import { defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const router = useRouter()

// 声明 props 类型
const props = defineProps({
	list: {
		type: Array as () => any[],
		default: () => []
	}
})

function getChgBgClass(num: number) {
	if (num > 0) {
		return 'bg-function-buy'
	} else if (num < 0) {
		return 'bg-function-sell'
	} else {
		return 'bg-background-disabled'
	}
}

const goPage = (item: { symbol: string }) => {
	const symbols = item.symbol.split('/')
	router.push({ path: `/trade/${symbols[0]}-${symbols[1]}` })
}
</script>
