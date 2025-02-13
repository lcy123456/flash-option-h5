<script setup lang="ts">
import HeaderSort from '@/components/header-sort.vue'
import { ref } from 'vue'
const emit = defineEmits(['changeSort'])
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const sort = ref('')
const sortKey = ref({}) as any
const updateChangeSort = (sortObj: any) => {
	const sortvalue = sort.value === 'asc' ? 'desc' : sort.value === 'desc' ? '' : 'asc'
	sortKey.value = {
		...sortObj,
		[sortObj.key]: sortvalue,
		sortType: sortvalue,
		sortName: sortObj.key
	}
	sort.value = sortvalue
	emit('changeSort', sortKey.value)
}
</script>
<template>
	<div class="flex justify-between items-center text-style-web-small-regular text-text-description">
		<div>{{ t('trade.txt1') }}</div>
		<div class="flex items-center">
			<HeaderSort
				:content="t('trade.txt2')"
				@click="updateChangeSort({ key: 'close' })"
				:sort="sortKey['close']" />
			<HeaderSort
				:content="t('trade.txt3')"
				class="w-[82px] justify-end"
				@click="updateChangeSort({ key: 'chg' })"
				:sort="sortKey['chg']" />
		</div>
	</div>
</template>
