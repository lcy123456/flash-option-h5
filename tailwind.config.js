/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
	theme: {
		screens: {
			ph: { max: '744px' }, // phone
			pd: { max: '1200px', min: '744px' }, // ipad
			pdph: { max: '1200px' }, // pdph
			web: { min: '1200px' } // web
		},
		extend: {
			colors: {
				primary: 'var(--color-primary)',
				secondary: 'var(--color-secondary)',
				success: 'var(--color-success)',
				danger: 'var(--color-danger)',

				'always-black': 'var(--color-always-black)',
				'always-white': 'var(--color-always-white)',

				'background-disabled': 'var(--color-background-disabled)',
				'background-inverse-primary': 'var(--color-background-inverse-primary)',
				'background-primary': 'var(--color-background-primary)',
				'background-secondary': 'var(--color-background-secondary)',
				'background-secondary1': 'var(--color-background-secondary1)',
				'background-tertiary': 'var(--color-background-tertiary)',
				'background-top-universal': 'var(--color-background-top-universal)',
				'background-mask': 'var(--color-background-mask)',
				'background-warning': 'var(--color-background-warning)',
				'background-window': 'var(--color-background-window)',
				'background-special': 'var(--color-background-special)',

				'border-button_line': 'var(--color-border-button-line)',
				'border-button_strong': 'var(--color-border-button-strong)',
				'border-gutter': 'var(--color-border-gutter)',
				'border-strong': 'var(--color-border-strong)',
				'border-subtle': 'var(--color-border-subtle)',

				'brand-main': 'var(--color-brand-main)',
				'brand-blue': 'var(--color-brand-blue)',

				'function-buy': 'var(--color-function-buy)',
				'function-buy-disabled': 'var(--color-function-buy-disabled)',
				'function-buy-light-background': 'var(--color-function-buy-light-background)',
				'function-buy-volume': 'var(--color-function-buy-volume)',
				'function-sell': 'var(--color-function-sell)',
				'function-sell-disabled': 'var(--color-function-sell-disabled)',
				'function-sell-light-backgroundr': 'var(--color-function-sell-light-backgroundr)',
				'function-sell-volume': 'var(--color-function-sell-volume)',

				'text-brand': 'var(--color-text-brand)',
				'text-brand2': 'var(--color-text-brand2)',
				'text-brand3': 'var(--color-text-brand3)',
				'text-brand4': 'var(--color-text-brand4)',
				'text-brand5': 'var(--color-text-brand5)',
				'text-description': 'var(--color-text-description)',
				'text-disabled': 'var(--color-text-disabled)',
				'text-error': 'var(--color-text-error)',
				'text-inverse-primary': 'var(--color-text-inverse-primary)',
				'text-inverse-secondary': 'var(--color-text-inverse-secondary)',
				'text-inverse-tertiary': 'var(--color-text-inverse-tertiary)',
				'text-primary': 'var(--color-text-primary)',
				'text-secondary': 'var(--color-text-secondary)',
				'text-success': 'var(--color-text-success)',
				'text-tertiary': 'var(--color-text-tertiary)',
				'text-tips': 'var(--color-text-tips)',
				'text-warning': 'var(--color-text-warning)',

				'transaction-blu': 'var(--color-transaction-blu)',
				'transaction-pur': 'var(--color-transaction-pur)',
				'transaction-yel': 'var(--color-transaction-yel)',

				// ------

				'bg-1': 'var(--color-bg-1)',
				'background-cue': 'var(--color-text-cue)',
				'border-brand': 'var(--color-text-brand)',
				'function-sell-light-background': 'var(--color-function-sell-light-background)',

				'text-disabled-10': 'rgba(164, 172, 193, 0.10)',
				'text-error-10': 'rgba(241, 96, 109, 0.10)',
				'text-warning-10': 'rgba(255, 145, 66, 0.10)',
				'text-success-0.05': 'rgba(40, 173, 118, 0.05)',
				'text-success-10': 'rgba(40, 173, 118, 0.1)',
				'text-brand-10': 'rgba(23, 84, 248, 0.10)',
				'function-sell-10': 'rgba(253, 61, 73, 0.10)',
				'brand-main-20': 'rgba(23, 84, 248, 0.20)'
			},
			fontFamily: {
				light: ['HarmonyOS Sans SC Light'],
				regular: ['HarmonyOS Sans SC Regular'],
				medium: ['HarmonyOS Sans SC Medium'],
				bold: ['HarmonyOS Sans SC Bold']
			},
			fontSize: {
				xs: ['12px'],
				sm: ['14px'],
				base: ['16px'],
				lg: ['24px'],
				xl: ['40px'],
				'2xl': ['50px']
			}
		}
	},
	plugins: []
}
