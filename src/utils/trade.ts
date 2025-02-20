import {
	positionTypeEnum,
	orderTypeEnum,
	directionTypeEnum,
	actionTypeEnum,
	orderCurrentTypeEnum
} from '@/enums/swap'
import i18n from '@/i18n/index'
// 将币对- 替换成/
export const replaceName = (name: string) => {
	if (!name) return '--'
	return name.replace('-', '/')
}
// 将币对/ 替换成-
export const replaceToName = (name: string) => {
	if (!name) return 'BTC/USDT'
	return name.replace('/', '-')
}
/**
 * 获取币币交易当前币对
 * @param  dataList - 币对列表
 * @returns url币对|币对列表第一个
 */
export const getCuSymbol = (dataList: any[]) => {
	// url上是的有币对
	const clientPathName: any = window.location.hash.split('/')
	const symbolKey = clientPathName && replaceName(clientPathName[2])
	const urlContractName = dataList.length && dataList?.find((item) => item.symbol === symbolKey)
	if (urlContractName) {
		return urlContractName
	}
	return false
}
/**
 * 获取当前类型
 * @param  dataList - 类型列表
 * @param  type - 当前类型
 * @returns 当前类型名称
 */
export const filterType = (dataList: any, type: any) => {
	if (!dataList.length || !type) return '--'
	const res = dataList?.find((item) => item.value === type)
	return res?.label
}
// BUY【绿】 sell[红]
export const directionTypeColor = (direction: any) => {
	return direction === 'BUY' ? 'text-function-buy' : 'text-function-sell'
}
// BUY【绿】 sell[红]
export const directionTypeBgColor = (direction: any) => {
	return direction === 'BUY' ? 'bg-[#2EBD87] bg-opacity-10 ' : 'bg-[#F54058] bg-opacity-10'
}
// BUY【绿】 sell[红]
export const directionBgColor = (direction: any) => {
	return direction === 'BUY' ? 'bg-function-buy ' : 'bg-function-sell'
}
// 设置涨跌颜色
export const PONTextColor = (newVal: any) => {
	return newVal > 0 ? 'text-text-success' : 'text-function-sell'
}
// 设置涨跌颜色
export const chgTextColor = (oldVal: any, newVal: any) => {
	return newVal > oldVal ? 'text-function-buy' : 'text-function-sell'
}
// 设置涨跌颜色 【success|】
export const chgSuccessColor = (oldVal: any, newVal: any) => {
	return newVal > oldVal
		? 'text-text-success'
		: newVal === oldVal
			? 'text-text-primary'
			: 'text-function-sell'
}
// 设置背景颜色
export const chgBgColor = (chg: any) => {
	return chg > 0 ? 'bg-function-buy' : 'bg-function-sell'
}

// 设置多空颜色
export const directionColor = (direction: any) => {
	const isBuy = direction === 'BUY'
	return {
		borderColor: isBuy
			? 'border-[var(--color-function-buy)] '
			: 'border-[var(--color-function-sell)]',
		lightBg: isBuy ? 'bg-function-buy-light-background' : 'bg-function-sell-light-background',
		textColor: isBuy ? 'text-function-buy' : ' text-function-sell'
	}
}

// 千位数字每三位加逗号
export const thousandsComma = (num: any) => {
	let Num = (num || 0).toString()
	let symbol = ''
	if (new RegExp(/^\+|^-/).test(Num)) {
		symbol = Num.substr(0, 1)
		Num = Num.substr(1)
	}
	let number = 0
	let floatNum = ''
	let intNum: any = ''
	// 判断是否有小数位，有则截取小数点后的数字
	if (Num.indexOf('.') > 0) {
		number = Num.indexOf('.') // 获取小数点出现的位置
		floatNum = Num.substr(number) // 截取arr.substr(form, length)
		intNum = Num.substring(0, number) // 截取arr.substring(start, end)
	} else {
		intNum = Num
	}
	const result = []
	let counter = 0
	intNum = intNum.split('')
	// 利用3的倍数，向数组插入','
	for (let i = intNum.length - 1; i >= 0; i -= 1) {
		counter += 1
		result.unshift(intNum[i])
		if (!(counter % 3) && i !== 0) {
			result.unshift(',')
		}
	}
	return symbol + result.join('') + floatNum || ''
}

