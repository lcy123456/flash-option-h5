<script setup lang="ts">
import { PropType } from 'vue'

import { ListView, Loading } from '@/components/base'
import Empty from '@/components/empty.vue'

const loading = defineModel('loading', { default: false })
const finished = defineModel('finished', { default: false })
const emits = defineEmits(['load'])
const onLoad = () => {
	emits('load')
}

type Column = {
	title: string | (() => any)
	key: string
	align?: string | 'left' // left right center
	render?: (item: any, column: any) => void
}
defineProps({
	columns: {
		type: Array as PropType<Column[]>,
		default: () => []
	},
	dataSource: {
		type: Array as PropType<any[]>,
		default: () => []
	},
	// true 开启下滑加载数据
	slide: {
		type: Boolean,
		default: false
	},
	maxHeight: {
		type: String,
		default: ''
	}
})

const getStyle = (item: any) => {
	const style: any = {}

	if (item.width) {
		style.width = item.width
	} else {
		style.flex = '1 1 0%'
	}

	if (item.align === 'right') {
		style.textAlign = 'right'
	} else if (item.align === 'center') {
		style.textAlign = 'center'
	}
	return style
}
</script>

<template>
	<div>
		<div class="py-3 px-4 flex items-center border-b-[1px] border-border-subtle box-border">
			<div
				v-for="item in columns"
				:key="item.key"
				class="mr-2 min:h-4 last:mr-0 text-text-description text-style-web-small-regular"
				:style="{ ...getStyle(item) }">
				<span v-if="typeof item.title === 'function'">
					<component :is="item.title()" />
				</span>
				<span v-else>{{ item.title }}</span>
			</div>
		</div>
		<div :style="{ maxHeight }" :class="maxHeight ? 'overflow-y-auto' : ''">
			<ListView
				v-if="slide"
				v-model:loading="loading"
				v-model:finished="finished"
				@load="onLoad"
				pt="pt-0">
				<div class="p-4 flex items-center" v-for="(source, key) in dataSource" :key="key">
					<div
						v-for="column in columns"
						:key="column.key"
						:style="{ ...getStyle(column) }"
						class="mr-2 last:mr-0 overflow-hidden text-ellipsis text-text-tertiary text-style-web-small-medium">
						<span v-if="column.render">
							<component :is="column.render(source, column)" />
						</span>
						<span v-else>{{ source[column.key] }}</span>
					</div>
				</div>
			</ListView>
			<div v-else>
				<div class="p-4 flex items-center" v-for="(source, key) in dataSource" :key="key">
					<div
						v-for="column in columns"
						:key="column.key"
						:style="{ ...getStyle(column) }"
						class="mr-2 last:mr-0 overflow-hidden text-ellipsis text-text-tertiary text-style-web-small-medium">
						<span v-if="column.render">
							<component :is="column.render(source, column)" />
						</span>
						<span v-else>{{ source[column.key] }}</span>
					</div>
				</div>
				<Empty v-if="!loading && !dataSource.length" />
				<Loading v-model:loading="loading" />
			</div>
		</div>
	</div>
</template>
