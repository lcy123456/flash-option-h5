// WebSocketService.ts
import SockJS from 'sockjs-client'
import { Client, Frame, Message, StompSubscription } from '@stomp/stompjs'

class WebSocketService {
	private stompClient: Client | null = null
	private socket: any = null
	private reconnectAttempts = 0
	private maxReconnectAttempts = 5
	private reconnectInterval = 5000 // 5秒
	private url: string
	private connectionStatus: 'connected' | 'disconnected' | 'connecting' = 'disconnected'
	private subscriptions: StompSubscription[] = []
	private onConnectedCallbacks: ((client: Client) => void)[] = []
	private isFinallyClose: boolean = false

	constructor(url: string) {
		this.url = url
		this.isFinallyClose = false
	}

	// 建立连接
	public connect(): void {
		if (this.connectionStatus === 'connecting' || this.connectionStatus === 'connected') {
			console.log('WebSocket is already connected or connecting.')
			return
		}
		// this.disconnect()
		this.connectionStatus = 'connecting'
		this.socket = new SockJS(this.url)
		this.stompClient = new Client({
			webSocketFactory: () => this.socket,
			reconnectDelay: 0 // 自定义重连机制
			// debug: (msg: string) => console.log(msg),
			// heartbeatIncoming: 30 * 1000,
			// heartbeatOutgoing: 30 * 1000
		})

		this.stompClient.onConnect = (frame: Frame) => {
			console.log('Connected to WebSocket')
			this.connectionStatus = 'connected'
			this.reconnectAttempts = 0

			// 执行连接成功后的回调函数
			this.onConnectedCallbacks.forEach((callback) => callback(this.stompClient!))
			this.onConnectedCallbacks = []
		}

		this.stompClient.onStompError = (frame: Frame) => {
			console.error('STOMP error: ', frame.headers['message'])
			this.connectionStatus = 'disconnected'
		}

		this.stompClient.onWebSocketClose = () => {
			console.log('WebSocket connection closed.')
			this.handleReconnection()
		}

		this.stompClient.onWebSocketError = (error: Event) => {
			console.error('WebSocket error: ', error)
			this.connectionStatus = 'disconnected'
			this.handleReconnection()
		}

		this.stompClient.activate()
	}

	// 重连逻辑
	private handleReconnection(): void {
		if (this.isFinallyClose) return
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			setTimeout(() => {
				this.reconnectAttempts++
				console.log(`Reconnecting attempt ${this.reconnectAttempts}`)
				this.connect()
			}, this.reconnectInterval)
		} else {
			console.log('Max reconnect attempts reached, giving up.')
		}
	}

	// 订阅消息
	public subscribe(destination: string, callback: (message: Message) => void): void {
		if (this.stompClient && this.connectionStatus === 'connected') {
			const subscription = this.stompClient.subscribe(destination, callback)
			this.subscriptions.push(subscription)
		} else {
			console.log('WebSocket is not connected.')
			// 如果还没有连接，推迟到连接成功时再订阅
			this.onConnectedCallbacks.push((client) => {
				client.subscribe(destination, callback)
			})
		}
	}

	// 发送消息
	public send(destination: string, body: string): void {
		if (this.stompClient && this.connectionStatus === 'connected') {
			this.stompClient.publish({ destination, body })
		} else {
			console.log('WebSocket is not connected.')
		}
	}

	// 关闭连接
	public disconnect(): void {
		this.isFinallyClose = true
		try {
			if (this.stompClient) {
				this.stompClient.deactivate()
				this.subscriptions.forEach((sub) => sub.unsubscribe())
				this.subscriptions = []
				this.connectionStatus = 'disconnected'
				console.log('WebSocket connection closed by user.')
			} else {
				console.log('WebSocket is not connected.')
			}
		} catch (error) {
			console.log('error :', error)
		}
	}

	// 获取连接状态
	public getConnectionStatus(): 'connected' | 'disconnected' | 'connecting' {
		return this.connectionStatus
	}
}

export default WebSocketService
