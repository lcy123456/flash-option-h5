//订单簿类型
export enum HandicapKeyEnum {
	ALL = 'ALL',
	BUY = 'BUY',
	SELL = 'SELL'
}

// 当前委托交易类型
export enum tradeOrderEnum {
	LIMIT_PRICE = 'LIMIT_PRICE', // 限价
	MARKET_PRICE = 'MARKET_PRICE' // 市价
}
// 当前委托交易方向
export enum directionTypeEnum {
	BUY = 'BUY', // 买
	SELL = 'SELL' // 卖
}
// 订单状态
export enum orderStatusEnum {
	COMPLETED = 'COMPLETED', // 完成
	CANCELED = 'CANCELED' // 取消
}
// 行情搜索tab
export enum marketSearchEnum {
	own = 'own', //自选
	trade = 'trade', // 现货
	swap = 'swap', // 合约
	option = 'option', // 期权
	dcontract = 'dcontract' // 交割合约
}

// 订单tab
export enum orderTabActiveEnum {
	position = 'position', //当前持仓
	current = 'current', //当前委托
	history = 'history', // 历史委托
	assets = 'assets' // 资产
}

// kline操作项
export enum klineTypeEnum {
	dept = 'dept', //深度图
	kline = 'kline' // 基础版
}
// 自选类型枚举
export enum findTypeEnum {
	trade = 1, //现货
	swap = 2, // 合约
	option = 3, // 期权
	dcontract = 4 // 交割合约
}
