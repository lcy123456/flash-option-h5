<template>
	<div
		style="background: #000 url('/imgs/welcome/web_product_bg.png') 50% / cover no-repeat"
		class="pdph:hidden mt-[120px] pt-[64px] pb-[90px]">
		<div class="w-[1200] mx-auto">
			<div class="flex justify-center text-web-mega-bold text-always-white">
				{{ t('other.txt28') }}
			</div>
			<div class="mt-[16px] text-web-h3-regular text-text-description flex justify-center">
				{{ t('other.txt29') }}
			</div>
			<div class="mt-[48px]">
				<div class="flex justify-center">
					<div
						class="w-[588px] h-[238px] rounded-[10px] px-[40px] py-[50px] flex justify-between bg-background-secondary1">
						<div class="flex-1 relative">
							<div class="text-style-web-h1-medium text-always-white">{{ t('other.txt30') }}</div>
							<div class="text-style-web-h4-regular text-text-tips mt-[20px]">
								{{ t('other.txt31') }}
							</div>
							<div
								@click="routeTo('/home/follow')"
								class="flex items-center absolute bottom-0 text-style-web-body-medium text-text-disabled cursor-pointer">
								{{ t('other.txt32') }}
								<img src="/imgs/welcome/arrow-up-right.svg" class="w-[20px] h-[20px]" />
							</div>
						</div>
						<div class="flex flex-col ml-[65px] items-center">
							<img src="/imgs/welcome/p1.png" class="w-[81px] h-[74px] ml-[13px]" />
							<img src="/imgs/welcome/p_bg.png" class="w-[91px] h-[18px] mt-[32px]" />
						</div>
					</div>

					<div
						class="w-[588px] h-[238px] ml-[24px] rounded-[10px] px-[40px] py-[50px] flex bg-background-secondary1">
						<div class="flex-1 relative">
							<div class="text-style-web-h1-medium text-always-white">{{ t('other.txt33') }}</div>
							<div class="text-style-web-h4-regular text-text-tips mt-[20px]">
								{{ t('other.txt34') }}
							</div>
							<div
								@click="routeTo('/home/deliveryContract/BTC-USDT')"
								class="flex items-center absolute bottom-0 text-style-web-body-medium text-text-disabled cursor-pointer">
								{{ t('other.txt32') }}
								<img src="/imgs/welcome/arrow-up-right.svg" class="w-[20px] h-[20px]" />
							</div>
						</div>
						<div class="flex flex-col ml-[60px] items-center">
							<img src="/imgs/welcome/p2.svg" class="w-[74px] h-[74px]" />
							<img src="/imgs/welcome/p_bg.png" class="w-[91px] h-[18px] mt-[32px]" />
						</div>
					</div>
				</div>

				<div class="flex justify-center mt-[24px]">
					<div
						class="w-[588px] h-[238px] rounded-[10px] px-[40px] py-[50px] flex bg-background-secondary1">
						<div class="flex-1 relative">
							<div class="text-style-web-h1-medium text-always-white">{{ t('other.txt35') }}</div>
							<div class="text-style-web-h4-regular text-text-tips mt-[20px]">
								{{ t('other.txt36') }}
							</div>
							<div
								@click="routeTo('/trade/BTC-USDT')"
								class="flex items-center absolute bottom-0 text-style-web-body-medium text-text-disabled cursor-pointer">
								{{ t('other.txt32') }}
								<img src="/imgs/welcome/arrow-up-right.svg" class="w-[20px] h-[20px]" />
							</div>
						</div>
						<div class="flex flex-col ml-[60px] items-center">
							<img src="/imgs/welcome/p3.png" class="w-[81px] h-[74px]" />
							<img src="/imgs/welcome/p_bg.png" class="w-[91px] h-[18px] mt-[32px]" />
						</div>
					</div>

					<div
						class="w-[588px] h-[238px] ml-[24px] rounded-[10px] px-[40px] py-[50px] flex bg-background-secondary1">
						<div class="flex-1 relative">
							<div class="text-style-web-h1-medium text-always-white">{{ t('other.txt38') }}</div>
							<div class="text-style-web-h4-regular text-text-tips mt-[20px]">
								{{ t('other.txt39') }}
							</div>
							<div
								@click="routeTo('/home/swap/BTC-USDT')"
								class="flex items-center absolute bottom-0 text-style-web-body-medium text-text-disabled cursor-pointer">
								{{ t('other.txt32') }}
								<img src="/imgs/welcome/arrow-up-right.svg" class="w-[20px] h-[20px]" />
							</div>
						</div>
						<div class="flex flex-col ml-[60px] items-center">
							<img src="/imgs/welcome/p4.png" class="w-[81px] h-[74px]" />
							<img src="/imgs/welcome/p_bg.png" class="w-[91px] h-[18px] mt-[32px]" />
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div
		style="background: #000 url('/imgs/welcome/product_bg.png') no-repeat"
		class="_bg_ web:hidden mt-[40px] px-[16px] py-[40px]">
		<div class="flex justify-center text-style-web-h1-bold text-always-white">
			{{ t('other.txt28') }}
		</div>
		<div class="mt-[16px] text-style-web-small-regular text-text-description flex justify-center">
			{{ t('other.txt29') }}
		</div>
		<div class="mt-[24px]">
			<!-- <div class="flex justify-center"> -->
			<div class="rounded-[10px] px-[16px] py-[24px] flex justify-between bg-background-secondary1">
				<div class="flex-1">
					<div class="text-style-web-h3-medium text-always-white">{{ t('other.txt30') }}</div>
					<div class="text-style-web-small-regular text-text-tips mt-[12px]">
						{{ t('other.txt31') }}
					</div>
					<div
						@click="routeTo('/home/follow')"
						class="mt-4 flex items-center text-style-web-small-regular text-text-disabled cursor-pointer">
						{{ t('other.txt32') }}
						<img src="/imgs/welcome/arrow-up-right.svg" class="w-[14px] h-[14px]" />
					</div>
				</div>
				<div class="flex flex-col items-center ml-[5px]">
					<img src="/imgs/welcome/p1.svg" class="w-[59px] h-[53px] ml-[9px]" />
					<img src="/imgs/welcome/p_bg.svg" class="w-[66px] h-[13px] mt-[23px]" />
				</div>
			</div>

			<div
				class="rounded-[10px] px-[16px] py-[24px] flex justify-between mt-[10px] bg-background-secondary1">
				<div class="flex-1">
					<div class="text-style-web-h3-medium text-always-white">{{ t('other.txt33') }}</div>
					<div class="text-style-web-small-regular text-text-tips mt-[12px]">
						{{ t('other.txt34') }}
					</div>
					<div
						@click="routeTo('/home/deliveryContract/BTC-USDT')"
						class="mt-4 flex items-center text-style-web-small-regular text-text-disabled cursor-pointer">
						{{ t('other.txt32') }}
						<img src="/imgs/welcome/arrow-up-right.svg" class="w-[14px] h-[14px]" />
					</div>
				</div>
				<div class="flex flex-col items-center ml-[5px]">
					<img src="/imgs/welcome/p2.svg" class="w-[55px] h-[55px]" />
					<img src="/imgs/welcome/p_bg.svg" class="w-[66px] h-[13px] mt-[21px]" />
				</div>
			</div>
			<div
				class="rounded-[10px] px-[16px] py-[24px] flex justify-between mt-[10px] bg-background-secondary1">
				<div class="flex-1">
					<div class="text-style-web-h3-medium text-always-white">{{ t('other.txt35') }}</div>
					<div class="text-style-web-small-regular text-text-tips mt-[12px]">
						{{ t('other.txt36') }}
					</div>
					<div
						@click="routeTo('/trade/BTC-USDT')"
						class="mt-4 flex items-center text-style-web-small-regular text-text-disabled cursor-pointer">
						{{ t('other.txt32') }}
						<img src="/imgs/welcome/arrow-up-right.svg" class="w-[14px] h-[14px]" />
					</div>
				</div>
				<div class="flex flex-col ml-[60px] items-center">
					<img src="/imgs/welcome/p3.svg" class="w-[57px] h-[53px] ml-[8px]" />
					<img src="/imgs/welcome/p_bg.svg" class="w-[66px] h-[13px] mt-[21px]" />
				</div>
			</div>

			<div
				class="rounded-[10px] px-[16px] py-[24px] flex justify-between mt-[10px] bg-background-secondary1">
				<div class="flex-1">
					<div class="text-style-web-h3-medium text-always-white">{{ t('other.txt38') }}</div>
					<div class="text-style-web-small-regular text-text-tips mt-[12px]">
						{{ t('other.txt39') }}
					</div>
					<div
						@click="routeTo('/home/swap/BTC-USDT')"
						class="mt-4 flex items-center text-style-web-small-regular text-text-disabled cursor-pointer">
						{{ t('other.txt32') }}
						<img src="/imgs/welcome/arrow-up-right.svg" class="w-[14px] h-[14px]" />
					</div>
				</div>
				<div class="flex flex-col ml-[60px] items-center">
					<img src="/imgs/welcome/p4.svg" class="w-[61px] h-[55px] ml-[2px]" />
					<img src="/imgs/welcome/p_bg.svg" class="w-[66px] h-[13px] mt-[21px]" />
				</div>
			</div>
		</div>
		<!-- </div> -->
	</div>
</template>
<script lang="ts" setup>
import { routeTo } from '@/utils/routeTo'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>
