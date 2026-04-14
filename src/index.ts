//
//   ▗▄▄▖▗▞▀▜▌▄▄▄▄  ▄      ▄▄▄  ▗▄▖ ▄▄▄▄  ▄      ▗▄▄▖▗▞▀▜▌▄▄▄▄  ▄      ▄▄▄  ▗▄▖ ▄▄▄▄  ▄ 
//  ▐▌   ▝▚▄▟▌█ █ █ ▄     ▀▄▄  ▐▌ ▐▌█ █ █ ▄     ▐▌   ▝▚▄▟▌█ █ █ ▄     ▀▄▄  ▐▌ ▐▌█ █ █ ▄ 
//   ▝▀▚▖     █   █ █     ▄▄▄▀ ▐▛▀▜▌█   █ █      ▝▀▚▖     █   █ █     ▄▄▄▀ ▐▛▀▜▌█   █ █ 
//  ▗▄▄▞▘           █          ▐▌ ▐▌      █     ▗▄▄▞▘           █          ▐▌ ▐▌      █ 
//                                                                                    
//  SamiBot (main module)
//
//      by SuperVisionado
//                                                                           

import dotenv from "dotenv";
import { Storage } from "./storage";
import { MarketData } from "./market";
import { TelegramBot } from "./bot";
import { Futures } from "./futures";
import { AlertManager } from "./alert";

dotenv.config();

const telegram_token = process.env.BOT_TOKEN!;
const finnhub_key = process.env.FINNHUB_API_KEY!;
const twelvedata_key = process.env.TWELVE_API_KEY!;
const alerts = new AlertManager();

if (!telegram_token || !finnhub_key) {
  throw new Error("Missing env vars");
}

const topNasdaq = [
  "AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA","AVGO","COST","NFLX",
  "ADBE","PEP","CSCO","ASML","QCOM","TXN","AMD","INTU","ISRG","AMAT"
];

// Init modules
const storage = new Storage(topNasdaq);
const market = new MarketData(finnhub_key, topNasdaq);
const bot = new TelegramBot(telegram_token, storage, alerts);
const commodities = new Futures(twelvedata_key);

// Notification bridge (for the alerts) 
const notifyUser = (userId: number, message: string) => {
  bot.sendMessage(userId, message);
};

// Connect flow - hooking into both data sources (Futures & Stocks)
market.onTrade((event) => {
  storage.ingest(event.symbol, event.price, event.size, event.timestamp);
  alerts.checkAlerts(event.symbol, event.price, notifyUser);
});
commodities.onTrade((event) => {
  storage.ingest(event.symbol, event.price, event.size, event.timestamp);
  alerts.checkAlerts(event.symbol, event.price, notifyUser);
});

// Start bot
bot.start();

console.log("🚀 System running...");