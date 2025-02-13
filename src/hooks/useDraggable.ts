import { onUnmounted, ref, onMounted, watch } from 'vue'
import type { Ref } from 'vue'

export const useDraggable = (): Ref<HTMLDivElement | null> => {
	const divRef = ref<HTMLDivElement | null>(null)

	let offsetX = 0 // 鼠标点击或触摸点距离 div 左侧的偏移
	let offsetY = 0 // 鼠标点击或触摸点距离 div 顶部的偏移
	let isDragging = false // 是否正在拖拽中

	const disablePageScroll = () => {
		document.body.style.overflow = 'hidden'
	}

	const enablePageScroll = () => {
		document.body.style.overflow = 'auto'
	}

	const startDragging = () => {
		isDragging = true
		disablePageScroll()
	}

	const stopDragging = () => {
		isDragging = false
		enablePageScroll()
		setTimeout(() => {
			if (divRef.value) {
				divRef.value.style.pointerEvents = 'auto'
			}
		}, 100)
	}

	const handleMouseMove = (event: MouseEvent | TouchEvent) => {
		requestAnimationFrame(() => {
			if (isDragging && divRef.value) {
				const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX
				const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY
				const x = clientX - offsetX
				const y = clientY - offsetY

				event.stopPropagation()
				event.preventDefault()

				const maxX = window.innerWidth - (divRef.value.clientWidth || 0)
				const maxY = window.innerHeight - (divRef.value.clientHeight || 0)

				divRef.value.style.left = `${Math.min(maxX, Math.max(0, x))}px`
				divRef.value.style.top = `${Math.min(maxY, Math.max(0, y))}px`

				divRef.value.style.pointerEvents = 'none'
			}
		})
	}

	const handleMouseUp = () => {
		stopDragging()

		document.removeEventListener('touchmove', handleMouseMove)
		document.removeEventListener('mousemove', handleMouseMove)
	}

	const handleMouseDown = (event: MouseEvent | TouchEvent) => {
		if (!divRef.value) return

		offsetX =
			'touches' in event
				? event.touches[0].clientX - divRef.value.offsetLeft
				: event.clientX - divRef.value.offsetLeft
		offsetY =
			'touches' in event
				? event.touches[0].clientY - divRef.value.offsetTop
				: event.clientY - divRef.value.offsetTop

		startDragging()
		document.addEventListener('mousemove', handleMouseMove, {
			passive: false
		})
		document.addEventListener('touchmove', handleMouseMove, {
			passive: false
		})

		document.addEventListener('mouseup', handleMouseUp)
		document.addEventListener('touchend', handleMouseUp)
	}

	watch(
		() => divRef.value,
		() => {
			if (divRef.value) {
				divRef.value.addEventListener('mousedown', handleMouseDown)
				divRef.value.addEventListener('touchstart', handleMouseDown)
			}
		}
	)

	onMounted(() => {
		if (divRef.value) {
			divRef.value.addEventListener('mousedown', handleMouseDown)
			divRef.value.addEventListener('touchstart', handleMouseDown)
		}
	})

	onUnmounted(() => {
		if (divRef.value) {
			divRef.value.removeEventListener('mousedown', handleMouseDown)
			divRef.value.removeEventListener('touchstart', handleMouseDown)
		}
		document.removeEventListener('mouseup', handleMouseUp)
		document.removeEventListener('touchend', handleMouseUp)
	})

	return divRef
}
