<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { toLogin } from '@/utils/routeTo'

import { showSuccessToast } from '@/components/base/toast'
import { Button } from '@/components/base'
import LineChart from './LineChart.vue'
import { getLangContrast, colorChange, toFixed } from '@/utils'
import { thousandsComma } from '@/utils/trade'
import { useUserStore } from '@/store/useUserStore'
import { useIsApp } from '@/hooks/useIsApp'
import { traderVote } from '@/apis/follow'
import { useThemeStore } from '@/store/useThemeStore'

import FollowSettings from '../follow-settings/index.vue'

const themeStore = useThemeStore()
const { isApp } = useIsApp()
const userStore: any = useUserStore()
const { t } = useI18n()
const props = defineProps({
	item: {
		type: Object,
		default: () => ({})
	},
	bg: {
		type: Boolean,
		default: false
	},
	isVote: {
		type: Boolean,
		default: false
	}
})

const emits = defineEmits(['update'])

const isTrader = ref(false)
const show = ref(false)

watchEffect(() => {
	isTrader.value = userStore.userInfo?.isTrader === 1
})

const disabled = computed(() => {
	if (props.item?.isFollow) {
		return true
	}

	if (isTrader.value) {
		return true
	}

	if (userStore.userInfo?.isTrader === 2) {
		return true
	}

	return false
})

const isFullMember = computed(() => props.item?.following === props.item?.maxFollow)

const tagList = computed(() => {
	if (props.item?.taglist && props.item?.taglist.length) {
		return props.item?.taglist.map((tag: any) => {
			return {
				label: tag[getLangContrast()]
			}
		})
	}
	return []
})

const router = useRouter()

const onFollow = () => {
	if (isApp.value && !userStore.loginToken) {
		console.log('window.callFlutterAppMethod', window.callFlutterAppMethod)
		if (window.callFlutterAppMethod) {
			window.callFlutterAppMethod('appLogin', '')
		}
		return
	}

	if (!userStore.loginToken) {
		toLogin()
		return
	}

	if (!isFullMember.value) {
		show.value = true
	}
}

const toDetail = () => {
	if (isApp.value && !userStore.loginToken) {
		if (window.callFlutterAppMethod) {
			window.callFlutterAppMethod('appLogin', '')
		}
	} else {
		router.push(`/trader-detail?traderId=${props.item.id}`)
	}
}

const onVote = async () => {
	const res: any = await traderVote({ traderId: props.item.id })
	console.log('res', res)
	if (res.code === 0) {
		showSuccessToast(t('text284'))
		emits('update')
	}
}
</script>

