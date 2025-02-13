import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

export default class WebSocketClient {
	private stompClient: any
	private socket: any
	private shouldReconnect: boolean = true
	private reconnectInterval: number = 10 * 1000 // 重连间隔
	private heartbeatInterval: number = 30 * 1000 // 自定义心跳间隔
	private heartbeatDestination: string
	private reconnectAttempts: number = 0 // 当前重连次数
	private maxReconnectAttempts: number = 5 // 最大重连次数
	public connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected' // ws 连接状态

	constructor(
		private url: string,
		private connectCall?: any,
		private config?: {
			heartbeatDestination?: string
		}
	) {
		this.heartbeatDestination = config?.heartbeatDestination || ''
		this.connect()
	}

	private connect() {
		if (this.reconnectAttempts >= this.maxReconnectAttempts) {
			console.log('Reached maximum reconnect attempts. Aborting reconnection.')
			this.connectionStatus = 'disconnected'
			return
		}

		// 更新状态为 "连接中"
		this.connectionStatus = 'connecting'

		// 创建 SockJS 连接
		this.socket = new SockJS(this.url, null, {
			transports: ['websocket']
		})

		// 创建 STOMP 客户端实例
		this.stompClient = Stomp.over(this.socket)

		// 关闭默认的 debug 输出（可选）
		this.stompClient.debug = null

		// 配置 STOMP 客户端的连接
		this.stompClient.connect({}, this.onConnect.bind(this), this.onError.bind(this))

		// 当连接关闭时，根据 shouldReconnect 判断是否重连
		this.socket.onclose = () => {
			console.log('WebSocket connection closed.')
			this.connectionStatus = 'disconnected'
			if (this.shouldReconnect) {
				console.log('Reconnecting...')
				this.reconnectAttempts++
				setTimeout(() => this.connect(), this.reconnectInterval)
			}
		}
	}

	private onConnect(frame: any) {
		console.log('Connected: ' + frame)
		this.reconnectAttempts = 0 // 重连成功，重置重连次数
		this.connectionStatus = 'connected' // 更新状态为 "已连接"
		if (this.connectCall) {
			this.connectCall(this.stompClient)
		}
		// 开始发送自定义心跳
		// this.startCustomHeartbeat();
	}

	private onError(error: any) {
		console.error('STOMP Error: ' + error)
		this.connectionStatus = 'disconnected' // 更新状态为 "断开连接"
		if (this.shouldReconnect) {
			this.reconnectAttempts++
			setTimeout(() => this.connect(), this.reconnectInterval)
		}
	}

	private startCustomHeartbeat() {
		setInterval(() => {
			if (this.stompClient && this.stompClient.connected) {
				this.stompClient.send(this.heartbeatDestination, {}, 'ping')
				console.log('Sent custom heartbeat: ping')
			}
		}, this.heartbeatInterval)
	}

	public subscribe(destination: string, callback: (message: any) => void) {
		if (this.stompClient && this.stompClient.connected) {
			this.stompClient.subscribe(destination, callback)
		}
	}

	public send(destination: string, message: string) {
		if (this.stompClient && this.stompClient.connected) {
			this.stompClient.send(destination, {}, message)
		}
	}

	public async disconnect() {
		this.shouldReconnect = false
		return new Promise((resolve) => {
			if (this.stompClient) {
				this.stompClient.disconnect(() => {
					console.log('STOMP connection closed.')
					this.connectionStatus = 'disconnected'
					resolve('connection closed')
				})
			}
			if (this.socket) {
				this.socket.close()
			}
		})
	}

	// 主动重连方法
	public reconnect() {
		if (this.connectionStatus === 'disconnected') {
			this.reconnectAttempts = 0
			this.shouldReconnect = true
			this.connect()
		} else {
			console.log('Already connected or reconnecting.')
		}
	}

	public getConnectedStatus() {
		return this.connectionStatus
	}
}
