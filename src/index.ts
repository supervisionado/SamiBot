import { Bot } from "grammy";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const token = process.env.BOT_TOKEN;
if (!token) {
  throw new Error("BOT_TOKEN is not set in .env file");
}

const topNasdaq = [
  "AAPL","MSFT","NVDA","AMZN","GOOGL","META","TSLA","AVGO","COST","NFLX",
  "ADBE","PEP","CSCO","ASML","QCOM","TXN","AMD","INTU","ISRG","AMAT"
];

const commo = [
  "XAUUSD", // Gold
  "XAGUSD", // Silver
  "CL",     // Oil
  "HG",     // Copper
  "XPDUSD"  // Palladium
];

// Create the bot
const bot = new Bot(token);

// Basic commands
bot.command("start", (ctx) => ctx.reply("Hello! I'm your bot 🤖"));
bot.command("help", (ctx) => ctx.reply("Available commands: /start, /help"));

// Echo any text message
bot.on("message:text", (ctx) => {
  ctx.reply(`You said: ${ctx.message.text}`);
});

// WebSocket placeholder (you can expand this later)
console.log("WebSocket support can be added here (e.g., using ws or socket.io)");

// Start the bot (long polling)
bot.start();

console.log("🚀 Bot is running...");