<template>
	<div
		class="p-4 border border-border-strong rounded-lg cursor-pointer"
		:style="[
			bg
				? themeStore.theme === 'light'
					? 'background: linear-gradient(180deg, #fff9e9 0%, rgba(255, 235, 185, 0) 19.68%)'
					: 'background: linear-gradient(180deg, rgba(255, 249, 233, 0.20) 0%, rgba(255, 235, 185, 0.00) 19.68%)'
				: ''
		]">
		<div @click="toDetail" class="relative h-full">
			<div class="flex justify-between">
				<div class="flex">
					<div class="w-10 h-10 rounded-full mr-3 overflow-hidden">
						<img class="w-[100%] h-[100%] object-cover" :src="item?.avatar" alt="" />
					</div>
					<div>
						<div class="flex items-center">
							<div class="text-text-primary text-style-web-h4-medium mr-1">
								{{ item?.nickname }}
							</div>
							<img class="w-4 h-4 object-cover" :src="item?.traderLevel?.avatar" alt="" />
						</div>
						<div class="py-[2px] flex items-center">
							<base-icon name="follow/icon2" :size="12" class="text-text-description" />
							<div class="pl-[2px] text-text-description text-style-web-xsmall-regular">
								{{ item?.following }}/{{ item?.maxFollow }}
							</div>
						</div>
						<div class="flex">
							<div
								v-for="tag in tagList"
								:key="tag.label"
								class="mr-1 py-[1px] px-[6px] text-text-tertiary text-style-web-xsmall-regular bg-background-tertiary rounded-[3px]">
								{{ tag.label }}
							</div>
						</div>
					</div>
				</div>
				<!-- <div class="pdph:hidden flex items-center">
					<Button
						v-if="isVote"
						@click.stop="onVote"
						plain
						:disabled="item.canVote === 0"
						:class="
							item.canVote === 0 ? '!bg-background-tertiary !border-0 !text-text-disabled' : ''
						"
						size="mini"
						class="!px-[10px] mr-2 flex items-center !whitespace-nowrap">
						{{ item.canVote === 0 ? t('text281') : '👋🏻' + t('text280') }}
					</Button>
					<Button
						v-if="item?.following >= item?.maxFollow"
						disabled
						size="mini"
						class="!bg-function-sell-light-backgroundr !border-0 !text-function-sell">
						{{ t('flw.txt89') }}
					</Button>
					<Button
						v-else
						:disabled="!(!item?.isFollow && !isTrader)"
						@click.stop="onFollow"
						size="mini">
						{{ t('flw.txt19') }}
					</Button>
				</div> -->
			</div>

			<div class="py-4 flex justify-between border-b border-border-subtle">
				<div>
					<div class="text-text-description text-style-web-small-medium">{{ t('text37') }}</div>
					<div class="py-1 text-style-web-h2-bold" :class="[colorChange(item?.dayYield30)]">
						{{ toFixed(item?.dayYield30, 2) || 0 }}%
					</div>
					<div class="flex">
						<div class="text-text-description text-style-web-small-regular">
							{{ t('flw.txt109') }}
						</div>
						<div
							class="ml-[2px] text-style-web-small-regular"
							:class="[colorChange(item?.day30Amount)]">
							{{ toFixed(item?.day30Amount, 2) || 0 }}
						</div>
					</div>
				</div>
				<div class="w-[100px] flex flex-1 justify-end">
					<LineChart :data="item?.yield14List" />
				</div>
			</div>

			<div class="pt-4 flex justify-between">
				<div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt3') }}</div>
					<div class="text-text-secondary text-style-web-small-medium">
						{{ toFixed(item?.winRate14, 2) || 0 }}%
					</div>
				</div>
				<div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt66') }}</div>
					<div class="text-text-secondary text-style-web-small-medium">
						{{ item?.totalFollowAmount }}
					</div>
				</div>
				<div>
					<div class="text-text-description text-style-web-small-regular">{{ t('flw.txt67') }}</div>
					<div class="text-text-secondary text-style-web-small-medium">
						{{ thousandsComma(item?.minFollowAmount) }}
					</div>
				</div>
			</div>

			<div
				v-if="item?.description"
				class="mt-4 py-[6px] px-[10px] rounded-[6px] bg-background-secondary flex">
				<base-icon name="follow/icon3" :size="16" class="w-4 text-text-tertiary" />
				<div
					class="ml-[2px] flex-1 text-style-web-small-regular overflow-hidden text-text-tertiary text-ellipsis whitespace-nowrap">
					{{ item?.description }}
				</div>
			</div>

			<div class="h-[44px]"></div>
			<div class="flex absolute bottom-0 w-[100%]">
				<Button
					v-if="isVote"
					@click.stop="onVote"
					plain
					:disabled="item.canVote === 0"
					size="mini"
					:class="item.canVote === 0 ? '!bg-background-tertiary !border-0 !text-text-disabled' : ''"
					class="w-auto !px-[10px] mr-2 flex items-center !whitespace-nowrap">
					{{ item.canVote === 0 ? t('text281') : '👋🏻' + t('text280') }}
				</Button>
				<!-- 	v-if="!item?.isFollow" -->
				<Button
					:disabled="disabled"
					@click.stop="onFollow"
					size="mini"
					class="flex-1"
					:class="isFullMember ? 'bg-function-sell-10 text-function-sell border-none' : ''">
					{{ isFullMember ? t('flw.txt89') : t('flw.txt19') }}
				</Button>
			</div>
		</div>
		<FollowSettings v-model:show="show" :item="item" @update="emits('update')" />
	</div>
</template>
