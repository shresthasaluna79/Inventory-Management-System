from sqlalchemy.orm import Session
from sqlalchemy import func
from models import Category, Item, User
from schemas import CategoryCreate, CategoryUpdate, ItemCreate, ItemUpdate


# ── Auth ──────────────────────────────────────────────────────────────────────

SEED_USERS = [
    {"name": "Alice Johnson",  "email": "alice@inventory.com",   "password": "Alice@123",   "role": "Admin"},
    {"name": "Bob Smith",      "email": "bob@inventory.com",     "password": "Bob@123",     "role": "Manager"},
    {"name": "Carol Williams", "email": "carol@inventory.com",   "password": "Carol@123",   "role": "Staff"},
    {"name": "David Brown",    "email": "david@inventory.com",   "password": "David@123",   "role": "Staff"},
    {"name": "Eva Martinez",   "email": "eva@inventory.com",     "password": "Eva@123",     "role": "Manager"},
    {"name": "Frank Wilson",   "email": "frank@inventory.com",   "password": "Frank@123",   "role": "Staff"},
    {"name": "Grace Lee",      "email": "grace@inventory.com",   "password": "Grace@123",   "role": "Staff"},
    {"name": "Henry Taylor",   "email": "henry@inventory.com",   "password": "Henry@123",   "role": "Admin"},
    {"name": "Isla Anderson",  "email": "isla@inventory.com",    "password": "Isla@123",    "role": "Staff"},
    {"name": "Jack Thomas",    "email": "jack@inventory.com",    "password": "Jack@123",    "role": "Manager"},
]


def seed_users(db: Session):
    if db.query(User).count() == 0:
        for u in SEED_USERS:
            db.add(User(**u))
        db.commit()


def login_user(db: Session, email: str, password: str):
    return db.query(User).filter(
        User.email == email,
        User.password == password,
        User.is_active == True
    ).first()


# ── Categories ────────────────────────────────────────────────────────────────

def get_categories(db: Session):
    return db.query(Category).order_by(Category.name).all()


def get_category(db: Session, category_id: int):
    return db.query(Category).filter(Category.id == category_id).first()


def get_category_by_name(db: Session, name: str):
    return db.query(Category).filter(Category.name == name).first()


def create_category(db: Session, payload: CategoryCreate):
    cat = Category(**payload.model_dump())
    db.add(cat)
    db.commit()
    db.refresh(cat)
    return cat


def update_category(db: Session, category_id: int, payload: CategoryUpdate):
    cat = get_category(db, category_id)
    if not cat:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(cat, field, value)
    db.commit()
    db.refresh(cat)
    return cat


def delete_category(db: Session, category_id: int):
    cat = get_category(db, category_id)
    if not cat:
        return None
    db.delete(cat)
    db.commit()
    return cat


def get_categories_with_count(db: Session):
    rows = (
        db.query(Category, func.count(Item.id).label("item_count"))
        .outerjoin(Item, Item.category_id == Category.id)
        .group_by(Category.id)
        .order_by(Category.name)
        .all()
    )
    result = []
    for cat, count in rows:
        cat.__dict__["item_count"] = count
        result.append(cat)
    return result


# ── Items ─────────────────────────────────────────────────────────────────────

def get_items(db: Session, category_id: int | None = None, search: str | None = None):
    q = db.query(Item)
    if category_id:
        q = q.filter(Item.category_id == category_id)
    if search:
        term = f"%{search.lower()}%"
        q = q.filter(
            (func.lower(Item.name).like(term)) |
            (func.lower(Item.sku).like(term)) |
            (func.lower(Item.location).like(term))
        )
    return q.order_by(Item.name).all()


def get_item(db: Session, item_id: int):
    return db.query(Item).filter(Item.id == item_id).first()


def get_item_by_sku(db: Session, sku: str):
    return db.query(Item).filter(Item.sku == sku).first()


def create_item(db: Session, payload: ItemCreate):
    item = Item(**payload.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


def update_item(db: Session, item_id: int, payload: ItemUpdate):
    item = get_item(db, item_id)
    if not item:
        return None
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(item, field, value)
    db.commit()
    db.refresh(item)
    return item


def delete_item(db: Session, item_id: int):
    item = get_item(db, item_id)
    if not item:
        return None
    db.delete(item)
    db.commit()
    return item


def get_inventory_summary(db: Session):
    total_items = db.query(func.count(Item.id)).scalar() or 0
    total_quantity = db.query(func.sum(Item.quantity)).scalar() or 0
    total_categories = db.query(func.count(Category.id)).scalar() or 0
    low_stock_count = (
        db.query(func.count(Item.id))
        .filter(Item.quantity <= Item.reorder_level, Item.reorder_level > 0)
        .scalar() or 0
    )
    return {
        "total_items": total_items,
        "total_quantity": int(total_quantity),
        "total_categories": total_categories,
        "low_stock_count": low_stock_count,
    }
