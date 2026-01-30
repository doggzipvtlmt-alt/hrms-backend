"""initial

Revision ID: 0001
Revises: 
Create Date: 2024-09-19 00:00:00.000000
"""

from alembic import op
import sqlalchemy as sa

revision = "0001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.create_table(
        "candidates",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("position", sa.String(), nullable=False),
        sa.Column("status", sa.Enum(
            "NEW",
            "INTERVIEW_SCHEDULED",
            "CONFIRMED",
            "INTERVIEW_DONE",
            "SELECTED",
            "REJECTED",
            "HOLD",
            "DOCUMENT_PENDING",
            "DOCUMENT_COMPLETED",
            "JOINED",
            "DROPPED",
            name="candidatestatus",
        ), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_candidates_email", "candidates", ["email"], unique=True)

    op.create_table(
        "employees",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("position", sa.String(), nullable=False),
        sa.Column("joined_on", sa.Date(), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.text("CURRENT_TIMESTAMP"), nullable=False),
    )
    op.create_index("ix_employees_email", "employees", ["email"], unique=True)

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("email", sa.String(), nullable=False),
        sa.Column("full_name", sa.String(), nullable=False),
        sa.Column("hashed_password", sa.String(), nullable=False),
        sa.Column("role", sa.Enum("ADMIN", "HR", "RECRUITER", "INTERVIEWER", name="role"), nullable=False),
    )
    op.create_index("ix_users_email", "users", ["email"], unique=True)

    op.create_table(
        "attendance",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("employee_id", sa.Integer(), nullable=False),
        sa.Column("date", sa.Date(), nullable=False),
        sa.Column("status", sa.Enum("PRESENT", "ABSENT", "HALF_DAY", "WEEK_OFF", name="attendancestatus"), nullable=False),
        sa.Column("marked_by", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(["employee_id"], ["employees.id"]),
        sa.ForeignKeyConstraint(["marked_by"], ["users.id"]),
        sa.UniqueConstraint("employee_id", "date", name="uniq_employee_date"),
    )


def downgrade() -> None:
    op.drop_table("attendance")
    op.drop_index("ix_users_email", table_name="users")
    op.drop_table("users")
    op.drop_index("ix_employees_email", table_name="employees")
    op.drop_table("employees")
    op.drop_index("ix_candidates_email", table_name="candidates")
    op.drop_table("candidates")
    op.execute("DROP TYPE IF EXISTS attendancestatus")
    op.execute("DROP TYPE IF EXISTS role")
    op.execute("DROP TYPE IF EXISTS candidatestatus")
