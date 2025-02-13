// index.ts
import { createI18n } from 'vue-i18n'
import { DEFAULT_LANG } from '@/constants'
import zh_CN from './lang/zh_CN.json' // 中文简体
import zh_HK from './lang/zh_HK.json' // 中文繁体
import en_US from './lang/en_US.json' // 英文
import ja_JP from './lang/ja_JP.json' // 日语
import ko_KR from './lang/ko_KR.json' // 韩语
import de_DE from './lang/de_DE.json' // 德语
import fr_FR from './lang/fr_FR.json' // 法语
import it_IT from './lang/it_IT.json' // 意大利语
import es_ES from './lang/es_ES.json' // 西班牙语

import hi_IN from './lang/hi_IN.json' // 印地语
import pt_PT from './lang/pt_PT.json' // 葡萄牙

import vi_VN from './lang/vi_VN.json' // 越南语
import in_ID from './lang/in_ID.json' // 印尼语
import ms_MY from './lang/ms_MY.json' // 马来语
import az_AZ from './lang/az_AZ.json' // 阿塞拜疆语
import ar_SA from './lang/ar_SA.json' // 阿拉伯语
import ro_RO from './lang/ro_RO.json' // 罗马尼亚语

const lang = localStorage.getItem('language') || DEFAULT_LANG
localStorage.setItem('language', lang)
const messages = {
	zh_CN,
	zh_HK,
	en_US,
	ja_JP,
	ko_KR,
	de_DE,
	fr_FR,
	it_IT,
	es_ES,
	hi_IN,
	pt_PT,
	vi_VN,
	in_ID,
	ms_MY,
	az_AZ,
	ar_SA,
	ro_RO
}
const i18n = createI18n({
	// 使用 Composition API 模式，则需要将其设置为false
	legacy: false,
	// 全局注入 $t 函数
	globalInjection: true,
	locale: lang, // 首先从缓存里拿，没有的话就用浏览器语言，
	messages,
	missingWarn: false,
	fallbackWarn: false,
	warnHtmlMessage: false
})
export const changeLang = (lang: any) => {
	localStorage.setItem('language', lang)
	i18n.global.locale.value = lang
	location.reload()
}

export default i18n
