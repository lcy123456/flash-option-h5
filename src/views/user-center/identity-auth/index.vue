<script setup lang="ts">
import { reactive, ref, shallowRef, onBeforeMount, computed, watchEffect, inject } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { showFailToast, showSuccessToast } from '@/components/base/toast'
import { useUserStore } from '@/store/useUserStore'
import { useKyc } from '@/hooks/useKyc'

import Menu from '@/views/user-center/components/Menu.vue'
import { Breadcrumb, Button } from '@/components/base'
import Select from '@/components/base/select/index.vue'
import Checkbox from '@/components/base/checkbox/index.vue'
import Input from '@/components/base/input/index.vue'
import Tip from '@/components/base/tip/index.vue'
import UploadID from './components/UploadID.vue'
import { realAuth } from '@/apis/user'
import { reg } from '@/utils/reg'
import Empty from '@/components/empty.vue'
import { useDevice } from '@/hooks/useDevice'

const globalData: any = inject('globalData')
const router = useRouter()
const { t } = useI18n()
const userStore = useUserStore()
const step = ref(1)
const country = ref('')
const idType = ref('1')
const lastName = ref('')
const firstName = ref('')
const idCard = ref('')
const idCardFront = ref('')
const idCardBack = ref('')
const handHeldIdCard = ref('')
const search = ref('')
const { isWeb } = useDevice()

const countryOpen = ref(false)
const countryList: any = shallowRef([])
const { kycInfo, updateKycInfo } = useKyc()

const items = reactive([
	{
		title: t('my.txt57'),
		path: '/user'
	},
	{
		title: t('my.txt74')
	}
])

onBeforeMount(() => {
	updateKycInfo()
	userStore.initCountryList()
})

const disabled = computed(() => !(firstName.value && lastName.value && idCard.value))

const disabled4 = computed(() => {
	if (!idCardFront.value) return true

	if (idType.value === '1') {
		if (!idCardBack.value) return true
	}

	if (!handHeldIdCard.value) return true

	return false
})

watchEffect(() => {
	const list: any = userStore.countryList
	if (Array.isArray(list) && list.length) {
		country.value = list[0].areaCode
		countryList.value = list.map((item: any) => {
			return {
				...item,
				label: item.showName,
				value: item.areaCode
			}
		})
	}
})

const filterCountryList = computed(() => {
	if (!search.value) {
		return countryList.value
	}
	const escapedKeyword = search.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	const regex = new RegExp(escapedKeyword, 'i')
	return countryList.value.filter(
		(item: any) => regex.test('+' + item.areaCode) || regex.test(item.showName)
	)
})

const changeSelect = (item: any) => {
	country.value = item.areaCode
	countryOpen.value = false
}

const submit = async () => {
	const params: any = {
		country: country.value,
		idType: idType.value,
		lastName: lastName.value,
		firstName: firstName.value,
		idCard: idCard.value,
		idCardFront: idCardFront.value,
		handHeldIdCard: handHeldIdCard.value
	}

	if (idType.value === '1') {
		params.idCardBack = idCardBack.value
	}
	const res: any = await realAuth(params)
	if (res.code === 0) {
		updateKycInfo()
		step.value = 5
		showSuccessToast(res.message)
	} else {
		showFailToast(res.message)
	}
}

const toNextStep4 = () => {
	console.log('idCard', idCard.value)
	if (idCard.value.length < 8) {
		showFailToast(t('text365'))
		return
	}
	step.value = 4
}
</script>

