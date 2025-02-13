export enum StorageType {
	Local,
	Session
}
/**
 * 存储数据
 */
export const setItem = (key: string, value: any, type: StorageType = StorageType.Local) => {
	value = JSON.stringify(value)
	const storage = type === StorageType.Local ? window.localStorage : window.sessionStorage
	storage.setItem(key, value)
}
/**
 * 获取数据
 */
export const getItem = (key: string, type: StorageType = StorageType.Local) => {
	const storage = type === StorageType.Local ? window.localStorage : window.sessionStorage
	const data: any = storage.getItem(key)
	try {
		return JSON.parse(data)
	} catch (err) {
		return data
	}
}

/**
 * 删除数据
 */
export const removeItem = (key: string, type: StorageType = StorageType.Local) => {
	const storage = type === StorageType.Local ? window.localStorage : window.sessionStorage
	storage.removeItem(key)
}

/**
 * 删除所有数据
 */
export const clear = (type: StorageType = StorageType.Local) => {
	const storage = type === StorageType.Local ? window.localStorage : window.sessionStorage
	storage.clear()
}
