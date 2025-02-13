<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { showSuccessToast, showFailToast } from '@/components/base/toast'
import { PopupBottom, Upload, Dialog, Button } from '@/components/base'
import { useUserStore } from '@/store/useUserStore'
import { setAvatar, uploadImg } from '@/apis/user'
import { useDevice } from '@/hooks/useDevice'

const { isPh } = useDevice()
const { t } = useI18n()
const show = defineModel('show', { default: false })

const userStore: any = useUserStore()
const imgUrl = ref('')

const afterRead = async (file: any) => {
	const res: any = await uploadImg(file.file)
	if (res.code === 0) {
		imgUrl.value = res.data.url || ''
	}
}

const setUserAvatar = async () => {
	if (imgUrl.value) {
		const res: any = await setAvatar({ url: imgUrl.value })
		if (res.code === 0) {
			show.value = false
			imgUrl.value = ''
			userStore.getUserInfo()
			showSuccessToast({
				message: t('my.txt79'),
				zIndex: 9999
			})
		} else {
			showFailToast({
				message: res.message,
				zIndex: 9999
			})
		}
	}
}
</script>

<template>
	<PopupBottom v-if="isPh" :title="t('my.txt84')" height="390px" v-model:show="show">
		<div class="my-3 py-6 px-4">
			<div class="w-[80px] h-80px rounded-full overflow-hidden bg-text-primary mx-auto">
				<img
					class="w-full h-full object-cover"
					:src="imgUrl ? imgUrl : userStore.userInfo?.avatar"
					alt="" />
			</div>
			<div class="py-3 flex justify-center">
				<Upload :after-read="afterRead">
					<van-button
						plain
						type="primary"
						class="!min-w-[158px] !h-[42px] border-border-button_strong !text-text-primary text-style-web-body-bold">
						{{ t('my.txt85') }}
					</van-button>
				</Upload>
			</div>
			<div class="text-text-tertiary text-style-web-small-regular text-center">
				{{ t('my.txt86') }}
			</div>
		</div>

		<template #bottom>
			<van-button
				@click="setUserAvatar"
				round
				block
				:disabled="!imgUrl"
				type="primary"
				class="!h-[42px] text-text-inverse-primary text-style-web-body-bold">
				{{ t('my.txt87') }}
			</van-button>
		</template>
	</PopupBottom>

	<Dialog v-else :title="t('my.txt84')" v-model:show="show" width="390px">
		<div class="py-[36px] px-4">
			<div class="w-[80px] h-80px rounded-full overflow-hidden bg-text-primary mx-auto">
				<img
					class="w-full h-full object-cover"
					:src="imgUrl ? imgUrl : userStore.userInfo?.avatar"
					alt="" />
			</div>
			<div class="py-3 flex justify-center">
				<Upload :after-read="afterRead">
					<Button plain size="small" class="!min-w-[158px]">
						{{ t('my.txt85') }}
					</Button>
				</Upload>
			</div>
			<div class="text-text-tertiary text-style-web-small-regular text-center">
				{{ t('my.txt86') }}
			</div>
		</div>
		<div class="py-5 px-4 border-t border-border-strong">
			<Button @click="setUserAvatar" :disabled="!imgUrl" size="small">{{ t('my.txt87') }}</Button>
		</div>
	</Dialog>
</template>
