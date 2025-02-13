import { ref, onMounted, onUnmounted } from 'vue'
import moment from 'moment'

const useCountdown = () => {
	let endTime = moment()
	const todayActivityEndUtc = moment.utc().startOf('day').add(4, 'hours')

	const todayActivityEndLocal = moment.utc(todayActivityEndUtc).local()

	if (moment().isAfter(todayActivityEndLocal)) {
		const tomorrowActivityEndUtc = moment.utc().clone().add(1, 'day').startOf('day').add(4, 'hours')

		endTime = moment.utc(tomorrowActivityEndUtc).local()
	} else {
		endTime = todayActivityEndLocal
	}

	const getTime = () => {
		const duration = moment.duration(endTime.diff(moment()))
		return moment.utc(duration.asMilliseconds()).format('HH:mm:ss')
	}

	const formattedTime = ref(getTime())

	const countdown = () => {
		formattedTime.value = getTime()
		if (formattedTime.value === '00:00:00') {
			window.location.reload()
		}
	}

	const timer = setInterval(countdown, 1000)

	onMounted(() => {
		countdown()
	})

	onUnmounted(() => {
		clearInterval(timer)
	})

	return {
		formattedTime
	}
}

export default useCountdown
