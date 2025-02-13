import { post, uploadFile, get } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function logout() {
	return post(`${API_BASE_URL}/uc/loginout`)
}

export function checkLogin() {
	return post(`${API_BASE_URL}/uc/check/login`)
}

/**
 * 上传图片
 */
export const uploadImg = (file: any) => {
	return uploadFile(`${API_BASE_URL}/uc/upload/oss/image`, file)
}

/**
 * 修改头像
 */
export const setAvatar = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/change/avatar`, params)
}

/**
 * 用户信息
 */
export const userInfo = async () => {
	return post(`${API_BASE_URL}/uc/member/my-info`)
}

/**
 * 修改用户名
 */
export const userName = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/change/username`, params)
}

/**
 * 生成谷歌认证码
 */
export const googleAuthInfo = async () => {
	return get(`${API_BASE_URL}/uc/google/sendgoogle`)
}

/**
 * 安全设置信息
 */
export const getSettingInfo = async () => {
	return post(`${API_BASE_URL}/uc/approve/security/setting`)
}

/**
 * 绑定/修改谷歌验证器
 */
export const bindGoogleAuth = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/google/googleAuth`, params)
}

/**
 * 关闭谷歌验证器
 */
export const closeGoogleAuth = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/google/close`, params)
}

/**
 * 开启谷歌验证器
 */
export const openGoogleAuth = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/google/open`, params)
}

/**
 * 实名认证
 */
export const realAuth = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/real/name`, params)
}

/**
 * 实名认证情况
 */
export const realDetail = async () => {
	return post(`${API_BASE_URL}/uc/approve/real/detail`)
}

/**
 * 修改登录密码
 */
export const updatePassword = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/update/password`, params)
}

/**
 * 设置资金密码
 */
export const setJyPassword = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/transaction/password`, params)
}

/**
 * 设置资金密码
 */
export const updateJyPassword = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/update/transaction/password`, params)
}

/**
 * 绑定手机号（开启手机验证）
 */
export const bindPhone = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/bind/phone`, params)
}

/**
 * 更换手机号（修改手机验证）
 */
export const updatePhone = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/change/phone`, params)
}

/**
 * 关闭手机验证
 */
export const unbindPhone = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/unbind/phone`, params)
}

/**
 * 开启手机验证
 */
export const openPhone = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/open/phone`, params)
}

/**
 * 绑定邮箱（开启邮箱验证）
 */
export const bindEmail = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/bind/email`, params)
}

/**
 * 变更邮箱（修改邮箱验证）
 */
export const updateEmail = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/change/email`, params)
}

/**
 * 关闭邮箱验证
 */
export const unbindEmail = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/unbind/email`, params)
}

/**
 * 关闭邮箱验证
 */
export const openEmail = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/approve/open/email`, params)
}

/**
 * 查询指定分类页面
 */
export const getCateOne = async (params: unknown) => {
	return post(`${API_BASE_URL}/uc/ancillary/more/help/cateOne`, params)
}

/**
 * 切换用户
 */
export const switchUser = async () => {
	return post(`${API_BASE_URL}/uc/member/switchUser`)
}

/*
 * 限时新人活动页面
 */
export const getNewcomerActivity = async () => {
	return post(`${API_BASE_URL}/uc/activity-new/newWelfare`)
}
