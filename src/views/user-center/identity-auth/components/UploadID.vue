<script setup lang="ts">
import { showLoadingToast } from '@/components/base/toast'
import { useI18n } from 'vue-i18n'
import { Upload } from '@/components/base'
import { uploadImg } from '@/apis/user'

const { t } = useI18n()
const modelValue: any = defineModel()

defineProps({
	title: {
		type: String,
		default: ''
	}
})

const afterRead = async (file: any) => {
	const toast = showLoadingToast(t('text161'))
	const res: any = await uploadImg(file.file)
	if (res.code === 0) {
		modelValue.value = res.data.url || ''
	}
	toast.close()
}
</script>

<template>
	<Upload
		class="__UploadID__ w-[100%]"
		:after-read="afterRead"
		accept="image/jpg, image/jpeg, image/png">
		<div
			class="pdph:h-[180px] web:h-[232px] w-full py-[50px] flex items-center justify-center px-4 border border-border-strong bg-background-secondary box-border rounded-[6px]">
			<img class="w-full h-full object-contain" v-if="modelValue" :src="modelValue" alt="" />
			<div v-else>
				<div class="w-11 h-11 mx-auto rounded-full bg-text-brand flex items-center justify-center">
					<icon name="user-center/icon24" :size="24" />
				</div>
				<div class="mt-4 text-text-secondary text-style-web-body-medium text-center">
					{{ title }}
				</div>
			</div>
		</div>
	</Upload>
</template>

<style lang="scss" scoped>
.__UploadID__ {
	margin-top: 12px;
	:deep(.van-uploader__input-wrapper) {
		width: 100%;
	}
}
</style>
