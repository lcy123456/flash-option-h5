<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
const show = defineModel('show', { default: false })
import { InputCountDown, InputPaste, Tabs } from '@/components/base'
const { t } = useI18n()
const active = ref(1)

const items = reactive([
	{
		title: '邮箱验证',
		id: 1
	},
	{
		title: '手机',
		id: 2
	},
	{
		title: '谷歌验证',
		id: 3
	}
])
</script>

<template>
	<van-dialog v-model:show="show" :show-confirm-button="false" class="w-[390px] !rounded-lg">
		<div>
			<div class="py-5 px-4 flex justify-between items-center">
				<div class="text-text-primary text-style-web-h3-bold">{{ t('text33') }}</div>
				<base-icon @click="show = false" name="user-center/icon23" :size="24" />
			</div>
			<div class="px-4 pb-6">
				<Tabs :items="items" v-model:active="active">
					<template v-slot="props">
						<div class="pt-6">
							<div v-if="props.active === 1">
								<InputCountDown placeholder="请输入邮箱验证码" />
							</div>
							<div v-if="props.active === 2">
								<InputCountDown placeholder="请输入手机验证码" />
							</div>
							<div v-if="props.active === 3">
								<InputPaste placeholder="请输入手机验证码" />
							</div>
						</div>
					</template>
				</Tabs>
			</div>
		</div>
	</van-dialog>
</template>
