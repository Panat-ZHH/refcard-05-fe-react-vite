# syntax=docker/dockerfile:1.7
# ---------------------------------------------------------------------------
# Stage 1: Vite-Build (Node 22)
# ---------------------------------------------------------------------------
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
# Vite bettet VITE_*-Variablen beim Build ein -> Backend-URL und Version als Build-Args
ARG VITE_API_BASE_URL=http://localhost:8080/
ARG VITE_APP_VERSION=dev
ARG GIT_SHA=local
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL} \
    VITE_APP_VERSION=${VITE_APP_VERSION}
RUN npm run build \
 && printf '{"version":"%s","gitSha":"%s","apiBaseUrl":"%s"}\n' "$VITE_APP_VERSION" "$GIT_SHA" "$VITE_API_BASE_URL" > dist/version.json

# ---------------------------------------------------------------------------
# Stage 2: nginx (non-root) liefert nur den fertigen Build aus
# ---------------------------------------------------------------------------
FROM nginxinc/nginx-unprivileged:1.27-alpine
ARG VITE_APP_VERSION=dev
ARG GIT_SHA=local
LABEL org.opencontainers.image.title="biztrips-frontend" \
      org.opencontainers.image.version="${VITE_APP_VERSION}" \
      org.opencontainers.image.revision="${GIT_SHA}" \
      org.opencontainers.image.source="https://github.com/Panat-ZHH/refcard-05-fe-react-vite"
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/healthz || exit 1
