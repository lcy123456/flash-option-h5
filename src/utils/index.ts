import BigNumber from 'bignumber.js'
import { DEFAULT_LANG } from '@/constants'
import { useRouter, useRoute } from 'vue-router'

/**
 * 加法
 * @param a
 * @param b
 */
export function plus(a: number | string, b: number | string) {
	const num1 = new BigNumber(a)
	const num2 = new BigNumber(b)

	return num1.plus(num2)
}

/**
 * 减法
 * @param a
 * @param b
 */
export function minus(a: number | string, b: number | string) {
	const num1 = new BigNumber(a)
	const num2 = new BigNumber(b)

	return num1.minus(num2)
}

/**
 * 乘法
 * @param {*} a
 * @param {*} b
 */
export function mul(a: number | string, b: number | string) {
	const x = new BigNumber(a)
	const y = x.multipliedBy(b) // '1.8'
	return y
}

/**
 * 除法
 * @param {*} a
 * @param {*} b
 */
export function div(a: number | string, b: number | string) {
	const x = new BigNumber(a)
	const y = new BigNumber(b) // '1.8'
	return x.dividedBy(y)
}

export function startSilce(str = '') {
	return str.slice(0, str.length - 5)
}
export function endSilce(str = '') {
	return str.slice(str.length - 5)
}

/**
 *
 * @param chg 涨跌幅显示
 * @returns
 */
export function formatChange(chg: number) {
	if (!chg) return '--'
	let percentage: any = chg * 100

	if (percentage > 0 && percentage < 0.01) {
		percentage = 0.01
	} else if (percentage < 0 && percentage > -0.01) {
		percentage = -0.01
	}

	const sign = percentage >= 0 ? '+' : '-'
	percentage = Math.abs(percentage).toFixed(2)

	return `${sign}${percentage}%`
}

/**
 * 小数点后保留几位
 * @param {number} num - 数值
 * @param {number} place - 保留几位
 * @return {number}
 * ```
 */
export const toFixed = (num: number, place: number): number => {
	if (Number.isNaN(num)) {
		return 0
	}
	if (num === undefined) {
		return 0
	}
	num = scientificNotationToString(num)
	const numberStr = num.toString()
	const dotIndex = numberStr.indexOf('.')
	const decimalLength = dotIndex === -1 ? 0 : numberStr.length - dotIndex - 1

	if (decimalLength <= place) {
		return num
	}

	const truncatedDecimal = numberStr.substr(0, dotIndex + place + 1)

	return Number(truncatedDecimal)
}

const scientificNotationToString = (param: any) => {
	const strParam: any = String(param)
	const flag = /[eE]/.test(strParam)
	if (!flag) return param

	let sysbol = true
	if (/[eE]-/.test(strParam)) {
		sysbol = false
	}
	const index = Number(strParam.match(/\d+$/)[0])

	const basis = strParam.match(/^[\d\.]+/)[0].replace(/\./, '')

	if (sysbol) {
		return basis.padEnd(index + 1, 0)
	} else {
		return basis.padStart(index + basis.length, 0).replace(/^0/, '0.')
	}
}

/* 防抖
 * @param {*} fn
 * @param {*} delay
 * @returns
 */
export const debounce = (fn: any, delay: number = 200) => {
	let timer: any
	// 闭包
	return (...args: any[]) => {
		// 判断还在定时，说明当前正在一个计时过程中，并且又触发了相同事件。所以要取消当前的计时，重新开始计时
		if (timer) {
			clearTimeout(timer)
		}
		timer = setTimeout(() => {
			timer = null
			return fn(...args)
		}, delay)
	}
}

/**
 * 截流
 * @param {*} func
 * @param {*} delay
 * @returns
 */
