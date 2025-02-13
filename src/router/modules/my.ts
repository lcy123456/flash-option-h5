import i18n from '@/i18n/index'
export default [
	{
		path: '/my',
		name: 'my',
		meta: {
			title: i18n.global.t(`menu.txt2`),
			icon: 'asset'
		},
		component: () => import('@/views/my/index.vue'),
		children: [
			{
				path: '/my/spot-account',
				name: 'spot-account',
				component: () => import('@/views/my/spot-account/index.vue')
			},
			{
				path: '/my/swap-account',
				name: 'swap-account',
				component: () => import('@/views/my/swap-account/index.vue')
			},
			{
				path: '/my/follow-account',
				name: 'follow-account',
				component: () => import('@/views/my/follow-account/index.vue')
			},
			{
				path: '/my/deposit',
				name: 'deposit',
				component: () => import('@/views/my/deposit/index.vue')
			},
			{
				path: '/my/withdraw',
				name: 'withdraw',
				component: () => import('@/views/my/withdraw/index.vue')
			},
			{
				path: '/my/record',
				name: 'record',
				component: () => import('@/views/my/record/index.vue')
			},
			{ path: '/my/transfer', component: () => import('@/views/my/transfer/index.vue') }
		]
	}
]
