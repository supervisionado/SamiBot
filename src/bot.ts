// Telegram Bot module

import { Bot } from "grammy";
import { Storage } from "./storage";
import { AlertManager } from "./alert";

export class TelegramBot {
  private bot: Bot;

  constructor(token: string, private storage: Storage, private alerts: AlertManager) {
    this.bot = new Bot(token);
    this.setup();
  }

  private setup() {

    this.bot.command("start", (ctx) =>
      ctx.reply("📈 Sami bot is ready. Type /help for commands.")
    );

    this.bot.command("help", (ctx) =>
      ctx.reply(
    `Commands:
    /price SYMBOL
    /alert SYMBOL PRICE
    /list
    /gold
    /oil
    /silver`
      )
    );

    this.bot.command("list", (ctx) => {
      const symbols = this.storage.getAllSymbols();
      ctx.reply(symbols.join(", "));
    });

    this.bot.command("gold", (ctx) => {
      this.replyPrice(ctx, "XAUUSD", "Gold 🪙");
    });

    this.bot.command("silver", (ctx) => {
      this.replyPrice(ctx, "XAGUSD", "Silver 🪙");
    });

    this.bot.command("oil", (ctx) => {
      this.replyPrice(ctx, "CL", "Oil 🛢️");
    });

    this.bot.command("price", (ctx) => {
      const parts = ctx.message.text.split(" ");
      const symbol = parts[1]?.toUpperCase();

      if (!symbol) {
        return ctx.reply("Usage: /price AAPL");
      }

      const data = this.storage.getPrice(symbol);

      if (!data) {
        return ctx.reply(`No data for ${symbol}`);
      }

      ctx.reply(
        `${symbol}: $${data.price.toFixed(2)}\nTime: ${new Date(data.timestamp).toLocaleTimeString()}`
      );
    });

    this.bot.command("alert", (ctx) => {
      const parts = ctx.message.text.split(" ");

      const symbol = parts[1]?.toUpperCase();
      const price = parseFloat(parts[2]);

      if (!symbol || isNaN(price)) {
        return ctx.reply("Usage: /alert AAPL 200");
      }

      this.alerts.addAlert(ctx.from.id, symbol, price);

      ctx.reply(`✅ Alert set for ${symbol} at $${price}`);
    });

  }

  private replyPrice(ctx: any, symbol: string, label: string) {
    const data = this.storage.getPrice(symbol);

    if (!data) {
      return ctx.reply(`No data for ${label}`);
    }

    ctx.reply(
      `${label}: $${data.price.toFixed(2)}\nTime: ${new Date(data.timestamp).toLocaleTimeString()}`
    );
  }

  start() {
    this.bot.start();
    console.log("🤖 Telegram bot running...");
  }

  sendMessage(userId: number, text: string) {
    this.bot.api.sendMessage(userId, text);
  }
}