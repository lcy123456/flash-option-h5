import { ref, onBeforeMount } from 'vue'
// import { getCountry } from '@/apis/login'

export const useData = () => {
	const country = ref([])

	onBeforeMount(async () => {
		// const data = await getCountry()
		// country.value = data.data
		// console.log('data', data)
	})

	return { country }
}