// 节流 定时器 + 时间戳
export const throttle = (func: any, delay: number = 200) => {
	// 第一次触发时间戳
	let startTime = Date.now()
	return (...args: any[]) => {
		// 再次触发时间
		const curTime = Date.now()
		// 间隔时间 = 延迟的时间 - （再次触发时间戳 - 第一次触发时间戳）
		const interval = delay - (curTime - startTime)
		if (interval <= 0) {
			// 重新计算开始时间
			startTime = Date.now()
			return func(...args)
		}
	}
}
export function calculatePercentageAmount(inputNumber: number, finalAmount: number) {
	// 确保输入数字在0到100之间
	if (inputNumber >= 0 && inputNumber <= 100) {
		// 转换为百分比并计算最终金额
		const percentage = inputNumber / 100
		const calculatedAmount = toFixed(Number(mul(percentage, finalAmount).toString()), 2)
		return calculatedAmount
	} else {
		// 如果输入的数字不在0到100的范围内，返回错误或默认值
		throw new Error('Input number must be between 0 and 100.')
	}
}

// 获取权限并复制文本到剪贴板
export const pasteText = () => {
	// 请求剪贴板权限
	return navigator.clipboard.readText()
}

export const getLangContrast = () => {
	const lang = localStorage.getItem('language') || DEFAULT_LANG
	const messages: any = {
		zh_CN: 'zhCn',
		zh_HK: 'zhHk',
		en_US: 'enUs',
		ja_JP: 'jaJp',
		ko_KR: 'koKr',
		de_DE: 'deDe',
		fr_FR: 'frFr',
		it_IT: 'itIt',
		es_ES: 'esEs',
		hi_IN: 'hiIn',
		pt_PT: 'ptPt',
		vi_VN: 'viVn',
		in_ID: 'inId',
		ms_MY: 'msMy'
	}
	return messages[lang]
}

export const colorChange = (num: any) => {
	num = Number(num)
	if (num < 0) {
		return 'text-function-sell'
	} else {
		return 'text-function-buy'
	}
}

export const isEmail = (str: string) => {
	return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
		str
	)
}

export const isPhone = (str: string) => {
	return /^[+]{0,1}(\d+)$/.test(str)
}

/**
 * 从中间截断字符串
 * @param str
 * @returns
 */
export function splitStringAtMiddle(str: string, endNum?: number) {
	if (!endNum) {
		endNum = Math.floor(str.length / 2)
	}
	const middleIndex = endNum
	const firstPart = str.slice(0, middleIndex)
	const secondPart = str.slice(middleIndex)
	return [firstPart, secondPart]
}

/**
 * 判断是否为移动端
 */
export const isMobile = (): boolean => {
	if (
		window.navigator.userAgent.match(
			/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i
		)
	) {
		return true // 移动端
	} else {
		return false // PC端
	}
}

/**
 * 设置TV刻度值
 * @param currentPeriod
 */
export function getTVInterval(currentPeriod: string) {
	switch (currentPeriod) {
		case '1min': {
			return '1'
		}
		case '5min': {
			return '5'
		}
		case '15min': {
			return '15'
		}
		case '30min': {
			return '30'
		}
		case '60min': {
			return '60'
		}
		case '4hour': {
			return '240'
		}
		case '1day': {
			return '1D'
		}
		case '1week': {
			return '1W'
		}
		case '1month': {
			return '1M'
		}
		default:
			return '15'
	}
}

/*
 * 获取TV语言
 */
export const getTVLang = () => {
	const lang = localStorage.getItem('language') || DEFAULT_LANG
	const messages: any = {
		zh_CN: 'zh',
		zh_HK: 'zh_TW',
		en_US: 'en',
		ja_JP: 'ja',
		ko_KR: 'ko',
		de_DE: 'de_DE',
		fr_FR: 'fr',
		it_IT: 'it',
		es_ES: 'es',
		// hi_IN: 'hiIn',
		pt_PT: 'pt',
		vi_VN: 'vi'
		// in_ID: 'inId',
		// ms_MY: 'msMy'
		// az_AZ: 'msMy',
	}
	return messages[lang] || 'en'
}
