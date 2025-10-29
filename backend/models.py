from datetime import datetime  # noqa: INP001
from enum import StrEnum

from pydantic import BaseModel, field_validator


class Tag(StrEnum):
    PERSONAL = "Personal"
    PROJECT = "Project"
    OTHER = "Other"


class Task(BaseModel):
    titol: str
    is_done: bool
    tipus: Tag
    deadline: str | None
    reminder: str | None
    is_selected: bool

    @field_validator("deadline", mode="after")
    @classmethod
    def validate_deadline(cls, value: str) -> str | None:
        if value in (None, "", "None"):
            return None
        try:
            dt = datetime.fromisoformat(value)
            return dt.strftime("%d %b")  # "21 Dec"
        except ValueError:
            msg = "Invalid deadline format. Must be ISO date string."
            raise ValueError(msg) from ValueError

    @field_validator("reminder", mode="after")
    def validate_reminder(cls, value: str) -> str | None:
        if value in (None, "", "None"):
            return None
        try:
            dt = datetime.fromisoformat(value)
            return dt.strftime("%d %b, %I:%M %p")  # "20 Dec, 9:00 AM"
        except ValueError:
            msg = "Invalid reminder format. Must be ISO date string."
            raise ValueError(msg) from ValueError


class Nota(BaseModel):
    titol: str
    contingut: str
    link: str | None
    has_tasks: bool
    num_links: int
    # cambiar a que sea con las tasques
    tags: Tag | None
    num_tags: int
    time: str
    notebook: str
    has_alarm: bool
    is_shared: bool
    tasks: dict[int, Task]
    tasks_id: list[int]
    last_edit: str
    images: list[str] | None
