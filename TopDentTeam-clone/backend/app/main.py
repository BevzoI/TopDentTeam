from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import users, excuses, posts, gallery

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Naše MŠ clone")

origins = [
    "http://localhost:3000",  # admin
    "http://localhost:19006", # expo web
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(excuses.router)
app.include_router(posts.router)
app.include_router(gallery.router)
