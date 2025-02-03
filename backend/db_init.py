from typing import Optional, List
from sqlalchemy import Date, DateTime, String, Integer, Float, ForeignKey, UniqueConstraint, create_engine, inspect, text
from sqlalchemy.orm import Mapped, mapped_column, sessionmaker, relationship, declarative_base
from datetime import date, datetime

# Database setup
DATABASE_URL = "sqlite:///./db.sqlite"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ------------------ MODELS ------------------

class User(Base):
    __tablename__ = "users"

    phone: Mapped[str] = mapped_column(String, primary_key=True, index=True)  # Primary Key
    name: Mapped[str] = mapped_column(String, nullable=False)
    age: Mapped[int] = mapped_column(Integer, nullable=False)
    gender: Mapped[str]= mapped_column(String, nullable=False)
    valid_till: Mapped[date] = mapped_column(Date, nullable=False)
    batch_name: Mapped[str] = mapped_column(ForeignKey("batches.batch_name", onupdate="CASCADE"), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=text("CURRENT_TIMESTAMP")
    )

    enrollments: Mapped[List["Enrollment"]] = relationship(back_populates="user")

class Batch(Base):
    __tablename__ = "batches"

    batch_name: Mapped[str] = mapped_column(String, primary_key=True, index=True)  # Primary Key
    timing: Mapped[str] = mapped_column(String, nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime, server_default=text("CURRENT_TIMESTAMP")
    )
    enrollments: Mapped[List["Enrollment"]] = relationship(back_populates="batch")

class Enrollment(Base):
    __tablename__ = "enrollments"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    phone: Mapped[str] = mapped_column(ForeignKey("users.phone"), nullable=False)  # Reference Phone
    batch_name: Mapped[str] = mapped_column(ForeignKey("batches.batch_name"), nullable=False)  # Reference Batch
    payment_status: Mapped[str] = mapped_column(String) # Success, Pending, Failed
    payment_date: Mapped[Optional[datetime]] = mapped_column(
        DateTime, server_default=text("CURRENT_TIMESTAMP")
    )
    amount: Mapped[float] = mapped_column(Float, nullable=False)

    user: Mapped["User"] = relationship(back_populates="enrollments")
    batch: Mapped["Batch"] = relationship(back_populates="enrollments")

    __table_args__ = (UniqueConstraint("phone", "batch_name", name="unique_user_batch"),)

# ------------------ DATABASE INITIALIZATION ------------------

def init_db():
    """Creates database tables if they don’t exist."""
    inspector = inspect(engine)
    tables = inspector.get_table_names()
    if not tables:
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
    else:
        print("⚠️ Tables already exist. Skipping creation.")

if __name__ == "__main__":
    init_db()
