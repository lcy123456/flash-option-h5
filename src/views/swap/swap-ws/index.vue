<script setup lang="ts">
import { Tabs } from '@/components/base'
import Kline from './kline.vue'
import Last from './last.vue'
import OrderBooks from './order-books.vue'
import { computed, ref } from 'vue'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const tabList = computed(() => {
	if (isPC.value) {
		return [
			{ title: t('trade.txt35'), id: 'order-books' },
			{ title: t('trade.txt36'), id: 'last' }
		]
	}
	return [
		{ title: t('trade.txt34'), id: 'kline' },
		{ title: t('trade.txt35'), id: 'order-books' },
		{ title: t('trade.txt36'), id: 'last' }
	]
})
const active = ref(!isPC.value ? 'kline' : 'order-books')
</script>
<template>
	<div>
		<Tabs :items="tabList" v-model:active="active" :headClass="'px-4'" :line_b="true" />
		<Kline v-show="active === 'kline'" />
		<OrderBooks v-if="active === 'order-books'" />
		<Last v-if="active === 'last'" />
	</div>
</template>
