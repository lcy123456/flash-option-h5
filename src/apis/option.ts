import { get, post } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 获取期权历史数据
 * @returns
 */
export function getOptionsHistory(params: any) {
	return get(`${API_BASE_URL}/flash-option/option/historyPriceLine`, params)
}

/**
 * 获取期权数据开始时间
 * @param params
 * @returns
 */
export function getOptionStarting(params: any) {
	return get(`${API_BASE_URL}/flash-option/option/starting`, params)
}

/**
 * 获取进行中的订单
 */
export function getCurrentOrders(params: any) {
	return get(`${API_BASE_URL}/flash-option/order/current`, params)
}

/**
 * 获取历史订单
 * @param params
 * @returns
 */
export function getHistoryOrders(params: any) {
	return get(`${API_BASE_URL}/flash-option/order/history`, params)
}

/**
 * 提交订单
 * @param params
 * @returns
 */
export function addOrder(params: any) {
	return post(`${API_BASE_URL}/flash-option/order/add`, params)
}

/**
 * 通过id查询订单详情
 * @param params
 * @returns
 */
export function queryOrderById(params: any) {
	return get(`${API_BASE_URL}/flash-option/order/queryById`, params)
}

/**
 * 获取所有期权交易对列表
 * @param params
 * @returns
 */
export function getFlashOptionCoins() {
	return get(`${API_BASE_URL}/flash-option/option/thumb`)
}

/**
 * 查询所有期权的周期数
 * @returns
 */
export function queryOptionPeriod() {
	return get(`${API_BASE_URL}/flash-option/option/queryOptionPeriod`)
}

/**
 * 获取交易对信息
 * @param params
 * @returns
 */
export function getCoinInfo(params: any) {
	return get(`${API_BASE_URL}/flash-option/coin/coin-info`, params)
}
