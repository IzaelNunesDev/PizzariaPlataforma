# backend/api/routes/orders.py
from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from api import deps
from crud import crud_order
from schemas import order as order_schemas
from database import models # Required for current_user type hint

router = APIRouter()

@router.post("/", response_model=order_schemas.Order, status_code=status.HTTP_201_CREATED)
def create_new_order(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    order_in: order_schemas.OrderCreate,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Create a new order for the current authenticated user.
    """
    try:
        order = crud_order.create_order(db=db, order=order_in, user_id=current_user.id)
    except ValueError as e:
        # This catches the ValueError from crud_order if a menu item is not found
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return order

@router.get("/me", response_model=List[order_schemas.Order])
def read_my_orders(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100
):
    """
    Retrieve orders for the current authenticated user.
    """
    orders = crud_order.get_orders_by_user(db, user_id=current_user.id, skip=skip, limit=limit)
    return orders

@router.get("/{order_id}", response_model=order_schemas.Order)
def read_order(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    order_id: int,
    current_user: models.User = Depends(deps.get_current_active_user)
):
    """
    Get a specific order by ID. 
    Ensures the order belongs to the current user or the user is an admin (not implemented yet).
    """
    order = crud_order.get_order(db, order_id=order_id)
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")
    # Add authorization check: order must belong to current_user or current_user is admin
    # For now, only allow user to see their own orders
    if order.user_id != current_user.id:
        # You might want a more generic "Not authorized" or a specific "Order not found" to avoid leaking info
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized to access this order")
    return order

# Admin route to get all orders (example, needs superuser protection)
@router.get("/all", response_model=List[order_schemas.Order]) # Consider a different path prefix for admin routes
def read_all_orders(
    db: Session = Depends(deps.get_db),
    skip: int = 0,
    limit: int = 100,
    # current_user: models.User = Depends(deps.get_current_active_superuser) # Protect this route
):
    """
    Retrieve all orders (admin/superuser access).
    THIS ROUTE SHOULD BE PROTECTED TO ONLY ALLOW ADMINS/SUPERUSERS.
    """
    # This is a placeholder for admin functionality. 
    # Ensure proper authorization (e.g., using get_current_active_superuser) before enabling.
    # For now, it's commented out in main.py or should raise a 501 Not Implemented.
    # raise HTTPException(status_code=status.HTTP_501_NOT_IMPLEMENTED, detail="Admin access only")
    orders = crud_order.get_orders(db, skip=skip, limit=limit)
    return orders
