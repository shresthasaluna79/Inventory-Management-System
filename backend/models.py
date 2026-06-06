from sqlalchemy import Column, String, Integer, Numeric, Text, ForeignKey, TIMESTAMP, Boolean, func
from sqlalchemy.orm import relationship
from database import Base


class User(Base):
    __tablename__ = "users"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False)
    email      = Column(String(200), unique=True, nullable=False, index=True)
    password   = Column(String(200), nullable=False)   # plain text for demo
    role       = Column(String(50), nullable=False, default="Staff")
    is_active  = Column(Boolean, default=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())


class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())

    items = relationship("Item", back_populates="category", cascade="all, delete-orphan")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    category_id = Column(Integer, ForeignKey("categories.id", ondelete="RESTRICT"), nullable=False)
    quantity = Column(Integer, nullable=False, default=0)
    unit = Column(String(50), nullable=True)          # e.g. "pcs", "kg", "box"
    unit_price = Column(Numeric(12, 2), nullable=True)
    sku = Column(String(100), unique=True, nullable=True)
    location = Column(String(200), nullable=True)
    reorder_level = Column(Integer, nullable=True, default=0)
    notes = Column(Text, nullable=True)
    created_at = Column(TIMESTAMP(timezone=True), server_default=func.now())
    updated_at = Column(TIMESTAMP(timezone=True), server_default=func.now(), onupdate=func.now())

    category = relationship("Category", back_populates="items")
