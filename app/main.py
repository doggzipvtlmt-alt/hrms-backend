from fastapi import FastAPI

from app.core.config import settings
from app.routers import attendance, auth, candidates, employees, users

app = FastAPI(title=settings.app_name)

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(candidates.router)
app.include_router(employees.router)
app.include_router(attendance.router)


@app.get("/")
def root():
    return {"message": "HRMS backend is running"}
