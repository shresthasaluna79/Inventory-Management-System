# Inventory Management — Backend (FastAPI)

## Setup

### 1. Create & activate a virtual environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 2. Install dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure the database

Edit `.env` and paste your Supabase **direct connection** (Transaction mode pooler) URL:

```
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

> Use port **5432** for the direct / session pooler. Port 6543 is for transaction mode.

### 4. Create tables in Supabase

Open the Supabase dashboard → **SQL Editor** → paste the contents of `schema.sql` → Run.

### 5. Start the server

```bash
uvicorn main:app --reload --port 8000
```

API docs are available at: http://localhost:8000/docs

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/summary` | Inventory summary KPIs |
| GET | `/api/categories` | List all categories (with item count) |
| POST | `/api/categories` | Create a category |
| GET | `/api/categories/{id}` | Get a category |
| PUT | `/api/categories/{id}` | Update a category |
| DELETE | `/api/categories/{id}` | Delete a category |
| GET | `/api/items` | List items (supports `?search=` and `?category_id=`) |
| POST | `/api/items` | Create an item |
| GET | `/api/items/{id}` | Get an item |
| PUT | `/api/items/{id}` | Update an item |
| DELETE | `/api/items/{id}` | Delete an item |
