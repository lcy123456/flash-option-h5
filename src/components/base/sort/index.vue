<script setup lang="ts">
const state = defineModel('state', { default: 0 }) // 0 不排序， 1 升序，2 降序

const change = () => {
	if (state.value === 0) {
		state.value = 1
		return
	}
	if (state.value === 1) {
		state.value = 2
		return
	}
	if (state.value === 2) {
		state.value = 0
		return
	}
}
</script>

<template>
	<div class="flex items-center" @click="change">
		<div>
			<slot />
		</div>
		<div class="ml-[2px]">
			<div>
				<svg xmlns="http://www.w3.org/2000/svg" width="6" height="4" viewBox="0 0 6 4" fill="none">
					<path d="M3 0L5.59808 3.75H0.401924L3 0Z" :fill="state === 1 ? '#1754F8' : '#B9C3DF'" />
				</svg>
			</div>
			<div class="mt-[2px]">
				<svg xmlns="http://www.w3.org/2000/svg" width="6" height="4" viewBox="0 0 6 4" fill="none">
					<path d="M3 4L5.59808 0.25H0.401924L3 4Z" :fill="state === 2 ? '#1754F8' : '#B9C3DF'" />
				</svg>
			</div>
		</div>
	</div>
</template>
