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
    tipus: Tag | None
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
        except ValueError:
            return None
        return dt.strftime("%d %b")  # "21 Dec"

    @field_validator("reminder", mode="after")
    @classmethod
    def validate_reminder(cls, value: str) -> str | None:
        if value in (None, "", "None"):
            return None

        datestr, timestr = value.split(",")

        # str a datetime
        datedt = datetime.fromisoformat(datestr)
        timedt = datetime.strptime(timestr, "%H:%M:%S")  # noqa: DTZ007
        # datetime a str
        date = datedt.strftime("%d %b")
        time = timedt.strftime("%I:%M %p")
        return f"{date}, {time}"  # 21 Dec, 10:30 AM"


class Nota(BaseModel):
    titol: str
    contingut: str
    link: str | None
    has_tasks: bool
    num_links: int
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
