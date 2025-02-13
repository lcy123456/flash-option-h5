<script setup lang="ts">
import History from './history.vue'
import Current from './current.vue'
import { computed, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDeliveryContract } from '@/hooks/useDeliveryContract'

const { t } = useI18n()
const { state } = useDeliveryContract()

const tabList = computed(() => {
	return [
		{ label: t('flwaccount.txt6'), name: 'current' },
		{ label: t('text103'), name: 'history' }
	]
})
const active = ref('current')
const handleTab = (name: string) => {
	active.value = name
}

onMounted(() => {
	const type = sessionStorage.getItem('dcontract_filter_order')
	state.filterOrderType = type
})

const handleCheck = () => {
	let type = sessionStorage.getItem('dcontract_filter_order')
	type = type == '1' ? '0' : '1'
	sessionStorage.setItem('dcontract_filter_order', type)
	state.filterOrderType = type
}
</script>
<template>
	<div>
		<div class="flex items-center px-4 border-b border-border-strong">
			<div
				class="py-[10px] px-3 cursor-pointer"
				:class="[
					active === item.name
						? 'text-always-black border-b-2 border-border-button_strong '
						: 'text-text-description'
				]"
				v-for="item in tabList"
				:key="item.name"
				@click="handleTab(item.name)">
				{{ item.label }}
			</div>

			<div
				class="flex-1 flex items-center justify-end text-text-tertiary text-style-web-small-regular pdph:hidden">
				<img
					:src="
						state.filterOrderType === '1'
							? '/imgs/common/checked-radio.svg'
							: '/imgs/common/check-radio.svg'
					"
					class="w-[12px] h-[12px]"
					@click="handleCheck" />
				<span class="ml-[4px]">{{ t('text148') }}</span>
			</div>
		</div>
		<Current v-show="active === 'current'" />
		<History v-show="active === 'history'" />
	</div>
</template>
