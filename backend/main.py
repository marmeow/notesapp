# uvicorn main:app --reload  # noqa: INP001

from typing import Annotated

from data import nota_list
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
async def get_notes() -> list[Nota]:
    return nota_list


@app.get("/notes/{note_id}")
async def get_note(note_id: int) -> Nota | None:
    # nota = next({nota for nota in nota_list if nota.id == note_id}), None)

    for nota in nota_list:
        if nota.id == note_id:
            return nota
    return None


@app.patch("/notes/{note_id}/tasks/{task_id}")
async def update_task(
    note_id: int,
    task_id: int,
    is_done: Annotated[
        bool, Body(embed=True)
    ],  # https://fastapi.tiangolo.com/es/tutorial/body-multiple-params/#multiples-parametros-de-cuerpo-y-query
) -> Task | None:
    for nota in nota_list:
        if nota.id == note_id:
            for task in nota.tasks:
                if task.id == task_id:
                    task.is_done = is_done
                    return task
    return None
