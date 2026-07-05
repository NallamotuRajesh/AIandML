from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import date, timedelta
from typing import List
from app.core.database import get_db
from app.models.models import User, Steps
from app.models.schemas import StepsCreate, StepsResponse, StepsStats
from app.api.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=StepsResponse, status_code=status.HTTP_201_CREATED)
async def create_steps(
    steps: StepsCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    existing_steps = db.query(Steps).filter(
        Steps.user_id == current_user.id,
        Steps.date == steps.date
    ).first()
    
    if existing_steps:
        existing_steps.step_count = steps.step_count
        existing_steps.distance = steps.distance
        existing_steps.calories = steps.calories
        db.commit()
        db.refresh(existing_steps)
        return existing_steps
    
    db_steps = Steps(
        user_id=current_user.id,
        date=steps.date,
        step_count=steps.step_count,
        distance=steps.distance,
        calories=steps.calories
    )
    
    db.add(db_steps)
    db.commit()
    db.refresh(db_steps)
    
    return db_steps

@router.get("/", response_model=List[StepsResponse])
async def get_steps_history(
    skip: int = 0,
    limit: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    steps = db.query(Steps).filter(
        Steps.user_id == current_user.id
    ).order_by(Steps.date.desc()).offset(skip).limit(limit).all()
    
    return steps

@router.get("/today", response_model=StepsResponse)
async def get_today_steps(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    today = date.today()
    steps = db.query(Steps).filter(
        Steps.user_id == current_user.id,
        Steps.date == today
    ).first()
    
    if not steps:
        steps = Steps(
            user_id=current_user.id,
            date=today,
            step_count=0,
            distance=0.0,
            calories=0.0
        )
        db.add(steps)
        db.commit()
        db.refresh(steps)
    
    return steps

@router.get("/stats", response_model=StepsStats)
async def get_steps_stats(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    start_date = date.today() - timedelta(days=days)
    
    stats = db.query(
        func.sum(Steps.step_count).label("total_steps"),
        func.sum(Steps.distance).label("total_distance"),
        func.sum(Steps.calories).label("total_calories"),
        func.count(Steps.id).label("days_tracked")
    ).filter(
        Steps.user_id == current_user.id,
        Steps.date >= start_date
    ).first()
    
    total_steps = stats.total_steps or 0
    total_distance = stats.total_distance or 0.0
    total_calories = stats.total_calories or 0.0
    days_tracked = stats.days_tracked or 0
    
    average_daily_steps = total_steps / days_tracked if days_tracked > 0 else 0
    
    return StepsStats(
        total_steps=total_steps,
        total_distance=total_distance,
        total_calories=total_calories,
        average_daily_steps=average_daily_steps,
        days_tracked=days_tracked
    )
