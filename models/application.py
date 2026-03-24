from sqlalchemy import Column, Integer, String, Date, DateTime, Text
from sqlalchemy.sql import func
from db.base import Base


class InternshipApplication(Base):
    __tablename__ = "internship_applications"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(150), nullable=False)
    father_name = Column(String(150), nullable=False)
    date_of_birth = Column(Date, nullable=False)
    gender = Column(String(20), nullable=False)
    category = Column(String(20), nullable=False)
    email = Column(String(150), nullable=False)
    phone = Column(String(15), nullable=False)
    address = Column(Text, nullable=False)
    qualification = Column(String(100), nullable=False)
    institution = Column(String(200), nullable=False)
    specialization = Column(String(100), nullable=False)
    cgpa = Column(String(10), nullable=False)
    department = Column(String(100), nullable=False)
    duration_weeks = Column(Integer, nullable=False)
    mode = Column(String(20), nullable=False)
    available_from = Column(Date, nullable=False)
    submitted_at = Column(DateTime, server_default=func.now(), nullable=False)
