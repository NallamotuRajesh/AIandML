# Capstone Project #5: AI Deployment Platform

**Phase:** 5 (MLOps & Production AI) | **Duration:** 3 weeks | **Difficulty:** Advanced

---

## 📋 Project Overview

Build a **complete ML deployment & monitoring platform** that manages model versioning, automated retraining, performance monitoring, and team collaboration.

### 🏢 Enterprise Features

- **Model Registry:** Store & manage ML models with versions
- **Automated Retraining:** Trigger retraining on data drift
- **Performance Dashboard:** Real-time metrics & alerts
- **Experiment Tracking:** MLflow integration
- **Deployment Management:** Multi-environment support (dev/staging/prod)
- **Team Collaboration:** Role-based access & audit logs

### 🎯 What You'll Learn

✅ MLflow model registry & versioning  
✅ Kubernetes deployment at scale  
✅ CI/CD pipeline automation  
✅ Database design for ML workflows  
✅ Monitoring & alerting systems  
✅ Data drift detection  
✅ Automated retraining pipelines  
✅ Cloud deployment (Azure ML)  

---

## 📊 Project Structure

```
Capstone_AIDeploymentPlatform/
├── PROJECT.md (this file)
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── models/
│   │   ├── registry.py      # Model versioning
│   │   └── deployment.py    # Deploy models
│   ├── monitoring/
│   │   ├── performance.py   # Track metrics
│   │   ├── drift_detection.py
│   │   └── alerts.py        # Alert system
│   ├── retraining/
│   │   ├── pipeline.py      # Retraining workflow
│   │   └── scheduler.py     # Schedule jobs
│   ├── database/
│   │   ├── models.py        # SQLAlchemy models
│   │   └── queries.py       # Database operations
│   └── api.py               # FastAPI app
├── kubernetes/
│   ├── deployment.yaml
│   ├── service.yaml
│   └── configmap.yaml
├── mlflow/
│   └── MLproject
├── .github/
│   └── workflows/
│       └── ci-cd.yaml       # GitHub Actions
├── tests/
│   └── test_*.py
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
└── README.md
```

---

## 🔧 Implementation Tasks

### Task 1: Model Registry (`src/models/registry.py`)

```python
import mlflow
from mlflow.entities import ViewType
from datetime import datetime
import json

class ModelRegistry:
    def __init__(self, mlflow_uri="http://localhost:5000"):
        mlflow.set_tracking_uri(mlflow_uri)
        self.client = mlflow.tracking.MlflowClient()
    
    def register_model(self, run_id, model_name, description=""):
        """Register model from MLflow run"""
        model_uri = f"runs:/{run_id}/model"
        
        result = mlflow.register_model(model_uri, model_name)
        
        # Add metadata
        self.client.update_model_version(
            name=model_name,
            version=result.version,
            description=f"{description} | From run {run_id}"
        )
        
        return result
    
    def promote_model(self, model_name, version, stage):
        """Promote model to stage (Staging -> Production)"""
        self.client.transition_model_version_stage(
            name=model_name,
            version=version,
            stage=stage
        )
    
    def get_production_model(self, model_name):
        """Get current production model"""
        model = self.client.get_latest_versions(
            name=model_name,
            stages=["Production"]
        )
        return model[0] if model else None
    
    def get_model_history(self, model_name):
        """Get all model versions"""
        versions = self.client.search_model_versions(
            f"name='{model_name}'"
        )
        return versions
    
    def list_models(self):
        """List all registered models"""
        return self.client.list_registered_models()
```

### Task 2: Drift Detection (`src/monitoring/drift_detection.py`)

