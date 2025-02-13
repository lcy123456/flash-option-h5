import { createApp } from 'vue'
// 2. 引入组件样式
import 'vant/lib/index.css'
import App from './App.vue'
import vant from 'vant'
import '@/styles/index.scss'
import '@/styles/scrollbar.scss'
// main.js
import 'virtual:windi-base.css'
import 'virtual:windi-components.css'
import 'virtual:windi-utilities.css'
import 'virtual:windi.css'
import 'virtual:svg-icons-register'
// import "./style.css";
import store from './store'
import '@/configs/permission'
import router from '@/router/index'
import '@/assets/font/index.css'
import i18n from '@/i18n'
import components from './components'

// 创建全局变量
const globalData = {
	title: 'ACOIN',
	appName: 'ACOIN',
	appNameUpper: 'ACOIN',
	appNameCFN: 'ACOIN',
	webName: 'ACOIN.net'
}

const setupApp = () => {
	const app = createApp(App)

	app.provide('globalData', globalData)

	app.use(vant)
	app.use(store)
	app.use(router)
	app.use(i18n)
	app.use(components)

	app.mount('#app')

	return app
}

export const app = setupApp()

// createApp(App).use(vant).use(pinia).use(router).mount("#app");
