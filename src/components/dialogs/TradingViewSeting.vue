<script lang="ts" setup>
import { Dialog } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { mainIndicators, subIndicators } from '@/constants'
import { useTradingView } from '@/hooks/useTradingView'

const { t } = useI18n()
const show = defineModel('show', { default: true })
const { setActive } = useTradingView()

const checkedMainChange = (type: any) => {
	setActive(type)
}

const checkedSubChange = (type: any) => {
	setActive(type)
}
</script>
<template>
	<Dialog v-model:show="show" :title="t('text19')" width="400px">
		<div class="p-[16px]">
			<div class="text-text-primary">
				{{ t('text358') }}
			</div>
			<van-checkbox-group shape="square" @change="checkedMainChange">
				<van-checkbox
					class="mt-[12px]"
					v-for="item in mainIndicators"
					:key="item.value"
					:name="item.value">
					{{ item.label }}
				</van-checkbox>
			</van-checkbox-group>
			<div class="text-text-primary mt-[24px]">
				{{ t('text359') }}
			</div>
			<van-checkbox-group shape="square" @change="checkedSubChange">
				<van-checkbox
					class="mt-[12px]"
					v-for="item in subIndicators"
					:key="item.value"
					:name="item.value">
					{{ item.label }}
				</van-checkbox>
			</van-checkbox-group>
		</div>
	</Dialog>
</template>
