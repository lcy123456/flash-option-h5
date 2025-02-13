<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { Breadcrumb, Tabs } from '@/components/base'
import DepositCard from './components/DepositCard.vue'
import WithdrawCard from './components/WithdrawCard.vue'
import TransferCard from './components/TransferCard.vue'
import Menu from '../components/Menu.vue'

const route = useRoute()
const { t } = useI18n()
const activeTab = route.query?.tab || 1

const active = ref(Number(route.query?.active) || 1)
const items = reactive([
	{
		title: t('my.txt12'),
		path: '/home/my/wallet'
	},
	{
		title: t('my.txt9')
	}
])

const tabItems = reactive([
	{
		title: t('text1'),
		id: 1
	},
	{
		title: t('text2'),
		id: 2
	},
	{
		title: t('text373'),
		id: 5
	}
])
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div class="py-6 px-4">
			<div class="text-text-primary text-style-web-h3-bold pb-6">{{ t('my.txt9') }}</div>

			<Tabs :items="tabItems" v-model:active="active" line_b>
				<template v-slot="props">
					<div v-if="props.active === 1">
						<DepositCard />
					</div>
					<div v-if="props.active === 2">
						<WithdrawCard />
					</div>
					<div v-if="props.active === 5">
						<TransferCard />
					</div>
				</template>
			</Tabs>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<div class="w-[268px] flex-shrink-0 h-[calc(100vh-64px)] border-r border-border-strong pt-10">
			<Menu :active="Number(activeTab)" />
		</div>
		<div class="flex-1 pt-10 px-20">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('text377') }}</div>
			<div class="pt-[42px]">
				<Tabs :items="tabItems" v-model:active="active" line_b>
					<template v-slot="props">
						<div v-if="props.active === 1">
							<DepositCard />
						</div>
						<div v-if="props.active === 2">
							<WithdrawCard />
						</div>
						<div v-if="props.active === 5">
							<TransferCard />
						</div>
					</template>
				</Tabs>
			</div>
		</div>
	</div>
</template>
