from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from .. import models, schemas
from ..auth import get_db, get_current_user, require_admin

router = APIRouter(prefix="/excuses", tags=["excuses"])


@router.post("/", response_model=schemas.ExcuseOut)
def create_excuse(
    excuse_in: schemas.ExcuseCreate,
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    excuse = models.Excuse(
        **excuse_in.model_dump(),
        parent_id=user.id,
    )
    db.add(excuse)
    db.commit()
    db.refresh(excuse)
    return excuse


@router.get("/my", response_model=List[schemas.ExcuseOut])
def list_my_excuses(
    db: Session = Depends(get_db),
    user: models.User = Depends(get_current_user),
):
    return (
        db.query(models.Excuse)
        .filter(models.Excuse.parent_id == user.id)
        .order_by(models.Excuse.date_from.desc())
        .all()
    )


@router.get("/", response_model=List[schemas.ExcuseOut])
def list_all_excuses(
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    return db.query(models.Excuse).order_by(models.Excuse.date_from.desc()).all()


@router.patch("/{excuse_id}/status", response_model=schemas.ExcuseOut)
def update_status(
    excuse_id: int,
    status: schemas.ExcuseStatusEnum,
    db: Session = Depends(get_db),
    admin: models.User = Depends(require_admin),
):
    excuse = db.query(models.Excuse).get(excuse_id)
    if not excuse:
        raise HTTPException(status_code=404, detail="Not found")
    excuse.status = status
    db.commit()
    db.refresh(excuse)
    return excuse