```python
from scipy.stats import ks_2samp
import numpy as np

class DriftDetector:
    def __init__(self, threshold=0.05):
        self.threshold = threshold  # p-value threshold
        self.reference_distribution = None
    
    def set_reference(self, data):
        """Set reference distribution from training data"""
        self.reference_distribution = data
    
    def detect_drift(self, new_data):
        """Detect if new data distribution differs significantly"""
        
        drifts = {}
        for column in new_data.columns:
            if column not in self.reference_distribution.columns:
                continue
            
            # Kolmogorov-Smirnov test
            statistic, p_value = ks_2samp(
                self.reference_distribution[column],
                new_data[column]
            )
            
            drifts[column] = {
                'statistic': statistic,
                'p_value': p_value,
                'has_drift': p_value < self.threshold
            }
        
        # Overall drift
        has_overall_drift = any(d['has_drift'] for d in drifts.values())
        
        return {
            'has_drift': has_overall_drift,
            'column_drifts': drifts,
            'trigger_retraining': has_overall_drift
        }
    
    def performance_drift(self, baseline_metrics, current_metrics, threshold=0.05):
        """Detect if model performance degraded"""
        
        degradation = {}
        for metric, baseline_value in baseline_metrics.items():
            current_value = current_metrics.get(metric)
            if current_value is None:
                continue
            
            delta = (baseline_value - current_value) / baseline_value
            degradation[metric] = {
                'baseline': baseline_value,
                'current': current_value,
                'percent_change': delta * 100,
                'significant': abs(delta) > threshold
            }
        
        return degradation
```

### Task 3: Retraining Pipeline (`src/retraining/pipeline.py`)

```python
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class RetrainingPipeline:
    def __init__(self, model_name, registry):
        self.model_name = model_name
        self.registry = registry
    
    def trigger_retraining(self, trigger_reason="scheduled"):
        """Execute retraining pipeline"""
        
        logger.info(f"Starting retraining for {self.model_name} - {trigger_reason}")
        
        with mlflow.start_run():
            # Log trigger reason
            mlflow.log_param("trigger_reason", trigger_reason)
            mlflow.log_param("timestamp", datetime.now().isoformat())
            
            # Step 1: Load fresh data
            logger.info("Loading training data...")
            X_train, y_train = self._load_training_data()
            
            # Step 2: Preprocess
            logger.info("Preprocessing data...")
            X_train_processed = self._preprocess(X_train)
            
            # Step 3: Train new model
            logger.info("Training model...")
            model = self._train_model(X_train_processed, y_train)
            
            # Step 4: Validate
            logger.info("Validating model...")
            X_val, y_val = self._load_validation_data()
            X_val_processed = self._preprocess(X_val)
            metrics = self._evaluate(model, X_val_processed, y_val)
            
            # Step 5: Log metrics
            for metric, value in metrics.items():
                mlflow.log_metric(metric, value)
            
            # Step 6: Log model
            mlflow.sklearn.log_model(model, "model")
            
            # Step 7: Get current production metrics
            prod_model = self.registry.get_production_model(self.model_name)
            if prod_model:
                prod_metrics = self._get_model_metrics(prod_model)
                
                # Compare with new model
                if metrics['accuracy'] > prod_metrics.get('accuracy', 0):
                    logger.info("New model is better! Promoting to production...")
                    
                    # Register new model
                    run_id = mlflow.active_run().info.run_id
                    registered = self.registry.register_model(
                        run_id,
                        self.model_name,
                        f"Auto-retrained - {trigger_reason}"
                    )
                    
                    # Promote to staging for testing
                    self.registry.promote_model(
                        self.model_name,
                        registered.version,
                        "Staging"
                    )
                else:
                    logger.warning("New model is not better. Keeping current production version.")
        
        return {"status": "success", "timestamp": datetime.now().isoformat()}
    
    def _load_training_data(self):
        """Load fresh training data"""
        # TODO: Implement data loading
        pass
    
    def _train_model(self, X, y):
        """Train model"""
        # TODO: Implement training
        pass
```

### Task 4: Performance Monitoring (`src/monitoring/performance.py`)

