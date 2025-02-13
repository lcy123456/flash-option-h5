import { watch, ref } from 'vue'
import { useUserStore } from '@/store/useUserStore'
import { useI18n } from 'vue-i18n'

export const useSecuritySetting = () => {
	const userStore = useUserStore()
	const { t } = useI18n()

	const settingInfo: any = ref({
		isGoogleAuth: false,
		isEmailAuth: false,
		isMobileAuth: false,
		isFundPwd: false,
		isLoginAuth: false,
		securityLevel: 2,
		email: '',
		mobilePhone: '',
		googleDate: '',
		levelInfo: {
			title: '',
			textClass: '',
			bgClass: ''
		},
		data: {}
	})

	watch(
		() => userStore.settingInfo,
		(newSettingInfo: any) => {
			if (newSettingInfo.id) {
				let level = 0
				settingInfo.value.isGoogleAuth = newSettingInfo.googleStatus === 1
				settingInfo.value.isEmailAuth = newSettingInfo.emailVerified === 1
				settingInfo.value.isMobileAuth = newSettingInfo.phoneVerified === 1
				settingInfo.value.isFundPwd = newSettingInfo.fundsVerified === 1
				settingInfo.value.isLoginAuth = newSettingInfo.loginVerified === 1
				settingInfo.value.email = newSettingInfo.email
				settingInfo.value.mobilePhone = newSettingInfo.mobilePhone
				settingInfo.value.googleDate = newSettingInfo.googleDate
				// settingInfo.value.isMobileAuth = true

				if (settingInfo.value.isGoogleAuth) {
					++level
				}
				if (settingInfo.value.isEmailAuth) {
					++level
				}
				if (settingInfo.value.isMobileAuth) {
					++level
				}
				settingInfo.value.securityLevel = level
				switch (level) {
					case 1:
						settingInfo.value.levelInfo.title = t('my.txt59')
						settingInfo.value.levelInfo.textClass = 'text-text-error'
						settingInfo.value.levelInfo.bgClass = 'bg-text-error'
						break
					case 2:
						settingInfo.value.levelInfo.title = t('my.txt60')
						settingInfo.value.levelInfo.textClass = 'text-text-warning'
						settingInfo.value.levelInfo.bgClass = 'bg-text-warning'
						break
					case 3:
						settingInfo.value.levelInfo.title = t('my.txt61')
						settingInfo.value.levelInfo.textClass = 'text-text-success'
						settingInfo.value.levelInfo.bgClass = 'bg-text-success'
						break
					default:
						break
				}

				settingInfo.value.data = newSettingInfo
			}
		},
		{
			immediate: true,
			deep: true
		}
	)

	const updateSettingInfo = async () => {
		return await userStore.initSettingInfo()
	}

	return { settingInfo, updateSettingInfo }
}
