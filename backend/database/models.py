# backend/database/models.py
from sqlalchemy import Column, Integer, String, Float, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True) # Added for user status management
    orders = relationship("Order", back_populates="owner")

class MenuItem(Base):
    __tablename__ = "menu_items"
    id = Column(String, primary_key=True, index=True) # As per user specification (string ID)
    name = Column(String, index=True, nullable=False)
    description = Column(String)
    price = Column(Float, nullable=False)
    category = Column(String, index=True)
    imageUrl = Column(String) # SQLAlchemy convention is often snake_case (e.g., image_url)

class Order(Base):
    __tablename__ = "orders"
    id = Column(Integer, primary_key=True, index=True)
    total_price = Column(Float, nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"))
    owner = relationship("User", back_populates="orders")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = "order_items"
    id = Column(Integer, primary_key=True, index=True)
    quantity = Column(Integer, nullable=False)
    menu_item_id = Column(String, ForeignKey("menu_items.id"), nullable=False)
    order_id = Column(Integer, ForeignKey("orders.id"), nullable=False)
    order = relationship("Order", back_populates="items")
    # Optional: relationship to MenuItem for easier access from OrderItem if needed
    # menu_item = relationship("MenuItem")
