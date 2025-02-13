import { watch, onMounted, onUnmounted, ref } from 'vue'

export const useRootScrollStop = () => {
	const isStop = ref(false)
	watch(
		() => isStop.value,
		() => {
			if (isStop.value) {
				document.body.classList.add('scroll-stop')
			} else {
				document.body.classList.remove('scroll-stop')
			}
		}
	)

	onMounted(() => {
		if (isStop.value) {
			document.body.classList.add('scroll-stop')
		} else {
			document.body.classList.remove('scroll-stop')
		}
	})

	onUnmounted(() => {
		document.body.classList.remove('scroll-stop')
	})

	return { isStop }
}
