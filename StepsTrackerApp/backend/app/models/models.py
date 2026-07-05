from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Boolean, JSON, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    settings = Column(JSON, default={})
    
    steps = relationship("Steps", back_populates="user", cascade="all, delete-orphan")
    exercises = relationship("Exercise", back_populates="user", cascade="all, delete-orphan")
    goals = relationship("Goal", back_populates="user", cascade="all, delete-orphan")
    activity_data = relationship("ActivityData", back_populates="user", cascade="all, delete-orphan")

class Steps(Base):
    __tablename__ = "steps"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    date = Column(Date, nullable=False, index=True)
    step_count = Column(Integer, default=0)
    distance = Column(Float, default=0.0)  # in kilometers
    calories = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="steps")

class Exercise(Base):
    __tablename__ = "exercises"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    exercise_type = Column(String, nullable=False)  # Running, Walking, Cycling, Gym, Yoga, Swimming
    duration_minutes = Column(Integer, nullable=False)
    intensity = Column(String, default="moderate")  # low, moderate, high
    calories = Column(Float, default=0.0)
    notes = Column(String, nullable=True)
    started_at = Column(DateTime, nullable=False)
    ended_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="exercises")

class Goal(Base):
    __tablename__ = "goals"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    goal_type = Column(String, nullable=False)  # daily_steps, weekly_exercise, etc.
    target_value = Column(Float, nullable=False)
    current_value = Column(Float, default=0.0)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    user = relationship("User", back_populates="goals")

class ActivityData(Base):
    __tablename__ = "activity_data"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    accelerometer_data = Column(JSON, nullable=False)  # Store sensor readings
    activity_label = Column(String, nullable=True)  # Sitting, Standing, Walking, Running, Cycling
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    
    user = relationship("User", back_populates="activity_data")
