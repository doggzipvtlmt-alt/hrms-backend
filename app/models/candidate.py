import enum

from sqlalchemy import Column, DateTime, Enum, Integer, String, func

from app.db.base import Base


class CandidateStatus(str, enum.Enum):
    NEW = "NEW"
    INTERVIEW_SCHEDULED = "INTERVIEW_SCHEDULED"
    CONFIRMED = "CONFIRMED"
    INTERVIEW_DONE = "INTERVIEW_DONE"
    SELECTED = "SELECTED"
    REJECTED = "REJECTED"
    HOLD = "HOLD"
    DOCUMENT_PENDING = "DOCUMENT_PENDING"
    DOCUMENT_COMPLETED = "DOCUMENT_COMPLETED"
    JOINED = "JOINED"
    DROPPED = "DROPPED"


class Candidate(Base):
    __tablename__ = "candidates"

    id = Column(Integer, primary_key=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    position = Column(String, nullable=False)
    status = Column(Enum(CandidateStatus), nullable=False, default=CandidateStatus.NEW)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
