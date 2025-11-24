from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..auth import get_db, require_admin

router = APIRouter(prefix="/gallery", tags=["gallery"])


@router.get("/", response_model=List[schemas.GalleryItemOut])
def list_gallery(db: Session = Depends(get_db)):
    return db.query(models.GalleryItem).order_by(models.GalleryItem.created_at.desc()).all()


@router.post("/", response_model=schemas.GalleryItemOut)
def create_gallery_item(
    item_in: schemas.GalleryItemCreate,
    db: Session = Depends(get_db),
    admin=Depends(require_admin),
):
    item = models.GalleryItem(**item_in.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item
