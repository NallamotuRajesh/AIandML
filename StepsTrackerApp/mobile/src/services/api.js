import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://localhost:8000';

class ApiService {
  async getAuthHeaders() {
    const token = await AsyncStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  async syncStepsToServer(date, stepCount, distance, calories) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/steps`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          date,
          step_count: stepCount,
          distance,
          calories
        })
      });

      if (!response.ok) {
        throw new Error('Failed to sync steps');
      }

      return await response.json();
    } catch (error) {
      console.error('Error syncing steps:', error);
      await this.saveToOfflineQueue('steps', { date, stepCount, distance, calories });
      throw error;
    }
  }

  async getStepsHistory(skip = 0, limit = 30) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/steps?skip=${skip}&limit=${limit}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch steps history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching steps history:', error);
      return await this.getOfflineData('stepsHistory') || [];
    }
  }

  async getTodaySteps() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/steps/today`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch today steps');
      }

      const data = await response.json();
      await AsyncStorage.setItem('todaySteps', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching today steps:', error);
      const cached = await AsyncStorage.getItem('todaySteps');
      return cached ? JSON.parse(cached) : null;
    }
  }

  async getStepsStats(days = 30) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/steps/stats?days=${days}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch steps stats');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching steps stats:', error);
      return null;
    }
  }

  async createExercise(exercise) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/exercises`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          exercise_type: exercise.type,
          duration_minutes: exercise.duration,
          intensity: exercise.intensity,
          calories: exercise.calories,
          notes: exercise.notes,
          started_at: exercise.startTime,
          ended_at: exercise.endTime
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create exercise');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating exercise:', error);
      await this.saveToOfflineQueue('exercise', exercise);
      throw error;
    }
  }

  async getExercises(skip = 0, limit = 50) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/exercises?skip=${skip}&limit=${limit}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch exercises');
      }

      const data = await response.json();
      await AsyncStorage.setItem('exercises', JSON.stringify(data));
      return data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      const cached = await AsyncStorage.getItem('exercises');
      return cached ? JSON.parse(cached) : [];
    }
  }

  async deleteExercise(exerciseId) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/exercises/${exerciseId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete exercise');
      }

      return true;
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  }

  async getGoals(activeOnly = false) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/goals?active_only=${activeOnly}`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to fetch goals');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching goals:', error);
      return [];
    }
  }

  async createGoal(goal) {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/goals`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          goal_type: goal.type,
          target_value: goal.targetValue,
          start_date: goal.startDate,
          end_date: goal.endDate
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create goal');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  async getActivityRecognition() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai/activity-recognition`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to get activity recognition');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting activity recognition:', error);
      return null;
    }
  }

  async getRecommendations() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai/recommendations`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to get recommendations');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting recommendations:', error);
      return null;
    }
  }

  async getPredictions() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai/predictions`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to get predictions');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting predictions:', error);
      return null;
    }
  }

  async getInsights() {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_URL}/ai/insights`, {
        headers
      });

      if (!response.ok) {
        throw new Error('Failed to get insights');
      }

      return await response.json();
    } catch (error) {
      console.error('Error getting insights:', error);
      return null;
    }
  }

  async saveToOfflineQueue(type, data) {
    try {
      const queue = await AsyncStorage.getItem('offlineQueue');
      const offlineQueue = queue ? JSON.parse(queue) : [];
      offlineQueue.push({ type, data, timestamp: Date.now() });
      await AsyncStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
    } catch (error) {
      console.error('Error saving to offline queue:', error);
    }
  }

  async getOfflineData(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting offline data:', error);
      return null;
    }
  }

  async syncOfflineQueue() {
    try {
      const queue = await AsyncStorage.getItem('offlineQueue');
      if (!queue) return;

      const offlineQueue = JSON.parse(queue);
      const failedItems = [];

      for (const item of offlineQueue) {
        try {
          if (item.type === 'steps') {
            await this.syncStepsToServer(
              item.data.date,
              item.data.stepCount,
              item.data.distance,
              item.data.calories
            );
          } else if (item.type === 'exercise') {
            await this.createExercise(item.data);
          }
        } catch (error) {
          failedItems.push(item);
        }
      }

      await AsyncStorage.setItem('offlineQueue', JSON.stringify(failedItems));
      return { synced: offlineQueue.length - failedItems.length, failed: failedItems.length };
    } catch (error) {
      console.error('Error syncing offline queue:', error);
      return { synced: 0, failed: 0 };
    }
  }
}

export default new ApiService();
