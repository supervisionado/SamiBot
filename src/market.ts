// Finnhub module

import WebSocket from "ws";

type TradeEvent = {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
};

export class MarketData {
  private socket: WebSocket;
  private symbols: string[];
  private onTradeCallback?: (event: TradeEvent) => void;

  constructor(apiKey: string, symbols: string[]) {
    this.symbols = symbols;
    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${apiKey}`);
    this.init();
  }

  private init() {
    this.socket.on("open", () => {
      console.log("📡 Connected to Finnhub");

      this.symbols.forEach(symbol => {
        this.socket.send(JSON.stringify({
          type: "subscribe",
          symbol
        }));
      });
    });

    this.socket.on("message", (data) => {
      const parsed = JSON.parse(data.toString());

      if (parsed.type === "trade") {
        parsed.data.forEach((trade: any) => {
          const event: TradeEvent = {
            symbol: trade.s,
            price: trade.p,
            size: trade.v,
            timestamp: trade.t
          };

          this.onTradeCallback?.(event);
        });
      }
    });

    this.socket.on("close", () => {
      console.log("❌ WebSocket closed");
    });

    this.socket.on("error", (err) => {
      console.error("WS Error:", err.message);
    });
  }

  onTrade(cb: (event: TradeEvent) => void) {
    this.onTradeCallback = cb;
  }
}