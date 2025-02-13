<template>
	<div class="pdph:hidden">
		<van-row justify="space-between" class="text-text-tertiary text-style-web-body-regular">
			<van-col span="5"># {{ t('other.txt23') }}</van-col>
			<van-col span="5">
				<Sort v-model:state="priceSort">{{ t('trade.txt28') }}</Sort>
			</van-col>
			<van-col span="5">
				<Sort v-model:state="increaseSort">{{ t('other.txt24') }}</Sort>
			</van-col>
			<van-col span="5">
				<Sort v-model:state="volumeSort">{{ t('other.txt25') }}</Sort>
			</van-col>
			<van-col span="2" class="text-right pr-[13px]">{{ t('other.txt26') }}</van-col>
		</van-row>
		<van-row v-for="item in _list" :key="item.name" justify="space-between" class="mt-[30px]">
			<van-col span="5">
				<div class="flex items-center">
					<img class="w-[30px] h-[30px] rounded-full mr-2" :src="item.iconUrl" alt="" />
					<div class="text-style-web-h4-medium text-text-primary">{{ item.symbol0 }}</div>
					<div class="text-style-web-small-regular text-text-description">/{{ item.symbol1 }}</div>
				</div>
			</van-col>
			<van-col span="5">
				<div class="text-style-web-h4-medium text-text-primary">{{ item.close }}</div>
			</van-col>
			<van-col span="5">
				<div
					class="text-style-web-h4-medium"
					:class="item.chg > 0 ? 'text-function-buy' : 'text-function-sell'">
					{{ item.chgDesc }}
				</div>
			</van-col>
			<van-col span="5" class="text-style-web-h4-medium text-text-primary">
				{{ item.volume }}
			</van-col>
			<van-col span="2" class="flex justify-end">
				<div
					@click="goTrade(item)"
					class="px-[11px] py-[5px] text-text-brand text-style-web-body-regular border rounded-[47px] border-border-strong cursor-pointer">
					{{ t('other.txt27') }}
				</div>
			</van-col>
		</van-row>
	</div>

	<div class="web:hidden">
		<van-row justify="space-between">
			<van-col span="12" class="text-text-tertiary text-style-web-body-regular">
				# {{ t('other.txt23') }}
			</van-col>
			<van-col span="6" class="text-text-tertiary text-style-web-body-regular">
				<Sort v-model:state="priceSort">{{ t('trade.txt28') }}</Sort>
			</van-col>
			<van-col span="6" class="text-text-tertiary text-style-web-body-regular">
				<Sort v-model:state="increaseSort">{{ t('other.txt24') }}</Sort>
			</van-col>
		</van-row>
		<van-row v-for="item in _list" :key="item.name" justify="space-between" class="mt-[30px]">
			<van-col span="12">
				<div class="flex items-center">
					<img class="w-[30px] h-[30px] rounded-full mr-2" :src="item.iconUrl" alt="" />
					<div class="text-style-web-h4-medium text-text-primary">{{ item.symbol0 }}</div>
					<div class="text-style-web-small-regular text-text-description">/{{ item.symbol1 }}</div>
				</div>
			</van-col>
			<van-col span="6">
				<div class="text-style-web-h4-medium text-text-primary">{{ item.close }}</div>
			</van-col>
			<van-col span="6">
				<div
					class="text-style-web-h4-medium"
					:class="item.chg > 0 ? 'text-function-buy' : 'text-function-sell'">
					{{ item.chgDesc }}
				</div>
			</van-col>
		</van-row>
	</div>
</template>
<script lang="ts" setup>
import { defineProps, computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Sort } from '@/components/base'

const { t } = useI18n()

const router = useRouter()
const priceSort = ref(0)
const increaseSort = ref(0)
const volumeSort = ref(0)

// 声明 props 类型
const props = defineProps({
	list: {
		type: Array as () => any[],
		default: () => []
	}
})

watch(
	() => [priceSort.value],
	(_value: any) => {
		if (_value > 0) {
			increaseSort.value = 0
			volumeSort.value = 0
		}
	}
)

watch(
	() => [increaseSort.value],
	(_value: any) => {
		if (_value > 0) {
			priceSort.value = 0
			volumeSort.value = 0
		}
	}
)

watch(
	() => [volumeSort.value],
	(_value: any) => {
		if (_value > 0) {
			priceSort.value = 0
			increaseSort.value = 0
		}
	}
)

const _list = computed(() => {
	if (priceSort.value > 0) {
		return [...props.list]?.sort((a: any, b: any) => {
			return priceSort.value === 1 ? a.close - b.close : b.close - a.close
		})
	}
	if (increaseSort.value > 0) {
		return [...props.list]?.sort((a: any, b: any) => {
			return increaseSort.value === 1 ? a.chg - b.chg : b.chg - a.chg
		})
	}
	if (volumeSort.value > 0) {
		return [...props.list]?.sort((a: any, b: any) => {
			return volumeSort.value === 1 ? a.volume - b.volume : b.volume - a.volume
		})
	}
	return props.list
})

const goTrade = (item: any) => {
	router.push({ path: `/trade/${item.symbol0}-${item.symbol1}` })
}
</script>
