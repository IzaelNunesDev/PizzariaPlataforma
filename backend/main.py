# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import models, database
from api.routes import auth, menu, orders
from core.config import settings

# Create database tables if they don't exist
# This should ideally be handled by Alembic migrations in a production setup
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    openapi_url=f"/api/v1/openapi.json" # Standard OpenAPI doc location
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    # Convert comma-separated string to list if necessary
    origins = []
    if isinstance(settings.BACKEND_CORS_ORIGINS, str):
        origins = [origin.strip() for origin in settings.BACKEND_CORS_ORIGINS.split(",")]
    elif isinstance(settings.BACKEND_CORS_ORIGINS, list):
        origins = settings.BACKEND_CORS_ORIGINS
    
    if origins: # Ensure origins list is not empty
        app.add_middleware(
            CORSMiddleware,
            allow_origins=origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

# Include API routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(menu.router, prefix="/api/v1/menu", tags=["Menu"])
app.include_router(orders.router, prefix="/api/v1/orders", tags=["Orders"])

@app.get("/api/v1")
def read_root():
    return {"Project": settings.PROJECT_NAME, "Version": settings.PROJECT_VERSION, "Environment": settings.ENVIRONMENT}

# Optional: Add a health check endpoint
@app.get("/api/v1/health", tags=["Health"])
def health_check():
    return {"status": "ok"}

# To run the app (for development):
# uvicorn main:app --reload --host 0.0.0.0 --port 8000
