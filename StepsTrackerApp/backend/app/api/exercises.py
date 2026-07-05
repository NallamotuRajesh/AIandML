from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.models.models import User, Exercise
from app.models.schemas import ExerciseCreate, ExerciseResponse, ExerciseUpdate
from app.api.auth import get_current_user

router = APIRouter()

@router.post("/", response_model=ExerciseResponse, status_code=status.HTTP_201_CREATED)
async def create_exercise(
    exercise: ExerciseCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_exercise = Exercise(
        user_id=current_user.id,
        exercise_type=exercise.exercise_type,
        duration_minutes=exercise.duration_minutes,
        intensity=exercise.intensity,
        calories=exercise.calories,
        notes=exercise.notes,
        started_at=exercise.started_at,
        ended_at=exercise.ended_at
    )
    
    db.add(db_exercise)
    db.commit()
    db.refresh(db_exercise)
    
    return db_exercise

@router.get("/", response_model=List[ExerciseResponse])
async def get_exercises(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exercises = db.query(Exercise).filter(
        Exercise.user_id == current_user.id
    ).order_by(Exercise.started_at.desc()).offset(skip).limit(limit).all()
    
    return exercises

@router.get("/{exercise_id}", response_model=ExerciseResponse)
async def get_exercise(
    exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()
    
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    return exercise

@router.put("/{exercise_id}", response_model=ExerciseResponse)
async def update_exercise(
    exercise_id: int,
    exercise_update: ExerciseUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()
    
    if not db_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    update_data = exercise_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_exercise, field, value)
    
    db.commit()
    db.refresh(db_exercise)
    
    return db_exercise

@router.delete("/{exercise_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_exercise(
    exercise_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    db_exercise = db.query(Exercise).filter(
        Exercise.id == exercise_id,
        Exercise.user_id == current_user.id
    ).first()
    
    if not db_exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    
    db.delete(db_exercise)
    db.commit()
    
    return None
