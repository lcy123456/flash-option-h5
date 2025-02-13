export default [
	{
		path: '/my-follow',
		name: 'my-follow',
		meta: {
			hiddenFooter: true
		},
		component: () => import('@/views/follow/my-follow/index.vue')
	},
	{
		path: '/followed-traders',
		name: 'followed-traders',
		component: () => import('@/views/follow/followed-traders/index.vue')
	},
	{
		path: '/trader-detail',
		name: 'trader-detail',
		component: () => import('@/views/follow/trader-detail/index.vue')
	},
	{
		path: '/become-trader',
		name: 'become-trader',
		component: () => import('@/views/follow/become-trader/index.vue')
	},
	{
		path: '/trader-list',
		name: 'trader-list',
		component: () => import('@/views/follow/trader-list/index.vue')
	},
	{
		path: '/trader',
		name: 'trader',
		component: () => import('@/views/follow/trader-page/index.vue')
	},
	{
		path: '/follow/user-manage',
		name: 'follow-user-manage',
		component: () => import('@/views/follow/trader-page/user-manage/index.vue')
	}
]
