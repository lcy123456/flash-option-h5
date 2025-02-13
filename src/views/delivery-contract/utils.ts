import i18n from '@/i18n/index'
import { formatTime } from '@/utils/date'

/**
 * 返回订单状态
 * @param status
 */
export function getOrderStatus(status: string) {
	switch (status) {
		case 'OPEN': {
			return i18n.global.t(`text125`)
		}
		case 'WAIT': {
			return i18n.global.t(`text126`)
		}
		case 'CLOSE': {
			return i18n.global.t(`text127`)
		}
		case 'CANCELED': {
			return i18n.global.t(`text128`)
		}
		default:
			return status
	}
}

/**
 * 时间周期
 */
export function getOrderOption(item: any) {
	if (!item.period) return ''
	const str = item.period.split('_')[1]

	return `${str}min(${formatTime(item.startTime, 'HH:mm')}~${formatTime(item.openTime, 'HH:mm')})`
}
