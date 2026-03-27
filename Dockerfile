# ============================================================
# Stage 1: Build the React/Vite frontend
# ============================================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY package.json package-lock.json ./

# Install frontend dependencies
RUN npm ci --ignore-scripts

# Copy frontend source
COPY index.html ./
COPY vite.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY eslint.config.js ./
COPY public/ ./public/
COPY src/ ./src/

# Build the frontend
RUN npm run build

# ============================================================
# Stage 2: Build the Node/Express backend
# ============================================================
FROM node:20-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package.json backend/package-lock.json ./

# Install production dependencies only
RUN npm ci --omit=dev --ignore-scripts

# ============================================================
# Stage 3: Production image
# ============================================================
FROM node:20-alpine AS production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy backend node_modules from builder
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules

# Copy backend source
COPY backend/server.js ./backend/
COPY backend/config/ ./backend/config/
COPY backend/controllers/ ./backend/controllers/
COPY backend/middleware/ ./backend/middleware/
COPY backend/models/ ./backend/models/
COPY backend/routes/ ./backend/routes/
COPY backend/utils/ ./backend/utils/
COPY backend/scripts/ ./backend/scripts/
COPY backend/package.json ./backend/

# Copy built frontend into backend's public directory
COPY --from=frontend-builder /app/frontend/dist ./backend/public

# Set correct ownership
RUN chown -R appuser:appgroup /app

USER appuser

WORKDIR /app/backend

EXPOSE 5000

ENV NODE_ENV=production

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget -qO- http://localhost:5000/api/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "server.js"]
