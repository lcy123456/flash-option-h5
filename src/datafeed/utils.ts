export function resolutionToSeconds(resolution: string, count: number): number {
	const secondsInMinute = 60
	const secondsInHour = 3600
	const secondsInDay = 86400

	if (resolution === '1D') return secondsInDay * count
	if (resolution === '1W') return secondsInDay * 7 * count
	if (resolution.endsWith('m')) return parseInt(resolution) * secondsInMinute * count
	if (resolution.endsWith('H')) return parseInt(resolution) * secondsInHour * count

	return parseInt(resolution) * secondsInMinute * count // 默认 1 分钟
}

export function isValidMillisecondTimestamp(timestamp: number) {
	const timestampStr = String(timestamp)
	const length = timestampStr.length

	// 检查时间戳长度是否为 13 位
	if (length === 13) {
		return timestamp
	} else if (length > 13) {
		const newStr = timestampStr.slice(0, 13)
		return Number(newStr)
	}

	return -1
}

export function getNewArray(datas: any[], from: number, to: number) {
	const array = datas
		.map((item: any) => {
			item[0] = isValidMillisecondTimestamp(item[0])
			return item
		})
		.filter((item: any) => {
			return item[0] > from && item[0] < to
		})
	if (array.length < 10 && array.length > 0) {
		console.log('array :', array[0][0])
	}
	return array
}
