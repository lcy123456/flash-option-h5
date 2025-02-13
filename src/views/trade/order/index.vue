<script setup lang="ts">
import Assets from './assets.vue'
import History from './history.vue'
import Current from './current.vue'
import { computed } from 'vue'
import { Tabs } from '@/components/base'
import { orderTabActiveEnum } from '@/enums/trade'
import { useTradeStore } from '@/store/modules/trade/index'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
const tradeStore = useTradeStore()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const tabList = computed(() => {
	const len = tradeStore.state?.currentOrderList?.length || 0
	if (isPC.value) {
		return [
			{ title: `${t('trade.txt37')}(${len})`, id: orderTabActiveEnum.current },
			{ title: t('trade.txt38'), id: orderTabActiveEnum.history },
		]
	} else {
		return [

			{ title: `${t('trade.txt37')}(${len})`, id: orderTabActiveEnum.current },
			{ title: t('trade.txt38'), id: orderTabActiveEnum.history },
			{ title: t('trade.txt39'), id: orderTabActiveEnum.assets }
		]
	}

})
</script>
<template>
	<div class="flex">
		<div class="flex-1">
			<Tabs :items="tabList"  :line="!isPC" :line_b="isPC" head-class="px-4" v-model:active="tradeStore.state.orderTabActive" />
			<Current v-if="tradeStore.state.orderTabActive === orderTabActiveEnum.current" />
			<History v-if="tradeStore.state.orderTabActive === orderTabActiveEnum.history" />
			<Assets v-if="tradeStore.state.orderTabActive === orderTabActiveEnum.assets" />
		</div>
		<div v-if="isPC" class="w-[322px]">
			<Assets />
		</div>
	</div>
</template>
