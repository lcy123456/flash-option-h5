import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

import { realDetail } from '@/apis/user'
import { useUserStore } from '@/store/useUserStore'

export const useKyc = () => {
	const userStore: any = useUserStore()
	const router = useRouter()
	const { t } = useI18n()

	const updateKycInfo = () => {
		realDetail().then((res) => {
			userStore.setKycDetail(res.data)
		})
	}

	const kycInfo = computed(() => {
		const enumeration: any = {
			0: 1,
			1: 3,
			2: 2
		}
		const data = {
			lable: '',
			level: enumeration[userStore.kycDetail?.auditStatus] || 0,
			textClass: '',
			bgClass: '',
			isAuth: false,
			isAuthType: 1,
			icon: '',
			idCard: userStore.kycDetail?.idCard || '',
			realName: userStore.kycDetail?.realName || '',
			rejectReason: userStore.kycDetail?.rejectReason || ''
		}

		switch (data.level) {
			case 0:
				data.lable = t('my.txt48')
				data.textClass = 'text-text-warning'
				data.bgClass = 'bg-text-warning-10'
				data.icon = 'user-center/icon18'
				break
			case 1:
				data.lable = t('my.txt73')
				data.textClass = 'text-text-disabled'
				data.bgClass = 'bg-text-disabled-10'
				data.icon = 'user-center/icon17'
				break
			case 2:
				data.lable = t('my.txt73.5')
				data.isAuth = true
				data.textClass = 'text-text-success'
				data.bgClass = 'bg-text-success-10'
				data.icon = 'user-center/icon16'
				break
			case 3:
				data.lable = t('my.txt164')
				data.textClass = 'text-text-description'
				data.bgClass = 'bg-text-warning-10'
				data.icon = 'user-center/icon21'
				break
			default:
				break
		}
		return data
	})

	const toKyc = () => {
		router.push('/user/kyc')
	}

	return { kycInfo, updateKycInfo, toKyc }
}
