# wTracker — Architecture & Deployment Specification

This document is generated from the current repository layout and source, not from a generic Django/React template. Paths, ports, script names, and environment variable names below match this codebase.

**Repository root:** `C:\1drive\React\wTracker`  
**Backend package:** `backend/` (Django project module is `config`, not `wtracker_config`)  
**Frontend package:** `wTracker/` (Vite app; `package.json` `"name"` is `"wtracker"`)

---

## 1. Project directory tree

Generated artifacts (`node_modules/`, `dist/`, `backend/staticfiles/`, `*.sqlite3`, `.venv/`) are gitignored and omitted. Local `.env` files are gitignored; committed templates are `.env.example`.

```text
wTracker/                          # git repo root
├── .gitignore
├── DEPLOYMENT_SPEC.md
│
├── backend/                       # Django API (cwd for manage.py / gunicorn)
│   ├── .env.example
│   ├── Procfile                   # gunicorn config.wsgi:application
│   ├── runtime.txt                # python-3.13.0
│   ├── start.sh                   # migrate + collectstatic + create_admin + gunicorn
│   ├── requirements.txt
│   ├── manage.py                  # DJANGO_SETTINGS_MODULE=config.settings
│   ├── create_admin.py            # optional superuser from DJANGO_SUPERUSER_*
│   ├── accounts/                  # custom User + cookie JWT auth
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── authentication.py      # CookieJWTAuthentication
│   │   ├── cookies.py             # access_token / refresh_token cookies
│   │   ├── models.py              # AUTH_USER_MODEL = accounts.User
│   │   ├── serializers.py
│   │   ├── throttles.py           # login / register scopes
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── tests.py
│   │   └── migrations/0001_initial.py
│   ├── logs/                      # workout CRUD + stats
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   ├── permissions.py
│   │   ├── serializers.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── tests.py
│   │   └── migrations/
│   │       ├── 0001_initial.py
│   │       └── 0002_alter_workoutlog_date.py
│   └── config/                    # Django project (settings / URLconf / WSGI)
│       ├── settings.py
│       ├── urls.py
│       ├── exceptions.py
│       ├── wsgi.py                # application = get_wsgi_application()
│       └── asgi.py                # application = get_asgi_application() (unused by Procfile)
│
└── wTracker/                      # React SPA (Vite)
    ├── .env.example               # VITE_API_URL=http://localhost:8000/api
    ├── .gitignore
    ├── README.md
    ├── package.json
    ├── package-lock.json          # npm lockfile (not pnpm/yarn)
    ├── vite.config.js             # @vitejs/plugin-react + @tailwindcss/vite; no proxy, no custom port
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx                # client routes
        ├── index.css
        ├── theme.css
        ├── api/
        │   ├── axios.js           # authenticated client, withCredentials, CSRF, 401 refresh
        │   ├── publicAxios.js     # login/register/csrf/logout/refresh
        │   ├── auth.js
        │   └── workout.js
        ├── context/AuthContext.jsx
        ├── utils/csrf.js          # in-memory csrfToken → X-CSRFToken
        ├── utils/notify.js
        ├── components/
        │   ├── Navigation.jsx
        │   ├── ProtectedRoute.jsx
        │   └── ui/EmptyState.jsx, Spinner.jsx
        └── pages/
            ├── Landing.jsx
            ├── auth/Login.jsx, Register.jsx
            └── dashboard/
                ├── DashboardLayout.jsx
                ├── WorkoutLogs.jsx
                ├── WorkoutDetails.jsx
                ├── AddSet.jsx
                └── Profile.jsx
```

---

## 2. Backend architecture & specs

### 2.1 Runtime and dependencies

| Item | Value in this repo |
|---|---|
| Python | `python-3.13.0` (`backend/runtime.txt`) |
| Settings module | `config.settings` |
| WSGI | `config.wsgi:application` (`WSGI_APPLICATION` and `Procfile`) |
| ASGI | `config.asgi:application` exists; **not** used by `Procfile` or `start.sh` |
| Process manager | gunicorn `23.0.0` |

Pinned packages from `backend/requirements.txt`:

| Package | Version | Role |
|---|---|---|
| Django | 6.0 | Web framework |
| djangorestframework | 3.16.1 | REST API |
| djangorestframework_simplejwt | 5.5.1 | JWT issue/refresh/blacklist |
| django-cors-headers | 4.9.0 | CORS (`corsheaders`) |
| dj-database-url | 3.1.0 | Parse `DATABASE_URL` |
| python-dotenv | 1.2.1 | `load_dotenv()` in `settings.py` |
| whitenoise | 6.11.0 | Static files (`STATICFILES_STORAGE`) |
| psycopg / psycopg-binary | 3.3.2 | PostgreSQL (when `DATABASE_URL` is set) |
| gunicorn | 23.0.0 | Production HTTP |
| PyJWT | 2.10.1 | JWT library (SimpleJWT dependency) |
| asgiref, packaging, sqlparse, tzdata | as pinned | Django stack |

