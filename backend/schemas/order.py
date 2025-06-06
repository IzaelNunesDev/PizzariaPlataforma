# backend/schemas/order.py
from pydantic import BaseModel
from typing import List, Optional
from .menu import MenuItem # For response model

# --- OrderItem Schemas ---
class OrderItemBase(BaseModel):
    menu_item_id: str
    quantity: int

class OrderItemCreate(OrderItemBase):
    pass

class OrderItemUpdate(OrderItemBase):
    quantity: Optional[int] = None # Allow updating only quantity

class OrderItem(OrderItemBase):
    id: int
    # menu_item: MenuItem # Optionally include full menu item details

    class Config:
        from_attributes = True

# --- Order Schemas ---
class OrderBase(BaseModel):
    # Add other order details here if needed, e.g., delivery_address, notes
    pass

class OrderCreate(OrderBase):
    items: List[OrderItemCreate]

class OrderUpdate(OrderBase):
    # Potentially update status, items (more complex), etc.
    # For now, let's keep it simple. Order updates might be restricted.
    pass

class Order(OrderBase):
    id: int
    user_id: int
    total_price: float
    items: List[OrderItem]

    class Config:
        from_attributes = True
