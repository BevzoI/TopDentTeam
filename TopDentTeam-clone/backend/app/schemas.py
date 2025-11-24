from datetime import date, datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from enum import Enum


class RoleEnum(str, Enum):
    parent = "parent"
    admin = "admin"


class ExcuseStatusEnum(str, Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class UserBase(BaseModel):
    email: EmailStr
    full_name: str


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int
    role: RoleEnum

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenData(BaseModel):
    user_id: int
    role: RoleEnum


class ExcuseBase(BaseModel):
    child_name: str
    date_from: date
    date_to: date
    reason: str


class ExcuseCreate(ExcuseBase):
    pass


class ExcuseOut(ExcuseBase):
    id: int
    status: ExcuseStatusEnum

    class Config:
        from_attributes = True


class PostBase(BaseModel):
    title: str
    content: str


class PostCreate(PostBase):
    pass


class PostOut(PostBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


class GalleryItemBase(BaseModel):
    image_url: str
    description: Optional[str] = None


class GalleryItemCreate(GalleryItemBase):
    pass


class GalleryItemOut(GalleryItemBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
