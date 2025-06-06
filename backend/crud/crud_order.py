# backend/crud/crud_order.py
from sqlalchemy.orm import Session
from typing import List, Optional

from database import models
from schemas import order as order_schemas
from . import crud_menu # To fetch menu item details like price

# Create a new order
def create_order(db: Session, order: order_schemas.OrderCreate, user_id: int) -> models.Order:
    total_price = 0
    db_order_items = []

    for item_in in order.items:
        menu_item = crud_menu.get_menu_item(db, item_in.menu_item_id)
        if not menu_item:
            # Handle error: menu item not found. 
            # This could raise an HTTPException in the route or be handled here.
            # For now, we'll skip items not found, but in a real app, you'd want robust error handling.
            # Consider raising ValueError or a custom exception.
            raise ValueError(f"Menu item with id {item_in.menu_item_id} not found.")
        
        total_price += menu_item.price * item_in.quantity
        db_order_item = models.OrderItem(
            menu_item_id=item_in.menu_item_id,
            quantity=item_in.quantity
            # order_id will be set when the Order is created and relationships are flushed
        )
        db_order_items.append(db_order_item)
    
    db_order = models.Order(
        user_id=user_id, 
        total_price=total_price, 
        items=db_order_items # SQLAlchemy will handle associating these OrderItems with the Order
    )
    db.add(db_order)
    db.commit()
    db.refresh(db_order) # Refresh to get IDs and relationships populated
    return db_order

# Get a single order by ID
def get_order(db: Session, order_id: int) -> Optional[models.Order]:
    return db.query(models.Order).filter(models.Order.id == order_id).first()

# Get all orders (e.g., for an admin)
def get_orders(db: Session, skip: int = 0, limit: int = 100) -> List[models.Order]:
    return db.query(models.Order).order_by(models.Order.id.desc()).offset(skip).limit(limit).all()

# Get orders for a specific user
def get_orders_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[models.Order]:
    return (
        db.query(models.Order)
        .filter(models.Order.user_id == user_id)
        .order_by(models.Order.id.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )

# Note: Updating and Deleting orders can be complex due to business logic
# (e.g., can't update a completed order, refunds, etc.).
# For now, we'll keep it simple or omit them until specific requirements are defined.

# Example: Update order status (simplified)
# def update_order_status(db: Session, order_id: int, status: str) -> Optional[models.Order]:
#     db_order = get_order(db, order_id)
#     if db_order:
#         db_order.status = status # Assuming 'status' field exists in Order model
#         db.add(db_order)
#         db.commit()
#         db.refresh(db_order)
#     return db_order
