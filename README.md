# VerityAI

**VerityAI** is a Hallucination-Aware Information Assistant designed to provide grounded, verified answers with transparent source attribution and confidence indicators.

---

## 🛠 Technology Stack

- **Frontend:** React 19, TypeScript, Vite
- **Backend:** Python 3.11, FastAPI, Pydantic v2, Uvicorn
- **AI & Reasoning:** Google Gemini API *(planned)*
- **Data Persistence:** Firebase Firestore *(planned)*
- **Vector Retrieval:** ChromaDB *(planned)*
- **Testing:** Pytest, HTTPX, Vitest/React Testing Library
- **Version Control:** Git

---

## 📂 Project Structure

```text
VerityAI/
├── frontend/                     # React + TypeScript + Vite frontend application
│   ├── src/                      # Source code (components, styles, hooks)
│   ├── public/                   # Static assets
│   ├── package.json              # Frontend dependencies and build scripts
│   ├── tsconfig.json             # TypeScript compiler configuration
│   └── vite.config.ts            # Vite bundler configuration
├── backend/                      # Python FastAPI backend service
│   ├── app/                      # Application core module
│   │   ├── api/                  # API routers and endpoints
│   │   ├── core/                 # App configuration and settings
│   │   ├── models/               # Pydantic data schemas
│   │   ├── services/             # Business logic and external service integrations
│   │   └── utils/                # Helper functions and utilities
│   ├── tests/                    # Pytest test suite
│   └── requirements.txt          # Backend Python dependencies
├── docs/                         # Project documentation and specifications
├── .env.example                  # Environment variable template
├── .gitignore                    # Version control exclusions
├── pytest.ini                    # Pytest test discovery settings
└── README.md                     # Project overview and instructions
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v20+ (tested on v26+)
- **npm:** v10+ (tested on v11+)
- **Python:** 3.11.x
- **Git**

### Backend Setup

1. **Create and activate Python virtual environment:**
   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

2. **Install backend dependencies:**
   ```bash
   pip install -r backend/requirements.txt
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```

4. **Run the backend development server:**
   ```bash
   uvicorn backend.app.main:app --reload --port 8000
   ```
   API Documentation is available at:
   - Swagger UI: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/api/health`

5. **Run backend test suite:**
   ```bash
   pytest
   ```

### Frontend Setup

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Run frontend development server:**
   ```bash
   npm run dev
   ```
   The application will be accessible at `http://localhost:5173/`.

3. **Build frontend for production:**
   ```bash
   npm run build
   ```

---

## 🔒 Security & Environment Variables

- Never commit `.env` or any file containing private keys, API secrets, or service account credentials to Git.
- The `.gitignore` file is strictly configured to ignore `.env`, `.env.*`, Firebase credentials (`*firebase*.json`, `*serviceAccount*.json`), and ChromaDB persistent storage directories.
- Always use `.env.example` as a template for adding new environment configuration flags.
