<script setup lang="ts">
import Last from './last.vue'
import OrderBooks from './order-books.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Tabs } from '@/components/base'
const { t } = useI18n()
const tabList = computed(() => {
	return [
		{ title: t('trade.txt35'), id: 'order-books' },
		{ title: t('trade.txt36'), id: 'last' }
	]
})
const active = ref('order-books')
</script>
<template>
	<div>
		<Tabs :items="tabList" v-model:active="active" :headClass="'px-4'" :line_b="true" />
		<OrderBooks v-show="active === 'order-books'" class="h-[512px]" />
		<Last v-show="active === 'last'" class="h-[512px]" />
	</div>
</template>
