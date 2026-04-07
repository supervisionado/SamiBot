// Bot module

import { Bot } from "grammy";
import { Storage } from "./storage";

export class TelegramBot {
  private bot: Bot;

  constructor(token: string, private storage: Storage) {
    this.bot = new Bot(token);
    this.setup();
  }

  private setup() {

    this.bot.command("start", (ctx) =>
      ctx.reply("📈 Stock bot running")
    );

    this.bot.command("help", (ctx) =>
      ctx.reply(
    `Commands:
    /price SYMBOL
    /list
    /gold
    /silver
    /oil`
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
        `${symbol}: $${data.price}\nTime: ${new Date(data.timestamp).toLocaleTimeString()}`
      );
    });
  }

  private replyPrice(ctx: any, symbol: string, label: string) {
    const data = this.storage.getPrice(symbol);

    if (!data) {
      return ctx.reply(`No data for ${label}`);
    }

    ctx.reply(
      `${label}: $${data.price}\nTime: ${new Date(data.timestamp).toLocaleTimeString()}`
    );
  }

  start() {
    this.bot.start();
    console.log("🤖 Telegram bot running...");
  }
}