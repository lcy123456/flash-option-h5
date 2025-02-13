import { ref, onBeforeMount } from 'vue'
import { getItem } from '@/utils/storage'

export const useIsApp = () => {
	const isApp = ref(false)
	onBeforeMount(() => {
		isApp.value = getItem('isApp')
	})

	return { isApp }
}
