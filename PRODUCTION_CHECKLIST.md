# Production Readiness Checklist — Ticket Priority Predictor

## Stack
- Frontend : React 19 + Vite (rolldown-vite 7) + Tailwind CSS
- Backend  : Node.js 20 + Express (backend/server.js)
- Database : MongoDB 7 (Mongoose ODM)
- Auth     : JWT (jsonwebtoken)
- ML       : External HTTP service via backend/utils/mlPredict.js

---

## 1. Environment & Secrets
- [ ] All values in `.env.example` are populated in the production `.env` (never committed to git)
- [ ] `JWT_SECRET` is at least 64 random bytes (`openssl rand -base64 64`)
- [ ] `MONGO_ROOT_PASSWORD` is a strong, unique password — not the default `changeme`
- [ ] `NODE_ENV=production` is set on the server
- [ ] `ML_API_KEY` is rotated and stored in a secrets manager (e.g. AWS Secrets Manager, Vault, GitHub Secrets)
- [ ] `.gitignore` covers `.env`, `*.env`, `dist/`, `node_modules/`

## 2. MongoDB
- [ ] MongoDB is NOT exposed on a public network interface (port 27017 bound to `127.0.0.1` or container-only network)
- [ ] Authentication is enabled (`--auth` flag / `MONGO_INITDB_ROOT_*` env vars)
- [ ] A dedicated application user with least-privilege access is created (not the root user)
- [ ] Automated daily backups are configured (`mongodump` or Atlas backup)
- [ ] MongoDB connection URI uses connection pooling and includes a `connectTimeoutMS` option
- [ ] Mongoose connection error handling and reconnect logic is verified in `backend/config/db.js`
- [ ] Indexes are defined on frequently queried fields (e.g. `Ticket.priority`, `Ticket.createdAt`, `User.email`)

## 3. Backend / Express API
- [ ] `helmet` middleware is installed and active (adds secure HTTP headers)
- [ ] `express-rate-limit` is applied to `/api/auth/*` routes to prevent brute-force attacks
- [ ] CORS origin is restricted to `CLIENT_URL` — wildcard `*` is not used in production
- [ ] `errorHandler` middleware does NOT leak stack traces or internal error details to clients in production
- [ ] All routes requiring authentication are protected by the `auth` middleware
- [ ] Input validation (`backend/middleware/validation.js`) covers all mutation endpoints
- [ ] `/api/health` endpoint exists and returns a 200 with DB connectivity status
- [ ] `express.json()` body size limit is set (e.g. `{ limit: '1mb' }`) to prevent large payload attacks
- [ ] `morgan` or equivalent request logging is enabled and writes to a persistent log destination

## 4. Authentication & Authorization
- [ ] JWT tokens have a reasonable expiry (`JWT_EXPIRE=7d` or shorter)
- [ ] Refresh token strategy or re-login flow is implemented for expired tokens
- [ ] Passwords are hashed with bcrypt (cost factor ≥ 12) in `backend/models/User.js`
- [ ] Password reset tokens (`ForgotPassword` / `ResetPassword` flows) are single-use and expire within 1 hour
- [ ] Role-based access control is enforced server-side (not just on the React router)

## 5. ML Prediction Service
- [ ] `ML_API_URL` is reachable from the production server
- [ ] Timeouts and retries are configured in `backend/utils/mlPredict.js` (axios timeout)
- [ ] The app degrades gracefully if the ML service is unavailable (fallback priority or clear error message)
- [ ] ML API responses are validated before being stored or returned to clients

## 6. Docker & Infrastructure
- [ ] Production image is built from the `production` stage only (no dev tooling included)
- [ ] Container runs as non-root user `appuser` (uid 1001)
- [ ] `dumb-init` is used as PID 1 to handle signals correctly
- [ ] Health checks pass before traffic is routed to the container
- [ ] MongoDB data volume (`mongo_data`) is backed by persistent storage (not ephemeral)
- [ ] Secrets are injected via environment variables or a secrets manager — not baked into the image
- [ ] Image tags use a content-addressed SHA (`sha-<short>`) — `latest` is not relied on exclusively

## 7. Frontend Build
- [ ] `VITE_API_BASE_URL` points to the production backend URL
- [ ] Source maps are NOT included in the production bundle (set `build.sourcemap: false` in `vite.config.js`)
- [ ] Bundle size is reviewed (`npm run build -- --report` or Rollup visualizer)
- [ ] All `console.log` / debug statements are removed or guarded by `NODE_ENV` checks
- [ ] Content Security Policy (CSP) headers are configured at the reverse proxy or in Express

## 8. Networking & TLS
- [ ] A reverse proxy (Nginx, Caddy, or cloud ALB) terminates TLS in front of the Express app
- [ ] HTTPS is enforced — HTTP redirects to HTTPS
- [ ] TLS certificate auto-renewal is configured (Let's Encrypt / Certbot or cloud-managed)
- [ ] HTTP/2 is enabled on the reverse proxy
- [ ] `PORT=5000` is not exposed directly to the internet — only the reverse proxy port (443) is public

## 9. Observability
- [ ] Structured JSON logging is configured (e.g. `pino` or `winston`) with log levels
- [ ] Error tracking is set up (e.g. Sentry DSN configured in both frontend and backend)
- [ ] Uptime / health monitoring is active (e.g. UptimeRobot pinging `/api/health`)
- [ ] Container and host metrics are collected (CPU, memory, disk, MongoDB connections)

## 10. CI/CD
- [ ] GitHub Actions secrets are set: `JWT_SECRET`, `MONGO_ROOT_PASSWORD`, `DEPLOY_HOST`, `DEPLOY_USER`, `DEPLOY_SSH_KEY`, `VITE_API_BASE_URL`
- [ ] The `production` GitHub Actions environment has required reviewers enabled
- [ ] Build fails on ESLint errors (no `--max-warnings` bypass)
- [ ] Docker image digest is pinned in deployment to prevent supply-chain substitution
- [ ] A rollback procedure is documented and tested (previous image tag redeploy)

## 11. Seed Data & Database Migrations
- [ ] `backend/scripts/seed.js` is NOT run automatically on production startup
- [ ] A migration strategy is in place for Mongoose schema changes (e.g. `migrate-mongoose`)
- [ ] Seeding in production (if needed) is a deliberate, gated manual step
