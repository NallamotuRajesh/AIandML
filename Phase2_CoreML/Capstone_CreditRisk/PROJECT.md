# Capstone Project #2: Credit Risk Prediction System

**Phase:** 2 (Core Machine Learning) | **Duration:** 4 weeks | **Difficulty:** Intermediate

---

## 📋 Project Overview

Build a **production-ready credit risk classification system** that evaluates loan applications and predicts approval likelihood. This mirrors real fintech systems used by banks.

### 🎯 Business Context

Banks need to:
- Identify high-risk loan applicants
- Minimize defaults while approving good customers
- Maintain regulatory compliance
- Explain decisions to business teams

### 💼 What You'll Learn

✅ Production ML pipeline architecture  
✅ Feature engineering & preprocessing  
✅ Multiple model comparison  
✅ Hyperparameter optimization  
✅ Model evaluation & business metrics  
✅ REST API deployment  
✅ Swagger documentation & authentication  
✅ Azure cloud deployment (optional)  

---

## 📊 Project Structure

```
Capstone_CreditRisk/
├── PROJECT.md (this file)
├── requirements.txt
├── data/
│   ├── raw/
│   │   └── loan_data.csv
│   └── processed/
├── notebooks/
│   ├── 01_eda.ipynb
│   ├── 02_feature_engineering.ipynb
│   ├── 03_model_comparison.ipynb
│   └── 04_evaluation.ipynb
├── src/
│   ├── __init__.py
│   ├── preprocessor.py     # Data cleaning & scaling
│   ├── feature_engineer.py # Feature creation
│   ├── models.py           # Model training
│   ├── evaluator.py        # Performance evaluation
│   └── api.py              # FastAPI application
├── models/
│   ├── preprocessor.pkl
│   ├── random_forest.pkl
│   └── xgboost.pkl
├── tests/
│   └── test_models.py
├── reports/
│   ├── model_comparison.html
│   └── feature_importance.html
├── docker/
│   └── Dockerfile
└── README.md
```

---

## 🔧 Implementation Tasks

### Task 1: Data Understanding

**Dataset:** Loan applications with outcomes

```csv
loan_id,age,income,credit_score,debt_to_income,employment_years,loan_amount,interest_rate,loan_purpose,approved
1001,35,75000,720,0.25,8,25000,5.5,home,1
1002,28,45000,620,0.45,2,15000,7.2,auto,0
```

**Features:**
- Numeric: age, income, credit_score, debt_to_income, etc.
- Categorical: loan_purpose, employment_status, etc.
- Target: approved (binary classification)

### Task 2: Data Preprocessing (`src/preprocessor.py`)

```python
import pandas as pd
from sklearn.preprocessing import StandardScaler, LabelEncoder

class CreditRiskPreprocessor:
    def __init__(self):
        self.scaler = StandardScaler()
        self.label_encoders = {}
    
    def fit(self, X, y=None):
        """Fit preprocessor on training data"""
        # Scale numeric features
        # Encode categorical features
        # TODO: Implement
        return self
    
    def transform(self, X):
        """Transform new data"""
        # TODO: Implement
        return X_transformed
    
    def fit_transform(self, X, y=None):
        return self.fit(X, y).transform(X)
```

**Tasks:**
- Remove duplicate loan IDs
- Handle missing values (imputation strategy)
- Encode categorical variables
- Scale numeric features
- Create preprocessing pipeline

### Task 3: Feature Engineering (`src/feature_engineer.py`)

```python
def create_features(df):
    """Create new features from raw data"""
    
    df = df.copy()
    
    # 1. Ratio features
    df['income_to_loan'] = df['income'] / (df['loan_amount'] + 1)
    df['debt_ratio_squared'] = df['debt_to_income'] ** 2
    
    # 2. Binned features
    df['age_group'] = pd.cut(df['age'], bins=[0, 30, 40, 50, 100])
    df['income_bucket'] = pd.qcut(df['income'], q=4, duplicates='drop')
    
    # 3. Interaction features
    df['credit_income_interaction'] = df['credit_score'] * df['income']
    
    # 4. Temporal features
    df['loan_approval_date'] = pd.to_datetime(df['loan_approval_date'])
    df['application_month'] = df['loan_approval_date'].dt.month
    
    return df
```

