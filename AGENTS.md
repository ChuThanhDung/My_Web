# AGENTS.md — Developer Reference for AI Agents

Welcome, AI Agent! This file acts as a system summary and guidelines catalog for this project. Read this thoroughly to ensure compatibility and consistency before making changes.

---

## 🛠️ Technology Stack

* **Frontend**:
  * React 19 (SPA Router: `react-router-dom` v7)
  * Build Tool: Vite 8 + TypeScript
  * Styling: Tailwind CSS v3 + PostCSS
  * Animation: Framer Motion v12
  * Translation: i18next (with React integrations and locale detection)
  * Mathematics: KaTeX (`react-katex` for LaTeX support)
  * HTTP Client: Axios

* **Backend**:
  * FastAPI (Python 3.12+)
  * ORM: SQLAlchemy
  * Database: SQLite (`sql_app.db` locally)
  * Dependency Manager: pip (`requirements.txt`)
  * Runtime/Server: Uvicorn

---

## 📁 Repository Directory Structure

```text
/ (Project Root)
├── backend/                  # Python FastAPI codebase
│   ├── routers/              # API endpoints organized by feature
│   │   ├── admin.py
│   │   ├── articles.py
│   │   ├── auth.py
│   │   ├── contact.py
│   │   ├── projects.py
│   │   └── quizzes.py
│   ├── database.py           # SQLAlchemy setup and database sessions
│   ├── dependencies.py       # API dependency injection (auth checks, db session)
│   ├── main.py               # API gateway initialization & middleware
│   ├── models.py             # SQLAlchemy SQL database models
│   ├── schemas.py            # Pydantic validation schemas
│   ├── seed.py               # DB seeder (runs automatically if DB is empty)
│   └── requirements.txt      # Backend Python dependencies
├── src/                      # Frontend Client codebase
│   ├── assets/               # Local static images and icons
│   ├── components/           # Reusable UI widgets and layout shells
│   │   ├── topics/           # Sub-components displaying individual ML details
│   │   ├── LanguageToggle.tsx
│   │   ├── Layout.tsx        # Base page layout (sidebar + animation host)
│   │   ├── Sidebar.tsx       # Collapsible navigation panel
│   │   └── ThemeToggle.tsx
│   ├── hooks/                # Custom React hooks (e.g., useIsDark.ts)
│   ├── i18n/                 # Localization configuration
│   │   ├── config.ts
│   │   └── locales/          # Localization files (en.json, vi.json)
│   ├── lib/                  # Helper utilities (Framer Motion variants)
│   ├── pages/                # Parent route templates
│   ├── App.css               # App-wide UI rules
│   ├── App.tsx               # Route definitions
│   ├── api.ts                # Axios instance with auth interceptor
│   ├── index.css             # Tailwind layers and root variables
│   └── main.tsx              # React mounting root
├── public/                   # Public assets (untransformed files)
├── mycode/                   # Extra/sandbox static HTML utility pages
├── dist/                     # Productive client output folder (after build)
└── .run-logs/                # Operational CLI logs
```

---

## 🔑 Environment Variables

### Frontend (`/src/.env` & `.env.production`)
* `VITE_API_URL`: Address of the backend server. Defaults to `http://127.0.0.1:8000/api` if not provided.

### Backend (`/backend/.env`)
* `ALLOWED_ORIGINS`: Comma-separated list of origins permitted by CORS.
* `SECRET_KEY`: Private hashing key for generating JWT tokens.
* `ADMIN_PASSWORD`: Plain password required for backend dashboard operations.

---

## ⚙️ Build and Run Commands

### Frontend (Root Directory)
* **Start local dev server**: `npm run dev`
* **Compile for production**: `npm run build`
* **Lint codebase**: `npm run lint`

### Backend (`/backend` Directory)
* **Activate virtual environment** (Windows): `venv\Scripts\activate`
* **Activate virtual environment** (Linux/macOS): `source venv/bin/activate`
* **Install dependencies**: `pip install -r requirements.txt`
* **Launch server**: `uvicorn main:app --reload --port 8000`

---

## 🎨 UI/UX Design System & Animation Patterns

* **Theme**: Modern high-contrast editorial UI with a premium black interface (`#000000` or `#080808` backgrounds) in dark mode. Light mode acts as a clean, high-contrast white layout.
* **Colors**: 
  * Dark theme uses pure deep blacks, high-contrast white text, and sleek neon border highlights.
  * Light theme uses soft grey-whites (`#f1f5f9`) and deep slate colors (`#0f172a`).
* **Animations**: Powered by Framer Motion. Motion presets (variants) must be stored in `src/lib/motion.ts` to keep JSX clean and reusable.
* **Canvas Particles**: Managed in `Layout.tsx` dynamically according to theme variables.
* **Responsive Layout**: Sidebar is placed on the left side on desktop screens and collapses to a minimized version. On mobile, it automatically shifts to a bottom navigation bar.

---

## 🔌 API Architecture

All routes are prefixed by `/api`:
1. `POST /api/auth/login`: Accepts credentials and yields a bearer JWT.
2. `GET /api/articles`: Fetches articles cataloging ML topics.
3. `POST /api/contact`: Collects incoming contact messages.
4. `GET /api/projects`: Displays the active project list.

*Authentication*: Requests require the header: `Authorization: Bearer <JWT_TOKEN>`.

---

## 🛑 STRICT RULES (DO NOT BREAK)

1. **Routing Integrity**: Never modify routes in `App.tsx` unless adding new routes explicitly requested by the user. Do not break navigation.
2. **Mobile Responsiveness**: Maintain excellent layouts for both tablet and mobile displays. The sidebar must convert to a bottom navigation bar on mobile screen sizes.
3. **API Contracts**: Do not modify existing API properties or responses. Pydantic schemas in `backend/schemas.py` are coupled directly with React types.
4. **Translations**: All user-facing text must be fetched through the `t()` helper of `react-i18next`. Update both `en.json` and `vi.json` files when modifying static texts.
5. **No Heavy Libraries**: Rely on tailwind classes and custom code rather than importing massive component toolkits.
6. **No Hardcoding URLs**: Always query `import.meta.env.VITE_API_URL` for fetching endpoints.
7. **Keep Comments/KaTeX**: Leave mathematical LaTeX configurations and comments untouched.
