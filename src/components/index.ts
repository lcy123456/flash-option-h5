import { App } from 'vue'
import Icon from './base/icon/index.vue'

export default {
	install(app: App) {
		app.component('base-icon', Icon)
		app.component('icon', Icon)
	}
}
