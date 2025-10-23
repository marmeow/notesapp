
from typing import Optional
from pydantic import BaseModel
from enum import StrEnum
from uuid import uuid4



class Tag(StrEnum):
    PERSONAL = "Personal"
    PROJECT = "Project"
    OTHER = "Other"

class Task(BaseModel):
    titol: str
    isDone: bool
    tipus: Tag
    deadline: str
    reminder: str
    isSelected: bool

class Nota(BaseModel):
    titol: str
    preview: str
    hasTasks: bool
    numLinks: int
    tags: Optional[Tag] 
    numTags: int
    time: str
    notebook: str 
    hasAlarm: bool 
    isShared: bool 
    imgPreview: Optional[str]
    isActive:bool
    tasks: list[Task]