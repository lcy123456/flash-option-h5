<script setup lang="ts">
import Top from './top/index.vue'
// import TradeWs from './trade-ws/index.vue'
import Order from './order/index.vue'
import CreateOrder from './create-order/index.vue'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
</script>
<template>
	<div class="pb-20">
		<Top />
		<!-- <TradeWs /> -->
		<Order />
		<CreateOrder v-if="!isPC" />
	</div>
</template>
