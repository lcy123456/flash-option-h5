export interface Coin {
	symbol: string
}

export interface SymbolInfo {
	name: string
}

export interface StompClient {
	subscribe: (destination: string, callback: (message: any) => void) => void
}

export interface Bar {
	time: number
	open: number
	high: number
	low: number
	close: number
	volume: number
}

export interface HistoryCallback {
	(bars: Bar[], meta: { noData: boolean }): void
}

export interface RealtimeCallback {
	(bar: Bar): void
}

export interface Config {
	exchanges: any[]
	supported_resolutions: string[]
	supports_group_request: boolean
	supports_marks: boolean
	supports_search: boolean
	supports_time: boolean
	supports_timescale_marks: boolean
}
