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