// 计算M K
export const formatNumUnit = (val: number) => {
	if (!val) return ''
	const getNum = function (num: number, str: string, unit: string) {
		const int: any = str.slice(0, 0 - num)
		const inM = str.slice(0 - num)
		const thousandsInt = thousandsComma(int)
		return `${thousandsInt}.${inM.slice(0, 2)}${unit}`
	}
	if (!Number.isNaN(val)) {
		const valStr = val?.toString()
		const integer = valStr?.split('.')[0]
		let returnStr: any = val
		if (integer.length < 4) {
			returnStr = val
		} else if (integer.length < 7) {
			returnStr = getNum(3, integer, 'K')
		} else if (integer.length < 10) {
			returnStr = getNum(6, integer, 'M')
		} else {
			returnStr = getNum(9, integer, 'B')
		}
		return returnStr
	}
	return val
}
// 精度计算
export const fixD = (num: number, precision: any) => {
	// num初始化
	if (`${num}` === '0') {
		if (!parseFloat(precision)) {
			return 0
		}
		return '0.'.padEnd(precision + 2, '0')
	}
	if (!num) {
		return '--'
	}
	const newnum = `${parseFloat(num)}`
	if (newnum === 'NaN') {
		return '--'
	}
	let fixNum: any = newnum
	// 科学计数法计算
	if (newnum.toLowerCase().indexOf('e') > -1) {
		const a = newnum.toLowerCase().split('e')
		let b = a[0]
		const c = Math.abs(parseFloat(a[1]))
		let d = ''
		let h = b.length
		let i
		if (a[0].split('.')[1]) {
			b = a[0].split('.')[0] + a[0].split('.')[1]
			h = a[0].split('.')[0].length
		}
		for (i = 0; i < c - h; i += 1) {
			d += '0'
		}
		fixNum = `0.${d}${b}`
	}
	// 精度格式化
	// precision初始化
	if (`${precision}` !== '0' && !precision) {
		return fixNum
	}
	if (`${parseFloat(num)}` === 'NaN') {
		return fixNum
	}
	const fNum = fixNum.split('.')
	if (precision === 0) {
		fixNum = parseInt(fixNum, 10)
	} else if (precision > 0 && fNum[1]) {
		if (fNum[1].length > precision) {
			if (fNum[1].indexOf('999999999') > -1) {
				const s = parseFloat(fixNum).toFixed(precision + 1)
				fixNum = s.slice(0, s.length - 1)
			} else {
				fixNum = `${fNum[0]}.${fNum[1].slice(0, precision)}`
			}
		} else {
			fixNum = parseFloat(fixNum).toFixed(precision)
		}
	} else {
		fixNum = parseFloat(fixNum).toFixed(precision)
	}
	if (fixNum.length >= 14 && fixNum.indexOf('.') > -1) {
		const arry = fixNum.split('.')
		if (arry[0].length > 14) {
			fixNum = `${arry[0].slice(0, 14)}+`
		} else {
			fixNum = fixNum.slice(0, 13)
			if (fixNum.indexOf('.') === 12) {
				fixNum = fixNum.slice(0, 12)
			}
		}
	}
	return fixNum
}

export const positionList = [
	{
		value: positionTypeEnum.Full,
		label: i18n.global.t(`trade.txt127`)
	},
	{
		value: positionTypeEnum.Position,
		label: i18n.global.t(`trade.txt126`)
	}
]
// 匹配仓位类型
export const macthPosition = (type: any) => {
	const matchItem: any = positionList.find((item) => item.value === type) || {}
	return matchItem.label
}

