from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional

import crud
import models
import schemas
from database import engine, get_db, SessionLocal

# Create all tables on startup (safe to run repeatedly)
models.Base.metadata.create_all(bind=engine)

# Seed default users once
_db = SessionLocal()
try:
    crud.seed_users(_db)
finally:
    _db.close()

app = FastAPI(title="Inventory Management API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins in development
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/health")
def health():
    return {"status": "ok"}


# ── Auth ──────────────────────────────────────────────────────────────────────

@app.post("/api/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    user = crud.login_user(db, payload.email, payload.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return user





# ── Summary ───────────────────────────────────────────────────────────────────

@app.get("/api/summary", response_model=schemas.InventorySummary)
def get_summary(db: Session = Depends(get_db)):
    return crud.get_inventory_summary(db)


# ── Categories ────────────────────────────────────────────────────────────────

@app.get("/api/categories", response_model=list[schemas.CategoryWithCount])
def list_categories(db: Session = Depends(get_db)):
    return crud.get_categories_with_count(db)


@app.post("/api/categories", response_model=schemas.CategoryOut, status_code=201)
def create_category(payload: schemas.CategoryCreate, db: Session = Depends(get_db)):
    if crud.get_category_by_name(db, payload.name):
        raise HTTPException(status_code=409, detail="Category with this name already exists")
    return crud.create_category(db, payload)


@app.get("/api/categories/{category_id}", response_model=schemas.CategoryOut)
def get_category(category_id: int, db: Session = Depends(get_db)):
    cat = crud.get_category(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@app.put("/api/categories/{category_id}", response_model=schemas.CategoryOut)
def update_category(category_id: int, payload: schemas.CategoryUpdate, db: Session = Depends(get_db)):
    if payload.name:
        existing = crud.get_category_by_name(db, payload.name)
        if existing and existing.id != category_id:
            raise HTTPException(status_code=409, detail="Category name already in use")
    cat = crud.update_category(db, category_id, payload)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")
    return cat


@app.delete("/api/categories/{category_id}", status_code=204)
def delete_category(category_id: int, db: Session = Depends(get_db)):
    cat = crud.delete_category(db, category_id)
    if not cat:
        raise HTTPException(status_code=404, detail="Category not found")


# ── Items ─────────────────────────────────────────────────────────────────────

@app.get("/api/items", response_model=list[schemas.ItemOut])
def list_items(
    category_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    return crud.get_items(db, category_id=category_id, search=search)


@app.post("/api/items", response_model=schemas.ItemOut, status_code=201)
def create_item(payload: schemas.ItemCreate, db: Session = Depends(get_db)):
    # Validate category exists
    if not crud.get_category(db, payload.category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    # Validate SKU uniqueness
    if payload.sku and crud.get_item_by_sku(db, payload.sku):
        raise HTTPException(status_code=409, detail="Item with this SKU already exists")
    return crud.create_item(db, payload)


@app.get("/api/items/{item_id}", response_model=schemas.ItemOut)
def get_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.get_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.put("/api/items/{item_id}", response_model=schemas.ItemOut)
def update_item(item_id: int, payload: schemas.ItemUpdate, db: Session = Depends(get_db)):
    if payload.category_id and not crud.get_category(db, payload.category_id):
        raise HTTPException(status_code=404, detail="Category not found")
    if payload.sku:
        existing = crud.get_item_by_sku(db, payload.sku)
        if existing and existing.id != item_id:
            raise HTTPException(status_code=409, detail="SKU already in use")
    item = crud.update_item(db, item_id, payload)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    return item


@app.delete("/api/items/{item_id}", status_code=204)
def delete_item(item_id: int, db: Session = Depends(get_db)):
    item = crud.delete_item(db, item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
