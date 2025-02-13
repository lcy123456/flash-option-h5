<script setup lang="ts">
import History from './history.vue'
import Current from './current.vue'
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Tabs } from '@/components/base'

const { t } = useI18n()

const tabList = computed(() => {
	return [
		{ title: t('option.txt20'), id: 'current' },
		{ title: t('option.txt21'), id: 'history' }
	]
})
const active = ref('current')
</script>
<template>
	<div>
		<div class="flex items-center px-4 border-b border-border-subtle">
			<Tabs :items="tabList" v-model:active="active" :headClass="'px-4'" :line_b="true" />

			<!-- <div
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
			</div> -->
			<!-- <div
				class="flex-1 flex items-center justify-end text-text-tertiary text-style-web-small-regular">
				<img src="/imgs/common/checked-radio.svg" class="w-[12px] h-[12px]" />
				<span class="ml-[4px]">{{ t('text148') }}</span>
			</div> -->
		</div>
		<Current v-show="active === 'current'" />
		<History v-show="active === 'history'" />
	</div>
</template>
