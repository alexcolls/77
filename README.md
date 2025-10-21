# SOLucky (aka 77)

Decentralized, daily lottery on Solana with a realtime Vue.js client and Node.js backend. Users connect their Solana wallet, commit a number, and watch the global pot and stats update live.

- Program: Anchor-based Solana program for ticket accounts
- Client: Vue 3 + Tailwind + Wallet Adapter
- Backend: Express + Socket.IO + PostgreSQL for history and analytics

## Table of Contents
- Overview
- Architecture
- Features
- Quick Start
- Configuration
- Development
- Smart Contract
- Backend Server
- Web Client(s)
- Troubleshooting
- Contributing
- License

## Overview
SOLucky is a simple, fair daily lottery. Each ticket stores: owner, timestamp, number, and country on-chain (Anchor account). The backend aggregates stats, pushes realtime updates, and persists historical draws in PostgreSQL. The Vue client shows the pot in SOL/USD, connected users, and historical charts.

## Architecture
- Solana program (Anchor-like), see `solotto/*/src/program/lib.rs`
- Node.js server with Socket.IO, see `solotto/server`
- Vue 3 frontends: `web` (marketing/landing) and `solotto/client` (full dApp)

Data flow:
Wallet -> Client (commit number) -> Backend (broadcast + DB) -> Client (live pot, stats)
On-chain: ticket accounts per user with number + metadata

## Features
- 🔐 Wallet connect (Solana Wallet Adapter / solana-wallets-vue)
- 🎟️ Ticket commit with number + country
- 📈 Live pot in SOL and USD (ticker via Bitstamp)
- 🧠 Stats: verified tickets, unique players, countries
- 🕗 Daily cycle at 00:00:00 UTC; server table rotation 08:00 UTC
- 🧰 Tailwind UI, charts, sockets

## Quick Start
Prereqs: Node 16+, npm, PostgreSQL, Solana toolchain (for program builds)

Install root deps (if any):
```bash
npm install
```

Install each app:
```bash
# Web landing
cd web && npm install

# Lottery client
cd solotto/client && npm install

# Backend server
cd solotto/server && npm install
```

Run dev:
```bash
# Backend
cd solotto/server && node server.js

# Web landing
cd web && npm run serve

# Lottery client
cd solotto/client && npm run serve
```

## Configuration
Create `.env` files per app (see variables below). Values here are inferred from the code; adjust for your environment.

Backend (`solotto/server/.env`):
- POSTGRE_URL=postgres://user:pass@host:5432/dbname
- CLIENT_URL=http://localhost:8080

Client (`solotto/client/.env`):
- VUE_APP_SOCKET_ENDPOINT=http://localhost:5001
- VUE_APP_CLUSTER_URL=https://api.devnet.solana.com

Web (`web/.env`):
- VUE_APP_SOCKET_ENDPOINT=http://localhost:5001
- VUE_APP_CLUSTER_URL=https://api.devnet.solana.com

Program:
- Program ID (found in lib.rs): fH2j1AXaGr14kCroRseuetQsJmi6rij1NNqkBicdksr

## Development
- Smart contract: Rust + Anchor-style accounts in `solotto/*/src/program/lib.rs`
- Frontends: Vue 3 + Tailwind, uses Socket.IO for realtime updates
- Server: Express + Socket.IO, schedules daily tasks and talks to PostgreSQL

Recommended scripts:
```bash
# Web
cd web && npm run serve
# Client
cd solotto/client && npm run serve
# Server
cd solotto/server && node server.js
```

## Smart Contract
Found in `solotto/client/src/program/lib.rs` and `solotto/backup/src/program/lib.rs`.

Instructions:
- send_ticket(owner, number: i32, country: String)
- delete_ticket
- delete_tickets
- close (close account and defund)
- force_defund (safety for closed account discriminator)

Account: Ticket
- owner: Pubkey
- timestamp: i64
- number: i32
- country: String

## Backend Server
Path: `solotto/server`
- server.js: Express + Socket.IO + PostgreSQL
- Emits: getPOT, getTickets, nVerified, nPlayers, getHistory, userNumber
- Ticker: coin-ticker Bitstamp SOL_USD
- Utilities: `src/utils` (time/date, counts), `src/controller` (SQL helpers)

Ports and timing:
- Default port: 5001
- Creates a new daily table at ~08:00 UTC (e.g., `_YYYY_MM_DD_`)

## Web Client(s)
- `web`: Landing site with wallet status and hero sections
- `solotto/client`: Full dApp with Pot, Play, and History panels

Common commands:
```bash
npm run serve
npm run build
npm run lint
```

## Troubleshooting
- Socket not connecting: ensure `VUE_APP_SOCKET_ENDPOINT` matches backend URL and CORS allows the origin
- Empty pot/metrics: verify PostgreSQL `POSTGRE_URL` and that tables exist (the server creates daily tables at 08:00 UTC)
- Wallet errors: check `VUE_APP_CLUSTER_URL` RPC endpoint and wallet adapter setup

## Contributing
PRs are welcome. Please open an issue to discuss major changes first. Ensure lint passes for affected packages.

## License
If you plan to open source, consider adding a LICENSE (MIT recommended).
