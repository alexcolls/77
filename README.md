<div align="center">

# 🎰 SOLucky (77)

### *Decentralized Daily Lottery on Solana*

[![Solana](https://img.shields.io/badge/Solana-Program-9945FF?style=for-the-badge&logo=solana&logoColor=white)](https://solana.com)
[![Vue.js](https://img.shields.io/badge/Vue.js-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)](https://vuejs.org)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white)](https://socket.io)

*Connect your wallet, pick your lucky number, and watch the pot grow in real-time* ✨

[Quick Start](#-quick-start) • [Features](#-features) • [Architecture](#-architecture) • [Configuration](#-configuration)

</div>

---

## 🎯 Overview

**SOLucky** is a fully decentralized, transparent daily lottery built on Solana. Every ticket is stored on-chain with complete fairness and verifiability. The platform features real-time updates, live statistics, and seamless wallet integration.

### Why SOLucky?

- 🔒 **Trustless & Transparent** - All tickets stored on-chain
- ⚡ **Real-time Updates** - Watch the pot grow with Socket.IO
- 🌍 **Global Participation** - Track players by country
- 💰 **Live SOL/USD Pricing** - Real-time market rates
- 📊 **Historical Analytics** - Complete draw history and stats
- 🎨 **Beautiful UI** - Modern design with Tailwind CSS

---

## 🏗 Architecture

```mermaid
graph LR
    A[👛 Solana Wallet] --> B[🎨 Vue 3 Client]
    B --> C[⚡ Node.js + Socket.IO]
    C --> D[🐘 PostgreSQL]
    C --> E[⛓️ Solana Program]
    B --> E
```

### Stack Components

| Layer | Technology | Location |
|-------|-----------|----------|
| **Smart Contract** | Rust + Anchor | `solotto/*/src/program/lib.rs` |
| **Backend Server** | Express + Socket.IO | `solotto/server/` |
| **Lottery dApp** | Vue 3 + Tailwind | `solotto/client/` |
| **Landing Page** | Vue 3 | `web/` |
| **Database** | PostgreSQL | Remote/Local |
| **Real-time** | Socket.IO | Backend & Clients |

### Data Flow

```
1. User connects Solana wallet 👛
2. Client commits ticket (number + country) 🎟️
3. Backend broadcasts update via Socket.IO 📡
4. On-chain ticket account created ⛓️
5. Stats aggregated in PostgreSQL 📊
6. Live updates pushed to all clients ⚡
```

---

## ✨ Features

### 🎮 Core Gameplay
- 🔐 **Solana Wallet Integration** - Phantom, Solflare, and more
- 🎟️ **Ticket Commitment** - Choose your lucky number (0-99)
- 🌍 **Country Tracking** - Geographic distribution of players
- ⏰ **Daily Draws** - Reset at 00:00:00 UTC

### 📊 Real-time Stats
- 💰 **Live Pot Value** - Updated in SOL and USD
- 👥 **Active Players** - Connected users count
- ✅ **Verified Tickets** - Total committed tickets
- 🗺️ **Global Map** - Players by country

### 💻 Technical Features
- ⚡ **Socket.IO** - Sub-second update latency
- 📈 **Chart.js Integration** - Historical data visualization
- 🎨 **Tailwind CSS** - Responsive, modern UI
- 🔄 **Auto-rotation** - Daily table creation at 08:00 UTC
- 💱 **Live Ticker** - Bitstamp SOL/USD feed

---

## 🚀 Quick Start

### Prerequisites

```bash
# Required
Node.js >= 16
npm or yarn
PostgreSQL >= 12

# Optional (for smart contract development)
Rust + Cargo
Solana CLI
Anchor Framework
```

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/77.git
cd 77

# 2. Install root dependencies
npm install

# 3. Install backend dependencies
cd solotto/server
npm install

# 4. Install client dependencies
cd ../client
npm install

# 5. Install web landing dependencies
cd ../../web
npm install
```

### Running Development Servers

```bash
# Terminal 1 - Backend Server (Port 5001)
cd solotto/server
node server.js

# Terminal 2 - Lottery Client (Port 8080)
cd solotto/client
npm run serve

# Terminal 3 - Landing Page (Port 8081)
cd web
npm run serve
```

---

## ⚙️ Configuration

### Backend Server `.env`

Create `solotto/server/.env`:

```env
# Database
POSTGRE_URL=postgres://user:password@localhost:5432/solucky

# CORS
CLIENT_URL=http://localhost:8080

# Server
PORT=5001
```

### Lottery Client `.env`

Create `solotto/client/.env`:

```env
# Backend WebSocket
VUE_APP_SOCKET_ENDPOINT=http://localhost:5001

# Solana Cluster
VUE_APP_CLUSTER_URL=https://api.devnet.solana.com
# For mainnet: https://api.mainnet-beta.solana.com

# Program ID
VUE_APP_PROGRAM_ID=fH2j1AXaGr14kCroRseuetQsJmi6rij1NNqkBicdksr
```

### Landing Page `.env`

Create `web/.env`:

```env
VUE_APP_SOCKET_ENDPOINT=http://localhost:5001
VUE_APP_CLUSTER_URL=https://api.devnet.solana.com
```

> 💡 **Tip**: Check `.env.sample` files in each directory for complete examples

---

## 🔧 Development

### Smart Contract

**Location**: `solotto/client/src/program/lib.rs`

#### Instructions

| Instruction | Parameters | Description |
|------------|------------|-------------|
| `send_ticket` | `owner`, `number: i32`, `country: String` | Create new ticket |
| `delete_ticket` | - | Delete single ticket |
| `delete_tickets` | - | Delete all user tickets |
| `close` | - | Close account and reclaim rent |
| `force_defund` | - | Safety mechanism for closed accounts |

#### Ticket Account Structure

```rust
pub struct Ticket {
    pub owner: Pubkey,      // Wallet address
    pub timestamp: i64,     // Unix timestamp
    pub number: i32,        // Lucky number (0-99)
    pub country: String,    // ISO country code
}
```

**Program ID**: `fH2j1AXaGr14kCroRseuetQsJmi6rij1NNqkBicdksr`

### Backend Server

**Location**: `solotto/server/`

#### Socket.IO Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `getPOT` | Server → Client | `{ sol: Number, usd: Number }` | Current pot value |
| `getTickets` | Server → Client | `Array<Ticket>` | All active tickets |
| `nVerified` | Server → Client | `Number` | Verified ticket count |
| `nPlayers` | Server → Client | `Number` | Unique player count |
| `getHistory` | Server → Client | `Array<Draw>` | Historical draws |
| `userNumber` | Client → Server | `{ number: Number, country: String }` | Commit ticket |

#### Scripts

```bash
# Production
npm start

# Development (auto-reload)
npm run dev
```

### Frontend Clients

#### Lottery dApp (`solotto/client`)

Main application with:
- 🎮 Play panel (ticket submission)
- 💰 Pot display (SOL/USD)
- 📊 Statistics dashboard
- 📜 History viewer

#### Landing Page (`web`)

Marketing site with:
- 🎨 Hero section
- 👛 Wallet status
- 📱 Call-to-action

#### Common Commands

```bash
# Development server
npm run serve

# Production build
npm run build

# Linting
npm run lint
```

---

## 🗄️ Database Schema

### Daily Tables

Tables are auto-created at **08:00 UTC** with format: `_YYYY_MM_DD_`

```sql
CREATE TABLE _2024_10_21_ (
    id SERIAL PRIMARY KEY,
    owner VARCHAR(44),
    number INT,
    country VARCHAR(2),
    timestamp BIGINT,
    verified BOOLEAN DEFAULT false
);
```

---

## 🐛 Troubleshooting

### Socket Connection Issues

**Problem**: Client can't connect to Socket.IO server

**Solutions**:
- ✅ Verify `VUE_APP_SOCKET_ENDPOINT` matches backend URL
- ✅ Check CORS settings in `solotto/server/server.js`
- ✅ Ensure backend server is running on correct port
- ✅ Check firewall/network settings

### Empty Pot/Metrics

**Problem**: No data displayed in UI

**Solutions**:
- ✅ Verify PostgreSQL connection via `POSTGRE_URL`
- ✅ Check if daily table exists (created at 08:00 UTC)
- ✅ Inspect browser console for errors
- ✅ Ensure backend has database permissions

### Wallet Connection Errors

**Problem**: Can't connect Solana wallet

**Solutions**:
- ✅ Check `VUE_APP_CLUSTER_URL` is valid RPC endpoint
- ✅ Verify wallet adapter is properly installed
- ✅ Test with different wallet (Phantom, Solflare, etc.)
- ✅ Check browser console for adapter errors
- ✅ Ensure wallet has SOL for transaction fees

### Build Issues

**Problem**: npm install or build fails

**Solutions**:
- ✅ Use Node.js 16 or higher
- ✅ Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
- ✅ Clear npm cache: `npm cache clean --force`
- ✅ Check for node-gyp issues on Windows

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. 🍴 Fork the repository
2. 🌿 Create a feature branch (`git checkout -b feature/amazing-feature`)
3. 💾 Commit your changes (`git commit -m '✨ Add amazing feature'`)
4. 📤 Push to the branch (`git push origin feature/amazing-feature`)
5. 🎉 Open a Pull Request

### Guidelines

- Ensure all linters pass before submitting
- Write clear commit messages
- Update documentation for new features
- Test thoroughly on devnet before proposing mainnet changes

---

## 📋 Roadmap

- [ ] 🎨 UI/UX improvements
- [ ] 🔔 Push notifications for draws
- [ ] 📱 Mobile app (React Native)
- [ ] 🏆 Leaderboard system
- [ ] 🎁 Referral rewards
- [ ] 🌐 Multi-language support
- [ ] 🔐 Enhanced security audits
- [ ] 📈 Advanced analytics dashboard

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Solana Foundation for the amazing blockchain
- Anchor Framework for smart contract development
- Vue.js community for excellent tooling
- Socket.IO for real-time communication

---

<div align="center">

**Built with ❤️ on Solana**

[⬆ Back to Top](#-solucky-77)

</div>
