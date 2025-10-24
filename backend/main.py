# uvicorn main:app --reload  # noqa: INP001

from data import nota_list
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models import Nota

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


# cuando se hace click en la nota en el froont se guarda el atributo data-id y eso se envia a note_id, añadir algun error si no se envuentra  # noqa: E501
@app.get("/notes/{note_id}")
async def get_note(note_id: int) -> Nota | None:
    for nota in nota_list:
        if nota.id == note_id:
            return nota
    return None
