import { createApp } from 'vue'
import {
	showSuccessToast as _showSuccessToast,
	showFailToast as _showFailToast,
	showToast as _showToast,
	showLoadingToast as _showLoadingToast
} from 'vant'
import Toast from './index.vue'
import { isMobile } from '@/utils'

const _duration = 2000
const _delay = 500

const _analyzeParams = (options: any) => {
	let msg = ''
	let duration = _duration
	if (options?.message) {
		msg = options.message
		if (options.duration) {
			duration = options.duration
		}
	} else {
		msg = options
	}
	return { msg, duration }
}

const showToast = (options: any) => {
	if (isMobile()) {
		_showToast(options)
		return
	}

	const { msg, duration } = _analyzeParams(options)

	const div: any = document.createElement('div')
	const componentInstance = createApp(Toast, {
		show: true,
		type: 'tip',
		msg,
		duration
	})

	componentInstance.mount(div)
	document.body.appendChild(div)

	let timer: any = null
	clearTimeout(timer)
	timer = setTimeout(() => {
		componentInstance.unmount()
		document.body.removeChild(div)
	}, duration + _delay)
}

const showSuccessToast = (options: any) => {
	if (isMobile()) {
		_showSuccessToast(options)
		return
	}

	const { msg, duration } = _analyzeParams(options)

	const div: any = document.createElement('div')
	const componentInstance = createApp(Toast, {
		show: true,
		type: 'success',
		msg,
		duration
	})

	componentInstance.mount(div)
	document.body.appendChild(div)

	let timer: any = null
	clearTimeout(timer)
	timer = setTimeout(() => {
		componentInstance.unmount()
		document.body.removeChild(div)
	}, duration + _delay)
}

const showFailToast = (options: any) => {
	if (isMobile()) {
		_showFailToast(options)
		return
	}

	const { msg, duration } = _analyzeParams(options)

	const div: any = document.createElement('div')
	const componentInstance = createApp(Toast, {
		show: true,
		type: 'error',
		msg,
		duration
	})

	componentInstance.mount(div)
	document.body.appendChild(div)

	let timer: any = null
	clearTimeout(timer)
	timer = setTimeout(() => {
		componentInstance.unmount()
		document.body.removeChild(div)
	}, duration + _delay)
}

const showLoadingToast = (options: any) => {
	if (isMobile()) {
		return _showLoadingToast(options)
	}
	const { msg, duration } = _analyzeParams(options)
	const div: any = document.createElement('div')
	const componentInstance = createApp(Toast, {
		show: true,
		type: 'loading',
		msg,
		duration
	})
	componentInstance.mount(div)
	document.body.appendChild(div)

	return {
		close: () => {
			componentInstance.unmount()
			document.body.removeChild(div)
		}
	}
}

export { showToast, showSuccessToast, showFailToast, showLoadingToast }
