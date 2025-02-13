import { post } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 活动中心-列表
 * @returns
 */
export function getActivityList(params: any) {
	return post(`${API_BASE_URL}/uc/activity/page-query`, params)
}

/**
 * 活动详情
 * @param params
 * @returns
 */
export function getActivityDetail(params: any) {
	return post(`${API_BASE_URL}/uc/activity/detail`, params)
}

/**
 * 帮助中心-列表
 * @param params
 * @returns
 */
export function getHelpList(params?: any) {
	return post(`${API_BASE_URL}/uc/ancillary/more/help`, params)
}
/**
 * 帮助中心-下级
 * @param params
 * @returns
 */
export function getSubHelpList(params: any) {
	return post(`${API_BASE_URL}/uc/ancillary/more/help/page`, params)
}

/**
 * 帮助中心-详情
 * @param params
 * @returns
 */
export function getHelpDetail(params: any) {
	return post(`${API_BASE_URL}/uc/ancillary/more/help/detail`, params)
}

/**
 * 注册协议、隐私协议 、平台协议、关于我们
 * @param params
 */
export function helpCateone(params: any) {
	return post(`${API_BASE_URL}/uc/ancillary/more/help/cateOne`, params)
}
