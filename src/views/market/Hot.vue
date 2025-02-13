<template>
	<div>
		<div class="text-web-h2-bold px-[16px] text-text-primary">{{ t('home.txt13') }}</div>
		<div
			class="mt-[17px] ml-[16px] flex items-center overflow-x-auto overflow-y-hidden"
			style="scrollbar-width: none; -ms-overflow-style: none">
			<div
				class="w-[124px] h-[96px] flex flex-col items-center bg-background-secondary rounded-[6px] p-[8px]"
				v-for="(item, index) in list"
				:key="item.name"
				@click="goPage(item)"
				:class="index === 0 ? '' : 'ml-[12px]'">
				<div class="w-[100px] flex items-center">
					<div class="flex-1 flex items-center">
						<div class="text-app-medium-600 text-text-primary">{{ item.symbol0 }}</div>
						<div class="text-app-medium-400 text-text-tertiary">/{{ item.symbol1 }}</div>
					</div>
					<img :src="item.iconUrl" class="w-[20px] h-[20px]" />
				</div>
				<div class="mt-[12px] text-app-medium-600 text-text-primary">
					{{ thousandsComma(item.close) }}
				</div>
				<div
					class="text-app-small-400"
					:class="item.chg > 0 ? 'text-function-buy' : 'text-function-sell'">
					{{ item.chgDesc }}
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { thousandsComma } from '@/utils/trade'
import { defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

// 声明 props 类型
const props = defineProps({
	list: {
		type: Array as () => any[],
		default: () => []
	}
})

const goPage = (item: { symbol0: string; symbol1: string }) => {
	router.push({ path: `/trade/${item.symbol0}-${item.symbol1}` })
}
</script>
