<script setup lang="ts">
import { ref, PropType, onMounted, computed } from 'vue'
import { Popover } from 'vant'
import { useI18n } from 'vue-i18n'

import { Input } from '@/components/base'
import Empty from '@/components/empty.vue'
import { onClickOutside } from '@vueuse/core'
import { useThemeStore } from '@/store/useThemeStore'

const themeStore = useThemeStore()
const modelValue = defineModel('value', { default: '' })

const open = ref(false)
const width = ref(370)
const current = ref()
const search = ref('')
const { t } = useI18n()
const target = ref(null)

type ListType = {
	areaCode: string
	zhName: string
	enName: string
	showName: string
}

const props = defineProps({
	list: {
		type: Array as PropType<ListType[]>,
		default: () => []
	}
})

onClickOutside(target, () => {
	open.value = false
})

onMounted(() => {
	width.value = current.value?.parentElement?.parentElement?.offsetWidth
})

const filterList = computed(() => {
	if (!search.value) {
		return props.list
	}
	const escapedKeyword = search.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const regex = new RegExp(escapedKeyword, 'i')
	return props.list.filter((item) => regex.test('+' + item.areaCode) || regex.test(item.showName))
})

const clickItem = (item: any) => {
	open.value = false
	modelValue.value = item.areaCode
}
</script>

<template>
	<Popover
		:theme="themeStore.theme"
		:show-arrow="false"
		v-model:show="open"
		:offset="[width / 2 - 49, 18]">
		<template #reference>
			<div class="mr-4 flex items-center" ref="current">
				<!-- <div class="w-6 h-6 rounded-full mr-2"></div> -->
				<div class="w-[40px] text-text-primary text-style-web-body-medium">+{{ modelValue }}</div>

				<div :style="{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }">
					<Icon name="components/icon5" :size="8" class="text-text-secondary" />
				</div>
			</div>
		</template>

		<template #default>
			<div
				ref="target"
				class="rounded-[6px] h-[372px] py-2 bg-background-window"
				:style="{ width: width + 'px' }">
				<div class="p-3">
					<Input v-model="search" size="small" :placeholder="t('text155')">
						<template v-slot:prefix>
							<Icon name="search" :size="20" class="mr-[10px] text-text-primary" />
						</template>
					</Input>
				</div>
				<div class="h-[calc(100%-68px)] overflow-y-auto">
					<div
						class="px-3 py-3 flex items-center"
						v-for="item in filterList"
						:key="item.areaCode + item.showName"
						:class="[modelValue === item.areaCode ? 'bg-background-tertiary' : '']"
						@click="clickItem(item)">
						<div class="w-10 mr-[10px] text-text-primary text-style-web-body-medium">
							+{{ item.areaCode }}
						</div>
						<div class="text-text-primary text-style-web-body-medium">{{ item.showName }}</div>
					</div>
					<div v-if="!filterList.length">
						<Empty />
					</div>
				</div>
			</div>
		</template>
	</Popover>
</template>
