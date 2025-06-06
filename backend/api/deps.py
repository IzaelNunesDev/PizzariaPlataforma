# backend/api/deps.py
from typing import Generator, Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt, JWTError
from pydantic import ValidationError
from sqlalchemy.orm import Session

from core import security
from core.config import settings
from database import models, database
from schemas import token as token_schemas
from crud import crud_user

reusable_oauth2 = OAuth2PasswordBearer(
    tokenUrl=f"/api/v1/auth/token" #  Path to the token generation endpoint
)

def get_db() -> Generator[Session, None, None]:
    try:
        db = database.SessionLocal()
        yield db
    finally:
        db.close()

def get_current_user(
    db: Session = Depends(get_db),
    token: str = Depends(reusable_oauth2)
) -> models.User:
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[security.ALGORITHM]
        )
        token_data = token_schemas.TokenData(**payload)
    except (JWTError, ValidationError) as e:
        # Log the error e for debugging
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )
    if token_data.email is None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials (email missing in token)",
        )
    user = crud_user.get_user_by_email(db, email=token_data.email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

def get_current_active_user(
    current_user: models.User = Depends(get_current_user)
) -> models.User:
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user

# Dependency for superuser (if you implement roles)
# def get_current_active_superuser(
#     current_user: models.User = Depends(get_current_active_user),
# ) -> models.User:
#     if not crud_user.is_superuser(current_user): # Requires is_superuser method in crud_user
#         raise HTTPException(
#             status_code=400, detail="The user doesn't have enough privileges"
#         )
#     return current_user
