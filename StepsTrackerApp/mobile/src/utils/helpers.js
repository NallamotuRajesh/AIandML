export const calculateDistance = (steps) => {
  const averageStepLength = 0.762;
  return (steps * averageStepLength) / 1000;
};

export const calculateCalories = (steps, weight = 70) => {
  return steps * 0.04;
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (date) => {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatDateTime = (date) => {
  return `${formatDate(date)} ${formatTime(date)}`;
};

export const getWeekDates = () => {
  const dates = [];
  const today = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  
  return dates;
};

export const calculateMET = (exerciseType, intensity) => {
  const metValues = {
    'Running': { low: 6, moderate: 9.8, high: 12.3 },
    'Walking': { low: 2.5, moderate: 3.5, high: 5 },
    'Cycling': { low: 4, moderate: 8, high: 12 },
    'Gym': { low: 3, moderate: 5, high: 8 },
    'Yoga': { low: 2.5, moderate: 3, high: 4 },
    'Swimming': { low: 6, moderate: 8, high: 11 },
    'Other': { low: 3, moderate: 5, high: 7 }
  };
  
  return metValues[exerciseType]?.[intensity] || 5;
};

export const calculateExerciseCalories = (exerciseType, duration, intensity, weight = 70) => {
  const met = calculateMET(exerciseType, intensity);
  return Math.round((met * weight * duration) / 60);
};

export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 18) return 'Good Afternoon';
  return 'Good Evening';
};

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const formatNumber = (num) => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
