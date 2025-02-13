import { post, get, postQuery } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 登陆
 */
export const login = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/login`, params)
}

/**
 * 退出登陆
 */
export const loginout = () => {
	return get(`${API_BASE_URL}/uc/loginout`)
}

/**
 * 检查用户是否登录
 */
export const checkLogin = () => {
	return get(`${API_BASE_URL}/uc/check/login`)
}

/**
 * 邮箱注册
 */
export const register = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/register/email`, params)
}

/**
 * 邮箱注册验证码
 */
export const send_email_verify_code = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/reg/email/code`, params)
}

/**
 * 手机注册
 */
export const register_phone = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/register/phone`, params)
}

/**
 * 手机注册验证码
 */
export const send_mobile_verify_code = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/mobile/code`, params)
}

/**
 * 获取国家列表（多语言）
 */
export const getCountry = () => {
	return post(`${API_BASE_URL}/uc/support/country`)
}

/**
 * 忘记密码邮箱验证码
 */
export const send_reset_email_code = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/web/reset/email/code`, params)
}

/**
 * 忘记密码短信验证码
 */
export const send_reset_mobile_code = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/mobile/reset/code`, params)
}

/**
 * 重置密码(找回密码)
 */
export const reset_password = (params: unknown) => {
	return postQuery(`${API_BASE_URL}/uc/reset/login/password`, params)
}
