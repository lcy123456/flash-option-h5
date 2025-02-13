import axios from 'axios'
import qs from 'qs'
import { showFailToast } from '@/components/base/toast'
import { useUserStore } from '@/store/useUserStore'
import { StorageKeyEnum } from '@/enums'
import { setItem, getItem } from '@/utils/storage'
import router from '@/router/index.ts'
// import { useAppStore } from '@/store/useAppStore'
import i18n from '@/i18n/index'

const TIME_OUT = 30 * 1000

export function request(opts: any) {
	const instance = axios.create({
		timeout: TIME_OUT
	})
	setInterceptors(instance)
	return instance(opts)
}

//拦截器
function setInterceptors(instance: any) {
	//请求拦截器
	instance.interceptors.request.use((config: any) => {
		const lang = localStorage.getItem('language')
		// if (lang != null) {
		// 	lang = lang.substr(1)
		// 	lang = lang.substr(0, lang.length - 1)
		// }

		const header = {
			// "Content-Type": 'application/json;charset=UTF-8',
			'Content-Type': 'application/x-www-form-urlencoded',
			'x-auth-token': getItem(StorageKeyEnum.token),
			'client-type': 'h5',
			lang
		}
		config.headers = {
			...header,
			...config.headers
		}
		return config
	})

	//响应拦截器
	instance.interceptors.response.use(
		async (res: any) => {
			if (res.status == 200) {
				//登录极验证时需获取后台返回的TOKEN值
				const xAuthToken = res.headers.get('x-auth-token')
				if (xAuthToken != null && xAuthToken != '') {
					// setItem(StorageKeyEnum.token, xAuthToken)
				}
				if (res.data.code == '4000') {
					const userStore = useUserStore()
					// 退出登录
					await userStore.logout()
					// window.location.href = '/login'
					router.push({ name: 'login' })
				}
				if (res.data.code !== 0) {
					showFailToast(res.data?.message || res.data?.msg)
				}
				return Promise.resolve(res.data)
			} else {
				showFailToast(res.data?.message || res.data?.msg)
				return Promise.resolve({ code: -1, data: res.data })
			}
		},
		(err: any) => {
			console.log('err :', err)
			// const appStore = useAppStore()
			if (
				err.code === 'ECONNABORTED' ||
				err.message === 'Network Error' ||
				err.message.includes('timeout')
			) {
				// appStore.httpCode = 1
				// showFailToast(res.data?.message || res.data?.msg)
				showFailToast(i18n.global.t('common.txt1'))
			} else {
				showFailToast(i18n.global.t('common.txt1'))
				// appStore.httpCode = 2
				// showFailToast(res.data?.message || res.data?.msg)
			}
			return Promise.resolve({ code: -1, data: err })
		}
	)
}

//封装get请求
export function get(url: string, options?: any, headers?: any) {
	return request({
		url: url,
		method: 'get',
		params: options,
		headers
	})
}

//封装post请求
export function post(url: string, options?: any, headers?: any) {
	return request({
		url: url,
		method: 'post',
		headers,
		data: qs.stringify(options)
	})
}

//封装post请求
export function postJson(url: string, options?: any) {
	return request({
		url: url,
		method: 'post',
		headers: {
			'Content-Type': 'application/json'
		},
		data: options
	})
}

//封装post请求
export function postQuery(url: string, options?: any, headers?: any) {
	return request({
		url: url,
		method: 'post',
		headers,
		params: options
	})
}

//封装put请求
export function put(url: string, options?: any, headers?: any) {
	return request({
		url: url,
		method: 'put',
		headers,
		data: qs.stringify(options)
	})
}

/**
 * 文件上传
 * @param {*} url
 * @param {*} file
 * @returns
 */
export function uploadFile(url: string, file: any) {
	const param = new FormData() // 创建form对象
	//注意files是对应后台的参数名哦
	// 通过append向form对象添加数据
	param.append('file', file)
	const headers = {
		'Content-type': 'multipart/form-data'
	}
	return request({
		url: url,
		method: 'post',
		headers,
		data: param
	})
}

// export default {
//   get,
//   post,
//   uploadFile,
// };
