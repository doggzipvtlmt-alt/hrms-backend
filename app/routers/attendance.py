from datetime import date, timedelta

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.core.dependencies import get_db, require_roles
from app.models.attendance import Attendance, AttendanceStatus
from app.models.employee import Employee
from app.models.user import Role, User
from app.schemas.attendance import AttendanceFlag, AttendanceMark, AttendanceOut

router = APIRouter(prefix="/attendance", tags=["attendance"])


@router.post("/mark", response_model=AttendanceOut, status_code=status.HTTP_201_CREATED)
def mark_attendance(
    attendance_in: AttendanceMark,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.HR)),
):
    if not db.get(Employee, attendance_in.employee_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Employee not found")
    existing = (
        db.query(Attendance)
        .filter(
            Attendance.employee_id == attendance_in.employee_id,
            Attendance.date == attendance_in.date,
        )
        .first()
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Attendance already marked")
    attendance = Attendance(
        employee_id=attendance_in.employee_id,
        date=attendance_in.date,
        status=attendance_in.status,
        marked_by=current_user.id,
    )
    db.add(attendance)
    db.commit()
    db.refresh(attendance)
    return attendance


@router.get("/{employee_id}", response_model=list[AttendanceOut])
def get_attendance_for_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.HR)),
):
    return db.query(Attendance).filter(Attendance.employee_id == employee_id).all()


@router.get("/", response_model=list[AttendanceOut])
def get_attendance_by_date(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.HR)),
    day: date | None = Query(None, alias="date"),
):
    query = db.query(Attendance)
    if day:
        query = query.filter(Attendance.date == day)
    return query.all()


@router.get("/flags", response_model=list[AttendanceFlag])
def attendance_flags(
    db: Session = Depends(get_db),
    _: User = Depends(require_roles(Role.HR)),
):
    flags: list[AttendanceFlag] = []
    employees = db.query(Employee).all()
    today = date.today()
    for employee in employees:
        absences = (
            db.query(Attendance)
            .filter(
                Attendance.employee_id == employee.id,
                Attendance.status == AttendanceStatus.ABSENT,
            )
            .all()
        )
        absences_last_7 = [a for a in absences if a.date >= today - timedelta(days=6)]
        consecutive = 0
        for offset in range(0, 7):
            day = today - timedelta(days=offset)
            entry = (
                db.query(Attendance)
                .filter(
                    Attendance.employee_id == employee.id,
                    Attendance.date == day,
                )
                .first()
            )
            if entry and entry.status == AttendanceStatus.ABSENT:
                consecutive += 1
            elif entry:
                break
        flag = None
        if consecutive >= 2:
            flag = "🟡 2 consecutive absences"
        if len(absences_last_7) >= 3:
            flag = "🔴 3+ absences in 7 days"
        if flag:
            flags.append(
                AttendanceFlag(
                    employee_id=employee.id,
                    consecutive_absences=consecutive,
                    absences_last_7_days=len(absences_last_7),
                    flag=flag,
                )
            )
    return flags
