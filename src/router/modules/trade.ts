import i18n from '@/i18n/index'
export default [
	{
		path: '/trade/:symbol',
		name: 'trade',
		meta: {
			title: i18n.global.t(`menu.txt1`),
			hiddenFooter: true
		},
		component: () => import('@/views/trade/index.vue')
	}
]