**Feature Engineering Ideas:**
- Debt-to-income ratios
- Credit score binning
- Income categories
- Employment tenure categories
- Loan-to-value ratios
- Interaction terms

### Task 4: Model Training (`src/models.py`)

```python
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from xgboost import XGBClassifier
import pickle

class CreditRiskModels:
    def __init__(self):
        self.models = {}
    
    def train_logistic_regression(self, X_train, y_train):
        """Baseline model: Logistic Regression"""
        model = LogisticRegression(max_iter=1000, random_state=42)
        model.fit(X_train, y_train)
        self.models['logistic'] = model
        return model
    
    def train_random_forest(self, X_train, y_train):
        """Ensemble method: Random Forest"""
        model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            min_samples_split=5,
            random_state=42,
            n_jobs=-1
        )
        model.fit(X_train, y_train)
        self.models['random_forest'] = model
        return model
    
    def train_xgboost(self, X_train, y_train):
        """Gradient boosting: XGBoost"""
        model = XGBClassifier(
            n_estimators=100,
            max_depth=5,
            learning_rate=0.1,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42
        )
        model.fit(X_train, y_train)
        self.models['xgboost'] = model
        return model
    
    def save_model(self, name, filepath):
        """Persist model to disk"""
        with open(filepath, 'wb') as f:
            pickle.dump(self.models[name], f)
    
    def load_model(self, filepath):
        """Load model from disk"""
        with open(filepath, 'rb') as f:
            return pickle.load(f)
```

### Task 5: Model Evaluation (`src/evaluator.py`)

```python
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, f1_score,
    roc_auc_score, confusion_matrix, classification_report,
    roc_curve, auc
)
import pandas as pd
import matplotlib.pyplot as plt

class ModelEvaluator:
    def evaluate_model(self, model, X_test, y_test):
        """Comprehensive model evaluation"""
        
        y_pred = model.predict(X_test)
        y_proba = model.predict_proba(X_test)[:, 1]
        
        metrics = {
            'accuracy': accuracy_score(y_test, y_pred),
            'precision': precision_score(y_test, y_pred),
            'recall': recall_score(y_test, y_pred),
            'f1': f1_score(y_test, y_pred),
            'roc_auc': roc_auc_score(y_test, y_proba)
        }
        
        return metrics
    
    def compare_models(self, models_dict, X_test, y_test):
        """Compare multiple models"""
        results = []
        for name, model in models_dict.items():
            metrics = self.evaluate_model(model, X_test, y_test)
            metrics['model'] = name
            results.append(metrics)
        
        return pd.DataFrame(results).set_index('model')
    
    def plot_roc_curves(self, models_dict, X_test, y_test):
        """Plot ROC curves for comparison"""
        plt.figure(figsize=(8, 6))
        
        for name, model in models_dict.items():
            y_proba = model.predict_proba(X_test)[:, 1]
            fpr, tpr, _ = roc_curve(y_test, y_proba)
            auc_score = auc(fpr, tpr)
            plt.plot(fpr, tpr, label=f'{name} (AUC={auc_score:.3f})')
        
        plt.plot([0, 1], [0, 1], 'k--', label='Random')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.legend()
        plt.title('ROC Curves - Model Comparison')
        plt.show()
```

### Task 6: REST API (`src/api.py`)

```python
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pickle

app = FastAPI(
    title="Credit Risk API",
    description="Predict loan approval decisions",
    version="1.0.0"
)

class LoanApplication(BaseModel):
    age: int
    income: float
    credit_score: int
    debt_to_income: float
    employment_years: int
    loan_amount: float
    loan_purpose: str

class PredictionResponse(BaseModel):
    loan_id: str
    prediction: int  # 0 or 1
    probability: float
    risk_level: str

# Load model
with open('models/xgboost.pkl', 'rb') as f:
    model = pickle.load(f)

@app.post("/predict", response_model=PredictionResponse)
def predict_loan_approval(application: LoanApplication):
    """Predict if loan should be approved"""
    
    # Prepare features
    X = prepare_features(application)
    
    # Predict
    prediction = model.predict(X)[0]
    probability = model.predict_proba(X)[0, 1]
    
    # Determine risk level
    if probability < 0.3:
        risk_level = "Low"
    elif probability < 0.7:
        risk_level = "Medium"
    else:
        risk_level = "High"
    
    return PredictionResponse(
        loan_id=application.get('loan_id'),
        prediction=int(prediction),
        probability=float(probability),
        risk_level=risk_level
    )

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
```

