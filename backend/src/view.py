from fastapi import APIRouter
from db_init import get_db
from src.controller import update_status, current_status
from src.model import FormData
from sqlalchemy.orm import Session
from fastapi import Depends

router = APIRouter(prefix="/form")

@router.get("/query")
def query(phone: str,db: Session = Depends(get_db)):
    return current_status(phone,db)

@router.post("/update")
def update(data:FormData, db: Session = Depends(get_db)):
    return update_status(data,db)
