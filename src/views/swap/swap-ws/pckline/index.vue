<script setup lang="ts">
import { reactive } from 'vue'
import Kline from '../kline.vue'
import { useI18n } from 'vue-i18n'
import { Tabs } from '@/components/base'
const { t } = useI18n()
const state = reactive({
	tabList: [
		{ title: t('trade.txt34'), id: 'kline' }
		// { title: t('text147'), id: 'info' }
	],
	active: 'kline'
})
</script>

<template>
	<div>
		<Tabs :items="state.tabList" v-model:active="state.active" :headClass="'px-4'" :line_b="true" />
		<Kline v-show="state.active === 'kline'" />
	</div>
</template>
