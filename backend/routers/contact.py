from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models
import schemas
from database import get_db

router = APIRouter(prefix="/api/contact", tags=["Contact"])

@router.post("", response_model=schemas.ContactMessage)
def create_contact(message: schemas.ContactMessageCreate, db: Session = Depends(get_db)):
    db_msg = models.ContactMessage(**message.dict())
    db.add(db_msg)
    db.commit()
    db.refresh(db_msg)
    return db_msg
