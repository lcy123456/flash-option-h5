<script setup lang="ts">
import Top from './top/index.vue'
import SwapWs from './swap-ws/index.vue'
import Order from './order/index.vue'
import CreateOrder from './create-order/index.vue'
import { useDevice } from '@/hooks/useDevice'
const { isPC } = useDevice()
</script>
<template>
	<div class="pdph:pb-20">
		<Top />
		<SwapWs v-if="!isPC" />
		<Order />
		<CreateOrder v-if="!isPC" />
	</div>
</template>
