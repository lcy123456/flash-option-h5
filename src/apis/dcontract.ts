import { get, post } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 获取正在投注中当前默认的期权
 */
export const startList = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/option/starting`, params)
}

/**
 * 获取正在投注中的期权列表
 */
export const optionList = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/option/options`, params)
}

/**
 * 下单
 */
export const addOrder = (params: unknown) => {
	return post(`${API_BASE_URL}/delivery-contract/order/add`, params)
}

/**
 * 获取期权交易对信息
 */
export const getCoinInfo = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/coin/coin-info`, params)
}

/**
 * 进行中的订单（所有币对）
 */
export const getCurrentOrders = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/order/current-all`, params)
}

/**
 * 历史订单
 */
export const getHistoryOrders = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/order/history`, params)
}

/**
 * 根据id查询订单
 */
export const queryOrderById = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/order/queryById`, params)
}

/**
 * 8、查询所有期权的周期数
 */
export const queryOptionPeriod = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/option/queryOptionPeriod`, params)
}

/**
 * 7、期权交易对行情列表
 */
export const getOptionThumbs = () => {
	return get(`${API_BASE_URL}/delivery-contract/option/thumb`)
}

/**
 * 4、进行中的订单（指定币对）
 */
export const queryCurrentOrders = (params: unknown) => {
	return get(`${API_BASE_URL}/delivery-contract/order/current`, params)
}

/**
 * 12、取消订单
 * @param params
 */
export const cancelOrders = (params?: any) => {
	return get(`${API_BASE_URL}/delivery-contract/order/cancel`, params)
}