Django apps: `accounts`, `logs`, plus `rest_framework`, `rest_framework.authtoken`, `rest_framework_simplejwt.token_blacklist`, `corsheaders`. Custom user: `AUTH_USER_MODEL = "accounts.User"`.

### 2.2 Database

Logic in `backend/config/settings.py`:

1. If `os.environ.get("DATABASE_URL")` is truthy → `dj_database_url.parse(DATABASE_URL, conn_max_age=60)` (PostgreSQL in production).
2. Else → SQLite file `backend/db.sqlite3` (`ENGINE = django.db.backends.sqlite3`).

There is **no** live `DB_NAME` / `DB_USER` / `DB_PASSWORD` / `DB_HOST` / `DB_PORT` usage in `settings.py`. Those names are not read.

### 2.3 Authentication (accurate to current code)

This is **cookie JWT**, not “put Bearer tokens in localStorage”.

| Detail | Implementation |
|---|---|
| DRF default auth class | `accounts.authentication.CookieJWTAuthentication` |
| Access cookie | name `access_token`, `HttpOnly`, path `/api/` |
| Refresh cookie | name `refresh_token`, `HttpOnly`, path `/api/auth/` |
| Access lifetime | 15 minutes (`SIMPLE_JWT`) |
| Refresh lifetime | 7 days |
| Rotation | `ROTATE_REFRESH_TOKENS=True`, `BLACKLIST_AFTER_ROTATION=True` |
| CSRF | Unsafe methods: `X-CSRFToken` (token from `GET /api/auth/csrf/`, stored in frontend memory). Django CSRF cookie is not HttpOnly. |
| Credentials | Frontend axios `withCredentials: true` (cookies cross-origin) |
| CORS | `CORS_ALLOW_CREDENTIALS = True`; origins from `CORS_ALLOWED_ORIGINS` |
| Fallback header | `AUTH_HEADER_TYPES = ("Bearer",)`. If `access_token` cookie is missing, `CookieJWTAuthentication` still accepts `Authorization: Bearer <access>`. The React clients **do not** send that header. |

Login response body is user JSON (`id`, `username`, `email`) from `MeSerializer`. Tokens are **not** returned in JSON.

### 2.4 HTTP entry, port, static

| Item | Value |
|---|---|
| Local dev command | `python manage.py runserver 8000` from `backend/` |
| Local bind | Django default `127.0.0.1:8000` |
| Production command (`Procfile`) | `gunicorn config.wsgi:application --workers 1 --threads 2 --timeout 30 --max-requests 200 --max-requests-jitter 20` |
| `start.sh` | `gunicorn config.wsgi:application` (**no** `--bind 0.0.0.0:$PORT`) |
| Static | `STATIC_URL=static/`, `STATIC_ROOT=backend/staticfiles/`, WhiteNoise |
| Admin | `http://127.0.0.1:8000/admin/` (not under `/api/`) |

### 2.5 API routes

All JSON API routes are under `/api/` except Django admin.

**Health / auth** (`backend/config/urls.py` + `backend/accounts/urls.py`):

| Method | Path | Auth |
|---|---|---|
| GET | `/api/health/` | none |
| GET | `/api/auth/csrf/` | AllowAny; returns `{ "csrfToken": "..." }` |
| POST | `/api/auth/register/` | AllowAny; throttle scope `register` `10/hour` |
| POST | `/api/auth/login/` | AllowAny; throttle scope `login` `5/min`; sets cookies |
| POST | `/api/auth/refresh/` | AllowAny; reads `refresh_token` cookie |
| POST | `/api/auth/logout/` | AllowAny; blacklists refresh; clears cookies |
| GET | `/api/auth/me/` | authenticated |

**Workouts** (`backend/logs/urls.py`, included at `/api/`):

| Method | Path |
|---|---|
| GET, POST | `/api/logs/` |
| GET, PUT/PATCH, DELETE | `/api/logs/<pk>/` |
| GET, POST | `/api/logs/<log_id>/exercises/` |
| GET, PUT/PATCH, DELETE | `/api/exercises/<pk>/` |
| GET, POST | `/api/exercises/<exercise_id>/sets/` |
| GET, PUT/PATCH, DELETE | `/api/sets/<pk>/` |
| GET | `/api/stats/` |

Default permission: `IsAuthenticated`. Pagination: `PageNumberPagination`, `PAGE_SIZE=50`. Default throttles: anon `60/hour`, user `300/hour`.

---

## 3. Frontend architecture & specs

