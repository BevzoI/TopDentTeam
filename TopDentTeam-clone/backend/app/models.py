from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey, Enum, Date
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base


class UserRole(str, enum.Enum):
    parent = "parent"
    admin = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False, default=UserRole.parent)

    excuses = relationship("Excuse", back_populates="parent")


class ExcuseStatus(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"


class Excuse(Base):
    __tablename__ = "excuses"

    id = Column(Integer, primary_key=True, index=True)
    child_name = Column(String(255), nullable=False)
    date_from = Column(Date, nullable=False)
    date_to = Column(Date, nullable=False)
    reason = Column(Text, nullable=False)
    status = Column(Enum(ExcuseStatus), default=ExcuseStatus.pending)

    parent_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    parent = relationship("User", back_populates="excuses")


class Post(Base):
    __tablename__ = "posts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class GalleryItem(Base):
    __tablename__ = "gallery_items"

    id = Column(Integer, primary_key=True, index=True)
    image_url = Column(String(500), nullable=False)
    description = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
