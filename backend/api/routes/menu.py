# backend/api/routes/menu.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from api import deps
from crud import crud_menu
from schemas import menu as menu_schemas
from database import models # For response model if needed, though schemas are preferred

router = APIRouter()

@router.post("/", response_model=menu_schemas.MenuItem, status_code=status.HTTP_201_CREATED)
def create_menu_item(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    menu_item_in: menu_schemas.MenuItemCreate,
    # current_user: models.User = Depends(deps.get_current_active_superuser) # If only superusers can create
):
    """
    Create a new menu item.
    Potentially restricted to admin/superuser.
    """
    # Check if item with this ID already exists if IDs are client-provided and unique
    existing_item = crud_menu.get_menu_item(db, menu_item_id=menu_item_in.id)
    if existing_item:
        raise HTTPException(
            status_code=400,
            detail=f"Menu item with ID '{menu_item_in.id}' already exists."
        )
    menu_item = crud_menu.create_menu_item(db=db, menu_item=menu_item_in)
    return menu_item

@router.get("/", response_model=List[menu_schemas.MenuItem])
def read_menu_items(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    category: str = Query(None, description="Filter menu items by category")
):
    """
    Retrieve all menu items, optionally filtered by category.
    """
    if category:
        menu_items = crud_menu.get_menu_items_by_category(db, category=category, skip=skip, limit=limit)
    else:
        menu_items = crud_menu.get_menu_items(db, skip=skip, limit=limit)
    return menu_items

@router.get("/{menu_item_id}", response_model=menu_schemas.MenuItem)
def read_menu_item(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    menu_item_id: str,
):
    """
    Get a specific menu item by ID.
    """
    menu_item = crud_menu.get_menu_item(db, menu_item_id=menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    return menu_item

@router.put("/{menu_item_id}", response_model=menu_schemas.MenuItem)
def update_menu_item(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    menu_item_id: str,
    menu_item_in: menu_schemas.MenuItemUpdate,
    # current_user: models.User = Depends(deps.get_current_active_superuser) # If only superusers can update
):
    """
    Update a menu item.
    Potentially restricted to admin/superuser.
    """
    menu_item = crud_menu.get_menu_item(db, menu_item_id=menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    updated_menu_item = crud_menu.update_menu_item(db=db, menu_item_id=menu_item_id, menu_item_update=menu_item_in)
    return updated_menu_item

@router.delete("/{menu_item_id}", response_model=menu_schemas.MenuItem)
def delete_menu_item(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    menu_item_id: str,
    # current_user: models.User = Depends(deps.get_current_active_superuser) # If only superusers can delete
):
    """
    Delete a menu item.
    Potentially restricted to admin/superuser.
    """
    menu_item = crud_menu.get_menu_item(db, menu_item_id=menu_item_id)
    if not menu_item:
        raise HTTPException(status_code=404, detail="Menu item not found")
    deleted_menu_item = crud_menu.delete_menu_item(db=db, menu_item_id=menu_item_id)
    return deleted_menu_item
