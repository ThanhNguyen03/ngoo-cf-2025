<h1 align="center">NgOo Coffee Website</h1>

## Project Summary

NgOo Coffee is a full-stack e-commerce frontend for a coffee shop, built with Next.js 15 (App Router), React 19, TypeScript, and GraphQL. It includes:

- **Authentication** — Email/password + Google OAuth via NextAuth 4 (JWT strategy, 2-min refresh)
- **Menu & Cart** — Cursor-based infinite scroll, Zustand cart with localStorage persistence
- **Search** — Debounced full-text search with hot/trending terms (Redis sorted set) and localStorage recent searches
- **Recommendations** — Personalized "For you" tab per user (weighted VIEW/ADD_TO_CART/PURCHASE scoring, Redis 5-min cache); anonymous users see hot-search + best-seller fallback
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

## Design System

Figma file: [NgOo Coffee Design System](https://www.figma.com/design/sMPUpe33CNmUhnRGuzCF8k)

Documents all reusable components (Button, TextInput, Checkbox, SwitchButton, etc.) with their states, plus responsive page layouts for Home, Menu, Checkout, Payment, and Profile pages at Desktop/Tablet/Mobile viewports.

## TODO / Future Work

- **Admin Panel** — The BE has full admin APIs (audit log queries, order management, payment management) behind `adminWrapper` with `ERole.Admin` enforcement. FE has no admin UI. Needs: `/admin` route with audit log viewer, order management dashboard, payment history, item/category CRUD UI.

## Test sandbox Paypal account

Email: sb-6zfkd47331494@personal.example.com
Password: ]H&=4dDf
