# backend/schemas/menu.py
from pydantic import BaseModel
from typing import Optional

# Base model for MenuItem, used for creation and updates
class MenuItemBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float
    category: str
    imageUrl: Optional[str] = None

# Schema for creating a new MenuItem
# ID will be generated or handled by the backend, not provided by client on creation
class MenuItemCreate(MenuItemBase):
    id: str # As per user specification, client might provide ID or it's generated

# Schema for updating an existing MenuItem (all fields optional)
class MenuItemUpdate(MenuItemBase):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = None
    category: Optional[str] = None
    imageUrl: Optional[str] = None

# Schema for reading/returning a MenuItem (includes ID)
class MenuItem(MenuItemBase):
    id: str

    class Config:
        from_attributes = True # Pydantic v2, replaces orm_mode
