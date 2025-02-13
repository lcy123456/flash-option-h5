import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
	// state: 返回包含状态的对象的函数
	state: () => ({
		visibleState: 0, //  从后台切换回前台
		resize: 0,
		showUserCenter: 0,
		httpCode: -1, // 1 超时 2 服务异常

		transferVisible: false, // 划转弹窗
		refreshTransfer: 0, // 完成划转回掉

		noticeVisible: false, // 公告弹窗
		activityVisible: false // 活动 中心
	})
})
