<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
	<div class="mt-[120px] flex flex-col justify-center">
		<div class="flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="68"
				height="60"
				viewBox="0 0 68 60"
				fill="none">
				<path
					opacity="0.3"
					d="M31.7962 58.2383C33.0849 59.2684 34.9152 59.2684 36.2039 58.2383L43.9339 52.0588H24.0662L31.7962 58.2383Z"
					fill="#1754F8" />
				<rect x="0.470581" width="67.0588" height="52.9412" rx="10.5882" fill="#1754F8" />
				<ellipse cx="19.8823" cy="26.4718" rx="3.52941" ry="3.52941" fill="white" />
				<ellipse cx="34" cy="26.4718" rx="3.52941" ry="3.52941" fill="white" />
				<ellipse cx="48.1176" cy="26.4718" rx="3.52941" ry="3.52941" fill="white" />
			</svg>
		</div>
		<div class="pt-[11px] pb-6 flex justify-center">
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="166"
				height="110"
				viewBox="0 0 166 110"
				fill="none">
				<path
					d="M86.1654 22.9496L75.0863 37.1942V0L144.727 8.30935L86.1654 22.9496Z"
					fill="url(#paint0_linear_8697_30406)" />
				<path
					d="M71.5251 40.7554L19.2949 12.6619L75.0863 0V32.8417L71.5251 40.7554Z"
					fill="url(#paint1_linear_8697_30406)" />
				<path
					d="M18.8993 12.6631L85.3741 22.9509V102.088L24.01 90.0339C21.0407 89.4506 18.8993 86.8477 18.8993 83.8217V12.6631Z"
					fill="url(#paint2_linear_8697_30406)" />
				<path
					d="M85.3741 102.087L139.95 88.2609C142.759 87.5493 144.727 85.0215 144.727 82.1238V7.91425L85.3741 22.9502V102.087Z"
					fill="url(#paint3_linear_8697_30406)" />
				<path
					d="M85.3741 23.7411L19.295 13.0576L4.23412 35.0214C2.34365 37.7783 3.81808 41.5736 7.07393 42.3313L60.0902 54.6684C61.9785 55.1078 63.9444 54.355 65.0562 52.7667L85.3741 23.7411Z"
					fill="url(#paint4_linear_8697_30406)" />
				<path
					d="M161.559 37.7738L108.321 55.4022C106.931 55.8627 105.406 55.3089 104.635 54.0634L85.3741 22.9501L144.727 7.91412L163.113 32.8922C164.389 34.6248 163.601 37.0975 161.559 37.7738Z"
					fill="url(#paint5_linear_8697_30406)" />
				<path
					d="M87.3525 102.087L19.295 86.6553L64.7986 110.001L87.3525 102.087Z"
					fill="url(#paint6_linear_8697_30406)" />
				<defs>
					<linearGradient
						id="paint0_linear_8697_30406"
						x1="109.906"
						y1="0"
						x2="109.906"
						y2="37.1942"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#D6E1EB" />
						<stop offset="1" stop-color="#CFDEEB" />
					</linearGradient>
					<linearGradient
						id="paint1_linear_8697_30406"
						x1="47.1906"
						y1="0"
						x2="47.1906"
						y2="40.7554"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#C1CBD3" />
						<stop offset="1" stop-color="#CFDEEB" />
					</linearGradient>
					<linearGradient
						id="paint2_linear_8697_30406"
						x1="17.7122"
						y1="58.5624"
						x2="85.7698"
						y2="68.4545"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#DCEBF4" />
						<stop offset="1" stop-color="#DBEAF6" />
					</linearGradient>
					<linearGradient
						id="paint3_linear_8697_30406"
						x1="145.122"
						y1="55.3963"
						x2="85.7698"
						y2="62.9142"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#CEDDEF" />
						<stop offset="1" stop-color="#CEDDEA" />
					</linearGradient>
					<linearGradient
						id="paint4_linear_8697_30406"
						x1="75.0864"
						y1="23.7411"
						x2="-40.1223"
						y2="91.4196"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#EFF5F9" />
						<stop offset="1" stop-color="#DDE9F5" />
					</linearGradient>
					<linearGradient
						id="paint5_linear_8697_30406"
						x1="85.7698"
						y1="23.3458"
						x2="168.468"
						y2="34.8206"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#EFF5F9" />
						<stop offset="1" stop-color="#DDE9F5" />
					</linearGradient>
					<linearGradient
						id="paint6_linear_8697_30406"
						x1="19.295"
						y1="100.702"
						x2="87.3525"
						y2="100.702"
						gradientUnits="userSpaceOnUse">
						<stop stop-color="#DCEBF6" />
						<stop offset="1" stop-color="#DCEBF6" stop-opacity="0" />
					</linearGradient>
				</defs>
			</svg>
		</div>

		<div class="text-text-description text-style-web-body-regular text-center">
			{{ t('trade.txt125') }}
		</div>
	</div>
</template>
