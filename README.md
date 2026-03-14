<h1 align="center">NgOo Coffee Website</h1>

## Project Summary

NgOo Coffee is a full-stack e-commerce frontend for a coffee shop, built with Next.js 15 (App Router), React 19, TypeScript, and GraphQL. It includes:

- **Authentication** — Email/password + Google OAuth via NextAuth 4 (JWT strategy, 2-min refresh)
- **Menu & Cart** — Cursor-based infinite scroll, Zustand cart with localStorage persistence
- **Payments** — PayPal (popup flow + Socket.IO status), Cash on Delivery (real-time order progress), Crypto (on-chain via BNB Testnet + NgooPayment contract)
- **Web3** — MetaMask/WalletConnect via Wagmi, 3-step nonce → sign → verify wallet ownership flow
- **Real-time** — Socket.IO for payment status updates across all payment methods
- **Logging** — Pino browser logger (`src/lib/logger.ts`): structured logs in dev, silent in prod

---

## ⚙️ Setup Guideline

Follow these steps to set up and run the **NgOo Coffee Frontend** locally.

1️⃣ Clone the Repository

```bash
git clone https://github.com/ThanhNguyen03/ngoo-cf-2025.git
cd ngoo-cf
```

2️⃣ Install Dependencies

```
yarn
```

3️⃣ Configure Environment Variables <br/>

Create a `.env` file in the project root. Then edit it to include your own configuration according to the provided `.env.example` file.

4️⃣ Run the Development Server <br/>

```
yarn dev
```

Once the server starts, open your browser and visit: `http://localhost:3000`

## Test sandbox Paypal account

Email: sb-6zfkd47331494@personal.example.com
Password: ]H&=4dDf
