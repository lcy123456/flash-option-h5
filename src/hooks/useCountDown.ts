import { ref } from 'vue'

/**
 * @description 倒计时
 */
export function countDownFn(defaultTime?: number) {
	const initialCountDown = defaultTime ? defaultTime : 60

	const countDown = ref(initialCountDown)
	const isCounting = ref(false)
	const reClick = ref(false)
	let timer: ReturnType<typeof setInterval> | null | ReturnType<typeof setTimeout> = null

	const startCountDown = (val: number = initialCountDown) => {
		if (!isCounting.value) {
			countDown.value = val
			isCounting.value = true
			reClick.value = true
			timer = setInterval(() => {
				countDown.value--
				if (countDown.value === 0 && timer !== null) {
					clearInterval(timer)
					isCounting.value = false
				}
			}, 1000)
		}
	}

	const clearCountDown = () => {
		if (isCounting.value && timer !== null) {
			clearInterval(timer)
			timer = null
			isCounting.value = false
			countDown.value = 0
		}
	}
	const formatCountTime = (value: any) => {
		// 计算剩余时间的毫秒数
		let secondTime = parseInt(value) // 秒
		let minuteTime = 0 // 分
		let hourTime = 0 // 小时
		if (secondTime > 60) {
			//如果秒数大于60，将秒数转换成整数
			//获取分钟，除以60取整数，得到整数分钟
			minuteTime = parseInt(secondTime / 60)
			//获取秒数，秒数取佘，得到整数秒数
			secondTime = parseInt(secondTime % 60)
			//如果分钟大于60，将分钟转换成小时
			if (minuteTime > 60) {
				//获取小时，获取分钟除以60，得到整数小时
				hourTime = parseInt(minuteTime / 60)
				//获取小时后取佘的分，获取分钟除以60取佘的分
				minuteTime = parseInt(minuteTime % 60)
			}
		}
		function s(t) {
			return t < 10 ? `0${t}` : t
		}
		return `${s(hourTime)}:${s(minuteTime)}:${s(secondTime)}`
	}
	// 导出倒计时秒数和两个方法
	return { countDown, startCountDown, clearCountDown, isCounting, reClick, formatCountTime }
}
