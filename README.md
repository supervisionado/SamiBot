# 🐾 SamiBot
> Real-time market insights, delivered on demand. A TypeScript Telegram bot that fetches, stores, and analyzes stock & commodity data via structured slash commands.

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Telegram](https://img.shields.io/badge/Telegram-2CA5E0?style=flat&logo=telegram&logoColor=white)
![WebSockets](https://img.shields.io/badge/WebSockets-000000?style=flat&logo=socketdotio&logoColor=white)
![Status](https://img.shields.io/badge/Status-Side_Project-FF69B4)

## 📖 What is SamiBot?
A command-driven Telegram assistant that bridges financial APIs with a clean, predictable interface. SamiBot connects to **Finnhub** (stocks) and **iTick** (commodities) via WebSockets, ingests real-time price feeds, persists them to a database (ToDo), and surfaces structured stats on demand (ToDo). It’s a living lab for API orchestration, data pipelines, and disciplined Git workflows.

## 🐈‍⬛ Why “SamiBot”?
Named after my black cat, Sami. He’s highly active, shares his territory with three females, runs on a strict diet of meat and naps, and has low tolerance for trucks or loud music.  
This bot inherits his personality: **hungry for data**, **efficient when the market’s quiet**, and built to filter out the “noise” so you only get exactly what you ask for. 🐾

## 🛠 Features
### ✅ Currently Live
- 🔄 Iterative Git workflow with intentional, documented commits
- 💬 Command-driven Telegram interface (`/price`, `/list`, `/commodities`, etc.) for quick, structured queries
- 🔌 Real-time stock tracking via Finnhub (WebSocket streams)
- 📦 Commodity data ingestion via Twelve Data (REST API)

### 🔮 On the Horizon
- 🗄️ Persistent storage & statistical aggregations (moving averages, volatility, volume trends)
- 📰 News ingestion & sentiment scoring for market context
- 🪙 Cryptocurrency market support
- 🔔 User-defined price/volume alerts & threshold notifications
- 📊 Expanded analytics & lightweight portfolio tracking

## 🧠 Tech Stack
`TypeScript` | `Node.JS` | `Telegram Bot API (GrammY)` | `WebSockets` | `Finnhub & iTick APIs` | `[Your Database]` | `Git`

## 🌱 Development Philosophy
This is a **spare-time side project** built between work, life, and curiosity.  
I take the architecture and code quality seriously, but I keep expectations light. There’s no launch deadline, no burnout, and no perfectionism—just steady progress, deliberate commits, and genuine enjoyment of the craft. Every update is a step forward, not a milestone to hit. 🐢✨

## 🚀 Getting Started
*(Setup instructions will expand as the project matures.)*
```bash
# Quick preview of the intended flow
git clone https://github.com/yourusername/samibot.git
cp .env.example .env  # Add API keys & DB credentials
npm install
npm run dev           # Starts Telegram bot + WebSocket listeners
