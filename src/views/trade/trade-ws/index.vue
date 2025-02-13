<script setup lang="ts">
import { Tabs } from '@/components/base'
import Kline from './kline.vue'
import Last from './last.vue'
import OrderBooks from './order-books.vue'
import { computed, ref } from 'vue'
import Info from './info.vue'
import { useI18n } from 'vue-i18n'
import { useDevice } from '@/hooks/useDevice'

const { isPC } = useDevice()
const { t } = useI18n()
const tabList = computed(() => {
	if (isPC.value) {
		return [
			{ title: t('trade.txt34'), id: 'kline' },
            // { title: t('text147'), id: 'info' }
        ]
	} else {
		return [
		{ title: t('trade.txt34'), id: 'kline' },
		{ title: t('trade.txt35'), id: 'order-books' },
		{ title: t('trade.txt36'), id: 'last' }
	]
	}
	
})
const active = ref('kline')
</script>
<template>
	<div>
		<Tabs :items="tabList" v-model:active="active" :line_b="true" :headClass="'px-4'" />
		<Kline v-show="active === 'kline'" />
		<OrderBooks v-show="active === 'order-books'" />
		<Last v-show="active === 'last'" />
		<Info v-if="active === 'info'" />
	</div>
</template>
