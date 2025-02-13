const PREFIX = '__my__fn__'

const useCache = () => {
	if (!window[PREFIX]) {
		window[PREFIX] = {}
	}
	const get = (key: string) => {
		return window[PREFIX][key]
	}

	const set = (key: string, value: any) => {
		window[PREFIX][key] = value
	}

	const del = (key: string) => {
		delete window[PREFIX][key]
	}

	return { get, set, del }
}

export { useCache }
