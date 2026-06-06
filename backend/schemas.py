from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime
from decimal import Decimal


# ── Auth ──────────────────────────────────────────────────────────────────────

class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    email: str
    role: str


# ── Category ──────────────────────────────────────────────────────────────────

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None


class CategoryCreate(CategoryBase):
    pass


class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None


class CategoryOut(CategoryBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime


class CategoryWithCount(CategoryOut):
    item_count: int


# ── Item ──────────────────────────────────────────────────────────────────────

class ItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    category_id: int
    quantity: int = 0
    unit: Optional[str] = None
    unit_price: Optional[Decimal] = None
    sku: Optional[str] = None
    location: Optional[str] = None
    reorder_level: Optional[int] = 0
    notes: Optional[str] = None


class ItemCreate(ItemBase):
    pass


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    quantity: Optional[int] = None
    unit: Optional[str] = None
    unit_price: Optional[Decimal] = None
    sku: Optional[str] = None
    location: Optional[str] = None
    reorder_level: Optional[int] = None
    notes: Optional[str] = None


class ItemOut(ItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: datetime
    updated_at: datetime
    category: CategoryOut


# ── Summary ───────────────────────────────────────────────────────────────────

class InventorySummary(BaseModel):
    total_items: int
    total_quantity: int
    total_categories: int
    low_stock_count: int
