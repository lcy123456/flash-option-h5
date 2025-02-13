// import dayjs from 'dayjs'

interface SymbolInfo {
    name: string;
}

interface StompClient {
    subscribe: (destination: string, callback: (message: any) => void) => void;
}

interface Bar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

interface HistoryCallback {
    (bars: Bar[], meta: { noData: boolean }): void;
}

interface RealtimeCallback {
    (bar: Bar): void;
}

interface Config {
    exchanges: any[];
    supported_resolutions: string[];
    supports_group_request: boolean;
    supports_marks: boolean;
    supports_search: boolean;
    supports_time: boolean;
    supports_timescale_marks: boolean;
}

class WebsockFeed {
    private _datafeedURL: string;
    private coin: any;
    private stompClient: StompClient;
    private lastBar: Bar | null;
    private currentBar: Bar | null;
    private subscribe: boolean;
    private scale: number;

    constructor(url: string, coin: any, stompClient: StompClient, scale: number) {
        this._datafeedURL = url;
        this.coin = coin;
        this.stompClient = stompClient;
        this.lastBar = null;
        this.currentBar = null;
        this.subscribe = true;
        this.scale = scale;
    }

    onReady(callback: (config: Config) => void): void {
        const config: Config = {
            exchanges: [],
            supported_resolutions: [
                "1", "5", "15", "30", "60", "240", "1D", "1W", "1M"
            ],
            supports_group_request: false,
            supports_marks: false,
            supports_search: false,
            supports_time: true,
            supports_timescale_marks: false,
        };

        // $("#" + (window as any).tvWidget.id)
        //     .contents()
        //     .on("click", ".date-range-list>a", function () {
        //         if ((window as any).tvWidget) {
        //             if ($(this).html() === "分时") {
        //                 $(this).parent().addClass("real-op").removeClass("common-op");
        //                 (window as any).tvWidget.chart().setChartType(3);
        //             } else {
        //                 $(this).parent().addClass("common-op").removeClass("real-op");
        //                 (window as any).tvWidget.chart().setChartType(1);
        //             }
        //         }
        //     });

        setTimeout(() => {
            callback(config);
        }, 0);
    }

    subscribeBars(
        symbolInfo: SymbolInfo,
        resolution: string,
        onRealtimeCallback: RealtimeCallback,
        listenerGUID: string,
        onResetCacheNeededCallback: () => void
    ): void {
        this.stompClient.subscribe(`/topic/market/trade/${symbolInfo.name}`, (msg) => {
            const resp = JSON.parse(msg.body);
            if (this.lastBar && resp.length > 0) {
                const price = resp[resp.length - 1].price;
                this.lastBar.close = price;
                if (price > this.lastBar.high) {
                    this.lastBar.high = price;
                }
                if (price < this.lastBar.low) {
                    this.lastBar.low = price;
                }
                onRealtimeCallback(this.lastBar);
            }
        });

        this.stompClient.subscribe("/topic/market/thumb", (msg) => {
            const resp = JSON.parse(msg.body);
            if (resp.symbol === symbolInfo.name) {
                if (this.lastBar && resp.length > 0) {
                    const price = resp.price;
                    this.lastBar.close = price;
                    if (price > this.lastBar.high) {
                        this.lastBar.high = price;
                    }
                    if (price < this.lastBar.low) {
                        this.lastBar.low = price;
                    }
                    onRealtimeCallback(this.lastBar);
                }
            }
        });
        const currentPeriod = localStorage.getItem("swap_proid");
        this.stompClient.subscribe(`/topic/market/kline/${symbolInfo.name}/${currentPeriod}`, (msg) => {
            if (this.currentBar) onRealtimeCallback(this.currentBar);
            const resp = JSON.parse(msg.body);
            if (currentPeriod !== resp.period) {
                return;
            }
                this.lastBar = {
                    time: resp.time,
                    open: resp.openPrice,
                    high: resp.highestPrice,
                    low: resp.lowestPrice,
                    close: resp.closePrice,
                    volume: resp.volume,
                };
                this.currentBar = this.lastBar;
                onRealtimeCallback(this.lastBar);
            // }
        });
    }

    unsubscribeBars(subscriberUID: string): void {
        this.subscribe = false;
    }

    resolveSymbol(
        symbolName: string,
        onSymbolResolvedCallback: (data: any) => void,
        onResolveErrorCallback: () => void
    ): void {
        if (symbolName) {
            this.coin = {
                symbol: symbolName
            }    
        }
        this.lastBar = null;
        this.currentBar = null;

        const data = {
            name: this.coin.symbol,
            "exchange-traded": "",
            "exchange-listed": "",
            minmov: 1,
            volumescale: 10000,
            has_daily: true,
            has_weekly_and_monthly: true,
            has_intraday: true,
            description: this.coin.symbol,
            type: "bitcoin",
            session: "24x7",
            supported_resolutions: [
                "1", "5", "15", "30", "60", "240", "1D", "1W", "1M"
            ],
            pricescale: Math.pow(10, this.scale || 2),
            ticker: "",
            timezone: "Asia/Shanghai",
        };
        setTimeout(() => {
            onSymbolResolvedCallback(data);
        }, 0);
    }

    private _send(url: string, params: Record<string, any>): JQuery.jqXHR<any> {
        let request = url;
        if (params) {
            for (let i = 0; i < Object.keys(params).length; ++i) {
                const key = Object.keys(params)[i];
                const value = encodeURIComponent(params[key]);
                request += (i === 0 ? "?" : "&") + key + "=" + value;
            }
        }

        return $.ajax({
            type: "GET",
            url: request,
            dataType: "json",
        });
    }

    getBars(
        symbolInfo: SymbolInfo,
        resolution: string,
        periodParams: any,
        onHistoryCallback: HistoryCallback,
        onErrorCallback: (reason: any) => void,
    ): void {
        const bars: Bar[] = [];
        const { from, to, firstDataRequest } = periodParams
        this._send(this._datafeedURL + "/history", {
            symbol: symbolInfo.name,
            from: from * 1000,
            to: firstDataRequest ? new Date().getTime() : to * 1000,
            resolution: resolution,
        })
            .done((response) => {
                if (response.code !== 0) return
                const data = response.data || [];
                for (let i = 0; i < data.length; i++) {
                    const item = data[i];
                    bars.push({
                        time: item[0],
                        open: item[1],
                        high: item[2],
                        low: item[3],
                        close: item[4],
                        volume: item[5],
                    });
                }
                this.lastBar = bars.length > 0 ? bars[bars.length - 1] : null;
                this.currentBar = this.lastBar;
                const noData = bars.length === 0;
                onHistoryCallback(bars, { noData });
            })
            .fail((reason) => {
                onErrorCallback(reason);
            });
    }

    periodLengthSeconds(resolution: string, requiredPeriodsCount: number): number {
        let daysCount = 0;
        switch (resolution) {
            case "D":
                daysCount = requiredPeriodsCount;
                break;
            case "M":
                daysCount = 31 * requiredPeriodsCount;
                break;
            case "W":
                daysCount = 7 * requiredPeriodsCount;
                break;
            case "H":
                daysCount = (requiredPeriodsCount * +resolution) / 24;
                break;
            default:
                daysCount = (requiredPeriodsCount * +resolution) / (24 * 60);
                break;
        }

        return daysCount * 24 * 60 * 60;
    }
}

export default WebsockFeed;
