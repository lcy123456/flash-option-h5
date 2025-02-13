<template>
	<div class="w-[1200px] mx-auto pt-[100px] flex items-center justify-between pdph:hidden">
		<div class="left">
			<div class="text-style-web-oversize-bold text-text-primary">
				<div class="flex items-center">
					<span>{{ data.text1 }}</span>
					<div class="relative">
						<span class="text-brand-blue ml-[10px]">{{ data.text2 }}</span>
						<!-- <span
							ref="coinDiv"
							class="text-brand-blue ml-[10px] fadeOutDown absolute fade-text"
							:class="data.text2 === 'ETH' ? 'text-function-buy' : 'text-brand-blue'">
							{{ data.text2 }}
						</span> -->
					</div>
				</div>
				<div class="mt-[40px]">
					{{ data.text3 }}
				</div>
			</div>
			<div class="flex items-center mt-[30px]">
				<div class="min-w-[126px]">
					<div class="text-text-primary text-style-web-h4-bold">6 {{ t('other.txt12') }}</div>
					<div class="mt-[4px] text-text-description text-style-web-small-regular">
						{{ t('other.txt13') }}
					</div>
				</div>
				<div class="min-w-[126px] ml-4">
					<div class="text-text-primary text-style-web-h4-bold">28 {{ t('other.txt14') }}</div>
					<div class="mt-[4px] text-text-description text-style-web-small-regular">
						24h {{ t('other.txt15') }}
					</div>
				</div>
				<div class="min-w-[126px] ml-4">
					<div class="text-text-primary text-style-web-h4-bold">700+</div>
					<div class="mt-[4px] text-text-description text-style-web-small-regular">
						{{ t('other.txt16') }}
					</div>
				</div>
			</div>
			<div class="mt-[40px]" v-if="!userStore.loginToken">
				<div class="flex items-center">
					<Input
						class="w-[291px] flex-1"
						input-class="rounded-[50px]"
						:placeholder="t('text54')"
						v-model="data.regVal" />
					<Button
						class="w-auto ml-4 !whitespace-nowrap text-always-white !px-[30px]"
						@click="goRegister">
						{{ t('other.txt17') }}
					</Button>
					<div
						class="ml-4 w-[50px] h-[50px] flex flex-shrink-0 items-center justify-center rounded-full bg-background-tertiary">
						<Download :type="2">
							<img src="/imgs/welcome/code.svg" class="h-[44px] w-[44px] cursor-pointer" />
						</Download>
					</div>
				</div>
				<NoticeBar
					class="bg-[transparent] mt-[10px] px-0 h-[26px] flex items-center"
					:closeIcon="false">
					<template v-slot:prefix>
						<svg
							width="16"
							height="17"
							viewBox="0 0 16 17"
							fill="none"
							xmlns="http://www.w3.org/2000/svg">
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M12.533 3.96172C12.533 2.74669 11.548 1.76172 10.333 1.76172C9.11795 1.76172 8.13298 2.74669 8.13298 3.96172V5.09505H7.86631V3.96172C7.86631 2.74669 6.88134 1.76172 5.66631 1.76172C4.45128 1.76172 3.46631 2.74669 3.46631 3.96172C3.46631 4.37627 3.58097 4.76404 3.78031 5.09505H2.53298C1.94387 5.09505 1.46631 5.57261 1.46631 6.16172V7.76172C1.46631 8.35082 1.94387 8.82839 2.53298 8.82839H2.79964V13.2284C2.79964 14.112 3.51598 14.8284 4.39964 14.8284H11.5996C12.4833 14.8284 13.1996 14.112 13.1996 13.2284V8.82839H13.4663C14.0554 8.82839 14.533 8.35082 14.533 7.76172V6.16172C14.533 5.57262 14.0554 5.09505 13.4663 5.09505H12.219C12.4183 4.76404 12.533 4.37627 12.533 3.96172ZM10.333 6.16172L8.53298 6.16172V7.76172H12.6663H13.1996H13.4663V6.16172L10.333 6.16172ZM10.333 2.82839C10.9589 2.82839 11.4663 3.3358 11.4663 3.96172C11.4663 4.58764 10.9589 5.09505 10.333 5.09505H9.19964V3.96172C9.19964 3.3358 9.70705 2.82839 10.333 2.82839ZM7.33298 6.16172L7.46631 6.16172V7.76172H3.33298H2.79964L2.53298 7.76172V6.16172H5.66631H7.33298ZM6.79964 3.96172V5.09505H5.66631C5.04039 5.09505 4.53298 4.58764 4.53298 3.96172C4.53298 3.3358 5.04039 2.82839 5.66631 2.82839C6.29223 2.82839 6.79964 3.3358 6.79964 3.96172ZM3.86631 8.82839V13.2284C3.86631 13.5229 4.10509 13.7617 4.39964 13.7617H7.46631V8.82839H3.86631ZM8.53298 13.7617V8.82839H12.133V13.2284C12.133 13.5229 11.8942 13.7617 11.5996 13.7617H8.53298Z"
								fill="black" />
						</svg>
					</template>
					<div class="ml-1 text-text-primary text-style-web-small-medium">
						<span>{{ t('other.txt18') }}</span>
						<span class="text-text-brand">1000 USDT</span>
						<span>{{ t('other.txt19') }}</span>
					</div>
				</NoticeBar>
			</div>
		</div>
		<div class="pr-[111px]">
			<img src="/imgs/welcome/coin_circle.svg" class="w-[312px] h-[360px]" />
		</div>
	</div>

	<div class="mt-[50px] mx-[16px] web:hidden">
		<div>
			<div class="text-web-900-small text-text-primary">
				<div class="flex items-center">
					<span>{{ data.text1 }}</span>
					<div class="relative">
						<span
							ref="coinDiv"
							class="text-brand-blue ml-[10px] fadeOutDown absolute fade-text"
							:class="data.text2 === 'ETH' ? 'text-function-buy' : 'text-brand-blue'">
							{{ data.text2 }}
						</span>
					</div>
				</div>
				<div class="mt-[40px]">
					{{ data.text3 }}
				</div>
			</div>
			<div class="flex items-center justify-between mt-[30px]">
				<div>
					<div class="text-text-primary text-style-web-h4-bold">28 {{ t('other.txt14') }}</div>
					<div class="mt-[4px] text-text-description text-style-web-body-regular">
						24h {{ t('other.txt15') }}
					</div>
				</div>
				<div>
					<div class="text-text-primary text-style-web-h4-bold">6 {{ t('other.txt12') }}</div>
					<div class="mt-[4px] text-text-description text-style-web-body-regular">
						{{ t('other.txt13') }}
					</div>
				</div>
				<div>
					<div class="text-text-primary text-style-web-h4-bold">700+</div>
					<div class="mt-[4px] text-text-description text-style-web-body-regular">
						{{ t('other.txt16') }}
					</div>
				</div>
			</div>
			<div v-if="!userStore.loginToken">
				<div class="flex justify-center py-[30px]">
					<img src="/imgs/welcome/coin_circle.svg" class="w-[208px] h-[240px]" />
				</div>
				<Input
					input-class="rounded-[50px]"
					:placeholder="t('text54')"
					v-model="data.regVal"
					@click="goRegister" />
				<div class="flex items-center pt-6">
					<Button @click="routeTo('register')">{{ t('other.txt17') }}</Button>
					<div
						class="ml-[19px] w-[50px] h-[50px] flex flex-shrink-0 items-center justify-center rounded-full bg-background-tertiary">
						<Download :type="2" placement="bottom">
							<img src="/imgs/welcome/code.svg" class="h-[44px] w-[44px] cursor-pointer" />
						</Download>
					</div>
				</div>
				<div class="pt-4">
					<NoticeBar class="bg-[transparent] px-0 h-[26px]" :closeIcon="false">
						<template v-slot:prefix>
							<img src="/gifs/welcome/gift.gif" class="w-[26px] h-[26px]" alt="" />
						</template>
						<div class="text-text-primary text-style-web-small-medium">
							<span>{{ t('other.txt18') }}</span>
							<span class="text-brand-blue">999 USDT</span>
							<span>{{ t('other.txt19') }}</span>
						</div>
					</NoticeBar>
				</div>
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { reactive, inject, onMounted, onBeforeUnmount, ref } from 'vue'
import { Input, Button } from '@/components/base'
import NoticeBar from '@/components/base/notice-bar/index.vue'
import { routeTo } from '@/utils/routeTo'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store/useUserStore'
import { setItem } from '@/utils/storage'
import Download from '@/components/Download.vue'

