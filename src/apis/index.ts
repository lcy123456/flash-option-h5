import { post } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export const loadOverviews = () => {
	return post(`${API_BASE_URL}/follow/overview`)
}

export const getOverview = () => {
	return post(`${API_BASE_URL}/market/overview`)
}

/**
 * 通用邮箱验证码
 */
export const emailCode = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/validcode/email/code`, params)
}

/**
 * 通用手机验证码
 */
export const smsCode = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/validcode/sms/code`, params)
}

/**
 * USDT 兑 法币汇率
 */
export const exchangeRate = () => {
	return post(`${API_BASE_URL}/market/exchange-rate/usdt`)
}
