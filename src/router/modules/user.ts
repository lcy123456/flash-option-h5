export default [
	{
		path: '/user',
		name: 'user',
		component: () => import('@/views/user-center/index.vue')
	},
	{
		path: '/user/security-setting',
		name: 'user-security-setting',
		component: () => import('@/views/user-center/security-setting/index.vue')
	},
	{
		path: '/user/security-setting/email',
		name: 'user-security-setting-email',
		component: () => import('@/views/user-center/security-setting/email.vue')
	},
	{
		path: '/user/security-setting/mobile',
		name: 'user-security-setting-mobile',
		component: () => import('@/views/user-center/security-setting/mobile.vue')
	},
	{
		path: '/user/security-setting/pwd',
		name: 'user-security-setting-pwd',
		component: () => import('@/views/user-center/security-setting/pwd.vue')
	},
	{
		path: '/user/security-setting/google',
		name: 'user-security-setting-google',
		component: () => import('@/views/user-center/security-setting/google/index.vue')
	},
	{
		path: '/user/kyc',
		name: 'user-kyc',
		component: () => import('@/views/user-center/identity-auth/index.vue')
	},
	{
		path: '/user/overview',
		name: 'user-overview',
		component: () => import('@/views/user-center/overview/index.vue')
	}
]
