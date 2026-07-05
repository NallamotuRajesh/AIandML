import React, { createContext, useState, useContext, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StepsContext = createContext();

export const StepsProvider = ({ children }) => {
  const [todaySteps, setTodaySteps] = useState(0);
  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [dailyGoal, setDailyGoal] = useState(10000);

  useEffect(() => {
    checkPedometerAvailability();
    loadDailyGoal();
    subscribeToPedometer();
  }, []);

  const checkPedometerAvailability = async () => {
    const available = await Pedometer.isAvailableAsync();
    setIsPedometerAvailable(available);
  };

  const loadDailyGoal = async () => {
    try {
      const goal = await AsyncStorage.getItem('dailyGoal');
      if (goal) {
        setDailyGoal(parseInt(goal));
      }
    } catch (error) {
      console.error('Error loading daily goal:', error);
    }
  };

  const subscribeToPedometer = () => {
    const end = new Date();
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    Pedometer.getStepCountAsync(start, end)
      .then(result => {
        setTodaySteps(result.steps);
      })
      .catch(error => {
        console.error('Error getting step count:', error);
      });

    const subscription = Pedometer.watchStepCount(result => {
      setTodaySteps(prevSteps => prevSteps + result.steps);
    });

    return () => subscription && subscription.remove();
  };

  const updateDailyGoal = async (newGoal) => {
    try {
      await AsyncStorage.setItem('dailyGoal', newGoal.toString());
      setDailyGoal(newGoal);
    } catch (error) {
      console.error('Error updating daily goal:', error);
    }
  };

  return (
    <StepsContext.Provider 
      value={{ 
        todaySteps, 
        dailyGoal, 
        isPedometerAvailable,
        updateDailyGoal,
        progress: Math.min((todaySteps / dailyGoal) * 100, 100)
      }}
    >
      {children}
    </StepsContext.Provider>
  );
};

export const useSteps = () => {
  const context = useContext(StepsContext);
  if (!context) {
    throw new Error('useSteps must be used within StepsProvider');
  }
  return context;
};