export const swapOrderList = [
	{
		label: i18n.global.t(`trade.txt128`),
		title: i18n.global.t(`trade.txt128`),
		name: i18n.global.t(`trade.txt129`),
		value: orderTypeEnum.LIMIT,
		id: orderTypeEnum.LIMIT,
		key: orderTypeEnum.LIMIT,
		type: orderCurrentTypeEnum.LIMIT_PRICE
	},
	{
		label: i18n.global.t(`trade.txt91`),
		title: i18n.global.t(`trade.txt91`),
		name: i18n.global.t(`trade.txt130`),
		value: orderTypeEnum.MARKET,
		id: orderTypeEnum.MARKET,
		key: orderTypeEnum.MARKET,
		type: orderCurrentTypeEnum.MARKET_PRICE
	},
	{
		label: i18n.global.t(`trade.txt131`),
		title: i18n.global.t(`trade.txt131`),
		name: i18n.global.t(`trade.txt131`),
		value: orderTypeEnum.CONDITION,
		key: orderTypeEnum.CONDITION,
		id: orderTypeEnum.CONDITION,
		type: orderCurrentTypeEnum.SPOT_LIMIT
	}
]

export const closeOrderList = [
	{
		label: i18n.global.t(`trade.txt128`),
		name: i18n.global.t(`trade.txt129`),
		value: orderTypeEnum.LIMIT,
		key: orderTypeEnum.LIMIT,
		type: orderCurrentTypeEnum.LIMIT_PRICE
	},
	{
		label: i18n.global.t(`trade.txt91`),
		name: i18n.global.t(`trade.txt130`),
		value: orderTypeEnum.MARKET,
		key: orderTypeEnum.MARKET,
		type: orderCurrentTypeEnum.MARKET_PRICE
	}
]
/**
 * 匹配订单类型
 * @param labelName 返回的key
 * @param keyName 匹配的key
 * @returns 返回显示的标签值
 */
export const macthOrderType = (type: any, labelName = 'label', keyName = 'value') => {
	const matchItem: any = swapOrderList?.find((item) => item[keyName] === type) || {}
	return matchItem[labelName]
}

export const directionTypeList = [
	{
		label: i18n.global.t(`trade.txt132`),
		key: actionTypeEnum.BUY,
		value: directionTypeEnum.BUY,
		name: i18n.global.t(`trade.txt133`)
	},
	{
		label: i18n.global.t(`trade.txt134`),
		key: actionTypeEnum.SELL,
		value: directionTypeEnum.SELL,
		name: i18n.global.t(`trade.txt135`)
	}
]
// 匹配订单方向类型
export const macthDirectionType = (type: any, keyName = 'value', labelName = 'label') => {
	const matchItem: any = directionTypeList.find((item: any) => item[keyName] === type) || {}
	return matchItem[labelName]
}

/**
 * array 排序
 * @param  list - 排序列表
 * @param  filedInfo - 按照对象排序
 */
export const fieldSort = (list: [], filedInfo?: any) => {
	if (!list) return list
	const filterInfo: any = filedInfo || {}
	if (filterInfo.upOrDown) {
		list.sort(function (a, b) {
			const prop = filterInfo.sortName
			const sortType = filterInfo.sortType
			const valueA = sortType === 1 ? (a[prop] === '--' ? 0 : parseFloat(a[prop])) : a[prop]
			const valueB = sortType === 1 ? (b[prop] === '--' ? 0 : parseFloat(b[prop])) : b[prop]
			const direction = filterInfo.upOrDown
			const multiplier = direction === 'asc' ? 1 : -1
			// 数字对比
			if (sortType === 1) {
				if (valueA < valueB) {
					return -1 * multiplier
				} else if (valueA > valueB) {
					return 1 * multiplier
				}
			} else {
				// 字符串对比
				if (direction === 'asc') {
					return valueA?.localeCompare(valueB)
				} else if (direction === 'desc') {
					return valueB?.localeCompare(valueA)
				}
			}
			return 0
		})
	}
	return list
}

// 未有数据默认显示--列表
export const deOrderBook = () => {
	const list = []
	for (let i = 0; i < 12; i++) {
		list.push({
			price: '--',
			amount: '--',
			totalAmount: '--'
		})
	}
	return list
}
