from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, steps, exercises, goals, ai

app = FastAPI(
    title="Steps Tracker API",
    description="AI-Powered Steps Tracker Backend",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
app.include_router(steps.router, prefix="/steps", tags=["Steps"])
app.include_router(exercises.router, prefix="/exercises", tags=["Exercises"])
app.include_router(goals.router, prefix="/goals", tags=["Goals"])
app.include_router(ai.router, prefix="/ai", tags=["AI Features"])

@app.get("/")
async def root():
    return {
        "message": "Steps Tracker API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
