import { ref, onMounted, onUnmounted } from 'vue'

const useClickOutside = (elementRef: any, open: any, callback: () => void) => {
	const isClickOutside = ref(false)

	const handleClickOutside = (event: any) => {
		if (open.value) {
			if (elementRef.value && !elementRef.value.contains(event.target)) {
				isClickOutside.value = true
				callback()
			} else {
				isClickOutside.value = false
			}
		}
	}

	onMounted(() => {
		document.addEventListener('click', handleClickOutside)
	})

	onUnmounted(() => {
		document.removeEventListener('click', handleClickOutside)
	})

	return { isClickOutside }
}

export { useClickOutside }
