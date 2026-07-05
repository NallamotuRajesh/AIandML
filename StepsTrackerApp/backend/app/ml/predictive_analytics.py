import numpy as np
from sklearn.linear_model import LinearRegression
from datetime import datetime, timedelta

class PredictiveAnalytics:
    def __init__(self):
        self.model = LinearRegression()
    
    def predict_weekly_steps(self, step_history):
        """Predict weekly step count based on historical data"""
        if not step_history or len(step_history) < 7:
            return 50000
        
        dates = [datetime.fromisoformat(str(s['date'])) for s in step_history[-30:]]
        steps = [s['step_count'] for s in step_history[-30:]]
        
        X = np.array([(d - dates[0]).days for d in dates]).reshape(-1, 1)
        y = np.array(steps)
        
        self.model.fit(X, y)
        
        last_date = dates[-1]
        future_dates = [(last_date + timedelta(days=i) - dates[0]).days for i in range(1, 8)]
        future_X = np.array(future_dates).reshape(-1, 1)
        
        predicted_steps = self.model.predict(future_X)
        weekly_prediction = int(max(sum(predicted_steps), 0))
        
        return weekly_prediction
    
    def calculate_goal_achievement_probability(self, current_progress, target, days_remaining):
        """Calculate probability of achieving goal"""
        if days_remaining <= 0:
            return 1.0 if current_progress >= target else 0.0
        
        progress_rate = current_progress / max(30 - days_remaining, 1)
        projected_progress = progress_rate * 30
        
        if projected_progress >= target * 0.9:
            probability = 0.9
        elif projected_progress >= target * 0.75:
            probability = 0.7
        elif projected_progress >= target * 0.6:
            probability = 0.5
        elif projected_progress >= target * 0.4:
            probability = 0.3
        else:
            probability = 0.1
        
        return probability
    
    def detect_anomalies(self, step_history):
        """Detect unusual inactivity or activity patterns"""
        if not step_history or len(step_history) < 7:
            return {
                'anomalies_detected': False,
                'insights': []
            }
        
        recent_steps = [s['step_count'] for s in step_history[-7:]]
        avg_steps = np.mean(recent_steps)
        std_steps = np.std(recent_steps)
        
        anomalies = []
        insights = []
        
        if avg_steps < 3000:
            anomalies.append('low_activity')
            insights.append("Your activity has been significantly lower than recommended this week.")
        
        if std_steps > avg_steps * 0.8:
            anomalies.append('inconsistent_activity')
            insights.append("Your daily activity varies significantly. Try to maintain consistency.")
        
        if len(step_history) >= 14:
            previous_week = np.mean([s['step_count'] for s in step_history[-14:-7]])
            current_week = np.mean(recent_steps)
            
            if current_week < previous_week * 0.7:
                anomalies.append('declining_activity')
                insights.append("Your activity has dropped by 30% compared to last week.")
            elif current_week > previous_week * 1.3:
                insights.append("Great job! Your activity increased by 30% this week!")
        
        return {
            'anomalies_detected': len(anomalies) > 0,
            'anomalies': anomalies,
            'insights': insights
        }
    
    def forecast_calorie_burn(self, step_history, exercise_history):
        """Forecast calorie burn trends"""
        if not step_history:
            return {'daily': 200, 'weekly': 1400, 'trend': 'stable'}
        
        recent_calories = [s.get('calories', 0) for s in step_history[-7:]]
        avg_daily_calories = np.mean(recent_calories) if recent_calories else 200
        
        if len(step_history) >= 14:
            previous_avg = np.mean([s.get('calories', 0) for s in step_history[-14:-7]])
            if avg_daily_calories > previous_avg * 1.1:
                trend = 'increasing'
            elif avg_daily_calories < previous_avg * 0.9:
                trend = 'decreasing'
            else:
                trend = 'stable'
        else:
            trend = 'stable'
        
        return {
            'daily': int(avg_daily_calories),
            'weekly': int(avg_daily_calories * 7),
            'trend': trend
        }