const { t } = useI18n()
const userStore = useUserStore()
const globalData = inject('globalData')
const coinDiv = ref()
const data = reactive({
	text1: `${t('option.txt1')}, ${t('option.txt2')}`, // option.txt1 home.txt8
	text2: 'BTC',
	text3: `${t('other.txt11')} ${globalData.appNameUpper}`,
	regVal: ''
})

const onAnimationEnd = () => {
	data.text2 = data.text2 === 'BTC' ? 'ETH' : 'BTC'
}

const goRegister = () => {
	if (data.regVal) {
		setItem('reg_value', data.regVal)
	}
	routeTo('register')
}
onMounted(() => {
	coinDiv.value.addEventListener('webkitAnimationIteration', onAnimationEnd)
	coinDiv.value.addEventListener('animationiteration', onAnimationEnd)
})

onBeforeUnmount(() => {
	coinDiv.value.removeEventListener('webkitAnimationIteration', onAnimationEnd)
	coinDiv.value.removeEventListener('animationiteration', onAnimationEnd)
})
</script>
<style scoped>
.rotate-image {
	width: 200px; /* 图片宽度可根据需要调整 */
	animation: rotateBackAndForth 3s infinite linear; /* 2秒为一个循环，线性旋转 */
	transform-origin: center; /* 设置旋转中心为图片的中心 */
}

@keyframes rotateBackAndForth {
	0% {
		transform: rotate(0deg); /* 从0度开始 */
	}
	50% {
		transform: rotate(-30deg); /* 逆时针旋转到-15度 */
	}
	100% {
		transform: rotate(0deg); /* 回到初始位置 */
	}
}

/* 定义关键帧动画 */
@keyframes fadeUp {
	0% {
		opacity: 0;
		transform: translateY(100%);
	}
	50% {
		opacity: 1;
		transform: translateY(50%);
	}
	100% {
		opacity: 0;
		transform: translateY(-100%);
	}
}

.fade-text {
	bottom: -100%; /* 初始在下方 */
	animation: fadeUp 4s infinite; /* 使用3秒的动画，循环播放 */
}
</style>
