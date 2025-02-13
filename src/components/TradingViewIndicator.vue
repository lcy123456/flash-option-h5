<template>
	<el-popover :show-arrow="false" placement="bottom-end" title="Title" :width="300" trigger="hover">
		<div class="p-[8px]">
			<div class="flex items-center"></div>
		</div>

		<template #reference>
			<slot />
		</template>
	</el-popover>
</template>
