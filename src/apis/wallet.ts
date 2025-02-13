import { get, post, postQuery } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 现货账户基本信息
 */
export const spotAssetsOverview = () => {
	return get(`${API_BASE_URL}/market/asset/overview`)
}

/**
 * 合约/跟单账号基本信息
 */
export const swapAssetsOverview = () => {
	return post(`${API_BASE_URL}/swap/asset/overview`)
}

/**
 * 今日0点资产
 */
export const getMidnightBalance = () => {
	return get(`${API_BASE_URL}/uc/asset/midnight-balance`)
}

/**
 * 资产盈亏折线图
 */
export const getProfitAndLossChart = () => {
	return get(`${API_BASE_URL}/uc/asset/pnl-stats`)
}

/**
 * 现货账户
 */
export const getAssetList = () => {
	return post(`${API_BASE_URL}/market/asset/list`)
}

/*
 * 现货资产列表
 */
export const spotAssetList = () => {
	return post(`${API_BASE_URL}/market/asset/list`)
}

/**
 * 获取能充值的币种列表
 */
export const getDepositCoinList = () => {
	return post(`${API_BASE_URL}/uc/asset/support/deposit-coin`)
}

/**
 * 查询充提主网
 */
export const getDepositMainnetList = (params: unknown) => {
	return postQuery(`${API_BASE_URL}/uc/asset/get-mainnet`, params)
}

/**
 * 获取充值地址
 */
export const getAddress = (params: unknown) => {
	return postQuery(`${API_BASE_URL}/uc/asset/get-address`, params)
}

/**
 * 支持提现的币种列表
 */
export const getWithdrawCoinList = () => {
	return post(`${API_BASE_URL}/uc/withdraw/support/coin`)
}

/**
 * 提币申请
 */
export const withdrawApply = (params: unknown) => {
	return post(`${API_BASE_URL}/uc/withdraw/apply`, params)
}

/**
 * 资产划转
 * @param params
 * @returns
 */
export const transfer = (params: any) => {
	return post(`${API_BASE_URL}/uc/asset/transfer`, params)
}

/**
 * 跟单人当前跟单订单列表
 * @param params
 * @returns
 */
export const getFollowCurrent = (params: any) => {
	return get(`${API_BASE_URL}/delivery-contract/order/current-all`, params)
}

/**
 * 充值历史记录
 */
export const rechargeList = (params: any) => {
	return get(`${API_BASE_URL}/uc/asset/recharge-list`, params)
}

/**
 * 提现记录分页查询
 */
export const withdrawRecord = (params: any) => {
	return post(`${API_BASE_URL}/uc/withdraw/record`, params)
}

/**
 * 是否可以提币
 */
export const canWithdraw = (params: any) => {
	return get(`${API_BASE_URL}/uc/withdraw/canWithdraw`, params)
}

/*
 * 划转历史记录
 */
export const transferRecord = (params: any) => {
	return post(`${API_BASE_URL}/uc/asset/transfer/list`, params)
}
