<template>
	<Header v-if="!isApp" />
	<SimulatedTips />
	<router-view></router-view>
	<Footer v-if="!isApp&&isHiddenFooter" />
</template>
<script lang="ts" setup>
import Header from '@/components/Header.vue'
import SimulatedTips from '@/components/SimulatedTips.vue'
import { useIsApp } from '@/hooks/useIsApp'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { computed } from 'vue';
const router = useRouter()

const isHiddenFooter = computed(() => {
	return !router.currentRoute.value.meta?.hiddenFooter
})
const { isApp } = useIsApp()
</script>
