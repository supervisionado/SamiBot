// Finnhub module

import WebSocket from "ws";

type TradeEvent = {
  symbol: string;
  price: number;
  size: number;
  timestamp: number;
};

export class MarketData {
  private socket: WebSocket | null = null;
  private symbols: string[];
  private apiKey: string;

  private onTradeCallback?: (event: TradeEvent) => void;

  private reconnectAttempts = 0;
  private maxReconnectDelay = 30000; // 30s

  constructor(apiKey: string, symbols: string[]) {
    this.apiKey = apiKey;
    this.symbols = symbols;

    this.connect();
  }

  private connect() {
    console.log("🔌 Connecting to Finnhub...");

    this.socket = new WebSocket(`wss://ws.finnhub.io?token=${this.apiKey}`);

    this.socket.on("open", () => {
      console.log("📡 Connected to Finnhub");

      this.reconnectAttempts = 0;

      // Resubscribe to symbols
      this.symbols.forEach(symbol => {
        this.socket?.send(JSON.stringify({
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
      this.scheduleReconnect();
    });

    this.socket.on("error", (err) => {
      console.error("⚠️ WS Error:", err.message);

      // Important: terminate to trigger close → reconnect
      this.socket?.terminate();
    });
  }

  private scheduleReconnect() {
    this.reconnectAttempts++;

    const delay = Math.min(
      1000 * Math.pow(2, this.reconnectAttempts), // exponential
      this.maxReconnectDelay
    );

    console.log(`🔁 Reconnecting in ${delay / 1000}s...`);

    setTimeout(() => {
      this.connect();
    }, delay);
  }

  onTrade(cb: (event: TradeEvent) => void) {
    this.onTradeCallback = cb;
  }
}