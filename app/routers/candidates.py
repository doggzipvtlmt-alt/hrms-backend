from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_roles
from app.models.candidate import Candidate, CandidateStatus
from app.models.user import Role, User
from app.schemas.candidate import (
    CandidateCreate,
    CandidateOut,
    CandidateStatusUpdate,
    CandidateUpdate,
)

router = APIRouter(prefix="/candidates", tags=["candidates"])

ALLOWED_TRANSITIONS: dict[CandidateStatus, set[CandidateStatus]] = {
    CandidateStatus.NEW: {CandidateStatus.INTERVIEW_SCHEDULED, CandidateStatus.REJECTED, CandidateStatus.HOLD},
    CandidateStatus.INTERVIEW_SCHEDULED: {CandidateStatus.CONFIRMED, CandidateStatus.REJECTED, CandidateStatus.HOLD},
    CandidateStatus.CONFIRMED: {CandidateStatus.INTERVIEW_DONE, CandidateStatus.REJECTED, CandidateStatus.HOLD},
    CandidateStatus.INTERVIEW_DONE: {
        CandidateStatus.SELECTED,
        CandidateStatus.REJECTED,
        CandidateStatus.HOLD,
    },
    CandidateStatus.SELECTED: {CandidateStatus.DOCUMENT_PENDING},
    CandidateStatus.DOCUMENT_PENDING: {CandidateStatus.DOCUMENT_COMPLETED, CandidateStatus.DROPPED},
    CandidateStatus.DOCUMENT_COMPLETED: {CandidateStatus.JOINED, CandidateStatus.DROPPED},
    CandidateStatus.HOLD: {CandidateStatus.INTERVIEW_SCHEDULED, CandidateStatus.REJECTED},
    CandidateStatus.REJECTED: set(),
    CandidateStatus.JOINED: set(),
    CandidateStatus.DROPPED: set(),
}


@router.post("/", response_model=CandidateOut, status_code=status.HTTP_201_CREATED)
def create_candidate(
    candidate_in: CandidateCreate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.ADMIN, Role.HR, Role.RECRUITER)),
):
    if db.query(Candidate).filter(Candidate.email == candidate_in.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Candidate already exists")
    candidate = Candidate(**candidate_in.model_dump())
    db.add(candidate)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.get("/", response_model=list[CandidateOut])
def list_candidates(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.ADMIN, Role.HR, Role.RECRUITER, Role.INTERVIEWER)),
    status_filter: CandidateStatus | None = Query(None, alias="status"),
    limit: int = Query(50, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    query = db.query(Candidate)
    if status_filter:
        query = query.filter(Candidate.status == status_filter)
    return query.offset(offset).limit(limit).all()


@router.get("/{candidate_id}", response_model=CandidateOut)
def get_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.ADMIN, Role.HR, Role.RECRUITER, Role.INTERVIEWER)),
):
    candidate = db.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    return candidate


@router.put("/{candidate_id}", response_model=CandidateOut)
def update_candidate(
    candidate_id: int,
    candidate_in: CandidateUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.ADMIN, Role.HR, Role.RECRUITER)),
):
    candidate = db.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    for field, value in candidate_in.model_dump(exclude_unset=True).items():
        setattr(candidate, field, value)
    db.commit()
    db.refresh(candidate)
    return candidate


@router.post("/{candidate_id}/status", response_model=CandidateOut)
def update_candidate_status(
    candidate_id: int,
    status_in: CandidateStatusUpdate,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.ADMIN, Role.HR, Role.RECRUITER)),
):
    candidate = db.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    allowed = ALLOWED_TRANSITIONS.get(candidate.status, set())
    if status_in.status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid status transition from {candidate.status} to {status_in.status}",
        )
    candidate.status = status_in.status
    db.commit()
    db.refresh(candidate)
    return candidate


@router.delete("/{candidate_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_candidate(
    candidate_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.ADMIN, Role.HR)),
):
    candidate = db.get(Candidate, candidate_id)
    if not candidate:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Candidate not found")
    db.delete(candidate)
    db.commit()
    return None
