from pydantic import BaseModel, EmailStr

from app.models.user import Role


class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    role: Role


class UserCreate(UserBase):
    password: str


class UserOut(UserBase):
    id: int

    class Config:
        from_attributes = True