```python
from datetime import datetime
import pandas as pd
from sqlalchemy import create_engine

class PerformanceMonitor:
    def __init__(self, db_url):
        self.engine = create_engine(db_url)
    
    def log_prediction(self, prediction_id, features, prediction, actual=None):
        """Log each prediction for monitoring"""
        
        record = {
            'prediction_id': prediction_id,
            'timestamp': datetime.now(),
            'features_hash': hash(tuple(features)),
            'prediction': prediction,
            'actual': actual,
            'correct': prediction == actual if actual else None
        }
        
        df = pd.DataFrame([record])
        df.to_sql('predictions', self.engine, if_exists='append', index=False)
    
    def get_performance_metrics(self, hours=24):
        """Calculate performance metrics over time window"""
        
        query = f"""
        SELECT 
            DATE_TRUNC('hour', timestamp) as hour,
            COUNT(*) as total_predictions,
            SUM(CASE WHEN correct = true THEN 1 ELSE 0 END) as correct_predictions,
            AVG(CASE WHEN correct = true THEN 1 ELSE 0 END) as accuracy
        FROM predictions
        WHERE timestamp >= NOW() - INTERVAL '{hours} hours'
        GROUP BY hour
        ORDER BY hour DESC
        """
        
        df = pd.read_sql(query, self.engine)
        return df
    
    def get_latest_metrics(self):
        """Get current metrics snapshot"""
        query = """
        SELECT 
            COUNT(*) as total_predictions,
            SUM(CASE WHEN correct = true THEN 1 ELSE 0 END)::float / COUNT(*) as accuracy,
            MIN(timestamp) as earliest,
            MAX(timestamp) as latest
        FROM predictions
        WHERE timestamp >= NOW() - INTERVAL '1 day'
        """
        
        df = pd.read_sql(query, self.engine)
        return df.iloc[0].to_dict()
```

### Task 5: FastAPI Management Interface

```python
from fastapi import FastAPI, Depends
from pydantic import BaseModel
import logging

app = FastAPI(title="AI Deployment Platform")

registry = ModelRegistry()
drift_detector = DriftDetector()
retraining = RetrainingPipeline("credit_risk", registry)
monitor = PerformanceMonitor("postgresql://...")

class RetrainingRequest(BaseModel):
    model_name: str
    trigger_reason: str = "manual"

class ModelVersionInfo(BaseModel):
    name: str
    version: str
    stage: str
    description: str

@app.get("/models")
async def list_models():
    """List all registered models"""
    models = registry.list_models()
    return [{"name": m.name} for m in models]

@app.get("/models/{model_name}/versions")
async def get_model_versions(model_name: str):
    """Get all versions of a model"""
    versions = registry.get_model_history(model_name)
    return [
        {
            "version": v.version,
            "stage": v.current_stage,
            "created": v.creation_timestamp
        }
        for v in versions
    ]

@app.get("/models/{model_name}/production")
async def get_production_model(model_name: str):
    """Get current production model details"""
    model = registry.get_production_model(model_name)
    if not model:
        return {"error": "No production model found"}
    
    return {
        "version": model.version,
        "stage": model.current_stage,
        "description": model.description
    }

@app.post("/retrain")
async def trigger_retraining(request: RetrainingRequest):
    """Manually trigger model retraining"""
    result = retraining.trigger_retraining(request.trigger_reason)
    return result

@app.get("/metrics/performance")
async def get_performance_metrics(hours: int = 24):
    """Get performance metrics"""
    metrics = monitor.get_performance_metrics(hours)
    return metrics.to_dict()

@app.get("/drift/check")
async def check_data_drift():
    """Check for data drift"""
    # Load latest data
    new_data = pd.read_csv("latest_data.csv")
    drift_result = drift_detector.detect_drift(new_data)
    return drift_result

@app.get("/health")
async def health():
    return {"status": "healthy"}
```

---

## 📊 Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-platform
spec:
  replicas: 3
  template:
    spec:
      containers:
      - name: ml-platform
        image: ml-platform:latest
        env:
        - name: MLFLOW_TRACKING_URI
          value: "http://mlflow-service:5000"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: db-credentials
              key: url
        ports:
        - containerPort: 8000
---
apiVersion: v1
kind: Service
metadata:
  name: ml-platform-service
spec:
  selector:
    app: ml-platform
  ports:
  - port: 80
    targetPort: 8000
  type: LoadBalancer
```

---

## ✅ Submission Checklist

- [ ] MLflow tracking & registry functional
- [ ] Model versioning working
- [ ] Drift detection implemented
- [ ] Retraining pipeline automated
- [ ] Performance monitoring dashboard
- [ ] Database schema & queries working
- [ ] FastAPI management interface complete
- [ ] Docker image builds successfully
- [ ] Kubernetes manifests correct
- [ ] CI/CD pipeline executing
- [ ] Unit & integration tests passing
- [ ] Monitoring alerts operational

---

**Time Estimate:** 20-25 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Advanced)

**Next:** [Phase 6 Capstone: Multi-Agent Job Portal](../../Phase6_AgenticAI/Capstone_MultiAgentJobPortal/PROJECT.md)
