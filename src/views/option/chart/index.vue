<script setup lang="ts">
import klinechart from './main.vue'
import { useDevice } from '@/hooks/useDevice'

const { isWeb } = useDevice()
</script>
<template>
	<div :class="isWeb ? 'h-full border-r-[2px] border-border-gutter' : ''">
		<div class="mt-[16px]">
			<klinechart />
		</div>
	</div>
</template>
