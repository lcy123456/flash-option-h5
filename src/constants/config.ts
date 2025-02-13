export const DEFAULT_LANG = 'en_US'

export const DEFAULT_THEME = 'dark'

export const BOTTOM_STUDIES = [
	'Volume',
	'MACD',
	'Relative Strength Index',
	'Stochastic',
	'Williams %R'
]

export const LANGUAGS = [
	{ label: '中文简体', value: 'zh_CN' },
	{ label: '中文繁體', value: 'zh_HK' },
	{ label: 'English', value: 'en_US' },

	{ label: '日本語', value: 'ja_JP' },
	{ label: '한국인', value: 'ko_KR' },
	{ label: 'Deutsch', value: 'de_DE' },

	{ label: 'Français', value: 'fr_FR' },
	{ label: 'Italiano', value: 'it_IT' },
	{ label: 'español', value: 'es_ES' },

	{ label: 'हिंदी', value: 'hi_IN' },
	{ label: 'Portugal', value: 'pt_PT' },
	{ label: 'Việt nam', value: 'vi_VN' },

	{ label: 'Bahasa indonesia', value: 'in_ID' },
	{ label: 'Bahasa Melayu', value: 'ms_MY' },
	{ label: 'Azərbaycan', value: 'az_AZ' },
	{ label: 'العربية', value: 'ar_SA' },
	{ label: 'Română', value: 'ro_RO' }
]

export const TIME_ZONE = [
	{ label: 'America/New_York', value: 'UTC-4' },
	{ label: 'America/Los_Angeles', value: 'UTC-7' },
	{ label: 'America/Chicago', value: 'UTC-5' },
	{ label: 'America/Phoenix', value: 'UTC-7' },
	{ label: 'America/Toronto', value: 'UTC-4' },
	{ label: 'America/Vancouver', value: 'UTC-7' },
	{ label: 'America/Argentina/Buenos_Aires', value: 'UTC-3' },
	{ label: 'America/El_Salvador', value: 'UTC-6' },
	{ label: 'America/Sao_Paulo', value: 'UTC-3' },
	{ label: 'America/Bogota', value: 'UTC-5' },
	{ label: 'America/Caracas', value: 'UTC-4' },
	{ label: 'Europe/Moscow', value: 'UTC+3' },
	{ label: 'Europe/Athens', value: 'UTC+3' },
	{ label: 'Europe/Belgrade', value: 'UTC+2' },
	{ label: 'Europe/Berlin', value: 'UTC+2' },
	{ label: 'Europe/London', value: 'UTC+1' },
	{ label: 'Europe/Luxembourg', value: 'UTC+2' },
	{ label: 'Europe/Madrid', value: 'UTC+2' },
	{ label: 'Europe/Paris', value: 'UTC+2' },
	{ label: 'Europe/Rome', value: 'UTC+2' },
	{ label: 'Europe/Warsaw', value: 'UTC+2' },
	{ label: 'Europe/Istanbul', value: 'UTC+3' },
	{ label: 'Europe/Zurich', value: 'UTC+2' },
	{ label: 'Australia/Sydney', value: 'UTC+10' },
	{ label: 'Australia/Brisbane', value: 'UTC+10' },
	{ label: 'Australia/Adelaide', value: 'UTC+9:30' },
	{ label: 'Australia/ACT', value: 'UTC+10' },
	{ label: 'Asia/Almaty', value: 'UTC+5' },
	{ label: 'Asia/Ashkhabad', value: 'UTC+5' },
	{ label: 'Asia/Tokyo', value: 'UTC+9' },
	{ label: 'Asia/Taipei', value: 'UTC+8' },
	{ label: 'Asia/Singapore', value: 'UTC+8' },
	{ label: 'Asia/Shanghai', value: 'UTC+8' },
	{ label: 'Asia/Seoul', value: 'UTC+9' },
	{ label: 'Asia/Tehran', value: 'UTC+3:30' },
	{ label: 'Asia/Dubai', value: 'UTC+4' },
	{ label: 'Asia/Kolkata', value: 'UTC+5:30' },
	{ label: 'Asia/Hong_Kong', value: 'UTC+8' },
	{ label: 'Asia/Bangkok', value: 'UTC+7' },
	{ label: 'Asia/Chongqing', value: 'UTC+8' },
	{ label: 'Asia/Jerusalem', value: 'UTC+3' },
	{ label: 'Asia/Kuwait', value: 'UTC+3' },
	{ label: 'Asia/Muscat', value: 'UTC+4' },
	{ label: 'Asia/Qatar', value: 'UTC+3' },
	{ label: 'Asia/Riyadh', value: 'UTC+3' },
	{ label: 'Pacific/Auckland', value: 'UTC+12' },
	{ label: 'Pacific/Chatham', value: 'UTC+12:45' },
	{ label: 'Pacific/Fakaofo', value: 'UTC+13' },
	{ label: 'Pacific/Honolulu', value: 'UTC-10' },
	{ label: 'America/Mexico_City', value: 'UTC-6' },
	{ label: 'Africa/Cairo', value: 'UTC+3' },
	{ label: 'Africa/Johannesburg', value: 'UTC+2' },
	{ label: 'Asia/Kathmandu', value: 'UTC+5:45' },
	{ label: 'US/Mountain', value: 'UTC-6' }
]

// Android下载链接
export const ANDROID_DONWLOAD = 'https://cytfy.qdtxuvnw.com/api/c/c48dn2q0'
// IOS下载链接
export const IOS_DONWLOAD = 'https://cytfy.qdtxuvnw.com/api/c/c48dn2q0'

export const CLIENT_SERVICE =
	'https://oedhttedr.vktqvocvbsbhjwlw.top/index?key=e2fa7aaae21385c52c094691a07825e7'
export const SHOW_CLIENT_PATH = [
	'/welcome',
	'/home/market',
	'/home/swap',
	'/home/option',
	'/home/follow',
	'/home/my/wallet',
	'/trade',
	'/welfare',
	'/home/deliveryContract'
]
//主图指标
export const mainIndicators = [
	{
		value: 'Moving Average',
		label: 'MA'
	},
	{
		value: 'Bollinger Bands',
		label: 'BOLL'
	}
]
// 副图指标
export const subIndicators = [
	{
		value: 'Volume',
		label: 'VOL'
	},
	{
		value: 'MACD',
		label: 'MACD'
	},
	{
		value: 'Relative Strength Index',
		label: 'RSI'
	},
	{
		value: 'Stochastic',
		label: 'KDJ'
	},
	{
		value: 'Williams %R',
		label: 'WR'
	}
]
// 默认K线加载数量
export const KLINE_DEFAULT_NUMS = 600

// 白皮书下载链接 https://www.gscgl.com/files/GSCGL_Exchange_whitepaper.pdf
export const WHITE_PAPER = 'https://www.gscgl.com/files/GSCGL_Exchange_whitepaper.pdf'
