from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Optional, Dict, List

# User schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    settings: Optional[Dict] = {}
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Steps schemas
class StepsBase(BaseModel):
    date: date
    step_count: int
    distance: Optional[float] = 0.0
    calories: Optional[float] = 0.0

class StepsCreate(StepsBase):
    pass

class StepsResponse(StepsBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class StepsStats(BaseModel):
    total_steps: int
    total_distance: float
    total_calories: float
    average_daily_steps: float
    days_tracked: int

# Exercise schemas
class ExerciseBase(BaseModel):
    exercise_type: str
    duration_minutes: int
    intensity: Optional[str] = "moderate"
    calories: Optional[float] = 0.0
    notes: Optional[str] = None
    started_at: datetime
    ended_at: Optional[datetime] = None

class ExerciseCreate(ExerciseBase):
    pass

class ExerciseUpdate(BaseModel):
    exercise_type: Optional[str] = None
    duration_minutes: Optional[int] = None
    intensity: Optional[str] = None
    calories: Optional[float] = None
    notes: Optional[str] = None
    ended_at: Optional[datetime] = None

class ExerciseResponse(ExerciseBase):
    id: int
    user_id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Goal schemas
class GoalBase(BaseModel):
    goal_type: str
    target_value: float
    start_date: date
    end_date: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class GoalUpdate(BaseModel):
    target_value: Optional[float] = None
    current_value: Optional[float] = None
    end_date: Optional[date] = None
    completed: Optional[bool] = None

class GoalResponse(GoalBase):
    id: int
    user_id: int
    current_value: float
    completed: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

# Activity Data schemas
class ActivityDataCreate(BaseModel):
    accelerometer_data: Dict
    activity_label: Optional[str] = None

class ActivityDataResponse(BaseModel):
    id: int
    user_id: int
    accelerometer_data: Dict
    activity_label: Optional[str]
    timestamp: datetime
    
    class Config:
        from_attributes = True

# AI schemas
class ActivityRecognitionResponse(BaseModel):
    activity: str
    confidence: float
    timestamp: datetime

class RecommendationResponse(BaseModel):
    recommendations: List[Dict[str, str]]
    reason: str

class PredictionResponse(BaseModel):
    predicted_weekly_steps: int
    goal_achievement_probability: float
    optimal_workout_time: str

class InsightResponse(BaseModel):
    insights: List[str]
    anomalies_detected: bool
    suggestions: List[str]
