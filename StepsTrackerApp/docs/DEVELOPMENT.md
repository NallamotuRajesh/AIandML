# Development Guide

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.12+
- Git
- Android Studio (for mobile development)
- Expo CLI

### Repository Structure

```
StepsTrackerApp/
├── mobile/                 # React Native mobile app
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── screens/       # App screens
│   │   ├── services/      # API and sensor services
│   │   ├── utils/         # Helper functions
│   │   ├── navigation/    # Navigation setup
│   │   └── context/       # React Context providers
│   ├── App.js
│   ├── package.json
│   └── app.json
├── backend/               # Python FastAPI backend
│   ├── app/
│   │   ├── api/          # REST API endpoints
│   │   ├── models/       # Database models
│   │   ├── ml/           # ML models & training
│   │   ├── services/     # Business logic
│   │   └── core/         # Configuration
│   ├── main.py
│   └── requirements.txt
├── ml_models/            # Trained AI models
├── docs/                 # Documentation
└── README.md
```

## Backend Development

### Setup

1. Install dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Initialize database:
```bash
python init_db.py
```

3. Run development server:
```bash
python main.py
# or
uvicorn main:app --reload
```

The API will be available at http://localhost:8000

### API Documentation

FastAPI provides automatic API documentation:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Adding New Endpoints

1. Create a new router in `app/api/`:
```python
from fastapi import APIRouter
router = APIRouter()

@router.get("/example")
async def example_endpoint():
    return {"message": "Hello"}
```

2. Register router in `main.py`:
```python
from app.api import example
app.include_router(example.router, prefix="/example", tags=["Example"])
```

### Database Migrations

When modifying models:

1. Update model in `app/models/models.py`
2. For simple changes, recreate database:
```bash
rm steps_tracker.db
python init_db.py
```

For production, use Alembic:
```bash
pip install alembic
alembic init alembic
alembic revision --autogenerate -m "description"
alembic upgrade head
```

### Testing Backend

1. Install test dependencies:
```bash
pip install pytest pytest-cov httpx
```

2. Run tests:
```bash
pytest
pytest --cov=app tests/
```

## Mobile Development

### Setup

1. Install dependencies:
```bash
cd mobile
npm install
```

2. Start development server:
```bash
npx expo start
```

3. Run on Android:
- Press `a` in terminal
- Or scan QR code with Expo Go app

### Project Structure

- `src/screens/` - Each screen is a separate component
- `src/components/` - Reusable UI components
- `src/context/` - Global state management (Auth, Steps)
- `src/services/` - API calls and external services
- `src/navigation/` - Navigation setup
- `src/utils/` - Helper functions

### Adding New Screens

1. Create screen component in `src/screens/`:
```javascript
export default function NewScreen() {
  return (
    <View style={styles.container}>
      <Text>New Screen</Text>
    </View>
  );
}
```

2. Add to navigation in `src/navigation/MainTabNavigator.js`

### State Management

Using React Context for global state:

```javascript
// Create context
const MyContext = createContext();

// Provider
export const MyProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  return (
    <MyContext.Provider value={{ state, setState }}>
      {children}
    </MyContext.Provider>
  );
};

// Use in component
const { state, setState } = useContext(MyContext);
```

### API Integration

All API calls go through `src/services/api.js`:

```javascript
import ApiService from '../services/api';

// In component
const data = await ApiService.getStepsHistory();
```

## ML Model Development

### Training New Models

1. Navigate to ML directory:
```bash
cd backend/app/ml
```

2. Train activity recognition model:
```bash
python train_activity_recognition.py
```

3. Model will be saved to `ml_models/`

### Using ML Models in API

```python
import joblib
model = joblib.load('path/to/model.joblib')
prediction = model.predict(features)
```

## Code Style

### Python
- Follow PEP 8
- Use type hints
- Document functions with docstrings

```python
def example_function(param: str) -> dict:
    """
    Brief description.
    
    Args:
        param: Description
        
    Returns:
        Description of return value
    """
    return {"result": param}
```

### JavaScript/React
- Use ES6+ features
- Functional components with hooks
- PropTypes for type checking

```javascript
import PropTypes from 'prop-types';

function Component({ prop1, prop2 }) {
  // component logic
}

Component.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};
```

## Git Workflow

### Branch Naming
- `feature/description` - New features
- `fix/description` - Bug fixes
- `refactor/description` - Code refactoring
- `docs/description` - Documentation updates

### Commit Messages
```
feat: Add user profile screen
fix: Correct step counting logic
docs: Update API documentation
refactor: Simplify authentication flow
```

### Pull Request Process
1. Create feature branch
2. Make changes and commit
3. Push to remote
4. Create pull request
5. Request review
6. Address feedback
7. Merge after approval

## Debugging

### Backend Debugging
- Use `print()` statements
- FastAPI interactive docs for testing endpoints
- Python debugger: `import pdb; pdb.set_trace()`

### Mobile Debugging
- React DevTools
- Expo DevTools in browser
- `console.log()` for debugging
- React Native Debugger

### Common Issues

**Backend:**
- Port already in use: Change port in `main.py`
- Database locked: Close other connections
- Import errors: Check virtual environment activation

**Mobile:**
- Metro bundler cache issues: `npx expo start -c`
- Native module errors: Rebuild app
- Network errors: Check API URL configuration

## Performance Optimization

### Backend
- Use async/await for I/O operations
- Implement caching for frequently accessed data
- Database query optimization with indexes
- Connection pooling

### Mobile
- Lazy loading for screens
- Memoization with `React.memo`, `useMemo`, `useCallback`
- Optimize images
- Reduce unnecessary re-renders
- Use FlatList for long lists

## Security Best Practices

### Backend
- Validate all input data
- Use parameterized queries
- Implement rate limiting
- Secure password hashing (bcrypt)
- JWT token expiration
- HTTPS only in production

### Mobile
- Never store sensitive data in plain text
- Use secure storage for tokens
- Validate API responses
- Implement certificate pinning for production

## Useful Commands

### Backend
```bash
# Run server
python main.py

# Run with auto-reload
uvicorn main:app --reload

# Check code style
flake8 app/

# Format code
black app/
```

### Mobile
```bash
# Start development server
npx expo start

# Clear cache
npx expo start -c

# Build for Android
eas build --platform android

# Run tests
npm test
```

## Resources

### Documentation
- FastAPI: https://fastapi.tiangolo.com/
- React Native: https://reactnative.dev/
- Expo: https://docs.expo.dev/
- React Navigation: https://reactnavigation.org/

### Learning
- FastAPI Tutorial: https://fastapi.tiangolo.com/tutorial/
- React Native School: https://www.reactnativeschool.com/
- Expo Learn: https://docs.expo.dev/tutorial/introduction/

## Contributing

1. Fork the repository
2. Create feature branch
3. Make your changes
4. Add tests if applicable
5. Ensure all tests pass
6. Submit pull request

## Need Help?

- Check documentation
- Search existing issues
- Create new issue with detailed description
- Join community discussions
