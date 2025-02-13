<script setup lang="ts">
import Kline from '../KLine.vue'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import HighchartsComponent from '../component/HighchartsComponent.vue'
import { useThemeStore } from '@/store/useThemeStore'
import { useFlashOption } from '@/hooks/useFlashOption'

const { t } = useI18n()
const themeStore = useThemeStore()
const tabList = computed(() => {
	return [{ label: t('trade.txt34'), name: 'kline' }]
})
const active = ref('kline')
const updateTheme = ref(false)
const { initHighchart } = useFlashOption()

const handleTab = (name: string) => {
	active.value = name
}

watch(
	() => themeStore.theme,
	() => {
		// location.reload()
		updateTheme.value = true
		thoggleTheme()
	}
)
const thoggleTheme = () => {
	setTimeout(() => {
		initHighchart()
		updateTheme.value = false
	}, 100)
}
</script>
<template>
	<div class="overflow-hidden w-full h-full">
		<div class="flex items-center px-4 border-b border-border-strong pdph:hidden">
			<div
				class="py-[10px] px-3"
				:class="[
					active === item.name
						? 'text-text-primary  border-b-2 border-border-button_strong '
						: 'text-text-description'
				]"
				v-for="item in tabList"
				:key="item.name"
				@click="handleTab(item.name)">
				{{ item.label }}
			</div>
		</div>
		<div class="h-[4px] bg-border-subtle web:hidden"></div>
		<Kline v-show="active === 'kline'" />
		<HighchartsComponent v-if="!updateTheme" />
	</div>
</template>
