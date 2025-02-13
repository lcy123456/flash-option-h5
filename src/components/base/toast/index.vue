<script lang="ts" setup>
import { ref, onBeforeUnmount, onBeforeMount } from 'vue'

const timer = ref()
const open = ref(true)

const props = defineProps({
	msg: {
		type: String,
		default: ''
	},
	type: {
		type: String,
		default: ''
	},
	show: {
		type: Boolean,
		default: false
	},
	duration: {
		type: Number,
		default: 0
	}
})

onBeforeMount(() => {
	timer.value = setTimeout(() => {
		open.value = false
	}, props.duration)
})

onBeforeUnmount(() => {
	clearTimeout(timer.value)
})
</script>

<template>
	<div
		v-if="show"
		class="w-[100vw] fixed top-[88px] z-9999 flex justify-center pointer-events-none">
		<div
			:class="open ? '' : 'leave'"
			class="py-4 px-[30px] pointer-events-auto flex items-center rounded-lg border-[1px] border-border-strong bg-background-tertiary move_1">
			<svg
				v-if="type === 'success'"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none">
				<circle
					cx="12"
					cy="12"
					r="10"
					transform="rotate(90 12 12)"
					fill="#1754F8"
					stroke="#1754F8"
					stroke-width="2" />
				<path
					d="M17.3501 9L10.7501 15L7.1501 11.4"
					stroke="white"
					stroke-width="2"
					stroke-linecap="round" />
			</svg>
			<svg
				v-if="type === 'error'"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M23 12C23 18.0751 18.0751 23 12 23C5.92487 23 1 18.0751 1 12C1 5.92487 5.92487 1 12 1C18.0751 1 23 5.92487 23 12ZM16.3738 7.62623C16.7643 8.01675 16.7643 8.64992 16.3738 9.04044L13.4142 12L16.3738 14.9596C16.7643 15.3501 16.7643 15.9832 16.3738 16.3738C15.9832 16.7643 15.3501 16.7643 14.9596 16.3738L12 13.4142L9.04044 16.3738C8.64992 16.7643 8.01675 16.7643 7.62623 16.3738C7.2357 15.9832 7.2357 15.3501 7.62623 14.9596L10.5858 12L7.62623 9.04044C7.2357 8.64992 7.2357 8.01675 7.62623 7.62623C8.01675 7.2357 8.64992 7.2357 9.04044 7.62623L12 10.5858L14.9596 7.62623C15.3501 7.2357 15.9832 7.2357 16.3738 7.62623Z"
					fill="#F1606D" />
			</svg>
			<svg
				v-if="type === 'tip'"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M23 11C23 17.0751 18.0751 22 12 22C5.92487 22 1 17.0751 1 11C1 4.92487 5.92487 0 12 0C18.0751 0 23 4.92487 23 11ZM12 17.1111C11.325 17.1111 10.7778 16.5639 10.7778 15.8889L10.7778 11C10.7778 10.325 11.325 9.77778 12 9.77778C12.675 9.77778 13.2222 10.325 13.2222 11V15.8889C13.2222 16.5639 12.675 17.1111 12 17.1111ZM10.7778 7.33333C10.7778 8.00835 11.325 8.55556 12 8.55556C12.675 8.55556 13.2222 8.00835 13.2222 7.33333V6.11111C13.2222 5.4361 12.675 4.88889 12 4.88889C11.325 4.88889 10.7778 5.4361 10.7778 6.11111V7.33333Z"
					fill="#FF9142" />
			</svg>

			<svg
				v-if="type === 'loading'"
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none">
				<path
					fill-rule="evenodd"
					clip-rule="evenodd"
					d="M12 23C18.0751 23 23 18.0751 23 12C23 5.92487 18.0751 1 12 1C5.92487 1 1 5.92487 1 12C1 18.0751 5.92487 23 12 23ZM12.0001 5.39997C12.0001 4.79246 11.5076 4.29997 10.9001 4.29997C10.2926 4.29997 9.80012 4.79246 9.80012 5.39997V13.1V14.2H10.9001H16.4001C17.0076 14.2 17.5001 13.7075 17.5001 13.1C17.5001 12.4925 17.0076 12 16.4001 12H12.0001V5.39997Z"
					fill="#B9C3DF" />
			</svg>
			<div class="ml-2 text-text-primary text-style-web-body-medium">{{ msg }}</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.leave {
	opacity: 0;
	transition: opacity 0.5s;
}

.move_1 {
	animation: move_1 0.3s;
}
@keyframes move_1 {
	0% {
		-webkit-transform: translateY(-88px);
		opacity: 0;
	}
}

.jelly_scale_1 {
	animation: jelly_scale_1 1s linear;
}

@keyframes jelly_scale_1 {
	0% {
		transform: translateX(-50%);
		transform: matrix3d(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
		opacity: 0;
	}
	3.4% {
		transform: matrix3d(0.316, 0, 0, 0, 0, 0.407, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	4.7% {
		transform: matrix3d(0.45, 0, 0, 0, 0, 0.599, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	6.81% {
		transform: matrix3d(0.659, 0, 0, 0, 0, 0.893, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	9.41% {
		transform: matrix3d(0.883, 0, 0, 0, 0, 1.168, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	10.21% {
		transform: matrix3d(0.942, 0, 0, 0, 0, 1.226, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	13.61% {
		transform: matrix3d(1.123, 0, 0, 0, 0, 1.332, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	14.11% {
		transform: matrix3d(1.141, 0, 0, 0, 0, 1.331, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	17.52% {
		transform: matrix3d(1.208, 0, 0, 0, 0, 1.239, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
		opacity: 1;
	}
	18.72% {
		transform: matrix3d(1.212, 0, 0, 0, 0, 1.187, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	21.32% {
		transform: matrix3d(1.196, 0, 0, 0, 0, 1.069, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	24.32% {
		transform: matrix3d(1.151, 0, 0, 0, 0, 0.96, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	25.23% {
		transform: matrix3d(1.134, 0, 0, 0, 0, 0.938, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	29.03% {
		transform: matrix3d(1.063, 0, 0, 0, 0, 0.897, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	29.93% {
		transform: matrix3d(1.048, 0, 0, 0, 0, 0.899, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	35.54% {
		transform: matrix3d(0.979, 0, 0, 0, 0, 0.962, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	36.74% {
		transform: matrix3d(0.972, 0, 0, 0, 0, 0.979, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	41.04% {
		transform: matrix3d(0.961, 0, 0, 0, 0, 1.022, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	44.44% {
		transform: matrix3d(0.966, 0, 0, 0, 0, 1.032, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	52.15% {
		transform: matrix3d(0.991, 0, 0, 0, 0, 1.006, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	59.86% {
		transform: matrix3d(1.006, 0, 0, 0, 0, 0.99, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	63.26% {
		transform: matrix3d(1.007, 0, 0, 0, 0, 0.992, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	75.28% {
		transform: matrix3d(1.001, 0, 0, 0, 0, 1.003, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	85.49% {
		transform: matrix3d(0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	90.69% {
		transform: matrix3d(0.999, 0, 0, 0, 0, 0.999, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
	100% {
		transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
	}
}
</style>
