from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import models
from database import engine
import os
from dotenv import load_dotenv

# Import routers
from routers import auth, articles, projects, quizzes, contact, admin

load_dotenv()

models.Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app):
    # Auto-seed DB khi app khởi động (chỉ insert nếu chưa có data)
    try:
        from seed import seed
        seed()
        print("[OK] Auto-seed completed")
    except Exception as e:
        print(f"[SKIP] Seed skipped: {e}")
    yield

app = FastAPI(title="ML Portfolio API", lifespan=lifespan)

@app.get("/")
def root():
    return {"message": "ML Portfolio API is running", "docs": "/docs", "status": "ok"}

# CORS setup securely
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", "*")
allowed_origins = [o.strip() for o in allowed_origins_str.split(",")] if allowed_origins_str else []

if "*" in allowed_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False, # Must be False if allow_origins is ["*"]
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=allowed_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

# Include Routers
app.include_router(auth.router)
app.include_router(articles.router)
app.include_router(projects.router)
app.include_router(quizzes.router)
app.include_router(contact.router)
app.include_router(admin.router)
