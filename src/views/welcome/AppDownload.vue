<template>
	<div class="mt-[120px] flex items-center justify-center pdph:hidden">
		<img src="/imgs/welcome/app.svg" class="w-[249px] h-540px" />
		<div class="ml-[100px]">
			<div class="text-web-mega-bold text-text-primary">{{ t('other.txt40') }}</div>
			<div class="mt-[28px] text-web-h3-regular text-text-description">
				{{ t('other.txt41') }}，{{ globalData.appNameCFN }} App {{ t('other.txt60') }}
			</div>
			<div class="mt-[40px]">
				<div class="flex items-center">
					<!-- <img src="/imgs/welcome/crcode.svg" class="w-[180px] h-[180px]" /> -->
					<img :src="qrUrl" class="w-[180px] h-[180px]" />

					<div class="ml-[30px]">
						<div class="text-web-h3-regular text-text-description">{{ t('other.txt42') }}</div>
						<div class="mt-[16px] text-text-primary text-style-web-h3-bold">iOS & Android</div>
					</div>
				</div>
				<!-- <div class="mt-[40px] flex items-center">
					<div
						class="flex w-[160px] h-[48px] text-text-primary border-border-button_strong justify-center items-center border rounded-[53px]">
						<img src="/imgs/welcome/apple.svg" class="w-[22px] h-[22px]" />
						<span class="text-style-web-h2-medium justify-center ml-[10px]">AppStore</span>
					</div>
					<div
						class="flex ml-[24px] w-[171px] h-[48px] text-text-primary border-border-button_strong justify-center items-center border rounded-[53px]">
						<img src="/imgs/welcome/google_play.svg" class="w-[22px] h-[22px]" />
						<span class="text-style-web-h2-medium ml-[10px]">Google Play</span>
					</div>
				</div> -->
			</div>
		</div>
	</div>

	<div class="pt-[40px] web:hidden">
		<div>
			<div class="flex items-center justify-center w-full">
				<img src="/imgs/welcome/app.svg" class="w-[249px] h-540px" />
			</div>
			<!-- <div
				class="h-[144px] w-full"
				style="background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, #fff 100%)"></div> -->
			<div class="w-full bg-background-primary pt-[32px] pb-[40px]">
				<div class="text-always-black text-style-web-large-bold text-center">
					{{ t('other.txt40') }}
				</div>
				<div class="mt-4 text-center text-text-description text-style-web-h3-regular">
					{{ t('other.txt41') }}，{{ globalData.appNameCFN }} App {{ t('other.txt60') }}
				</div>
				<div class="py-[30px] flex justify-center">
					<!-- <img src="/imgs/welcome/crcode.svg" class="w-[150px] h-[150px]" /> -->
					<img :src="qrUrl" class="w-[150px] h-[150px]" />
				</div>
				<div class="text-text-description text-style-web-h3-regular text-center">
					{{ t('other.txt42') }}
				</div>
				<div class="text-text-primary text-style-web-h3-bold text-center mt-[10[px]]">
					iOS & Android
				</div>
				<!-- <div class="flex justify-center px-[17px] pt-[30px]">
					<div
						class="w-[170px] border rounded-[53px] text-text-primary border-border-button_strong cursor-pointer py-3 px-5 flex items-center">
						<img src="/imgs/welcome/apple.svg" class="w-[22px] h-[22px]" />
						<div class="text-style-web-h2-medium ml-[10px]">AppStore</div>
					</div>
					<div
						class="border ml-[18px] cursor-pointer text-text-primary border-border-button_strong rounded-[53px] py-3 px-[18px] flex items-center">
						<img src="/imgs/welcome/google_play.svg" class="w-[22px] h-[22px]" />
						<div class="text-style-web-h2-medium ml-[5px]">Google Play</div>
					</div>
				</div> -->
			</div>
		</div>
	</div>
</template>
<script lang="ts" setup>
import { inject, ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import qrcode from 'qrcode-generator'
import { useDevice } from '@/hooks/useDevice'
import { ANDROID_DONWLOAD, IOS_DONWLOAD } from '@/constants/index'

const globalData: any = inject('globalData')
const { t } = useI18n()
const { android, isWeb } = useDevice()

const qrData = ref(IOS_DONWLOAD)
const qrUrl = ref('')
const size = isWeb.value ? 20 : 20
const generateQRCode = () => {
	qrData.value = android.value ? ANDROID_DONWLOAD : IOS_DONWLOAD
	if (qrData.value) {
		const typeNumber = 4 // 二维码版本号，1-40，数值越大，二维码越复杂
		const errorCorrectionLevel = 'L' // 错误校正级别，可选值：'L', 'M', 'Q', 'H'
		const qr = qrcode(typeNumber, errorCorrectionLevel)
		qr.addData(qrData.value)
		qr.make()
		qrUrl.value = qr.createDataURL(size) // 4 是二维码的大小
	} else {
		qrUrl.value = ''
	}
}

onMounted(() => {
	generateQRCode()
})
</script>