**Run API:**
```bash
pip install fastapi uvicorn
uvicorn src.api:app --reload

# Access: http://localhost:8000/docs (Swagger UI)
```

---

## 📊 Expected Outputs

### Model Comparison Table:
```
              accuracy  precision    recall        f1   roc_auc
logistic        0.8234      0.7891    0.7645    0.7766    0.8523
random_forest   0.8612      0.8234    0.8156    0.8195    0.8932
xgboost         0.8745      0.8567    0.8412    0.8489    0.9087
```

### Feature Importance:
```
Feature                    Importance
debt_to_income              0.2543
credit_score                0.2187
income                      0.1834
employment_years            0.1245
age                         0.0956
```

### API Response:
```json
{
  "loan_id": "APP-2024-001",
  "prediction": 1,
  "probability": 0.87,
  "risk_level": "High"
}
```

---

## 🧪 Testing

Create `tests/test_models.py`:
```python
import pytest
from src.models import CreditRiskModels
from src.evaluator import ModelEvaluator
import numpy as np

def test_model_training():
    # Generate synthetic data
    X = np.random.randn(100, 10)
    y = np.random.randint(0, 2, 100)
    
    # Train model
    models = CreditRiskModels()
    rf = models.train_random_forest(X[:80], y[:80])
    
    # Test prediction
    predictions = rf.predict(X[80:])
    assert len(predictions) == 20

def test_model_evaluation():
    X = np.random.randn(20, 10)
    y = np.random.randint(0, 2, 20)
    
    evaluator = ModelEvaluator()
    # Test evaluation metrics
```

Run tests:
```bash
pytest tests/ -v
```

---

## 🚀 Extensions

### Extension 1: Advanced Feature Engineering
```python
# Domain-specific features
df['financial_stress'] = (
    df['debt_to_income'] * df['loan_amount'] / df['income']
)

# Temporal patterns
df['recession_period'] = df['application_date'].dt.year.isin([2008, 2020])

# Outlier flags
df['has_outlier_debt_ratio'] = (
    df['debt_to_income'] > df['debt_to_income'].quantile(0.95)
)
```

### Extension 2: Cross-Validation & Hyperparameter Tuning
```python
from sklearn.model_selection import GridSearchCV

param_grid = {
    'n_estimators': [50, 100, 200],
    'max_depth': [5, 10, 15],
    'min_samples_split': [2, 5, 10]
}

grid_search = GridSearchCV(
    RandomForestClassifier(),
    param_grid,
    cv=5,
    scoring='roc_auc'
)

grid_search.fit(X_train, y_train)
print(grid_search.best_params_)
```

### Extension 3: Model Interpretability
```python
# SHAP values for feature importance
import shap

explainer = shap.TreeExplainer(xgb_model)
shap_values = explainer.shap_values(X_test)
shap.summary_plot(shap_values, X_test, plot_type="bar")
```

### Extension 4: Azure Deployment
```python
from azure.ai.ml import MLClient
from azure.identity import DefaultAzureCredential

ml_client = MLClient(
    credential=DefaultAzureCredential(),
    subscription_id="...",
    resource_group_name="...",
    workspace_name="..."
)

# Register model
ml_client.models.create_or_update(model)
```

---

## ✅ Submission Checklist

- [ ] Data loaded, cleaned, and explored
- [ ] Features engineered and documented
- [ ] 3+ models trained and compared
- [ ] Evaluation metrics calculated
- [ ] ROC curves plotted and analyzed
- [ ] Models saved to disk
- [ ] REST API implemented with Swagger docs
- [ ] Unit tests passing
- [ ] Code follows PEP 8
- [ ] All functions documented
- [ ] README explains architecture
- [ ] Optional: Deployed to Azure/AWS

---

**Time Estimate:** 20-30 hours  
**Difficulty:** ⭐⭐⭐☆☆ (Intermediate)

**Next:** [Phase 3 Capstone: Medical Image Classification](../../Phase3_DeepLearning/Capstone_MedicalImageClassification/PROJECT.md)
