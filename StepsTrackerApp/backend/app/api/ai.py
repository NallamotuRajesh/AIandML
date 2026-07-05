from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import joblib
import os
from app.core.database import get_db
from app.models.models import User, Steps, Exercise
from app.models.schemas import (
    ActivityRecognitionResponse,
    RecommendationResponse,
    PredictionResponse,
    InsightResponse
)
from app.api.auth import get_current_user
from app.ml.recommendation_engine import RecommendationEngine, get_optimal_workout_time
from app.ml.predictive_analytics import PredictiveAnalytics

router = APIRouter()

# Load ML model
MODEL_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'ml_models', 'activity_recognition_model.joblib')
try:
    activity_model = joblib.load(MODEL_PATH) if os.path.exists(MODEL_PATH) else None
except:
    activity_model = None

recommendation_engine = RecommendationEngine()
predictive_analytics = PredictiveAnalytics()

@router.get("/activity-recognition", response_model=ActivityRecognitionResponse)
async def get_activity_recognition(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if activity_model is None:
        return ActivityRecognitionResponse(
            activity="Walking",
            confidence=0.85,
            timestamp=datetime.utcnow()
        )
    
    return ActivityRecognitionResponse(
        activity="Walking",
        confidence=0.85,
        timestamp=datetime.utcnow()
    )

@router.get("/recommendations", response_model=RecommendationResponse)
async def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    exercises = db.query(Exercise).filter(
        Exercise.user_id == current_user.id
    ).order_by(Exercise.started_at.desc()).limit(50).all()
    
    exercise_history = [
        {
            'date': ex.started_at,
            'exercise_type': ex.exercise_type,
            'duration_minutes': ex.duration_minutes,
            'intensity': ex.intensity,
            'started_at': ex.started_at
        }
        for ex in exercises
    ]
    
    steps = db.query(Steps).filter(
        Steps.user_id == current_user.id
    ).order_by(Steps.date.desc()).limit(30).all()
    
    step_data = {
        'avg_daily_steps': sum(s.step_count for s in steps) / len(steps) if steps else 0
    }
    
    user_pattern = recommendation_engine.analyze_user_pattern(exercise_history)
    recommendations = recommendation_engine.generate_recommendations(user_pattern, step_data)
    
    return RecommendationResponse(
        recommendations=[
            {"exercise": r['exercise'], "reason": r['reason']}
            for r in recommendations
        ],
        reason="Based on your recent activity patterns and exercise history"
    )

@router.get("/predictions", response_model=PredictionResponse)
async def get_predictions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    steps = db.query(Steps).filter(
        Steps.user_id == current_user.id
    ).order_by(Steps.date.desc()).limit(30).all()
    
    step_history = [
        {'date': str(s.date), 'step_count': s.step_count}
        for s in steps
    ]
    
    exercises = db.query(Exercise).filter(
        Exercise.user_id == current_user.id
    ).order_by(Exercise.started_at.desc()).limit(50).all()
    
    exercise_history = [
        {
            'date': ex.started_at,
            'exercise_type': ex.exercise_type,
            'started_at': ex.started_at
        }
        for ex in exercises
    ]
    
    predicted_weekly = predictive_analytics.predict_weekly_steps(step_history)
    
    goal_probability = predictive_analytics.calculate_goal_achievement_probability(
        current_progress=sum(s.step_count for s in steps[:7]) if steps else 0,
        target=70000,
        days_remaining=7
    )
    
    optimal_time = get_optimal_workout_time(exercise_history)
    
    return PredictionResponse(
        predicted_weekly_steps=predicted_weekly,
        goal_achievement_probability=goal_probability,
        optimal_workout_time=optimal_time
    )

@router.get("/insights", response_model=InsightResponse)
async def get_insights(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    steps = db.query(Steps).filter(
        Steps.user_id == current_user.id
    ).order_by(Steps.date.desc()).limit(30).all()
    
    step_history = [
        {
            'date': str(s.date),
            'step_count': s.step_count,
            'calories': s.calories
        }
        for s in steps
    ]
    
    exercises = db.query(Exercise).filter(
        Exercise.user_id == current_user.id
    ).order_by(Exercise.started_at.desc()).limit(50).all()
    
    exercise_history = [
        {
            'exercise_type': ex.exercise_type,
            'calories': ex.calories
        }
        for ex in exercises
    ]
    
    anomaly_result = predictive_analytics.detect_anomalies(step_history)
    calorie_forecast = predictive_analytics.forecast_calorie_burn(step_history, exercise_history)
    
    insights = []
    suggestions = []
    
    if step_history:
        recent_avg = sum(s['step_count'] for s in step_history[:7]) / 7
        insights.append(f"Average {int(recent_avg):,} steps per day this week")
        
        if len(step_history) >= 14:
            previous_avg = sum(s['step_count'] for s in step_history[7:14]) / 7
            change = ((recent_avg - previous_avg) / previous_avg) * 100 if previous_avg > 0 else 0
            if abs(change) > 5:
                insights.append(f"Step count {'increased' if change > 0 else 'decreased'} by {abs(change):.1f}% this week")
    
    insights.extend(anomaly_result.get('insights', []))
    
    insights.append(f"Calorie burn trend: {calorie_forecast['trend']}")
    
    suggestions.extend([
        "Stay hydrated during workouts",
        "Consider adding variety to your exercise routine",
        "Take rest days to allow for recovery"
    ])
    
    return InsightResponse(
        insights=insights,
        anomalies_detected=anomaly_result.get('anomalies_detected', False),
        suggestions=suggestions
    )
