import { defineStore } from 'pinia'
import { StorageKeyEnum } from '@/enums'
import { setItem, getItem } from '@/utils/storage'

const DEFAULT_THEME = 'light'

export const useThemeStore = defineStore('theme', {
	state: () => ({
		// theme: getItem(StorageKeyEnum.THEME) || DEFAULT_THEME
		theme: DEFAULT_THEME
	}),
	actions: {
		setTheme(val: string) {
			// setItem(StorageKeyEnum.THEME, val)
			// this.theme = val
			// const htmlElem: any = document.querySelector('html')
			// if (val === 'light') {
			// 	htmlElem.classList.remove('dark')
			// 	htmlElem.classList.add('light')
			// } else {
			// 	htmlElem.classList.remove('light')
			// 	htmlElem.classList.add('dark')
			// }
		},

		init() {
			this.setTheme(this.theme)
		},

		changeTheme() {
			this.setTheme(this.theme === 'light' ? 'dark' : 'light')
		}
	}
})
