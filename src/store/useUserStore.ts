import { defineStore } from 'pinia'
import { StorageKeyEnum } from '@/enums'
import { setItem, getItem } from '@/utils/storage'
import { getCountry } from '@/apis/login'
import { userInfo, getSettingInfo } from '@/apis/user'

export const useUserStore = defineStore('user', {
	state: () => ({
		loginToken: getItem(StorageKeyEnum.token) || '',
		name: '',
		countryList: [],
		age: 0,
		settingInfo: {},
		userInfo: {},
		kycDetail: {},
		isSimulatedAccount: getItem(StorageKeyEnum.isSimulatedAccount) || false
	}),
	actions: {
		setLoginToken(token: string) {
			this.loginToken = token
			setItem(StorageKeyEnum.token, token)
		},
		setName(name: string) {
			this.name = name
		},
		setUserInfo(info: any) {
			this.userInfo = info
			this.setSimulatedAccount(info?.virtual)
		},
		setKycDetail(info: any) {
			this.kycDetail = info
		},
		setSimulatedAccount(flag: boolean) {
			setItem(StorageKeyEnum.isSimulatedAccount, flag)
			this.isSimulatedAccount = flag
		},
		setAge(age: number) {
			this.age = age
		},
		setSettingInfo(info: any) {
			this.settingInfo = info
		},
		async getUserInfo() {
			if (getItem(StorageKeyEnum.token)) {
				const res = await userInfo()
				this.setUserInfo(res.data)
			}
		},
		async initCountryList() {
			const data = await getCountry()
			this.countryList = data.data
			return data.data
		},
		// 获取安全设置数据
		async initSettingInfo() {
			const res = await getSettingInfo()
			this.setSettingInfo(res.data)
			return res.data
		},

		logout() {
			// 退出登录清理用户缓存
			this.loginToken = ''
			this.name = ''
			this.age = 0
			this.userInfo = {}
			setItem(StorageKeyEnum.token, '')
			setItem(StorageKeyEnum.isSimulatedAccount, '')
			window.location.href = `/login`
		}
	},
	getters: {
		fullName: (state) => `${state.name} (${state.age} years old)`
	}
})
