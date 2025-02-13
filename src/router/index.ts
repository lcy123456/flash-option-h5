import { createRouter, createWebHashHistory, createWebHistory, RouteRecordRaw } from 'vue-router'
import trade from '@/router/modules/trade.ts'
import my from '@/router/modules/my'
import follow from '@/router/modules/follow'
import user from '@/router/modules/user'
// import web from '@/router/web'
import i18n from '@/i18n/index'
// import OptionPage from '@/views/option/index.vue'
// import SwapPage from '@/views/swap/index.vue'

export const routes: Array<RouteRecordRaw> = [
	{
		path: '/home',
		name: 'home',
		component: () => import('@/views/home/Home.vue'),
		redirect: '/home/market',
		children: [
			{
				path: '/home/market',
				name: 'market',
				meta: {
					title: i18n.global.t(`menu.txt3`),
					isHome: true,
					icon: 'home'
				},
				component: () => import('@/views/market/index.vue')
			},
			{
				path: '/home/swap/:symbol',
				name: 'swap',
				meta: {
					title: i18n.global.t(`text129`),
					isHome: true,
					hiddenFooter: true,
					icon: 'contract'
				},
				component: () => import('@/views/swap/index.vue')
				// component: SwapPage
			},
			// {
			// 	path: '/home/option',
			// 	name: 'option',
			// 	meta: {
			// 		title: i18n.global.t(`home.txt10`),
			// 		isHome: true,
			// 		icon: 'option'
			// 	},
			// 	component: OptionPage
			// },
			{
				path: '/home/deliveryContract/:symbol',
				name: 'deliveryContract',
				meta: {
					title: i18n.global.t(`text130`),
					isHome: true,
					hiddenFooter: true,
					icon: 'option'
				},
				component: () => import('@/views/delivery-contract/index.vue')
				// component: OptionPage
			},
			{
				path: '/home/follow',
				name: 'follow',
				meta: {
					title: i18n.global.t(`menu.txt6`),
					isHome: true,
					hiddenFooter: true,
					icon: 'follow'
				},
				component: () => import('@/views/follow/index.vue')
			},

			{
				path: '/home/my/wallet',
				name: 'wallet',
				component: () => import('@/views/my/wallet/index.vue'),
				meta: {
					isHome: true,
					icon: 'asset',
					title: i18n.global.t(`my.txt49`)
				}
			}
		]
	},
	{
		path: '/',
		name: 'main',
		component: () => import('@/views/index.vue'),
		redirect: '/home/market',
		children: [
			...trade,
			...follow,
			...my,
			...user,
			{
				path: '/login',
				name: 'login',
				meta: {
					hiddenFooter: true
				},
				component: () => import('@/views/login/index.vue')
			},
			{
				path: '/register',
				name: 'register',
				meta: {
					hiddenFooter: true
				},
				component: () => import('@/views/register/index.vue')
			},
			{
				path: '/register-agreement',
				name: 'register-agreement',
				component: () => import('@/views/register/agreement/index.vue')
			},
			{
				path: '/forgetpwd',
				name: 'forgetpwd',
				meta: {
					hiddenFooter: true
				},
				component: () => import('@/views/forgetpwd/index.vue')
			},
			{ path: '/about', name: 'about', component: () => import('@/views/about/index.vue') },
			{
				path: '/helpCenter',
				name: 'helpCenter',
				component: () => import('@/views/help-center/index.vue')
			},
			{
				path: '/helpDetail',
				name: 'helpDetail',
				component: () => import('@/views/help-center/detail.vue')
			},
			{ path: '/notice', component: () => import('@/views/notice/index.vue') },
			{
				path: '/notice/detail/:id',
				name: 'noticeDetail',
				component: () => import('@/views/notice/detail.vue')
			},
			{
				path: '/advertise/detail/:id',
				name: 'advertiseDetail',
				component: () => import('@/views/advertise/detail.vue')
			},
			{ path: '/invite', component: () => import('@/views/invite/index.vue') },
			{ path: '/invite/detail', component: () => import('@/views/invite/detail.vue') },
			{ path: '/activitycenter', component: () => import('@/views/activitycenter/index.vue') },
			{
				path: '/activitycenter/detail/:id',
				name: 'activityDetail',
				component: () => import('@/views/activitycenter/detail.vue')
			}
			// {
			// 	path: '/welcome',
			// 	name: 'welcome',
			// 	component: () => import('@/views/welcome/index.vue')
			// },
			// {
			// 	path: '/welfare',
			// 	name: 'welfare',
			// 	component: () => import('@/views/welfare/index.vue')
			// }
		]
	},
	// ...web,
	{
		path: '/:catchAll(.*)',
		redirect: '/home/market'
	}
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
	scrollBehavior() {
		return { top: 0 }
	}
})

export default router
