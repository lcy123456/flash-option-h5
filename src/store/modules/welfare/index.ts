import { defineStore } from 'pinia'
import { isEmpty } from 'lodash'
import { useRouter, useRoute } from 'vue-router'
import { getNewcomerActivity } from '@/apis/user'

export const useWelfareStore = defineStore('welfare', {
	state: () => ({
		data: null
	}),
	actions: {
		async init() {
			const router = useRouter()
			const route = useRoute()
			const [res]: any = await Promise.all([getNewcomerActivity()])
			if (res.code === 0) {
				if (!isEmpty(res.data)) {
					this.data = res.data
				} else {
					if (route.path.includes('/welfare')) {
						router.push('/')
					}
				}
			}
		}
	}
})
