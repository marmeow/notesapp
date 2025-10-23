# uvicorn main:app --reload

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from models import Nota
from data import nota_list



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


