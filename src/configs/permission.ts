import router from '@/router'
import { StorageKeyEnum } from '@/enums'
import { getItem } from '@/utils/storage'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

NProgress.configure({ showSpinner: false })

// 白名单
const whiteList = [
	'market',
	'login',
	'register',
	'forgetpwd',
	'404',
	'swap',
	'trade',
	'option',
	'follow',
	'welcome',
	'advertiseDetail',
	'helpDetail',
	'register-agreement',
	'deliveryContract',
	'welfare',
	'about',
	'helpCenter',
	'notice',
	'noticeDetail',
	'activityDetail'
]

router.beforeEach(async (to: any, from, next) => {
	NProgress.start()
	if (getItem(StorageKeyEnum.token)) {
		;['login', 'register'].includes(to.name) ? next({ path: '/' }) : next()
	} else {
		if (whiteList.includes(to.name)) {
			// 在免登录白名单，直接进入
			next()
		} else {
			if (to.name === 'login') {
				next()
			} else {
				next(`/login?redirect=${to.fullPath}`)
			}
		}
	}
})

router.afterEach(() => {
	NProgress.done()
})
