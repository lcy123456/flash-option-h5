import { post, get } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

// 行情ws
export const marketWs = '/follow/market-ws'

// 获取币种
export const getSymbolThumb = (params?: any) => {
	return post(`${API_BASE_URL}/contract-market/symbol-thumb`, params)
}

// 提交订单接口
export const orderAdd = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/open/v3`, params)
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
	return post(`${API_BASE_URL}/contract-market/symbol-info`, params)
}
//获取当前委托列表
export const getCurrentOrder = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/current`, params)
}
//取消当前委托
export const cancelCurrentOrder = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/cancel`, params)
}
//获取历史委托
export const getHistoryOrder = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/history`, params)
}
//获取当前持仓列表
export const getPositionList = (params?: any) => {
	return get(`${API_BASE_URL}/swap/asset/get-with-positions`, params)
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
	return post(`${API_BASE_URL}/swap/coin-info`, params)
}

// 获取盘口数据
export const getPlatefull = (params?: any) => {
	return post(`${API_BASE_URL}/contract-market/exchange-plate`, params)
}

// 获取当前资金费率
export const getCuFundingRate = (params?: any) => {
	return get(`${API_BASE_URL}/swap/funding-rate/current`, params)
}
// 22、修改仓位类型（用户切换全仓、逐仓后调用）
export const modifyType = (params?: any) => {
	return post(`${API_BASE_URL}/swap/asset/modifyType`, params)
}

// 20、某币对的当前杠杆
export const getLeverage = (params?: any) => {
	return get(`${API_BASE_URL}/swap/asset/getLeverage`, params)
}

// 21、修改杠杆倍数
export const modifyLeverage = (params?: any) => {
	return post(`${API_BASE_URL}/swap/asset/modifyLeverage`, params)
}

// 14、一键平仓（市价全平）
export const closeAllPostion = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/close-all-coins`, params)
}

// 16、撤销全部委托单
export const closeAllCurrent = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/cancel-all`, params)
}

// 13、反向开仓
export const closeAndOpen = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/close-and-open`, params)
}

// 10、平仓
export const closePostion = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/close`, params)
}

// 11、止盈止损
export const cutPostion = (params?: any) => {
	return post(`${API_BASE_URL}/swap/order/cut-position/v1`, params)
}

// 5、最新成交记录列表
export const geLatestTrade = (params?: any) => {
	return post(`${API_BASE_URL}/contract-market/latest-trade`, params)
}
// 11-1、指定持仓的所有止盈止损单
export const geLimitList = (params?: any) => {
	return get(`${API_BASE_URL}/swap/order/search-cut-orders`, params)
}
