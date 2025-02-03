from fastapi import FastAPI
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from src.view import router as form_router
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(form_router)

@app.get("/")
def read_root():
    return {"Hello": "World"}