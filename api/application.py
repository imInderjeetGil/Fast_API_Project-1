from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.session import SessionLocal
from models.application import InternshipApplication
from schemas.application import ApplicationCreate, ApplicationResponse

router = APIRouter(prefix="/applications", tags=["Internship Applications"])


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@router.post("/apply", response_model=ApplicationResponse, status_code=status.HTTP_201_CREATED)
def submit_application(data: ApplicationCreate, db: Session = Depends(get_db)):
    application = InternshipApplication(**data.model_dump())
    db.add(application)
    db.commit()
    db.refresh(application)
    return application


@router.get("/", response_model=list[ApplicationResponse])
def list_applications(db: Session = Depends(get_db)):
    return db.query(InternshipApplication).order_by(InternshipApplication.submitted_at.desc()).all()
