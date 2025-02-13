<script setup lang="ts">
import { routeTo } from '@/utils/routeTo'

import Postion from './postion.vue'
import History from './history.vue'
import Current from './current.vue'
import Asset from './asset.vue'
import Checkbox from '@/components/base/checkbox/index.vue'
import { Tabs } from '@/components/base'
import { computed } from 'vue'
import { orderTabActiveEnum } from '@/enums/trade'
import { useSwapStore } from '@/store/modules/swap/index'
import { useUserStore } from '@/store/useUserStore'
const userStore = useUserStore()
const swapStore = useSwapStore()
import { useDevice } from '@/hooks/useDevice'
const { isPC, isWeb } = useDevice()
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
const tabList = computed(() => {
	const len = swapStore.state?.currentOrderList.length || 0
	const postionLen = swapStore.state?.positionList.length || 0
	return [
		{ title: `${t('trade.txt40')}(${postionLen})`, id: orderTabActiveEnum.position },
		{ title: `${t('trade.txt37')}(${len})`, id: orderTabActiveEnum.current },
		{ title: t('trade.txt38'), id: orderTabActiveEnum.history }
	]
})
const handleChange = () => {
	swapStore.fetchPostionList()
}
const handleCurrent = () => {
	swapStore.fetchCurrentOrder()
}
</script>
<template>
	<div class="flex justify-between" :class="[!isPC && 'border-t-[4px] border-border-subtle']">
		<div class="flex-1">
			<div class="relative">
				<Tabs
					:items="tabList"
					line
					head-class="px-4"
					v-model:active="swapStore.state.orderTabActive" />
				<div
					v-if="isPC"
					class="absolute top-[12px] right-[12px] text-style-web-small-regular text-text-tertiary">
					<div
						v-if="swapStore.state.orderTabActive === orderTabActiveEnum.position"
						class="flex items-center cursor-pointer">
						<Checkbox
							v-model:value="swapStore.state.positionInfo.isOnlyCurrent"
							@change="handleChange">
							<div class="text-text-tertiary">
								{{ t('trade.txt55') }}
							</div>
						</Checkbox>
					</div>
					<div
						v-if="swapStore.state.orderTabActive === orderTabActiveEnum.current"
						class="flex items-center cursor-pointer">
						<Checkbox
							v-model:value="swapStore.state.currentParams.isOnlyCurrent"
							@change="handleCurrent">
							<div class="text-text-tertiary">{{ t('trade.txt55') }}</div>
						</Checkbox>
					</div>
				</div>
			</div>
			<div v-if="isWeb && userStore.loginToken">
				<Postion v-if="swapStore.state.orderTabActive === orderTabActiveEnum.position" />
				<Current v-if="swapStore.state.orderTabActive === orderTabActiveEnum.current" />
				<History v-if="swapStore.state.orderTabActive === orderTabActiveEnum.history" />
			</div>
			<div
				v-else-if="isWeb"
				class="h-[236px] flex items-center justify-center text-text-tertiary text-style-web-body-regular">
				<div class="text-text-brand cursor-pointer" @click="routeTo('/login')">
					{{ t('login.txt1') }}
				</div>
				<div class="mx-1">
					{{ t('trade.txt202') }}
				</div>
				<div class="text-text-brand cursor-pointer mr-1" @click="routeTo('/register')">
					{{ t('other.txt17') }}
				</div>
				{{ t('trade.txt203') }}
			</div>

			<div v-if="!isWeb">
				<Postion v-if="swapStore.state.orderTabActive === orderTabActiveEnum.position" />
				<Current v-if="swapStore.state.orderTabActive === orderTabActiveEnum.current" />
				<History v-if="swapStore.state.orderTabActive === orderTabActiveEnum.history" />
			</div>
		</div>
		<div class="w-[322px] border-t border-border-subtle" v-if="isPC">
			<Asset />
		</div>
	</div>
</template>