<template>
	<div class="web:hidden">
		<Breadcrumb :items="items" />
		<div>
			<div class="py-6 px-4" v-if="kycInfo.isAuth">
				<div class="text-text-primary text-style-web-h1-medium">{{ t('my.txt74') }}</div>
				<div>
					<div class="py-6 flex items-center">
						<base-icon name="user-center/icon14" :size="24" />
						<div class="ml-[6px] text-text-success text-style-web-h2-medium">
							{{ kycInfo.lable }}
						</div>
					</div>
					<div class="border border-border-strong rounded-lg py-6 px-4">
						<div class="flex items-center">
							<div class="text-text-description text-style-web-body-medium mr-1">
								{{ t('my.txt93') }}
							</div>
							<div class="text-text-secondary text-style-web-body-medium">
								{{ kycInfo.realName }}
							</div>
						</div>
						<div class="flex items-center mt-4">
							<div class="text-text-description text-style-web-body-medium mr-1">
								{{ t('my.txt94') }}
							</div>
							<div class="text-text-secondary text-style-web-body-medium">{{ kycInfo.idCard }}</div>
						</div>
					</div>
					<Tip class="mt-3">
						{{ t('my.txt76', { num: globalData.appNameUpper }) }}
					</Tip>
				</div>
			</div>

			<div v-else>
				<div class="py-6 px-4" v-if="step === 1">
					<div class="text-text-primary text-style-web-h1-medium">{{ t('my.txt74') }}</div>
					<div>
						<div class="py-6 flex items-center">
							<base-icon :name="kycInfo.icon" :size="24" />
							<div class="ml-[6px] text-style-web-h2-medium" :class="[kycInfo.textClass]">
								{{ kycInfo.lable }}
							</div>
						</div>
						<div class="border border-border-strong rounded-lg py-6 px-4">
							<div class="w-[200px] h-[182px] mx-auto">
								<img class="w-full h-full" src="@/assets/img/user-center/icon.png" alt="" />
							</div>

							<div
								v-if="kycInfo.level === 3"
								class="py-6 text-text-description text-style-web-base-regular text-center">
								{{ kycInfo.rejectReason }}
							</div>
							<div
								v-else
								class="py-6 text-text-description text-style-web-base-regular text-center">
								{{ t('my.txt75') }}
							</div>

							<Tip>{{ t('my.txt76', { num: globalData.appNameUpper }) }}</Tip>

							<van-button
								v-if="kycInfo.level === 0"
								@click="step = 2"
								round
								block
								type="primary"
								class="mt-6 text-text-inverse-primary text-style-web-h5-bold">
								{{ t('my.txt77') }}
							</van-button>
							<van-button
								v-if="kycInfo.level === 3"
								@click="step = 2"
								round
								block
								type="primary"
								class="mt-6 text-text-inverse-primary text-style-web-h5-bold">
								{{ t('my.txt140') }}
							</van-button>
						</div>
					</div>
				</div>

				<div class="py-6 px-4" v-if="step === 2">
					<div class="text-text-primary text-style-web-h1-medium">{{ t('my.txt97') }}</div>

					<Select
						v-if="!isWeb"
						class="mt-3"
						:close-on-click-outside="true"
						v-model:value="country"
						v-model:open="countryOpen"
						:options="countryList">
						<div class="h-[288px]">
							<div class="p-3">
								<Input v-model="search" size="small" :placeholder="t('text155')">
									<template v-slot:prefix>
										<Icon name="search" :size="20" class="mr-[10px] text-text-primary" />
									</template>
								</Input>
							</div>
							<div
								v-for="item in filterCountryList"
								:key="item.value + item.label + item.areaCode"
								@click="changeSelect(item)"
								class="flex justify-between items-center p-3">
								<div class="flex items-center">
									<div class="w-10 text-text-primary text-style-web-body-medium">
										+{{ item.areaCode }}
									</div>
									<div class="text-text-primary text-style-web-body-medium">{{ item.label }}</div>
								</div>
								<Checkbox shape="round" :value="country === item.value" />
							</div>
							<div v-if="!filterCountryList.length">
								<Empty className="!pt-10" />
							</div>
						</div>
					</Select>

					<div class="mt-6 text-text-primary text-style-web-h1-medium">{{ t('my.txt98') }}</div>
					<div
						@click="idType = '1'"
						class="mt-3 border border-border-strong rounded-[6px] py-[15px] px-4 flex justify-between items-center">
						<div class="text-text-primary text-style-web-body-medium">{{ t('my.txt99') }}</div>
						<base-icon
							class="text-border-strong"
							:name="idType === '1' ? 'vant/round_yes' : 'vant/round_no'"
							:dark-name="idType === '1' ? 'vant/round_yes_dark' : 'vant/round_no_dark'"
							:size="18" />
					</div>
					<div
						@click="idType = '2'"
						class="mt-3 border border-border-strong rounded-[6px] py-[15px] px-4 flex justify-between items-center">
						<div class="text-text-primary text-style-web-body-medium">{{ t('my.txt100') }}</div>
						<base-icon
							class="text-border-strong"
							:name="idType === '2' ? 'vant/round_yes' : 'vant/round_no'"
							:dark-name="idType === '2' ? 'vant/round_yes_dark' : 'vant/round_no_dark'"
							:size="18" />
					</div>
					<van-button
						@click="step = 3"
						round
						block
						type="primary"
						class="mt-6 text-text-inverse-primary text-style-web-h5-bold">
						{{ t('my.txt92') }}
					</van-button>
				</div>

				<div class="py-6 px-4" v-if="step === 3">
					<div class="text-text-primary text-style-web-h1-medium">{{ t('my.txt101') }}</div>

					<Input class="mt-3" v-model="firstName" :placeholder="t('my.txt131')" />

					<Input class="mt-3" v-model="lastName" :placeholder="t('my.txt132')" />

					<Input
						class="mt-3"
						v-model="idCard"
						:replace="reg.unAlphanumeric"
						:placeholder="t('my.txt133')" />

					<Button round block @click="toNextStep4" :disabled="disabled" type="primary" class="mt-6">
						{{ t('my.txt92') }}
					</Button>
					<Button @click="step = 2" plain class="mt-3">
						{{ t('my.txt166') }}
					</Button>
				</div>

				<div class="py-6 px-4" v-if="step === 4">
					<div class="text-text-primary text-style-web-h1-medium">{{ t('text21') }}</div>
					<UploadID v-model="idCardFront" :title="t('text22')" />
					<UploadID v-if="idType === '1'" v-model="idCardBack" :title="t('text23')" />
					<UploadID v-model="handHeldIdCard" :title="t('text24')" />
					<div
						class="mt-3 py-4 px-3 rounded bg-[rgba(255,145,66,0.10)] text-text-tertiary text-style-web-small-regular">
						{{ t('text25') }}
						<br />
						{{ t('text26') }}
						<br />
						{{ t('text27') }}
						<br />
						{{ t('text28') }}
					</div>

					<Button @click="submit" :disabled="disabled4" class="mt-6">
						{{ t('my.txt165') }}
					</Button>
					<Button @click="step = 3" plain class="mt-3">
						{{ t('my.txt166') }}
					</Button>
				</div>

				<div class="py-10 px-4" v-if="step === 5">
					<div class="text-text-primary text-style-web-xlarge-medium text-center">
						{{ t('my.txt167') }}
					</div>

					<div class="pt-6 text-text-tertiary text-style-web-body-regular text-center">
						{{ t('my.txt102') }}
					</div>

					<Tip class="mt-6">{{ t('my.txt76', { num: globalData.appNameUpper }) }}</Tip>

					<div class="flex justify-center mt-6">
						<Button @click="router.push('/user')" class="w-[141px]">
							{{ t('my.txt103') }}
						</Button>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="ph:hidden pd:hidden flex">
		<Menu :active="2" />
		<div class="flex-1 px-20 py-10">
			<div class="text-text-primary text-style-web-xlarge-bold">{{ t('my.txt74') }}</div>

			<div class="w-[800px] mt-10">
				<div v-if="kycInfo.isAuth">
					<div class="border border-border-strong rounded-[12px] py-[30px] px-4">
						<div class="flex items-center justify-center">
							<base-icon name="user-center/icon14" :size="24" />
							<div class="ml-[6px] text-text-success text-style-web-h2-medium">
								{{ kycInfo.lable }}
							</div>
						</div>
						<div class="my-6 w-[500px] mx-auto rounded-[6px] py-6 px-4 bg-background-secondary">
							<div class="flex items-center">
								<div class="text-text-description text-style-web-body-medium mr-1">
									{{ t('my.txt93') }}
								</div>
								<div class="text-text-secondary text-style-web-body-medium">
									{{ kycInfo.realName }}
								</div>
							</div>
							<div class="flex items-center mt-4">
								<div class="text-text-description text-style-web-body-medium mr-1">
									{{ t('my.txt94') }}
								</div>
								<div class="text-text-secondary text-style-web-body-medium">
									{{ kycInfo.idCard }}
								</div>
							</div>
						</div>
						<Tip class="mt-3">
							{{ t('my.txt76', { num: globalData.appNameUpper }) }}
						</Tip>
					</div>
				</div>

				<div v-else>
					<div v-if="step === 1">
						<div>
							<div class="border border-border-strong rounded-[12] py-[30px] px-4">
								<div class="w-[200px] h-[182px] mx-auto">
									<img class="w-full h-full" src="@/assets/img/user-center/icon.png" alt="" />
								</div>

								<div class="pt-6 flex items-center justify-center">
									<base-icon :name="kycInfo.icon" :size="24" />
									<div class="ml-[6px] text-style-web-h2-medium" :class="[kycInfo.textClass]">
										{{ kycInfo.lable }}
									</div>
								</div>
								<div
									v-if="kycInfo.level === 3"
									class="py-6 text-text-description text-style-web-base-regular text-center">
									{{ kycInfo.rejectReason }}
								</div>
								<div
									v-else
									class="py-6 text-text-description text-style-web-base-regular text-center">
									{{ t('my.txt75') }}
								</div>

								<Tip class="mb-6">{{ t('my.txt76', { num: globalData.appNameUpper }) }}</Tip>

								<Button
									class="!w-[326px] mx-auto"
									v-if="kycInfo.level === 0"
									@click="step = 2"
									size="small">
									{{ t('my.txt77') }}
								</Button>
								<Button
									class="!w-[326px] mx-auto"
									v-if="kycInfo.level === 3"
									@click="step = 2"
									size="small">
									{{ t('my.txt140') }}
								</Button>
							</div>
						</div>
					</div>

					<div class="w-[460px]" v-if="step === 2">
						<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt97') }}</div>

						<Select
							v-if="isWeb"
							class="mt-3"
							:close-on-click-outside="true"
							v-model:value="country"
							v-model:open="countryOpen"
							:options="countryList">
							<div class="h-[288px]">
								<div class="p-3">
									<Input v-model="search" size="small" :placeholder="t('text155')">
										<template v-slot:prefix>
											<Icon name="search" :size="20" class="mr-[10px] text-text-primary" />
										</template>
									</Input>
								</div>
								<div
									v-for="item in filterCountryList"
									:key="item.value + item.label + item.areaCode"
									@click="changeSelect(item)"
									class="flex justify-between items-center p-3">
									<div class="flex items-center">
										<div class="w-10 text-text-primary text-style-web-body-medium">
											+{{ item.areaCode }}
										</div>
										<div class="text-text-primary text-style-web-body-medium">{{ item.label }}</div>
									</div>
									<Checkbox shape="round" :value="country === item.value" />
								</div>
								<div v-if="!filterCountryList.length">
									<Empty className="!pt-10" />
								</div>
							</div>
						</Select>

						<div class="mt-6 text-text-primary text-style-web-h3-bold">{{ t('my.txt98') }}</div>
						<div
							@click="idType = '1'"
							class="mt-3 cursor-pointer border border-border-strong rounded-[6px] py-[15px] px-4 flex justify-between items-center">
							<div class="text-text-primary text-style-web-body-medium">{{ t('my.txt99') }}</div>
							<Icon
								:name="idType === '1' ? 'vant/round_yes' : 'vant/round_no'"
								:dark-name="idType === '1' ? 'vant/round_yes_dark' : 'vant/round_no_dark'"
								:size="18" />
						</div>
						<div
							@click="idType = '2'"
							class="mt-3 cursor-pointer border border-border-strong rounded-[6px] py-[15px] px-4 flex justify-between items-center">
							<div class="text-text-primary text-style-web-body-medium">{{ t('my.txt100') }}</div>
							<Icon
								:name="idType === '2' ? 'vant/round_yes' : 'vant/round_no'"
								:dark-name="idType === '2' ? 'vant/round_yes_dark' : 'vant/round_no_dark'"
								:size="18" />
						</div>
						<Button
							@click="step = 3"
							size="small"
							class="mt-6 text-text-inverse-primary text-style-web-h5-bold">
							{{ t('my.txt92') }}
						</Button>
					</div>

					<div class="w-[460px]" v-if="step === 3">
						<div class="text-text-primary text-style-web-h3-bold">{{ t('my.txt101') }}</div>

						<Input class="mt-3" v-model="firstName" :placeholder="t('my.txt131')" />

						<Input class="mt-3" v-model="lastName" :placeholder="t('my.txt132')" />

						<Input
							class="mt-3"
							v-model="idCard"
							:replace="reg.unAlphanumeric"
							:placeholder="t('my.txt133')" />

						<Button @click="toNextStep4" size="small" :disabled="disabled" class="mt-6">
							{{ t('my.txt92') }}
						</Button>
						<Button @click="step = 2" size="small" plain class="w-full mt-3">
							{{ t('my.txt166') }}
						</Button>
					</div>

					<div class="w-[460px]" v-if="step === 4">
						<div class="text-text-primary text-style-web-h3-bold">{{ t('text21') }}</div>
						<UploadID v-model="idCardFront" height="232px" :title="t('text22')" />
						<UploadID
							v-if="idType === '1'"
							v-model="idCardBack"
							height="232px"
							:title="t('text23')" />
						<UploadID v-model="handHeldIdCard" height="232px" :title="t('text24')" />
						<div
							class="mt-3 py-4 px-3 rounded bg-[rgba(255,145,66,0.10)] text-text-tertiary text-style-web-small-regular">
							{{ t('text25') }}
							<br />
							{{ t('text26') }}
							<br />
							{{ t('text27') }}
							<br />
							{{ t('text28') }}
						</div>

						<Button @click="submit" size="small" :disabled="disabled4" class="mt-6">
							{{ t('my.txt165') }}
						</Button>
						<Button @click="step = 3" size="small" plain class="w-full mt-3">
							{{ t('my.txt166') }}
						</Button>
					</div>

					<div
						class="w-[800px] border border-border-strong rounded-[12px] py-[30px] px-4"
						v-if="step === 5">
						<div class="text-text-primary text-style-web-xlarge-medium text-center">
							{{ t('my.txt167') }}
						</div>

						<div class="pt-6 text-text-tertiary text-style-web-body-regular text-center">
							{{ t('my.txt102') }}
						</div>

						<Tip class="mt-6">{{ t('my.txt76', { num: globalData.appNameUpper }) }}</Tip>

						<div class="flex justify-center mt-6">
							<Button @click="step = 1" size="small" class="w-[141px]">
								{{ t('my.txt103') }}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
