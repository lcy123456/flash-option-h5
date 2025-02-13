import { ref, onMounted, onUnmounted } from 'vue'
import _ from 'lodash-es'
interface callBackFn {
	(): void
}
export function useWindowResize(callback?: callBackFn) {
	const mq = ref('')
	const width = ref(document.body.offsetWidth)
	const isWeb = ref(false)
	const isPd = ref(false)
	const isPh = ref(false)
	const isMinPh = ref(false) // 小屏幕手机设备
	const ios = ref(false)
	const android = ref(false)
	function checkScreenWidth() {
		const mqlWeb = window.matchMedia('(min-width: 1200px)')
		const mqlPd = window.matchMedia('(min-width: 744px) and (max-width: 1200px)')
		const mqlPh = window.matchMedia('(max-width: 744px)')
		const mqlMINPh = window.matchMedia('(max-width: 420px)')

		width.value = document.body.offsetWidth
		if (mqlWeb.matches) {
			mq.value = 'web'
		} else if (mqlPd.matches) {
			mq.value = 'pd'
		} else if (mqlPh.matches) {
			mq.value = 'ph'
		}

		if (mqlMINPh.matches) {
			isMinPh.value = true
		}
		isWeb.value = mq.value === 'web'
		isPd.value = mq.value === 'pd'
		isPh.value = mq.value === 'ph'
		ios.value = /iphone|ipad|ipod|ios/i.test(window?.navigator.userAgent.toLocaleLowerCase())
		android.value = /android/i.test(window?.navigator.userAgent.toLocaleLowerCase())
	}
	checkScreenWidth()
	const onResize = _.throttle(() => {
		checkScreenWidth()
		typeof callback === 'function' && callback()
	}, 300)
	onMounted(() => {
		window.addEventListener('resize', onResize)
	})
	onUnmounted(() => {
		window.removeEventListener('resize', onResize)
	})
	return {
		isMinPh,
		mq,
		isWeb,
		isPd,
		isPh,
		ios,
		android,
		width
	}
}
