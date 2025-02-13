<script setup lang="ts">
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { PopupBottom, Input } from '@/components/base'
import usdLogo from '@/assets/img/currency/usd.svg'
import vndLogo from '@/assets/img/currency/vnd.svg'
import { useWalletStore } from '@/store/modules/wallet'
import Empty from '@/components/empty.vue'

const walletStore = useWalletStore()
const { t } = useI18n()
const show = defineModel('show', { default: true })

const value = ref('')

const list = computed(() =>
	[
		{
			logo: usdLogo,
			id: 'usd',
			title: 'USD'
		},
		{
			logo: vndLogo,
			id: 'vnd',
			title: 'VND'
		}
	].filter((item) => item.title.match(value.value.toUpperCase()) !== null)
)

const change = (item: any) => {
	show.value = false
	walletStore.setCurrentCurrency(item.id)
}
</script>

<template>
	<PopupBottom :title="t('text108')" height="80%" v-model:show="show" :bottom="false">
		<Input v-model="value" size="small" :placeholder="t('text109')">
			<template v-slot:prefix>
				<icon name="search" :size="20" class="mr-[10px] text-text-primary" />
			</template>
		</Input>
		<div class="py-3">
			<div
				v-for="item in list"
				:key="item.title"
				@click="change(item)"
				class="flex items-center justify-between py-4">
				<div class="flex items-center">
					<img :src="item.logo" class="w-[30px] h-[30px]" alt="" />
					<div class="ml-[10px] text-text-primary text-style-app-medium-400_100">
						{{ item.title }}
					</div>
				</div>
				<icon
					v-if="walletStore.currentCurrency === item.id"
					name="user-center/yes"
					:size="24"
					class="text-text-primary" />
			</div>
			<div v-if="!list.length">
				<Empty />
			</div>
		</div>
	</PopupBottom>
</template>
