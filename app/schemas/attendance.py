from datetime import date

from pydantic import BaseModel

from app.models.attendance import AttendanceStatus


class AttendanceMark(BaseModel):
    employee_id: int
    date: date
    status: AttendanceStatus


class AttendanceOut(BaseModel):
    id: int
    employee_id: int
    date: date
    status: AttendanceStatus
    marked_by: int

    class Config:
        from_attributes = True


class AttendanceFlag(BaseModel):
    employee_id: int
    consecutive_absences: int
    absences_last_7_days: int
    flag: str
