import routeObj from '@/router/index'
import { useDevice } from '@/hooks/useDevice'
import { useAppStore } from '@/store/useAppStore'
import { useUserStore } from '@/store/useUserStore'

export const routeTo = (val: string | object, params?: object) => {
	if (val === '/my/transfer') {
		const userStore = useUserStore()
		if (!userStore.loginToken) {
			routeTo('/login')
			return
		}

		const { isWeb } = useDevice()
		if (isWeb.value) {
			const appStore = useAppStore()
			appStore.transferVisible = true
			return
		}
	}
	// else if (val === '/notice') {
	// 	const { isWeb } = useDevice()
	// 	if (isWeb.value) {
	// 		const appStore = useAppStore()
	// 		appStore.noticeVisible = true
	// 		return
	// 	}
	// }
	// else if (val === '/activitycenter') {
	// 	const { isWeb } = useDevice()
	// 	if (isWeb.value) {
	// 		const appStore = useAppStore()
	// 		appStore.activityVisible = true
	// 		return
	// 	}
	// }
	const router = routeObj
	if (typeof val === 'string') {
		if (val.startsWith('/')) {
			router.push(val)
			console.log('val,params=====')
		} else {
			if (params) {
				router.push({
					name: val,
					...params
				})
			} else {
				router.push({
					name: val
				})
			}
		}
	} else if (val && Object.prototype.toString.call(val) === '[object Object]') {
		router.push(val)
	}
}

export const toLogin = () => {
	const router = routeObj
	router.push('/login?redirect=' + router.currentRoute.value.path)
}
