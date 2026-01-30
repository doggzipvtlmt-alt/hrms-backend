from datetime import datetime

from pydantic import BaseModel, EmailStr

from app.models.candidate import CandidateStatus


class CandidateBase(BaseModel):
    full_name: str
    email: EmailStr
    position: str


class CandidateCreate(CandidateBase):
    pass


class CandidateUpdate(BaseModel):
    full_name: str | None = None
    position: str | None = None


class CandidateStatusUpdate(BaseModel):
    status: CandidateStatus


class CandidateOut(CandidateBase):
    id: int
    status: CandidateStatus
    created_at: datetime

    class Config:
        from_attributes = True
