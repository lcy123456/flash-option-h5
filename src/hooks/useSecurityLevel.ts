import { computed } from 'vue'
import { useUserStore } from '@/store/useUserStore'

export const useSecurityLevel = () => {
	const userStore = useUserStore()

	const securityLevel = computed(() => {
		const data = {
			lable: '',
			level: userStore.userInfo.realNameStatus,
			textClass: '',
			bgClass: '',
			isAuth: false
		}
		switch (userStore.userInfo.realNameStatus) {
			case 0:
				data.lable = '低'
				data.textClass = 'text-text-error'
				data.bgClass = 'text-text-error'
				break
			case 1:
				data.lable = '中'
				data.textClass = 'text-text-warning'
				data.bgClass = 'bg-text-warning'
				break
			case 2:
				data.lable = '高'
				data.isAuth = true
				data.textClass = 'text-text-success'
				data.bgClass = 'bg-text-success'
				break
			default:
				break
		}
		return data
	})

	return { securityLevel }
}
