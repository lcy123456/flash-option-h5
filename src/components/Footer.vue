<template>
	<div class="mt-[100px]">
		<div
			class="py-[48px] w-[1200px] mx-auto flex items-start justify-between mt-[120px] pdph:hidden">
			<div>
				<div class="flex">
					<!-- <img src="/imgs/logo2.svg" class="h-[24px]" alt="" /> -->
					<div class="flex items-center cursor-pointer">
						<MainLogo />
						<!-- <div class="ml-[8px] text-style-web-h2-bold">{{ globalData.title }}</div> -->
					</div>

					<!-- <img src="/imgs/welcome/logo.svg" class="w-[30px] h-[28px]" />
					<div class="pc-ma ml-[5px]">
						<span class="text-text-primary">{{ titles[0] }}</span>
						<span class="text-brand-blue">{{ titles[1] }}</span>
					</div> -->
				</div>
				<!-- <div class="mt-[24px]">
					<div
						class="flex justify-between cursor-pointer text-text-inverse-primary text-style-web-small-medium">
						<div
							@click="openUrl(IOS_DONWLOAD)"
							class="min-w-[108px] h-[36px] px-[16px] rounded-[6px] bg-background-inverse-primary flex items-center justify-center">
							<img src="/imgs/welcome/apple1.svg" class="w-[20px] h-[20px]" />
							<span class="ml-[6px]">iOS{{ t('other.txt43') }}</span>
						</div>

						<div
							@click="openUrl(ANDROID_DONWLOAD)"
							class="min-w-[119px] h-[36px] px-[16px] cursor-pointer rounded-[6px] bg-background-inverse-primary flex items-center justify-center ml-[12px]">
							<img src="/imgs/welcome/android1.svg" class="w-[20px] h-[20px]" />
							<span class="ml-[6px]">Android{{ t('other.txt43') }}</span>
						</div>
					</div>
				</div> -->
				<!-- <div class="mt-[24px] flex items-center">
					<img src="/imgs/welcome/x.svg" class="w-[24px] h-[24px]" />
					<img src="/imgs/welcome/x2.svg" class="w-[24px] h-[24px] ml-[24px]" />
					<img src="/imgs/welcome/x3.svg" class="w-[24px] h-[24px] ml-[24px]" />
					<img src="/imgs/welcome/x4.svg" class="w-[24px] h-[24px] ml-[24px]" />
				</div> -->
				<div class="mt-[24px] text-style-web-base-regular text-text-tips">
					Copyright © 2024 {{ t('my.txt45') }}{{ globalData.appNameCFN }}
				</div>
			</div>
			<div class="flex-1 flex justify-between ml-[147px]">
				<div>
					<div class="text-text-primary text-style-web-h2-bold">{{ t('other.txt44') }}</div>
					<div class="text-web-400 text-text-description">
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/home/swap/BTC-USDT')">
							{{ t('other.txt46') }}
						</div>
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/home/follow')">
							{{ t('other.txt47') }}
						</div>
						<div
							class="mt-[16px] cursor-pointer"
							@click="routeTo('/home/deliveryContract/BTC-USDT')">
							{{ t('other.txt48') }}
						</div>
					</div>
				</div>
				<div>
					<div class="text-text-primary text-style-web-h2-bold">{{ t('other.txt49') }}</div>
					<div class="text-web-400 text-text-description">
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/helpCenter')">
							{{ t('other.txt51') }}
						</div>
					</div>
				</div>
				<div>
					<div class="text-text-primary text-style-web-h2-bold">{{ t('other.txt53') }}</div>
					<div class="text-web-400 text-text-description">
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/helpCenter')">
							{{ t('other.txt51') }}
						</div>
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/notice')">
							{{ t('other.txt54') }}
						</div>
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/invite')">
							{{ t('other.txt55') }}
						</div>
					</div>
				</div>

				<div>
					<div class="text-text-primary text-style-web-h2-bold">{{ t('about.txt1') }}</div>
					<div class="text-web-400 text-text-description">
						<div class="mt-[16px] cursor-pointer" @click="routeTo('/about')">
							{{ t('my.txt45') }}{{ globalData.appNameCFN }}
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="px-[16px] mt-[24px] web:hidden pdph:hidden">
			<div class="flex">
				<img src="/imgs/logo2.svg" class="h-[24px]" alt="" />
				<!-- <img src="/imgs/welcome/logo.svg" class="w-[30px] h-[28px]" />
				<div class="pc-ma ml-[5px]">
					<span class="text-text-primary">{{ titles[0] }}</span>
					<span class="text-brand-blue">{{ titles[1] }}</span>
				</div> -->
			</div>
			<div class="mt-[24px]">
				<div class="flex items-center cursor-pointer" @click="data.visible1 = !data.visible1">
					<div class="flex-1 text-text-primary text-style-web-h3-regular">
						{{ t('other.txt44') }}
					</div>
					<img src="/imgs/common/chevron-down.svg" class="w-[20px] h-[20px]" />
				</div>
				<div class="text-web-400 text-text-description" v-if="data.visible1">
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/home/swap/BTC-USDT')">
						{{ t('other.txt46') }}
					</div>
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/home/follow')">
						{{ t('other.txt47') }}
					</div>
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/home/deliveryContract/BTC-USDT')">
						{{ t('other.txt48') }}
					</div>
				</div>
			</div>
			<div class="mt-[24px]">
				<div class="flex items-center cursor-pointer" @click="data.visible2 = !data.visible2">
					<div class="flex-1 text-text-primary text-style-web-h3-regular">
						{{ t('other.txt49') }}
					</div>
					<img src="/imgs/common/chevron-down.svg" class="w-[20px] h-[20px]" />
				</div>

				<!-- <div class="text-text-primary text-style-web-h3-regular">{{ t('other.txt49') }}</div> -->
				<div class="text-web-400 text-text-description" v-if="data.visible2">
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/helpCenter')">
						{{ t('other.txt51') }}
					</div>
				</div>
			</div>
			<div class="mt-[24px]">
				<div class="flex items-center">
					<div class="flex-1 text-text-primary text-style-web-h3-regular">
						{{ t('other.txt53') }}
					</div>
					<img
						src="/imgs/common/chevron-down.svg"
						class="w-[20px] h-[20px] cursor-pointer"
						@click="data.visible3 = !data.visible3" />
				</div>

				<!-- <div class="text-text-primary text-style-web-h3-regular">{{ t('other.txt53') }}</div> -->
				<div class="text-web-400 text-text-description" v-if="data.visible3">
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/helpCenter')">
						{{ t('other.txt51') }}
					</div>
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/notice')">
						{{ t('other.txt54') }}
					</div>
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/invite')">
						{{ t('other.txt55') }}
					</div>
				</div>
			</div>
			<div class="mt-[24px]">
				<div class="flex items-center">
					<div class="flex-1 text-text-primary text-style-web-h3-regular">
						{{ t('about.txt1') }}
					</div>
					<img
						src="/imgs/common/chevron-down.svg"
						class="w-[20px] h-[20px] cursor-pointer"
						@click="data.visible4 = !data.visible4" />
				</div>
				<div class="text-web-400 text-text-description" v-if="data.visible4">
					<div class="mt-[16px] cursor-pointer" @click="routeTo('/about')">
						{{ t('my.txt45') }}{{ globalData.appNameCFN }}
					</div>
				</div>
			</div>

			<div class="mt-[24px] flex items-center">
				<img src="/imgs/welcome/x.svg" class="w-[24px] h-[24px]" />
				<img src="/imgs/welcome/x2.svg" class="w-[24px] h-[24px] ml-[24px]" />
				<img src="/imgs/welcome/x3.svg" class="w-[24px] h-[24px] ml-[24px]" />
				<img src="/imgs/welcome/x4.svg" class="w-[24px] h-[24px] ml-[24px]" />
			</div>
			<div class="my-[24px] text-style-web-base-regular text-text-tips">
				Copyright © 2024 {{ t('my.txt45') }}{{ globalData.appNameCFN }}
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { inject, computed, reactive } from 'vue'
import { routeTo } from '@/utils/routeTo'
import { useI18n } from 'vue-i18n'
import { splitStringAtMiddle } from '@/utils'
import { ANDROID_DONWLOAD, IOS_DONWLOAD } from '@/constants/index'
import MainLogo from '@/components/business/MainLogo/index.vue'

const { t } = useI18n()
const globalData = inject('globalData')
const data = reactive({
	visible1: false,
	visible2: false,
	visible3: false,
	visible4: false
})
const titles = computed(() => {
	const array = splitStringAtMiddle(globalData.appNameCFN)

	return array
})

const openUrl = (url: string) => {
	if (!url) return
	window.open(url, '_blank')
}
</script>