| Item | Value in this repo |
|---|---|
| Location | `wTracker/` |
| UI | React `^19.2.0` (`react-dom` same) |
| Router | `react-router-dom` `^7.12.0` |
| Build | Vite `^7.2.4` (`vite.config.js`) |
| CSS | Tailwind via `@tailwindcss/vite` `^4.1.18` |
| HTTP | axios `^1.13.2` |
| Package manager | **npm** (`package-lock.json`; no `pnpm-lock.yaml` / `yarn.lock`) |
| Node version | **Not pinned** (`package.json` has no `engines` field) |
| Dev script | `npm run dev` → `vite` |
| Build script | `npm run build` → `vite build` |
| Preview script | `npm run preview` → `vite preview` |
| Lint | `npm run lint` → `eslint .` |
| Dev URL | Vite default **http://localhost:5173/** (`vite.config.js` does not set `server.port`) |
| Preview URL | Vite default **4173** (not customized) |
| Build output | **`wTracker/dist/`** (Vite default `outDir`; gitignored as `wTracker/dist/`) |
| Dev proxy | **None**. `vite.config.js` has no `server.proxy`. |

### 3.1 API base URL

Both `src/api/axios.js` and `src/api/publicAxios.js`:

```js
baseURL: import.meta.env.VITE_API_URL
withCredentials: true
```

`wTracker/.env.example`:

```text
VITE_API_URL=http://localhost:8000/api
```

Relative paths in clients are appended to that base (`/auth/login/`, `/logs/`, …), so the browser calls `http://localhost:8000/api/auth/login/` in local dev. There is no CRA `REACT_APP_*` and no Vite proxy `/api` rewrite.

`VITE_*` is inlined at **build time**. Production frontend hosts (Vercel, S3+CloudFront, etc.) must set `VITE_API_URL` before `npm run build`.

### 3.2 SPA routes (`src/App.jsx`)

| Path | Page |
|---|---|
| `/` | Landing |
| `/login` | Login |
| `/register` | Register |
| `/dashboard` | Workout log list (protected) |
| `/dashboard/logs/:logId` | Workout detail (protected) |
| `/dashboard/profile` | Profile (protected) |
| `*` | redirect to `/` |

---

## 4. Local run (Windows CMD)

Use **two** Command Prompt windows. Paths below are this machine’s workspace root.

### 4.1 One-time setup (first clone)

**Backend** — CMD:

```bat
cd /d C:\1drive\React\wTracker\backend
python -m venv .venv
.venv\Scripts\activate.bat
python -m pip install -r requirements.txt
copy .env.example .env
python manage.py migrate
```

Then edit `backend\.env`:

- `DJANGO_DEBUG=True`
- `DJANGO_SECRET_KEY` any long local string (or omit; DEBUG allows a built-in insecure fallback)
- `DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1`
- `CORS_ALLOWED_ORIGINS=http://localhost:5173`
- `CSRF_TRUSTED_ORIGINS=http://localhost:5173`
- `JWT_COOKIE_SECURE=False`
- `JWT_COOKIE_SAMESITE=Lax`
- Leave `DATABASE_URL` unset to use SQLite `backend\db.sqlite3`

**Frontend** — CMD:

```bat
cd /d C:\1drive\React\wTracker\wTracker
npm install
copy .env.example .env
```

`.env` should contain exactly:

```text
VITE_API_URL=http://localhost:8000/api
```

### 4.2 Start the app (every session)

**Terminal 1 — backend (must be up first):**

```bat
cd /d C:\1drive\React\wTracker\backend
.env\Scripts\activate.bat
python manage.py runserver 8000
```

API: http://127.0.0.1:8000/api/health/  
Admin: http://127.0.0.1:8000/admin/

**Terminal 2 — frontend:**

```bat
cd /d C:\1drive\React\wTracker\wTracker
npm run dev
```

UI: http://localhost:5173/

If `.venv` was not created, skip the `activate.bat` line and use a Python that already has `backend/requirements.txt` installed.

Optional admin user (only if these three env vars are set):

```bat
cd /d C:\1drive\React\wTracker\backend
.venv\Scripts\activate.bat
python create_admin.py
```

---

## 5. Networking, ports, and environment map

### 5.1 Services and ports

| Service | Code / process | Local dev | Production recommendation |
|---|---|---|---|
| Frontend (Vite) | `npm run dev` in `wTracker/` | **5173** | 443 (HTTPS) via CDN/static host; `vite preview` would be 4173 |
| Backend (Django) | `runserver` / gunicorn `config.wsgi:application` | **8000** | 443 via ALB/nginx; app bind `0.0.0.0:$PORT` (PaaS). `Procfile` does not set `--bind`. |
| Django admin | same process | 8000 `/admin/` | same origin as API; restrict network |
| Database | SQLite file **or** Postgres from `DATABASE_URL` | SQLite (no port) | PostgreSQL **5432** (RDS). Example URL in `.env.example` uses `:5432`. |
| Health check | `GET /api/health/` | 8000 | target this path; keep `DJANGO_SECURE_SSL_REDIRECT=False` behind an ALB HTTP target |

