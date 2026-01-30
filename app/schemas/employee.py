from datetime import date, datetime

from pydantic import BaseModel, EmailStr


class EmployeeBase(BaseModel):
    full_name: str
    email: EmailStr
    position: str
    joined_on: date | None = None


class EmployeeCreate(EmployeeBase):
    pass


class EmployeeUpdate(BaseModel):
    full_name: str | None = None
    position: str | None = None
    joined_on: date | None = None


class EmployeeOut(EmployeeBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
