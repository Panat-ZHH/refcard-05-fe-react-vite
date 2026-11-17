# RefCard 05 – Frontend: React + Vite als nginx-Container auf Amazon ECS

> **RefCard05 (M324 DevOps)** – Fork von `bbwlc/refcard-03-fe-react-vite` (Stand `v1-start`).
> Projektteam: Panat Ruangsri, Timo Eichenberger, Johan Stefanes  
> Hauptdokumentation (PDF): [docs/RefCard05_Dokumentation.pdf](docs/RefCard05_Dokumentation.pdf) (Kopie, Original im Repo refcard-05-fullstack-aws)  
> Backup-Dokumentation, AWS-Setup und lokales Compose: **[refcard-05-fullstack-aws](https://github.com/Panat-ZHH/refcard-05-fullstack-aws)**
> Backend: **[refcard-05-be-springboot-businesstrips](https://github.com/Panat-ZHH/refcard-05-be-springboot-businesstrips)**

[![Frontend CI/CD](https://github.com/Panat-ZHH/refcard-05-fe-react-vite/actions/workflows/ci-cd.yml/badge.svg)](https://github.com/Panat-ZHH/refcard-05-fe-react-vite/actions/workflows/ci-cd.yml)

## Was ist neu in RefCard05?

| Thema | Umsetzung | Dateien |
|---|---|---|
| CI/CD | lint → test → Vite-Build → nginx-Image → **Amazon ECR** → Rolling Deployment **ECS Fargate** → Smoke-Test (`/version.json`) | [`.github/workflows/ci-cd.yml`](.github/workflows/ci-cd.yml) |
| Image | Multi-Stage: Node 22 (Vite-Build) → `nginx-unprivileged` (non-root, Port 8080, `/healthz`) | [`Dockerfile`](Dockerfile), [`nginx.conf`](nginx.conf) |
| Backend-URL | `VITE_API_BASE_URL` = URL des Backend-Service (ALB), als Repository-Variable → Docker-Build-Arg | Pipeline, [`tripsService.js`](src/components/tripsService.js) |
| Versionierung | Git-Tag `vX.Y.Z` → Image-Tags `X.Y.Z`, `X.Y`, `latest` + `sha-<commit>`; Footer zeigt Frontend- **und** Backend-Version | Pipeline, [`VersionFooter.jsx`](src/components/VersionFooter.jsx) |
| Bilder | Trip-Bilder kommen vom Backend (S3), Upload-Button pro Trip; Fallback auf statische Bilder | [`TripImage.jsx`](src/components/TripImage.jsx), [`TripList.jsx`](src/components/TripList.jsx) |

### Pipeline-Konfiguration (GitHub)

| Typ | Name | Inhalt |
|---|---|---|
| Secret | `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_SESSION_TOKEN` | temporäre Learner-Lab-Zugangsdaten (laufen mit der Session ab) |
| Variable | `VITE_API_BASE_URL` | `http://<ALB-DNS>/` – URL des Backend-Service |
| Variable | `APP_URL` | `http://<ALB-DNS>` – für Smoke-Test und GitHub-Environment |

### Lokal entwickeln

```bash
npm ci
npm run dev        # http://localhost:5173, Backend unter VITE_API_BASE_URL aus .env (http://localhost:8080/)
npm test           # Vitest
```

Gesamtsystem lokal (Frontend + Backend + MariaDB + S3Mock, mit Podman): siehe [docker-compose-local](https://github.com/Panat-ZHH/refcard-05-fullstack-aws/tree/main/docker-compose-local).

---

## Ursprüngliche Beschreibung (RefCard 03)

# React + Vite

## Getting the starting point

**Option A — fresh clone at the starting point**

```bash
git clone --branch v1-start https://github.com/bbwlc/refcard-03-fe-react-vite.git
cd refcard-03-fe-react-vite
npm install
npm run dev
```

**Option B — you already have the repo cloned**

```bash
git fetch --tags
git checkout v1-start
npm install
npm run dev
```

This puts you in a "detached HEAD" state at the tag — fine for exploring, but if you'll commit your own work, branch off it first:

```bash
git checkout -b my-work v1-start
```

> The app calls a backend at `http://localhost:8080/v1/trips` (see the `RefCard-03-be-SpringBootBusinessTrips` project), so make sure that's running too for the trip list / wishlist to show real data.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
