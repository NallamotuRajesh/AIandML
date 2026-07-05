# AI-Powered Steps Tracker App 🏃‍♂️

An advanced Android fitness tracking application built with React Native (Expo) and Python FastAPI backend, featuring AI-powered activity recognition, personalized recommendations, and predictive analytics.

## Features

### Core Features
- **Step Tracking**: Real-time step counting using device pedometer
- **Exercise Logging**: Track various exercise types (Running, Walking, Cycling, Gym, Yoga, Swimming)
- **Goal Setting**: Custom daily step goals and exercise frequency targets
- **Data Visualization**: Interactive charts showing progress and trends
- **Offline Support**: Works without internet connection, syncs when online

### AI-Powered Features
- **Activity Recognition**: Automatically detect physical activities from sensor data
- **Personalized Recommendations**: Get workout suggestions based on your patterns
- **Predictive Analytics**: Forecast your weekly/monthly progress
- **Anomaly Detection**: Alerts for unusual inactivity periods

## Technology Stack

### Mobile App
- React Native with Expo
- React Navigation for navigation
- React Native Paper for UI components
- Expo Sensors for step counting and accelerometer
- AsyncStorage for local data persistence
- Axios for API communication

### Backend
- FastAPI (Python)
- SQLAlchemy ORM with SQLite/PostgreSQL
- JWT Authentication
- Scikit-learn for ML models
- Pandas & NumPy for data processing

## Project Structure

```
StepsTrackerApp/
├── mobile/                    # React Native app
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── screens/          # App screens
│   │   ├── services/         # API & sensor services
│   │   ├── utils/            # Helper functions
│   │   ├── navigation/       # Navigation setup
│   │   └── context/          # React Context providers
│   ├── App.js
│   └── package.json
├── backend/                   # Python FastAPI backend
│   ├── app/
│   │   ├── api/              # REST API endpoints
│   │   ├── models/           # Database models
│   │   ├── ml/               # ML models & training
│   │   ├── services/         # Business logic
│   │   └── core/             # Configuration
│   ├── main.py
│   └── requirements.txt
├── ml_models/                 # Trained AI models
└── docs/                      # Documentation
```

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Expo CLI: `npm install -g expo-cli`
- Android Studio with emulator (or physical Android device)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Run the backend:
```bash
python main.py
```

The API will be available at `http://localhost:8000`
API documentation: `http://localhost:8000/docs`

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npx expo start
```

4. Run on Android:
- Press `a` to open in Android emulator
- Or scan QR code with Expo Go app on physical device

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /auth/me` - Get current user

### Steps
- `POST /steps` - Log steps data
- `GET /steps` - Get steps history
- `GET /steps/today` - Today's steps
- `GET /steps/stats` - Aggregated statistics

### Exercises
- `POST /exercises` - Log new exercise
- `GET /exercises` - Get exercise history
- `PUT /exercises/{id}` - Update exercise
- `DELETE /exercises/{id}` - Delete exercise

### Goals
- `GET /goals` - Get user goals
- `POST /goals` - Create/update goals

### AI Features
- `GET /ai/activity-recognition` - Get activity prediction
- `GET /ai/recommendations` - Get personalized recommendations
- `GET /ai/predictions` - Get predictive analytics
- `GET /ai/insights` - Get anomaly detection insights

## Database Schema

### Users
- id, username, email, password_hash, created_at, settings

### Steps
- id, user_id, date, step_count, distance, calories, created_at

### Exercises
- id, user_id, exercise_type, duration_minutes, intensity, calories, notes, started_at, ended_at

### Goals
- id, user_id, goal_type, target_value, current_value, start_date, end_date, completed

### ActivityData
- id, user_id, accelerometer_data, activity_label, timestamp

## Development

### Backend Development
```bash
cd backend
source venv/bin/activate
python main.py  # Runs with hot reload
```

### Mobile Development
```bash
cd mobile
npx expo start
```

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Mobile tests
cd mobile
npm test
```

## Deployment

### Backend Deployment
See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for detailed deployment instructions.

Quick start with Docker:
```bash
cd backend
docker build -t steps-tracker-api .
docker run -p 8000:8000 steps-tracker-api
```

### Mobile App Deployment
Build Android APK:
```bash
cd mobile
eas build --platform android
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License

## Support

For issues and questions, please open an issue on GitHub.
