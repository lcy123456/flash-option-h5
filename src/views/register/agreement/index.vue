<script setup lang="ts">
import { reactive, onBeforeMount, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Breadcrumb, Loading } from '@/components/base'
import { getCateOne } from '@/apis/user'

const { t } = useI18n()
const agreementInfo: any = ref({})
const loading = ref(true)

const items = reactive([
	{
		title: t('home.txt2'),
		path: '/register'
	},
	{
		title: t('text49')
	}
])

onBeforeMount(() => {
	getCateOne({ cate: 8 }).then((res: any) => {
		if (res.code === 0 && res.data) {
			agreementInfo.value = res.data
		}
		loading.value = false
	})
})
</script>

<template>
	<Breadcrumb :items="items" />
	<div class="py-6 px-4">
		<Loading v-model:loading="loading" />
		<div v-html="agreementInfo?.content"></div>
	</div>
</template>
