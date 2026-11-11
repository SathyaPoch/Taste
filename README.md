# Taste

Taste is a crop marketplace prototype for customers and farmers. Customers can browse produce, save listings, send buy requests, and review crops. Farmers can publish listings and manage incoming requests.

## Architecture

The current repository runs as a Vue 3 and Vite frontend with lightweight mock authentication middleware:

```text
Browser (Vue 3) -> Vite development server (mock auth) -> userdb.json
                         |
                         +-> localStorage for prototype listings, chats, reviews, and profile data
```

The planned `web -> NestJS API -> PostgreSQL` architecture is not implemented yet. The `api/` directory and `docker-compose.yml` are empty. There is no PostgreSQL service or Swagger page in the current project.

## State management

Pinia holds state shared across components. The crops store contains the crop list and its loading, error, and loaded status, with actions to load and add crops. The counter store is unused demo code.

State used only by one page or temporary interaction stays in that component. Examples include form fields, filter selections, the selected chat, review stars, and image previews. Keeping this state local avoids making unrelated components depend on it.

The prototype uses browser `localStorage` for data that should survive page reloads, including the signed-in user, farmer listings, buy requests, saved listings, chat messages, reviews, and profile data. This is separate from Pinia and does not sync to a server.

## Run locally

Requirements: Node.js `^22.18.0` or `>=24.12.0` and npm.

From the repository root:

```sh
cd web/taste
npm install
npm run dev
```

Open <http://localhost:5173>.

Vite provides mock `POST /api/auth/login` and `POST /api/auth/signup` endpoints during development. The mock account data is stored in the repository root `userdb.json`. Prototype listings, chat messages, reviews, and profile information use browser `localStorage`.

## Environment variables

No environment variables are required for the current local setup. There is no `api/.env.example` yet.

| Name | Purpose | Example |
| --- | --- | --- |
| None | The current app uses Vite defaults and local mock data. | userdb.json |

## Test accounts

Use verification code `1111` for each account.

| Role | Name | Phone | Password |
| --- | --- | --- | --- |
| Farmer | H : Farmer | `+85512345678` | `pass123` |
| Customer | J Customer | `+85599887766` | `pass123` |
| Customer | New Customer | `+85512345677` | `pass123` |
| Admin | Admin | `+85511223344` | `pass01` |

These are development-only credentials. The mock authentication middleware reads passwords and verification codes from `userdb.json`.

## API documentation

Swagger is not configured yet. The Vite mock server currently implements:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Validate a phone number, password, and verification code. |
| `POST` | `/api/auth/signup` | Add a customer account to `userdb.json`. |

## Tests and checks

Run the frontend unit tests once:

```sh
cd web/taste
npm run test:unit -- --run
```

Run the production build, which includes Vue TypeScript checking:

```sh
npm run build
```

There is no e2e test suite or e2e runner configured yet.
