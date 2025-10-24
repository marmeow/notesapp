from enum import StrEnum  # noqa: INP001

from pydantic import BaseModel


class Tag(StrEnum):
    PERSONAL = "Personal"
    PROJECT = "Project"
    OTHER = "Other"


"""
class Contingut(StrEnum):
    text:str
    link:str
"""


class Task(BaseModel):
    id: int
    titol: str
    is_done: bool
    tipus: Tag
    deadline: str | None
    reminder: str | None
    is_selected: bool


class Nota(BaseModel):
    id: int
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
    is_active: bool
    tasks: list[Task]
    tasks_id: list[int]
    last_edit: str
    images: list[str] | None
