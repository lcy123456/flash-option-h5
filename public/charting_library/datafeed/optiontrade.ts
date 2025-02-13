interface Coin {
    symbol: string;
}

interface StompClient {
    subscribe(destination: string, callback: (message: any) => void): any;
}

interface SymbolInfo {
    name: string;
}

interface Bar {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
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
    private coin: Coin;
    private stompClient: StompClient;
    private lastBar: Bar | null = null;
    private currentBar: Bar | null = null;
    private subscribe: boolean = true;
    private scale: number;

    constructor(url: string, coin: Coin, stompClient: StompClient, scale: number) {
        this._datafeedURL = url;
        this.coin = coin;
        this.stompClient = stompClient;
        this.scale = scale;
    }

    public onReady(callback: (config: Config) => void): void {
        const config: Config = {
            exchanges: [],
            supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
            supports_group_request: false,
            supports_marks: false,
            supports_search: false,
            supports_time: true,
            supports_timescale_marks: false
        };

        setTimeout(() => {
            callback(config);
        }, 0);
    }

    public subscribeBars(
        symbolInfo: SymbolInfo,
        resolution: string,
        onRealtimeCallback: (bar: Bar) => void,
        listenerGUID: string,
        onResetCacheNeededCallback: () => void
    ): void {
        this.stompClient.subscribe("/topic/swap/thumb", (msg) => {
            const resp = JSON.parse(msg.body);
            if (resp.symbol === symbolInfo.name && this.lastBar) {
                const price = resp.close;
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

        this.stompClient.subscribe('/topic/swap/kline/' + symbolInfo.name, (msg) => {
            if (this.currentBar) onRealtimeCallback(this.currentBar);

            const resp = JSON.parse(msg.body);
            // const newTime = resp.time * 1000;

            const currentPeriod = localStorage.getItem("swap_proid");
            if (currentPeriod !== resp.period) {
                return;
            }

            // if (newTime - this.currentBar!.time > 0 && newTime - this.currentBar!.time < 86400000) {
                this.lastBar = {
                    time: resp.time * 1000,
                    open: resp.openPrice,
                    high: resp.highestPrice,
                    low: resp.lowestPrice,
                    close: resp.closePrice,
                    volume: resp.volume
                };
                this.currentBar = this.lastBar;
                onRealtimeCallback(this.lastBar);
            // }
        });
    }

    public unsubscribeBars(subscriberUID: string): void {
        this.subscribe = false;
    }

    public resolveSymbol(
        symbolName: string,
        onSymbolResolvedCallback: (data: any) => void,
        onResolveErrorCallback: (error: any) => void
    ): void {
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
            supported_resolutions: ["1", "5", "15", "30", "60", "240", "1D", "1W", "1M"],
            pricescale: Math.pow(10, this.scale || 2),
            ticker: "",
            timezone: "Asia/Shanghai"
        };

        setTimeout(() => {
            onSymbolResolvedCallback(data);
        }, 0);
    }

    private _send(url: string, params?: Record<string, any>): Promise<any> {
        let request = url;

        if (params) {
            request += '?' + Object.keys(params).map(key => `${key}=${encodeURIComponent(params[key])}`).join('&');
        }

        return $.ajax({
            type: 'GET',
            url: request,
            dataType: 'json'
        });
    }

    public getBars(
        symbolInfo: SymbolInfo,
        resolution: string,
        from: number,
        to: number,
        onHistoryCallback: (bars: Bar[], meta: { noData: boolean }) => void,
        onErrorCallback: (reason: any) => void,
        firstDataRequest: boolean
    ): void {
        this._send(this._datafeedURL + '/history', {
            symbol: symbolInfo.name,
            from: from * 1000,
            to: firstDataRequest ? new Date().getTime() : to * 1000,
            resolution: resolution
        }).done((response) => {
            const bars: Bar[] = response.map((item: any) => ({
                time: item[0],
                open: item[1],
                high: item[2],
                low: item[3],
                close: item[4],
                volume: item[5]
            }));

            this.lastBar = bars.length > 0 ? bars[bars.length - 1] : null;
            this.currentBar = this.lastBar;
            const noData = bars.length === 0;
            onHistoryCallback(bars, { noData: noData });
        }).fail((reason) => {
            onErrorCallback(reason);
        });
    }

    public periodLengthSeconds(resolution: string, requiredPeriodsCount: number): number {
        let daysCount = 0;

        if (resolution === 'D') {
            daysCount = requiredPeriodsCount;
        } else if (resolution === 'M') {
            daysCount = 31 * requiredPeriodsCount;
        } else if (resolution === 'W') {
            daysCount = 7 * requiredPeriodsCount;
        } else if (resolution === 'H') {
            daysCount = requiredPeriodsCount * parseInt(resolution) / 24;
        } else {
            daysCount = requiredPeriodsCount * parseInt(resolution) / (24 * 60);
        }

        return daysCount * 24 * 60 * 60;
    }
}

export default WebsockFeed;
