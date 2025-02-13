let notice = { title: '', content: '', id: '' }
export const useNotices = () => {
	const setNotice = (item: any) => {
		notice = item
	}

	return {
		setNotice,
		notice
	}
}
