import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from collections import Counter

class RecommendationEngine:
    def __init__(self):
        self.exercise_benefits = {
            'Running': ['cardio', 'endurance', 'calorie_burn'],
            'Walking': ['cardio', 'low_impact', 'accessibility'],
            'Cycling': ['cardio', 'low_impact', 'leg_strength'],
            'Gym': ['strength', 'muscle_building', 'flexibility'],
            'Yoga': ['flexibility', 'mindfulness', 'recovery'],
            'Swimming': ['full_body', 'low_impact', 'cardio'],
        }
        
        self.complementary_exercises = {
            'Running': ['Yoga', 'Gym'],
            'Walking': ['Gym', 'Cycling'],
            'Cycling': ['Yoga', 'Gym'],
            'Gym': ['Running', 'Yoga'],
            'Yoga': ['Running', 'Cycling'],
            'Swimming': ['Gym', 'Yoga'],
        }
    
    def analyze_user_pattern(self, exercise_history):
        """Analyze user's exercise patterns"""
        if not exercise_history:
            return self.get_beginner_recommendations()
        
        df = pd.DataFrame(exercise_history)
        
        recent_exercises = df[df['date'] >= datetime.now() - timedelta(days=7)]
        exercise_counts = Counter(recent_exercises['exercise_type'])
        
        most_common = exercise_counts.most_common(1)[0][0] if exercise_counts else None
        
        total_duration = recent_exercises['duration_minutes'].sum()
        avg_intensity = recent_exercises['intensity'].mode()[0] if len(recent_exercises) > 0 else 'moderate'
        
        days_since_last = (datetime.now() - recent_exercises['date'].max()).days if len(recent_exercises) > 0 else 7
        
        return {
            'most_common_exercise': most_common,
            'total_weekly_duration': total_duration,
            'avg_intensity': avg_intensity,
            'days_since_last_exercise': days_since_last,
            'exercise_variety': len(exercise_counts),
        }
    
    def generate_recommendations(self, user_pattern, step_data=None):
        """Generate personalized exercise recommendations"""
        recommendations = []
        
        if user_pattern['days_since_last_exercise'] > 3:
            recommendations.append({
                'exercise': user_pattern.get('most_common_exercise', 'Walking'),
                'reason': f"You haven't exercised in {user_pattern['days_since_last_exercise']} days. Time to get back!",
                'priority': 'high'
            })
        
        if user_pattern['exercise_variety'] < 3:
            if user_pattern.get('most_common_exercise'):
                complementary = self.complementary_exercises.get(
                    user_pattern['most_common_exercise'], 
                    ['Yoga', 'Walking']
                )
                for exercise in complementary[:2]:
                    recommendations.append({
                        'exercise': exercise,
                        'reason': f"Great for recovery and complements your {user_pattern['most_common_exercise']} routine",
                        'priority': 'medium'
                    })
        
        if user_pattern['total_weekly_duration'] > 300:
            recommendations.append({
                'exercise': 'Yoga',
                'reason': "You've been very active! Consider some recovery yoga.",
                'priority': 'medium'
            })
        elif user_pattern['total_weekly_duration'] < 150:
            recommendations.append({
                'exercise': 'Walking',
                'reason': "Aim for 150 minutes of moderate activity per week for optimal health.",
                'priority': 'high'
            })
        
        if step_data and step_data.get('avg_daily_steps', 0) < 5000:
            recommendations.append({
                'exercise': 'Walking',
                'reason': "Your step count is low. Try to walk more throughout the day!",
                'priority': 'high'
            })
        
        if not recommendations:
            recommendations = self.get_default_recommendations()
        
        return recommendations[:5]
    
    def get_beginner_recommendations(self):
        """Recommendations for users with no exercise history"""
        return [
            {
                'exercise': 'Walking',
                'reason': "Perfect for beginners. Start with 20-30 minutes daily.",
                'priority': 'high'
            },
            {
                'exercise': 'Yoga',
                'reason': "Improve flexibility and reduce stress with gentle yoga.",
                'priority': 'medium'
            },
            {
                'exercise': 'Cycling',
                'reason': "Low-impact cardio that's easy on the joints.",
                'priority': 'medium'
            }
        ]
    
    def get_default_recommendations(self):
        """Default recommendations when no specific suggestions"""
        return [
            {
                'exercise': 'Running',
                'reason': "Great for cardiovascular health and calorie burning.",
                'priority': 'medium'
            },
            {
                'exercise': 'Gym',
                'reason': "Build strength and muscle with resistance training.",
                'priority': 'medium'
            },
            {
                'exercise': 'Swimming',
                'reason': "Full-body workout with minimal impact on joints.",
                'priority': 'low'
            }
        ]

def get_optimal_workout_time(exercise_history):
    """Determine optimal workout time based on user patterns"""
    if not exercise_history:
        return "Morning (7-9 AM)"
    
    df = pd.DataFrame(exercise_history)
    df['hour'] = pd.to_datetime(df['started_at']).dt.hour
    
    hour_counts = df['hour'].value_counts()
    most_common_hour = hour_counts.index[0] if len(hour_counts) > 0 else 8
    
    if most_common_hour < 12:
        return "Morning (7-9 AM)"
    elif most_common_hour < 17:
        return "Afternoon (2-5 PM)"
    else:
        return "Evening (6-8 PM)"
