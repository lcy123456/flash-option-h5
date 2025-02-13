<template>
	<div>
		<div class="pdph:hidden">
			<div>
				<div class="flex justify-center text-web-mega-black text-text-primary mt-[40px]">
					{{ t('about.txt11') }} {{ globalData.appNameCFN }}
				</div>
				<div class="mx-[150px]">
					<div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ t('text317', { num: globalData.appNameCFN }) }}
					</div>
					<div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ t('text318', { num: globalData.appNameCFN }) }}
					</div>
					<div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ t('text319', { num: globalData.appNameCFN, num2: globalData.appNameCFN }) }}
					</div>
					<div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ t('text320', { num: globalData.appNameCFN }) }}
					</div>
					<div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ t('text321', { num: globalData.appNameCFN }) }}
					</div>
					<div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ t('text322', { num: globalData.appNameCFN }) }}
					</div>
					<!-- <div class="mt-[40px] flex justify-center text-text-tertiary text-style-web-h4-regular">
						{{ globalData.appNameCFN }} {{ t('about.txt4') }}
					</div> -->
				</div>

				<!-- <div class="flex justify-center mt-[40px]">
					<div
						class="w-[112px] h-[42px] rounded-[50px] flex items-center justify-center cursor-pointer bg-brand-main text-style-web-h4-bold text-always-white">
						{{ t('about.txt8') }}
					</div>
				</div> -->
			</div>

			<div class="mt-[100px] mx-[156px]">
				<div class="text-web-mega-black text-text-primary">
					{{ t('text163') }}
				</div>
				<div
					class="mt-[40px] rounded-[50px] flex items-center justify-center text-text-description text-style-web-small-regular">
					{{ t('about.txt6') }}{{ globalData.appNameCFN }}{{ t('about.txt6') }}
				</div>
				<div class="mt-[40px] flex justify-between">
					<div
						class="flex-1 h-[260px] relative rounded-[12px] bg-background-secondary py-[40px] px-[30px]">
						<div class="text-style-web-h1-bold text-text-secondary">{{ t('text173') }}</div>
						<div class="mt-[20px] text-text-description mr-[200px]">{{ t('text174') }}</div>
						<img
							src="/imgs/about/t1.svg"
							class="w-[160px] h-[120px] absolute"
							:style="{ right: '30px', bottom: '20px' }" />
					</div>
					<div
						class="flex-1 ml-[20px] h-[260px] relative rounded-[12px] bg-background-secondary py-[40px] px-[30px]">
						<div class="text-style-web-h1-bold text-text-secondary">{{ t('text175') }}</div>
						<div class="mt-[20px] text-text-description mr-[200px]">{{ t('text176') }}</div>
						<img
							src="/imgs/about/t2.svg"
							class="w-[160px] h-[120px] absolute"
							:style="{ right: '30px', bottom: '20px' }" />
					</div>
				</div>
			</div>

			<div class="mt-[100px] mx-[156px]">
				<div class="text-web-mega-black text-text-primary">
					{{ t('text164') }}
				</div>
				<div class="mt-[40px]">
					<div class="flex justify-between">
						<div
							class="flex-1 h-[160px] rounded-[6px] border border-border-strong px-[80px] py-[47px] flex items-center">
							<img src="/imgs/about/b1.svg" class="w-[65px] h-[65px]" />
							<div class="ml-[16px]">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text165') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text166') }}
								</div>
							</div>
						</div>

						<div
							class="flex-1 ml-[20px] h-[160px] rounded-[6px] border border-border-strong px-[80px] py-[47px] flex items-center">
							<img src="/imgs/about/b2.svg" class="w-[65px] h-[65px]" />
							<div class="ml-[16px]">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text167') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text168') }}
								</div>
							</div>
						</div>
					</div>
					<div class="flex justify-between mt-[20px]">
						<div
							class="flex-1 h-[160px] rounded-[6px] border border-border-strong px-[80px] py-[47px] flex items-center">
							<img src="/imgs/about/b3.svg" class="w-[65px] h-[65px]" />
							<div class="ml-[16px]">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text169') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text170') }}
								</div>
							</div>
						</div>

						<div
							class="flex-1 ml-[20px] h-[160px] rounded-[6px] border border-border-strong px-[80px] py-[47px] flex items-center">
							<img src="/imgs/about/b4.svg" class="w-[65px] h-[65px]" />
							<div class="ml-[16px]">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text171') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text172') }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="web:hidden">
			<Breadcrumb :items="items" />

			<div class="mx-[16px] my-[24px]">
				<div class="text-text-primary text-style-web-h1-bold">
					{{ t('about.txt11') }} {{ globalData.appNameCFN }}
				</div>
				<div class="mt-[22px] flex justify-center text-style-web-body-regular text-text-tertiary">
					{{ globalData.appNameCFN }} {{ t('about.txt2') }}
				</div>
				<div class="mt-[12px] flex justify-center text-style-web-body-regular text-text-tertiary">
					{{ globalData.appNameCFN }} {{ t('about.txt3') }}
				</div>
				<div class="mt-[12px] flex justify-center text-style-web-body-regular text-text-tertiary">
					{{ globalData.appNameCFN }} {{ t('about.txt4') }}
				</div>
				<!-- <div class="flex justify-center mt-[40px]">
					<div
						class="w-[112px] h-[42px] rounded-[50px] flex items-center justify-center cursor-pointer bg-brand-main text-style-web-h4-bold text-always-white">
						{{ t('about.txt8') }}
					</div>
				</div> -->
			</div>

			<div class="mt-[30px] mx-[16px]">
				<div class="text-text-primary text-style-web-h1-bold">
					{{ t('text163') }}
				</div>
				<div
					class="mt-[12px] rounded-[50px] flex items-center justify-center text-style-web-body-regular text-text-tertiary">
					{{ t('about.txt6') }}{{ globalData.appNameCFN }}{{ t('about.txt6') }}
				</div>
				<div class="mt-[28px]">
					<div
						class="w-full min-h-[190px] relative rounded-[12px] bg-background-secondary p-[16px]">
						<div class="text-style-web-h3-bold text-text-secondary">{{ t('text173') }}</div>
						<div class="mt-[20px] text-text-description text-style-web-body-regular">
							{{ t('text174') }}
						</div>
						<div class="flex justify-end mt-[16px]">
							<img src="/imgs/about/t1.svg" class="w-[80px] h-[60px]" />
						</div>
					</div>
					<div
						class="w-full min-h-[190px] mt-[16px] relative rounded-[12px] bg-background-secondary p-[16px]">
						<div class="text-style-web-h3-bold text-text-secondary">{{ t('text175') }}</div>
						<div class="mt-[20px] text-text-description text-style-web-body-regular">
							{{ t('text176') }}
						</div>
						<div class="flex justify-end mt-[16px]">
							<img src="/imgs/about/t2.svg" class="w-[80px] h-[60px]" />
						</div>
					</div>
				</div>
			</div>

			<div class="mt-[30px] mx-[16px]">
				<div class="text-style-web-h2-bold text-text-primary">
					{{ t('text164') }}
				</div>
				<div class="mt-[20px]">
					<div>
						<div
							class="w-full rounded-[6px] border border-border-strong px-[16px] py-[20px] flex items-center justify-between">
							<img src="/imgs/about/b1.svg" class="w-[50px] h-[50px]" />
							<div class="ml-[16px] flex-1">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text165') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text166') }}
								</div>
							</div>
						</div>

						<div
							class="w-full mt-[20px] rounded-[6px] border border-border-strong px-[16px] py-[20px] flex items-center justify-between">
							<img src="/imgs/about/b2.svg" class="w-[50px] h-[50px]" />
							<div class="ml-[16px] flex-1">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text167') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text168') }}
								</div>
							</div>
						</div>
					</div>
					<div>
						<div
							class="w-full mt-[20px] rounded-[6px] border border-border-strong px-[16px] py-[20px] flex items-center justify-between">
							<img src="/imgs/about/b3.svg" class="w-[50px] h-[50px]" />
							<div class="ml-[16px] flex-1">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text169') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text170') }}
								</div>
							</div>
						</div>

						<div
							class="w-full mt-[20px] rounded-[6px] border border-border-strong px-[16px] py-[20px] flex items-center justify-between">
							<img src="/imgs/about/b4.svg" class="w-[50px] h-[50px]" />
							<div class="ml-[16px] flex-1">
								<div class="text-text-primary text-style-web-h1-bold">{{ t('text171') }}</div>
								<div class="text-text-description text-style-web-small-regular">
									{{ t('text172') }}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, inject, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { helpCateone } from '@/apis/other'
import { Breadcrumb } from '@/components/base'

const { t } = useI18n()
const globalData = inject('globalData')

const items = reactive([
	{
		title: t('invite.txt22'),
		path: '-1',
		name: 'userCenter'
	},
	{
		title: t('about.txt1')
	}
])

const data = reactive({
	content: ''
})
const appName = computed(() => {
	return globalData.appName.toUpperCase()
})

const initData = async () => {
	const res = await helpCateone({ cate: 11 })
	if (res.code === 0) {
		data.content = res.data.content
	}
}

initData()
</script>
