import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError

from app.core.config import settings
from app.core.logging import logger
from app.core.exceptions import validation_exception_handler, global_exception_handler
from app.database.init_db import init_db
from app.api.router import api_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info(f"Starting {settings.PROJECT_NAME} backend service...")
    init_db()
    logger.info("Application startup complete. AI models will load lazily on first match request.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="An AI-powered Lost & Found platform backend API featuring semantic text matching, visual feature similarity, and automatic match notifications.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# CORS Middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception Handlers
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, global_exception_handler)

# Include API Endpoints
app.include_router(api_router, prefix=settings.API_V1_STR)

# Ensure upload directories exist and mount static files route
os.makedirs(settings.UPLOAD_LOST_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_FOUND_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": "1.0.0",
        "documentation": "/docs"
    }
