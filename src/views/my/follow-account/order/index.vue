<script setup lang="ts">
import { Tabs } from '@/components/base'
import History from './asset.vue'
import Current from './current.vue'
import { computed, watchEffect, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { routeTo } from '@/utils/routeTo'
import { useDevice } from '@/hooks/useDevice'

const userStore: any = useUserStore()
const { t } = useI18n()
const isTrader = ref(false)
const { isWeb } = useDevice()

const tabList = computed(() => {
	return [
		{ title: t('flwaccount.txt6'), id: 1 },
		{ title: t('flwaccount.txt7'), id: 2 }
	]
})

watchEffect(() => {
	isTrader.value = userStore.userInfo?.isTrader === 1
})

const toOrder = () => {
	if (isTrader.value) {
		routeTo('/trader')
	} else {
		routeTo('/my-follow')
	}
}
</script>
<template>
	<Tabs :items="tabList" line_b>
		<template v-slot="props">
			<Current v-if="props.active === 1" />
			<History v-if="props.active === 2" />
		</template>

		<template v-slot:suffix>
			<div class="ml-1 h-[100%] flex items-center">
				<div
					@click="toOrder"
					v-if="isWeb"
					class="flex items-center text-style-medium-500 cursor-pointer">
					<div class="text-text-brand">{{ isTrader ? t('text17') : t('flw.txt11') }}</div>
					<icon name="arrow-right" :size="16" class="text-text-primary" />
				</div>
				<icon v-else @click="toOrder" name="wallet/order" :size="20" class="text-text-primary" />
			</div>
		</template>
	</Tabs>
</template>
