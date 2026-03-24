from pydantic import BaseModel, EmailStr, Field
from datetime import date, datetime


class ApplicationCreate(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=150)
    father_name: str = Field(..., min_length=2, max_length=150)
    date_of_birth: date
    gender: str = Field(..., pattern="^(Male|Female|Other)$")
    category: str = Field(..., pattern="^(General|SC|ST|OBC|PH)$")
    email: EmailStr
    phone: str = Field(..., min_length=10, max_length=15, pattern=r"^\d{10,15}$")
    address: str = Field(..., min_length=10)
    qualification: str = Field(..., min_length=2, max_length=100)
    institution: str = Field(..., min_length=2, max_length=200)
    specialization: str = Field(..., min_length=2, max_length=100)
    cgpa: str = Field(..., min_length=1, max_length=10)
    department: str = Field(..., min_length=2, max_length=100)
    duration_weeks: int = Field(..., ge=4, le=52)
    mode: str = Field(..., pattern="^(Online|Offline|Hybrid)$")
    available_from: date


class ApplicationResponse(BaseModel):
    id: int
    full_name: str
    email: str
    department: str
    submitted_at: datetime

    class Config:
        from_attributes = True
