import { post, get } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function querySystemWeb(params: any) {
	return post(`${API_BASE_URL}/uc/agent/system/system-web-query`, params)
}

export function getAdvertise(params: any) {
	return post(`${API_BASE_URL}/uc/ancillary/system/advertise`, params)
}
export function getAdvertiseDetail(params: any) {
	return post(`${API_BASE_URL}/uc/ancillary/system/advertise/detail`, params)
}

export function getNotices(params: any) {
	return post(`${API_BASE_URL}/uc/announcement/page`, params)
}

export function getWallet(params?: any) {
	return post(`${API_BASE_URL}/uc/asset/wallet`, params)
}

export function getAnnouncementDetail(id: string) {
	return get(`${API_BASE_URL}/uc/announcement/${id}`)
}
