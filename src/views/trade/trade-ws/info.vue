<script setup lang="ts">
import { thousandsComma, formatNumUnit } from '@/utils/trade'
import { onBeforeMount, reactive, } from 'vue'
import { getCoinInfo } from '@/apis/trade'
import { formatTime } from '@/utils/date'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import { useTradeStore } from '@/store/modules/trade/index'
const tradeStore = useTradeStore()
const state = reactive({
    coinInfo: {
        infolink: '',
        information: '',
        name: '',
        unit: ''
    } as any,
})
const handleShowInfo = async () => {
    const res: any = await getCoinInfo({ unit: tradeStore.state.currentCoinInfo.coinSymbol })
    const isSuccess = res.code === 0
    if (isSuccess) {
        state.coinInfo = res?.data
    }
}

onBeforeMount(() => {
    handleShowInfo()
})
</script>


<template>
    <div class="flex items-center my-5 px-4">
        <img :src="state.coinInfo?.logo" class="w-7.5 h-7.5" />
        <span class="mx-3 text-web-h2-bold text-text-primary">{{ state.coinInfo.unit }}</span>
        <span class="text-style-web-body-regular text-text-tertiary">
            {{ state.coinInfo.name }}
        </span>
    </div>
    <div class="mt-5 mb-[50px] px-4 flex justify-between">
        <div class="flex-1 mr-4">

            <div class="flex justify-between items-center">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('trade.txt22') }}
                </div>
                <div class="text-style-web-body-regular">No.{{ state.coinInfo.rank }}</div>
            </div>
            <div class="flex justify-between items-center mt-3">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('trade.txt23') }}
                </div>
                <div class="text-style-web-body-regular text-text-primary">
                    {{ formatNumUnit(state.coinInfo?.marketValue) }}
                </div>
            </div>
            <div class="flex justify-between items-center mt-3">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('trade.txt24') }}
                </div>
                <div class="text-style-web-body-regular text-text-primary">
                    {{ formatNumUnit(state.coinInfo?.currencyAmount) }}
                </div>
            </div>
            <div class="flex justify-between items-center mt-3">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('trade.txt25') }}
                </div>
                <div class="text-style-web-body-regular text-text-primary">
                    {{ formatNumUnit(state.coinInfo?.publishAmount) }}
                </div>
            </div>
            <div class="flex justify-between items-center mt-3">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('text311') }}
                </div>
                <div class="text-style-web-body-regular text-text-primary">
                    {{ formatTime(state.coinInfo?.publishTime, 'YYYY-MM-DD') }}
                </div>
            </div>
            <div class="flex justify-between mt-3">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('trade.txt26') }}
                </div>
                <div class="text-style-web-body-regular text-text-primary">
                    <div class="text-right">{{ thousandsComma(state.coinInfo?.highestPrice) }}</div>
                    <div class="text-style-web-small-medium text-text-description mt-0.5 text-right">
                        {{ formatTime(state.coinInfo?.highestPriceTime, 'YYYY-MM-DD') }}
                    </div>
                </div>
            </div>
            <div class="flex justify-between mt-3">
                <div class="text-style-web-body-regular text-text-description">
                    {{ t('text310') }}
                </div>
                <div class="text-style-web-body-regular text-text-primary">
                    <div class="text-right">{{ thousandsComma(state.coinInfo?.lowestPrice) }}</div>
                    <div class="text-style-web-small-medium text-text-description mt-0.5 text-right">
                        {{ formatTime(state.coinInfo?.lowestPriceTime, 'YYYY-MM-DD') }}
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-1 ml-4">
            <div class="text-style-web-base-regular text-text-primary mb-1">{{ t('trade.txt27') }}</div>
            <div class="text-base-small-400 text-text-tertiary">
                {{ state.coinInfo.information }}
            </div>
        </div>
    </div>
</template>
