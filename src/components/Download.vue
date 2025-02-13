<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import qrcode from 'qrcode-generator'
import { IOS_DONWLOAD } from '@/constants/index'

const { t } = useI18n()
const props = defineProps({
	type: {
		type: Number,
		default: 1
	},
	placement: {
		type: String,
		default: 'right'
	}
})
const qrData = ref(IOS_DONWLOAD)
const qrUrl = ref('')
const size = 20
const generateQRCode = () => {
	// qrData.value = android.value ? ANDROID_DONWLOAD : IOS_DONWLOAD
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
<template>
	<el-popover
		:show-arrow="false"
		v-if="type === 1"
		popper-class="!rounded-[8px] !w-[286px] !min-h-[132px] !bg-background-window !border-background-primary"
		placement="bottom-end"
		trigger="hover"
		:offset="20">
		<div class="flex items-center justify-center">
			<!-- <div class="px-[30px] flex items-center"> -->
			<img class="w-[100px] h-[100px]" :src="qrUrl" alt="" />
			<div class="ml-[16px]">
				<div class="text-text-description text-style-web-h3-regular">{{ t('other.txt42') }}</div>
				<div class="mt-[16px] text-text-primary text-style-web-h3-bold">ios & Android</div>
			</div>
			<!-- </div> -->
		</div>
		<template #reference>
			<slot />
		</template>
	</el-popover>

	<el-popover
		:show-arrow="false"
		v-if="type === 2"
		popper-class="!rounded-[8px] !w-[112px] !min-h-[144px] !bg-background-window !border-background-primary"
		:placement="placement"
		trigger="hover"
		:offset="20">
		<div class="flex items-center justify-center flex-col overflow-hidden">
			<!-- <div class="px-[30px] flex items-center"> -->
			<img class="w-[80px] h-[80px]" :src="qrUrl" alt="" />
			<div class="break-words text-center text-text-description text-style-web-xsmall-regular mt-1">
				{{ t('other.txt42') }}
			</div>
			<div class="text-text-primary text-style-web-xsmall-regular">ios & Android</div>
			<!-- </div> -->
		</div>
		<template #reference>
			<slot />
		</template>
	</el-popover>
</template>
