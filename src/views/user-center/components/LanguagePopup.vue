<template>
	<!-- 自定义图标 -->
	<van-popup
		round
		v-model:show="data.show"
		position="bottom"
		:style="{ height: '486px' }"
		class="!bg-background-window">
		<div class="relative">
			<div class="text-text-primary text-style-web-h3-bold h-[64px] flex items-center px-[16px]">
				<div class="flex-1">{{ t('other.txt7') }}</div>
				<Icon name="common/close" :size="24" class="text-text-primary" @click="data.show = false" />
			</div>
			<div class="px-[16px] pb-[82px]">
				<div
					class="h-[54px] flex items-center text-style-web-h4-regular text-text-secondary cursor-pointer"
					v-for="item in LANGUAGS"
					@click="data.currentLan = item.value"
					:key="item.value">
					<div class="flex-1">{{ item.label }}</div>
					<Icon
						v-if="data.currentLan === item.value"
						name="common/select-tip"
						:size="15"
						class="text-text-primary" />
				</div>
			</div>
			<div
				class="fixed bottom-0 left-0 right-0 w-full h-[82px] bg-background-window border-t border-border-strong flex items-center px-[8px] justify-between">
				<Button
					plain
					@click="data.show = false"
					class="flex-1 mr-4 h-[42px] rounded-[50px] flex items-center justify-center border-border-button_strong border text-style-web-body-bold text-text-primary">
					{{ t('my.txt37') }}
				</Button>
				<Button
					@click="handleChangeLange"
					class="flex-1 h-[42px] rounded-[50px] flex items-center justify-center bg-brand-main text-style-web-body-bold text-text-primary">
					{{ t('my.txt38') }}
				</Button>
			</div>
		</div>
	</van-popup>
</template>
<script lang="ts" setup>
import { reactive, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { changeLang } from '@/i18n'
import { LANGUAGS } from '@/constants'

const { t, locale } = useI18n()

// 定义 props
const props = defineProps({
	show: {
		type: Boolean,
		default: false
	}
})
// 定义 emits
const emit = defineEmits(['update:show'])

const data = reactive({
	show: false,
	items: [{}],
	currentLan: locale.value
})

const handleChangeLange = () => {
	changeLang(data.currentLan)
	data.show = false
}

// 监听 show 的变化
watch(
	() => props.show,
	(newValue) => {
		data.show = newValue
	}
)

// 监听内部状态的变化
watch(
	() => data.show,
	(newValue) => {
		emit('update:show', newValue)
	}
)
</script>
