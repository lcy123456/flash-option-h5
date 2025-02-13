<script lang="ts" setup>
import { reactive, ref, computed } from 'vue'

import { useI18n } from 'vue-i18n'
import { LANGUAGS } from '@/constants/index'
import { changeLang } from '@/i18n'
import { useWalletStore } from '@/store/modules/wallet/index'

const { t, locale } = useI18n()
const show = defineModel('show', { default: true })
const emits = defineEmits(['ok'])
const walletStore = useWalletStore()

const data = reactive({
	currentLan: locale.value
})

const handleChangeLange = (lang: any) => {
	data.currentLan = lang.value
	changeLang(lang.value)
}

const handleSetRate = (item: any) => {
	walletStore.setCurrentCurrency(item.value)
	show.value = false
}
const tabList = computed(() => {
	return [
		{ label: t('home.txt28'), name: 'language' }
		// { label: t('text107'), name: 'rate' }
	]
})
const active = ref('language')
const handleTab = (name: string) => {
	active.value = name
}
</script>
<template>
	<van-popup v-model:show="show" round class="!bg-background-window">
		<div class="w-[600px] min-h-[320px] py-[16px]">
			<div
				class="h-[38px] px-[24px] flex items-center border-b border-border-gutter justify-between">
				<!-- <div
					class="w-[54px] h-[38px] border-b-[2px] border-border-button_strong flex items-center justify-center">
					<span class="text-style-web-h5-medium text-text-primary">{{ t('home.txt28') }}</span>
				</div> -->
				<div class="flex-1 flex">
					<div
						class="py-[10px] px-3 text-style-web-body-medium cursor-pointer"
						:class="[
							active === item.name
								? 'text-text-primary border-b-2 border-border-button_strong '
								: 'text-text-description'
						]"
						v-for="item in tabList"
						:key="item.name"
						@click="handleTab(item.name)">
						{{ item.label }}
					</div>
				</div>
				<Icon name="common/close" :size="24" class="text-text-primary" @click="show = false" />
			</div>
			<div class="p-[16px] text-style-web-body-medium" v-if="active === 'language'">
				<van-row align="center" :gutter="[16]">
					<van-col
						span="6"
						v-for="item in LANGUAGS"
						:key="item.value"
						class="h-[44px] cursor-pointer flex items-center"
						@click="handleChangeLange(item)"
						:class="data.currentLan === item.value ? 'text-text-brand' : 'text-text-secondary'">
						{{ item.label }}
					</van-col>
				</van-row>
			</div>

			<div class="p-[24px] text-style-web-body-medium" v-if="active === 'rate'">
				<van-row align="center" :gutter="[16, 16]">
					<van-col
						span="6"
						v-for="item in walletStore.rates"
						:key="item.value"
						class="h-[44px] cursor-pointer"
						@click="handleSetRate(item)"
						:class="
							walletStore.currentCurrency === item.value ? 'text-text-brand' : 'text-text-secondary'
						">
						{{ item.label }}
					</van-col>
				</van-row>
			</div>
		</div>
	</van-popup>
</template>
