from datetime import date
from pydantic import BaseModel

class FormData(BaseModel):
    phone: str
    name: str
    age: int
    gender: str
    batch_name: str


class Payments(BaseModel):
    phone: str
    batch_name: str
    payment_status: str
    amount: float