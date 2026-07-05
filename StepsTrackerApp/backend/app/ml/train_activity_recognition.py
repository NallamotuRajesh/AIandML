import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import joblib
import os

def generate_sample_activity_data():
    """Generate sample accelerometer data for different activities"""
    np.random.seed(42)
    n_samples = 1000
    
    activities = []
    features = []
    
    # Sitting: low variance, minimal movement
    for _ in range(n_samples // 5):
        x = np.random.normal(0, 0.5, 50)
        y = np.random.normal(0, 0.5, 50)
        z = np.random.normal(9.8, 0.5, 50)
        activities.append('Sitting')
        features.append(extract_features(x, y, z))
    
    # Standing: slightly more variance than sitting
    for _ in range(n_samples // 5):
        x = np.random.normal(0, 0.8, 50)
        y = np.random.normal(0, 0.8, 50)
        z = np.random.normal(9.8, 0.8, 50)
        activities.append('Standing')
        features.append(extract_features(x, y, z))
    
    # Walking: moderate periodic movement
    for _ in range(n_samples // 5):
        t = np.linspace(0, 2*np.pi, 50)
        x = 2 * np.sin(t) + np.random.normal(0, 0.5, 50)
        y = 1.5 * np.cos(t) + np.random.normal(0, 0.5, 50)
        z = 9.8 + np.sin(2*t) + np.random.normal(0, 0.5, 50)
        activities.append('Walking')
        features.append(extract_features(x, y, z))
    
    # Running: high amplitude periodic movement
    for _ in range(n_samples // 5):
        t = np.linspace(0, 4*np.pi, 50)
        x = 4 * np.sin(t) + np.random.normal(0, 1, 50)
        y = 3 * np.cos(t) + np.random.normal(0, 1, 50)
        z = 9.8 + 3*np.sin(3*t) + np.random.normal(0, 1, 50)
        activities.append('Running')
        features.append(extract_features(x, y, z))
    
    # Cycling: smooth periodic movement, less vertical
    for _ in range(n_samples // 5):
        t = np.linspace(0, 2*np.pi, 50)
        x = 3 * np.sin(t) + np.random.normal(0, 0.3, 50)
        y = 2 * np.cos(t) + np.random.normal(0, 0.3, 50)
        z = 9.8 + 0.5*np.sin(t) + np.random.normal(0, 0.3, 50)
        activities.append('Cycling')
        features.append(extract_features(x, y, z))
    
    return np.array(features), np.array(activities)

def extract_features(x, y, z):
    """Extract features from accelerometer data"""
    features = []
    
    for axis in [x, y, z]:
        features.extend([
            np.mean(axis),
            np.std(axis),
            np.min(axis),
            np.max(axis),
            np.median(axis),
            np.percentile(axis, 25),
            np.percentile(axis, 75),
        ])
    
    magnitude = np.sqrt(x**2 + y**2 + z**2)
    features.extend([
        np.mean(magnitude),
        np.std(magnitude),
        np.max(magnitude) - np.min(magnitude),
    ])
    
    return features

def train_activity_recognition_model():
    """Train Random Forest model for activity recognition"""
    print("Generating sample data...")
    X, y = generate_sample_activity_data()
    
    print(f"Dataset shape: {X.shape}")
    print(f"Classes: {np.unique(y)}")
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    print("\nTraining Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    
    print(f"\nModel Accuracy: {accuracy:.2%}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    model_dir = '../../ml_models'
    os.makedirs(model_dir, exist_ok=True)
    model_path = os.path.join(model_dir, 'activity_recognition_model.joblib')
    
    joblib.dump(model, model_path)
    print(f"\nModel saved to: {model_path}")
    
    return model, accuracy

if __name__ == "__main__":
    model, accuracy = train_activity_recognition_model()
    print("\nTraining complete!")
