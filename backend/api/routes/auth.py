# backend/api/routes/auth.py
from datetime import timedelta

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from api import deps
from core import security
from core.config import settings
from crud import crud_user
from schemas import user as user_schemas
from schemas import token as token_schemas

router = APIRouter()

@router.post("/token", response_model=token_schemas.Token)
def login_for_access_token(
    db: Session = Depends(deps.get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
):
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    user = crud_user.get_user_by_email(db, email=form_data.username) # username is email
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.email, "email": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/register", response_model=user_schemas.User, status_code=status.HTTP_201_CREATED)
def register_new_user(
    *, # Ensures all subsequent arguments are keyword-only
    db: Session = Depends(deps.get_db),
    user_in: user_schemas.UserCreate,
):
    """
    Create new user.
    """
    user = crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(
            status_code=400,
            detail="The user with this email already exists in the system.",
        )
    user = crud_user.create_user(db=db, user=user_in)
    return user

@router.get("/users/me", response_model=user_schemas.User)
def read_users_me(
    current_user: user_schemas.User = Depends(deps.get_current_active_user),
):
    """
    Get current user.
    """
    return current_user

@router.put("/users/me/password", status_code=status.HTTP_200_OK)
def change_current_user_password(
    *,
    db: Session = Depends(deps.get_db),
    password_data: user_schemas.PasswordChange,
    current_user: user_schemas.User = Depends(deps.get_current_active_user), # This should be the DB model instance
):
    """
    Change current user's password.
    """
    # Verify old password
    # current_user from get_current_active_user is typically the SQLAlchemy model instance
    # which includes hashed_password. If it were just a Pydantic schema without hashed_password,
    # we would need to fetch the user from DB first.
    # Assuming current_user has hashed_password:
    if not security.verify_password(password_data.old_password, current_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect old password",
        )

    # Hash the new password
    hashed_new_password = security.get_password_hash(password_data.new_password)

    # Update user in the database
    # current_user is assumed to be the SQLAlchemy model instance
    current_user.hashed_password = hashed_new_password
    db.add(current_user)
    db.commit()
    # db.refresh(current_user) # Not strictly necessary unless there are DB-side changes to refresh

    return {"message": "Password updated successfully"}

# Example of a protected route requiring authentication
@router.get("/users/me/items") # This is just an example endpoint
async def read_own_items(
    current_user: user_schemas.User = Depends(deps.get_current_active_user)
):
    return [{"item_id": "Foo", "owner": current_user.email}]
