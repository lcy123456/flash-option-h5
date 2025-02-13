import { get, post } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

export function invitationOverview() {
	return get(`${API_BASE_URL}/uc/my-invitation/overview`)
}

export function getSystemConfig() {
	return post(`${API_BASE_URL}/uc/promotion/getSystemConfig`)
}

export function commissionDetails(params: any) {
	return post(`${API_BASE_URL}/uc/my-invitation/commissionDetails`, params)
}
