# Inventory Management System

Full-stack inventory management app.

## Structure

```
├── frontend/   React + TypeScript + Vite + Tailwind
└── backend/    FastAPI + SQLAlchemy + SQLite/PostgreSQL
```

## Local Development

### Backend
```bash
cd backend
py -3.12 -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Deployment

- **Frontend** → Vercel (root directory: `frontend`)
- **Backend** → Render (root directory: `backend`)

Set `VITE_API_BASE_URL` in Vercel to your Render backend URL.
