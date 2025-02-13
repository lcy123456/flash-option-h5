import { useRoute, useRouter } from 'vue-router'
import { computed } from 'vue'

export default function useBreadcrumb() {
	const route = useRoute()
	const router = useRouter()

	const breadcrumbs = computed(() => {
		const routes = router.getRoutes()
		const matched = route.matched
		const breadcrumbList = []

		matched.forEach((match) => {
			const routeMeta = routes.find((r) => r.name === match.name)?.meta
			if (routeMeta && routeMeta.title) {
				breadcrumbList.push({
					path: match.path,
					name: match.name,
					title: routeMeta.title
				})
			}
		})

		return breadcrumbList
	})

	return {
		breadcrumbs
	}
}
