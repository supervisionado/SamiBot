// Storage module

export type PricePoint = {
  price: number;
  size: number;      // future use
  timestamp: number;
};

class SymbolStore {
  symbol: string;
  latest: PricePoint | null = null;

  // Future: ring buffer / candles
  history: PricePoint[] = []; 

  constructor(symbol: string) {
    this.symbol = symbol;
  }

  update(price: number, size: number, timestamp: number) {
    this.latest = { price, size, timestamp };

    // Future expansion placeholder
    // this.history.push(...)
  }

  getLatest(): PricePoint | null {
    return this.latest;
  }
}

export class Storage {
  private symbols: Map<string, SymbolStore> = new Map();

  constructor(symbols: string[]) {
    symbols.forEach(sym => {
      this.symbols.set(sym, new SymbolStore(sym));
    });
  }

  ingest(symbol: string, price: number, size: number, timestamp: number) {
    if (!this.symbols.has(symbol)) {
      this.symbols.set(symbol, new SymbolStore(symbol));
    }

    this.symbols.get(symbol)!.update(price, size, timestamp);
  }

  getPrice(symbol: string): PricePoint | null {
    return this.symbols.get(symbol)?.getLatest() || null;
  }

  getAllSymbols(): string[] {
    return Array.from(this.symbols.keys());
  }
}