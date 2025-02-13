import { post, get } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 行情ws
export const marketWs = '/follow/market-ws'

// 获取币种
export const getSymbolThumb = (params?: any) => {
	return post(`${API_BASE_URL}/market/symbol-thumb`, params)
}

// 提交订单接口
export const orderAdd = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/add`, params)
}

// 当前委托接口
export const getCurrent = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/current`, params)
}

//历史委托接口
export const getHistory = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/history`, params)
}
//详细订单接口
export const getDetail = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/detail/`, params)
}
//查询自选
export const favorFind = (params?: any) => {
	return post(`${API_BASE_URL}/market/favor/find`, params)
}
//删除自选
export const favorDelete = (params?: any) => {
	return post(`${API_BASE_URL}/market/favor/delete`, params)
}
//添加自选
export const favorAdd = (params?: any) => {
	return post(`${API_BASE_URL}/market/favor/add`, params)
}

//获取当前币种信息
export const getSymboyInfo = (params?: any) => {
	return post(`${API_BASE_URL}/market/symbol-info`, params)
}
//获取当前委托列表
export const getCurrentOrder = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/personal/current`, params)
}
//取消当前委托
export const cancelCurrentOrder = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/cancel/${params.orderId}`)
}
//获取历史委托
export const getHistoryOrder = (params?: any) => {
	return post(`${API_BASE_URL}/exchange/order/personal/history`, params)
}
//获取资产列表
export const getAssetList = (params?: any) => {
	return post(`${API_BASE_URL}/market/asset/list`, params)
}

// 获取当前币种余额USDT
export const getWalletUSDT = (params?: any) => {
	return post(`${API_BASE_URL}/uc/asset/wallet/${params}`)
}
// 获取当前币种余额
export const getWalletSymbol = (params?: any) => {
	return post(`${API_BASE_URL}/uc/asset/wallet/${params}`)
}
// 获取当前币种详情
export const getCoinInfo = (params?: any) => {
	return post(`${API_BASE_URL}/market/coin-info`, params)
}

// 获取盘口数据
export const getPlatefull = (params?: any) => {
	return post(`${API_BASE_URL}/market/exchange-plate-full`, params)
}

/**
 * 5-0、是否可以划转（跟单-》现货）
 */
export const canTransfer = () => {
	return get(`${API_BASE_URL}/uc/asset/canTransfer`)
}
