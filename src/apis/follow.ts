import { get, post, put } from '@/request'
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

/**
 * 交易员列表
 */
export const traderList = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/trader/list`, params)
}

/**
 * 交易员详情
 */
export const traderInfo = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/trader/info`, params)
}

/**
 * 跟单总览
 */
export const getOverview = () => {
	return get(`${API_BASE_URL}/follow/config/overview`)
}

/**
 * 所有交易对列表
 */
export const symbolList = () => {
	return get(`${API_BASE_URL}/follow/config/symbol-list`)
}

/**
 * 跟单设置
 */
export const followSettings = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/update`, params)
}

/**
 * 获取跟单设置
 */
export const getFollowSettings = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/follower-setting`, params)
}

/**
 * 结束跟单
 */
export const unfollow = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/unfollow`, params)
}

/**
 * 用户跟单资产
 */
export const followWallet = () => {
	return get(`${API_BASE_URL}/swap/follow-wallet/info`)
}

/**
 * 我的交易员列表
 */
export const myTraderList = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/my-trader-list`, params)
}

/**
 * 关注交易员
 */
export const favorTrader = (params: any) => {
	return put(`${API_BASE_URL}/follow/favor/${params.traderId}`)
}

/**
 * 取消关注交易员
 */
export const unfavorTrader = (params: any) => {
	return put(`${API_BASE_URL}/follow/favor/unfavorite/${params.traderId}`)
}

/**
 * 当前跟单 （跟单人）
 */
export const currentFollowOrder = (params: unknown) => {
	return post(`${API_BASE_URL}/delivery-contract/order/follow-current`, params)
}

/**
 * 历史跟单 （跟单人）
 */
export const historyFollowOrder = (params: unknown) => {
	return post(`${API_BASE_URL}/delivery-contract/order/follow-history`, params)
}

/**
 * 我的跟单头部信息
 */
export const myFollowOverview = () => {
	return get(`${API_BASE_URL}/follow/follower/overview`)
}

/**
 * 当前带单 （交易员）
 */
export const followCurrentTrade = (params: unknown) => {
	return post(`${API_BASE_URL}/delivery-contract/order/follow-current-trade`, params)
}

/**
 * 历史带单 （交易员）
 */
export const followHistoryTrade = (params: unknown) => {
	return post(`${API_BASE_URL}/delivery-contract/order/follow-history-trade`, params)
}

/**
 * 我关注的交易员列表
 */
export const myFavorTraderList = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/favor/list`, params)
}

/**
 * 我的跟随者
 */
export const myFollowersList = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/my-follower-list`, params)
}

/**
 * 交易员总览(交易员个人页面顶部数据)
 */
export const traderOverview = () => {
	return get(`${API_BASE_URL}/follow/trader/overview`)
}

/**
 * 交易员修改个人信息
 */
export const updateTraderInfo = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/trader/update`, params)
}

/**
 * 交易员修改头像
 */
export const updateTraderAvatar = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/trader/update-avatar-url`, params)
}

/**
 * 交易员移除跟随者
 */
export const removeFollower = (params: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/remove-follower`, params)
}

/**
 * 查询交易员14日收益
 */
export const trader14DayProfit = (params?: unknown) => {
	return get(`${API_BASE_URL}/follow/trader/selectTrader14DayProfit`, params)
}

/**
 * 0、跟单总览
 */
export const getTraderOverview = (params?: unknown) => {
	return get(`${API_BASE_URL}/follow/config/overview`, params)
}
/**
 * 30、是否跟随了其他交易员
 */
export const getIsFollow = (params?: unknown) => {
	return post(`${API_BASE_URL}/follow/follow/is-following`, params)
}
/**
 * 20、申请成为交易员最低资金
 */
export const getMinAsset = (params?: unknown) => {
	return post(`${API_BASE_URL}/follow/config/getMinAsset`, params)
}
/**
 * 5、申请成为交易员
 */
export const traderApply = (params?: unknown) => {
	return post(`${API_BASE_URL}/follow/trader/apply`, params)
}

/**
 * 给交易员投票
 */
export const traderVote = (params?: unknown) => {
	return post(`${API_BASE_URL}/follow/trader/vote`, params)
}

/*
 * 一键移除全部跟单人
 */
export const removeAllFollower = () => {
	return post(`${API_BASE_URL}/follow/follow/remove-all-follower`)
}
