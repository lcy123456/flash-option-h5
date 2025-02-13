// 模拟账户
import { showFailToast, showSuccessToast } from '@/components/base/toast'
import { switchUser } from '@/apis/user'
import { useUserStore } from '@/store/useUserStore'

export const useSimulation = () => {
	const userStore: any = useUserStore()

	const changeUser = async () => {
		const res: any = await switchUser()
		if (res.code === 0) {
			userStore.setUserInfo(res.data)
			userStore.setLoginToken(res.data.token)
			userStore.setSimulatedAccount(res.data.virtual)
			showSuccessToast(res.message)
		} else {
			showFailToast(res.message)
		}
	}

	return { changeUser }
}
