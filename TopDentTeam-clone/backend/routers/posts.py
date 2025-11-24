from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..auth import get_db, get_current_user, require_admin

router = APIRouter(prefix="/posts", tags=["posts"])


@router.get("/", response_model=List[schemas.PostOut])
def list_posts(db: Session = Depends(get_db)):
    return db.query(models.Post).order_by(models.Post.created_at.desc()).all()


@router.post("/", response_model=schemas.PostOut)
def create_post(
    post_in: schemas.PostCreate,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    post = models.Post(**post_in.model_dump())
    db.add(post)
    db.commit()
    db.refresh(post)
    return post


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    post = db.query(models.Post).get(post_id)
    if not post:
        raise HTTPException(status_code=404, detail="Not found")
    db.delete(post)
    db.commit()
    return {"detail": "deleted"}
