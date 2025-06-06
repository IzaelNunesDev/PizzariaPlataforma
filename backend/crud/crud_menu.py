# backend/crud/crud_menu.py
from sqlalchemy.orm import Session
from typing import List, Optional

from database import models
from schemas import menu as menu_schemas

# Get a single menu item by ID
def get_menu_item(db: Session, menu_item_id: str) -> Optional[models.MenuItem]:
    return db.query(models.MenuItem).filter(models.MenuItem.id == menu_item_id).first()

# Get all menu items with pagination
def get_menu_items(db: Session, skip: int = 0, limit: int = 100) -> List[models.MenuItem]:
    return db.query(models.MenuItem).offset(skip).limit(limit).all()

# Get menu items by category
def get_menu_items_by_category(db: Session, category: str, skip: int = 0, limit: int = 100) -> List[models.MenuItem]:
    return db.query(models.MenuItem).filter(models.MenuItem.category == category).offset(skip).limit(limit).all()

# Create a new menu item
def create_menu_item(db: Session, menu_item: menu_schemas.MenuItemCreate) -> models.MenuItem:
    db_menu_item = models.MenuItem(
        id=menu_item.id, # Assuming ID is provided or handled appropriately
        name=menu_item.name,
        description=menu_item.description,
        price=menu_item.price,
        category=menu_item.category,
        imageUrl=menu_item.imageUrl
    )
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item

# Update an existing menu item
def update_menu_item(db: Session, menu_item_id: str, menu_item_update: menu_schemas.MenuItemUpdate) -> Optional[models.MenuItem]:
    db_menu_item = get_menu_item(db, menu_item_id)
    if not db_menu_item:
        return None
    
    update_data = menu_item_update.model_dump(exclude_unset=True) # Pydantic v2
    for key, value in update_data.items():
        setattr(db_menu_item, key, value)
        
    db.add(db_menu_item)
    db.commit()
    db.refresh(db_menu_item)
    return db_menu_item

# Delete a menu item
def delete_menu_item(db: Session, menu_item_id: str) -> Optional[models.MenuItem]:
    db_menu_item = get_menu_item(db, menu_item_id)
    if db_menu_item:
        db.delete(db_menu_item)
        db.commit()
    return db_menu_item
