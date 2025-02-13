import { useThemeStore } from '@/store/useThemeStore'

// 根据主题返回样式
export const getThemeClass = (a: any, b: any) => {
	const themeStore = useThemeStore()
	return themeStore.theme === 'dark' ? a : b
}
