# uvicorn main:app --reload  # noqa: INP001

from typing import Annotated

from data import note_dict
from fastapi import Body, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Nota, Task

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/notes")
async def get_notes() -> dict[int, Nota]:
    return note_dict


@app.get("/notes/{note_id}")
async def get_note(note_id: int) -> Nota | None:
    return note_dict.get(note_id)


@app.patch("/notes/{note_id}/tasks/{task_id}")
async def update_task(
    note_id: int, task_id: int, is_done: Annotated[bool, Body(embed=True)]
) -> Task | None:
    nota = note_dict.get(note_id)
    if nota and task_id in nota.tasks:
        nota.tasks[task_id].is_done = is_done
        return nota.tasks[task_id]
    return None
