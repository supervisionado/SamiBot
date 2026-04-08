// twelvedata.ts

import fetch from "node-fetch";

type TradeEvent = {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
};

export class Futures {
  private apiKey: string;
  private symbols = ["XAU/USD", "XAG/USD", "CL"]; // Gold, Silver, Oil
  private intervalMs = 900000; // 900s (15min) polling

  private onTradeCallback?: (event: TradeEvent) => void;
  private timer: NodeJS.Timeout | null = null;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
    this.start();
  }

  private start() {
    console.log("🪙 Starting Twelve Data polling...");

    this.fetchLoop();
    this.timer = setInterval(() => this.fetchLoop(), this.intervalMs);
  }

  private async fetchLoop() {
    try {
      const symbolString = this.symbols.join(",");

      const url = `https://api.twelvedata.com/price?symbol=${symbolString}&apikey=${this.apiKey}`;

      const res = await fetch(url);
      const data = await res.json();

      console.log("Fetching prices for commodities (15min window)");

      /**
       * Response format:
       * {
       *   "XAU/USD": { price: "2321.50" },
       *   "XAG/USD": { price: "27.31" },
       *   "CL": { price: "81.22" }
       * }
       */

      Object.entries(data).forEach(([symbol, value]: any) => {
        if (!value?.price) return;

        const event: TradeEvent = {
          symbol: this.normalizeSymbol(symbol),
          price: parseFloat(value.price),
          size: 0,
          timestamp: Date.now()
        };

        this.onTradeCallback?.(event);
      });

    } catch (err: any) {
      console.error("⚠️ TwelveData error:", err.message);
    }
  }

  private normalizeSymbol(symbol: string): string {
    // Convert "XAU/USD" → "XAUUSD"
    return symbol.replace("/", "");
  }

  onTrade(cb: (event: TradeEvent) => void) {
    this.onTradeCallback = cb;
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}