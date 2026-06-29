# J7offsuit

J7offsuit is a private poker cash-game banker ledger. It works like a shared note with automatic chip and money calculation.

## Tech stack

- Frontend: React + Vite + TypeScript + PWA files
- Backend: Spring Boot + Java 21
- Database: PostgreSQL via Docker

## Main rules

- No sign up / login.
- A game only needs a name.
- Each player has `buyInChip` and `cashOutChip`.
- Rebuy is handled by editing the player's total buy-in.
- `cashOutChip` can be empty in the UI and is treated as `0`.
- Negative values are blocked for input.
- Profit/Loss = `cashOutChip - buyInChip`.
- Default rate: `1000 chips = 500,000 VND`.
- View link: read-only.
- Edit link: can edit the shared game.
- Owner token: stored locally in the banker's browser and can delete the game.

## Run locally

### 1. Start PostgreSQL

```bash
docker compose up -d postgres
```

### 2. Start backend

```bash
cd backend
mvn spring-boot:run
```

Backend runs at:

```txt
http://localhost:8080
```

### 3. Start frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```txt
http://localhost:5173
```

## Run backend + PostgreSQL in Docker

```bash
docker compose up --build
```

Then run frontend separately:

```bash
cd frontend
npm install
npm run dev
```

## Important note about no-login mode

Because the app has no account system, the browser stores owned game access in `localStorage`. If the browser data is cleared and the owner link/token is not saved elsewhere, the app cannot recover ownership. View/edit links still work if you copied them.
