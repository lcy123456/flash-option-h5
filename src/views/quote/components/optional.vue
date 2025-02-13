<script setup lang="ts">
import useQuoteStore from '@/hooks/useQuoteStore'
const quoteStore = useQuoteStore()
</script>
<template>
	<div class="flex items-center mt-3 mx-4">
		<div
			v-for="item in quoteStore.state.marketList"
			:key="item.value"
			class="px-2 py-[2px] text-style-web-small-medium mr-[10px] rounded-md cursor-pointer"
			@click="quoteStore.handleOptional(item)"
			:class="
				quoteStore.state.optActive === item.value
					? 'text-text-primary  bg-background-tertiary'
					: 'text-text-description  bg-background-secondary'
			">
			{{ item.label }}
		</div>
	</div>
</template>
