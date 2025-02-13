<template>
	<div class="pt-[120px] w-[1200px] mx-auto pdph:hidden">
		<div class="text-text-primary text-style-web-xlarge-bold">{{ t('other.txt20') }}</div>
		<div class="py-[30px] flex items-center">
			<div
				@click="data.active = 'Hot'"
				:class="data.active === 'Hot' ? 'text-text-primary' : 'text-text-description'"
				class="min-w-[64px] h-[36px] px-[16px] cursor-pointer rounded-[30px] flex items-center justify-center bg-background-secondary text-style-web-h4-medium">
				{{ t('other.txt21') }}
			</div>
			<div
				@click="data.active = 'Rank'"
				:class="data.active === 'Rank' ? 'text-text-primary' : 'text-text-description'"
				class="ml-[10px] min-w-[64px] h-[36px] px-[16px] cursor-pointer rounded-[30px] flex items-center justify-center bg-background-secondary text-style-web-h4-medium">
				{{ t('other.txt22') }}
			</div>
		</div>
		<div>
			<Hot v-if="data.active === 'Hot'" :list="recommends" />
			<Rank v-else :list="ranks" />
		</div>
	</div>

	<div class="mt-[40px] mx-[16px] web:hidden">
		<div class="text-text-primary text-style-web-h1-bold">{{ t('other.txt20') }}</div>
		<div class="mt-[24px] flex items-center">
			<div
				@click="data.active = 'Hot'"
				:class="data.active === 'Hot' ? 'text-text-primary' : 'text-text-description'"
				class="min-w-[64px] h-[36px] px-[16px] cursor-pointer rounded-[30px] flex items-center justify-center bg-background-secondary text-style-web-h4-medium">
				{{ t('other.txt21') }}
			</div>
			<div
				@click="data.active = 'Rank'"
				:class="data.active === 'Rank' ? 'text-text-primary' : 'text-text-description'"
				class="ml-[10px] min-w-[64px] h-[36px] px-[16px] cursor-pointer rounded-[30px] flex items-center justify-center bg-background-secondary text-style-web-h4-medium">
				{{ t('other.txt22') }}
			</div>
		</div>
		<div class="mt-[24px]">
			<Hot v-if="data.active === 'Hot'" :list="recommends" />
			<Rank v-else :list="ranks" />
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, defineProps } from 'vue'
import Hot from './Hot.vue'
import Rank from './Rank.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const data = reactive({
	active: 'Hot'
})

// 声明 props 类型
defineProps({
	recommends: {
		type: Array as () => any[],
		default: () => []
	},
	ranks: {
		type: Array as () => any[],
		default: () => []
	}
})
</script>
