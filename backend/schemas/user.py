# backend/schemas/user.py
from pydantic import BaseModel, EmailStr
from typing import Optional

# Shared properties
class UserBase(BaseModel):
    email: EmailStr

# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str

# Properties to receive via API on update (e.g., password change)
class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None

# Properties stored in DB (hashed_password should not be sent out)
class UserInDBBase(UserBase):
    id: int
    is_active: bool

    class Config:
        from_attributes = True

# Additional properties to return to client (excluding password)
class User(UserInDBBase):
    pass

# Additional properties stored in DB
class UserInDB(UserInDBBase):
    hashed_password: str
