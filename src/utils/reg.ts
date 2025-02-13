export const reg = {
	/**
	 * 字母数字
	 */
	alphanumeric: /^[0-9a-zA-Z]*$/,
	/**
	 * 非字母数字
	 */
	unAlphanumeric: /[^0-9a-zA-Z]*$/,
	/**
	 * 必须同时包含大小写字母数字组合6~20，特殊字符不限
	 */
	pwdRegex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,20}$/
}