Cross-origin local: UI `http://localhost:5173` → API `http://localhost:8000`. Cookies: `SameSite=Lax`, `Secure=False`. Production split domains need `JWT_COOKIE_SAMESITE=None` and `JWT_COOKIE_SECURE=True`.

### 5.2 Environment variable inventory

Every name actually read in code or documented in `.env.example`.

**Backend (`settings.py`, `create_admin.py`, dotenv)**

| Variable | Where | Default if unset | Example production value |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | `settings.py` | Required if `DJANGO_DEBUG` is not `True`; DEBUG fallback `dev-only-insecure-key` | 50+ char random string (never the git-history value) |
| `DJANGO_DEBUG` | `settings.py` | `"False"` (only `"True"` enables debug) | `False` |
| `DJANGO_ALLOWED_HOSTS` | `settings.py` `env_list` | empty list; **raises** if not DEBUG | `api.example.com` (comma-separated, no spaces required after comma but strips) |
| `DJANGO_SECURE_SSL_REDIRECT` | `settings.py` | `"False"` | `False` behind ALB; `True` only if Django itself terminates HTTPS |
| `DJANGO_SECURE_HSTS_SECONDS` | `settings.py` | `31536000` when not DEBUG | `31536000` |
| `CORS_ALLOWED_ORIGINS` | `settings.py` | empty | `https://app.example.com` |
| `CSRF_TRUSTED_ORIGINS` | `settings.py` | empty | `https://app.example.com` (scheme required) |
| `DATABASE_URL` | `settings.py` | unset → SQLite | `postgres://USER:PASSWORD@HOST:5432/DBNAME` |
| `JWT_COOKIE_SECURE` | `settings.py` | `False` if DEBUG else `True` | `True` |
| `JWT_COOKIE_SAMESITE` | `settings.py` | `Lax` if DEBUG else `None` | `None` (cross-site SPA) |
| `DJANGO_SUPERUSER_USERNAME` | `create_admin.py` / `start.sh` | skip create if any missing | your admin username |
| `DJANGO_SUPERUSER_EMAIL` | same | skip | `ops@example.com` |
| `DJANGO_SUPERUSER_PASSWORD` | same | skip | strong password (host secret store) |
| `DJANGO_SETTINGS_MODULE` | `manage.py`, `wsgi.py`, `asgi.py`, `create_admin.py` | set in those files to `config.settings` | do not override unless you know why |

Not used: `SECRET_KEY` (Django reads `DJANGO_SECRET_KEY`), `DEBUG` (use `DJANGO_DEBUG`), `ALLOWED_HOSTS` (use `DJANGO_ALLOWED_HOSTS`), `PORT` (not referenced in `Procfile` / `start.sh`).

**Frontend**

| Variable | Where | Example production value |
|---|---|---|
| `VITE_API_URL` | `axios.js`, `publicAxios.js`; `.env.example` | `https://api.example.com/api` (must include `/api`, no trailing slash beyond that) |

---

## 6. Deployment checklist (files this repo does **not** have)

Present today: `backend/Procfile`, `backend/runtime.txt`, `backend/start.sh`, `backend/requirements.txt`, `backend/.env.example`, `wTracker/.env.example`, WhiteNoise (no separate nginx in-repo).

Missing (typical next artifacts):

| File | Why |
|---|---|
| `backend/Dockerfile` | Container image: Python 3.13, `pip install -r requirements.txt`, `collectstatic`, gunicorn bind `0.0.0.0:$PORT` |
| `wTracker/Dockerfile` | Optional nginx/static image of `dist/` if not using a static host |
| `docker-compose.yml` | Local/prod-like: frontend, API, Postgres 5432 |
| `.github/workflows/deploy.yml` (or any `.github/workflows/`) | CI: `npm run build`, Django `check`/`migrate`, deploy |
| `nginx.conf` | TLS, reverse proxy `/api/` → gunicorn, SPA fallback to `index.html` |
| `vercel.json` / `netlify.toml` / `render.yaml` | Platform config (none in repo) |
| Gunicorn `--bind 0.0.0.0:$PORT` | `Procfile` and `start.sh` omit bind; many PaaS platforms require `$PORT` |

Production host env (minimum): `DJANGO_SECRET_KEY`, `DJANGO_DEBUG=False`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `DATABASE_URL`, `JWT_COOKIE_SECURE=True`, `JWT_COOKIE_SAMESITE=None`, and frontend build `VITE_API_URL`. Rotate any secret that was previously committed in `.env` files.
