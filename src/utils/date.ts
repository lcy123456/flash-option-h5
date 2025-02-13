import dayjs from 'dayjs'
import { TIME_ZONE } from '@/constants/config'
/**
 * 时间格式化
 * @param  time - 时间 时间戳
 * @param  format - 转换格式
 * @returns
 */
export const formatTime = (time: any, format = 'YYYY-MM-DD HH:mm:ss') => {
	if (!time) return '--'
	return dayjs(Number(time)).format(format)
}

/**
 * 获取浏览器本地时区
 * @returns
 */
export function getTimeZone() {
	// const val = Intl.DateTimeFormat().resolvedOptions().timeZone
	// console.log('浏览器时区:', val)
	// return val || 'Asia/Shanghai'
	const zone = getTradingViewZone()
	console.log('当前时区设置：', zone)
	return zone
}

/**
 * 时间转换
 * @param timestamp
 * @returns
 */
export function formatTimestamp(timestamp: number) {
	// 创建一个 Date 对象
	const date = new Date(timestamp)

	// 获取日期和时间的部分
	// const year = date.getFullYear()
	const month = String(date.getMonth() + 1).padStart(2, '0') // 月份是从0开始的，所以加1
	const day = String(date.getDate()).padStart(2, '0')
	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')

	// 格式化输出
	return `${month}-${day} ${hours}:${minutes}:${seconds}`
}
/**
 * 时间格式化
 * @param  time - 时间
 * @param  format - 转换格式
 * @returns
 */
export const formatData = (time: any, format = 'YYYY-MM-DD HH:mm:ss') => {
	if (!time) return '--'
	return dayjs(time).format(format)
}

/**
 * 获取当前TV支持时区
 * @returns
 */
export function getTradingViewZone() {
	const utcOffset = getCurrentUTCOffset()
	console.log('当前时区 ：', utcOffset)
	const array = TIME_ZONE.filter((item) => item.value === utcOffset)
	if (array.length > 0) {
		return array[0].label
	}
	return 'Asia/Shanghai'
}

function formatUTCString(utcString: string) {
	// 检查是否包含".5"
	if (utcString.includes('.5')) {
		// 找到小数点位置
		const parts = utcString.split('.')
		// 提取整数部分和小数部分
		const hours = parts[0]
		const minutes = '30'
		// 拼接格式化的字符串
		return `${hours}:${minutes}`
	}
	// 非 .5 的情况直接返回
	return utcString
}

/**
 *
 * @returns
 */
function getCurrentUTCOffset() {
	const date = new Date()
	const offset = -date.getTimezoneOffset() / 60 // 获取时区偏移，单位为小时
	const sign = offset >= 0 ? '+' : '-'
	const utc = `UTC${sign}${Math.abs(offset)}`
	console.log('UTC :', utc)
	return formatUTCString(utc)
}
