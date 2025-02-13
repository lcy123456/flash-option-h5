<template>
	<Breadcrumb :items="items" />
	<div class="py-[24px] px-[16px]">
		<div v-html="data.content"></div>
		<!-- <div>
			<div class="text-style-web-h5-medium text-text-secondary">
				{{ t('about.txt11').toUpperCase() }} {{ appName }}
			</div>
			<div class="mt-[10px] text-style-web-small-regular text-text-description">
				<p>
					{{ appName }}
					{{ t('about.txt2') }}
				</p>
				<p>
					{{ appName }}
					{{ t('about.txt3') }}
				</p>
				<p>
					{{ appName }}
					{{ t('about.txt4') }}
				</p>
			</div>
		</div>
		<div class="mt-[30px]">
			<div class="text-style-web-h5-medium text-text-secondary">
				{{ appName }} {{ t('about.txt12').toUpperCase() }}
			</div>
			<div class="mt-[10px] text-style-web-small-regular text-text-description">
				{{ t('about.txt5') }}
				{{ appName }}
				{{ t('about.txt6') }}
			</div>
		</div>
		<div class="mt-[30px]">
			<div class="text-style-web-h5-medium text-text-secondary">
				{{ appName }}
				{{ t('about.txt10').toUpperCase() }}
			</div>
			<div class="mt-[10px] text-style-web-small-regular text-text-description">
				{{ appName }}
				{{ t('about.txt7') }}
			</div>
		</div>
		<div class="mt-[30px]">
			<div class="text-style-web-h5-medium text-text-secondary">{{ t('about.txt8') }}</div>
			<div class="text-style-web-small-bold text-text-primary mt-[10px]">
				{{ t('about.txt9') }}:service@byxg.vip
			</div>
		</div> -->
	</div>
</template>
<script lang="ts" setup>
import { reactive, inject, computed } from 'vue'
import { Breadcrumb } from '@/components/base'
import { useI18n } from 'vue-i18n'
import { helpCateone } from '@/apis/other'

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
