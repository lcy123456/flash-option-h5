//仓位类型
export enum positionTypeEnum {
	Full = 0, // 全仓
	Position = 1 // 逐仓
}
// 下单交易类型
export enum orderTypeEnum {
	MARKET = 0, // 市价
	LIMIT = 1, // 限价
	CONDITION = 2, // 计划委托
	MERGE = 3 // 合并
}
// 下单交易类型
export enum orderCurrentTypeEnum {
	MARKET_PRICE = 'MARKET_PRICE', // 市价
	LIMIT_PRICE = 'LIMIT_PRICE', // 限价
	SPOT_LIMIT = 'SPOT_LIMIT' // 计划委托
}
// 当前委托交易方向
export enum directionTypeEnum {
	BUY = 0, // 开多【买】
	SELL = 1 // 开空【卖】
}

// 开仓|平仓
export enum actionTypeEnum {
	BUY = 'BUY',
	SELL = 'SELL'
}
// 开仓|平仓
export enum entrustTypeEnum {
	OPEN = 'OPEN',
	CLOSE = 'CLOSE'
}

// 订单状态
export enum orderStatusEnum {
	ENTRUST_SUCCESS = 'ENTRUST_SUCCESS', // 委托成功
	ENTRUST_FAILURE = 'ENTRUST_FAILURE', // 委托失败
	ENTRUST_CANCEL = 'ENTRUST_CANCEL', // 已撤销
	ENTRUST_ING = 'ENTRUST_ING0' // 委托中
}
