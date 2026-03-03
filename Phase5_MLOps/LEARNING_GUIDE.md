# Phase 5: MLOps & Production AI - Learning Guide

**Duration:** 3 weeks | **Level:** Advanced | **Prerequisites:** Phase 4 complete

---

## 🎯 Phase Objectives

By the end of Phase 5, you'll master:

✅ Docker containerization  
✅ Kubernetes orchestration  
✅ CI/CD pipelines for ML  
✅ Model versioning & registry  
✅ Monitoring & alerting  
✅ Data drift detection  
✅ Cloud deployment (Azure ML, AWS SageMaker)  
✅ **Complete capstone: Scalable AI deployment platform**  

---

## 📘 Core Concepts

### Week 1: Docker & Containerization

#### 1.1 Docker Fundamentals
**Problem:** "Works on my machine" syndrome  
**Solution:** Containerize everything

```dockerfile
FROM python:3.10-slim

WORKDIR /app

# Copy requirements
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy code
COPY src/ ./src/
COPY models/ ./models/

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD python -c "import requests; requests.get('http://localhost:8000/health')"

# Run command
CMD ["uvicorn", "src.api:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Build & Run:**
```bash
# Build image
docker build -t my-ml-app:v1.0 .

# Run container
docker run -p 8000:8000 my-ml-app:v1.0

# Push to registry
docker tag my-ml-app:v1.0 myregistry.azurecr.io/my-ml-app:v1.0
docker push myregistry.azurecr.io/my-ml-app:v1.0
```

#### 1.2 Docker Compose
**Run multi-container applications**

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    environment:
      - MODEL_PATH=/models/model.pkl
    volumes:
      - ./models:/models
    depends_on:
      - db
  
  db:
    image: postgres:14
    environment:
      - POSTGRES_PASSWORD=password
    volumes:
      - pgdata:/var/lib/postgresql/data

volumes:
  pgdata:
```

**Run all services:**
```bash
docker-compose up
```

---

### Week 2: Kubernetes & Orchestration

**Use When:** Deploying to production at scale

#### 2.1 Kubernetes Basics
```yaml
# Deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ml-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: ml-api
  template:
    metadata:
      labels:
        app: ml-api
    spec:
      containers:
      - name: ml-api
        image: myregistry.azurecr.io/ml-app:v1.0
        ports:
        - containerPort: 8000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

**Deployment:**
```bash
# Apply configuration
kubectl apply -f deployment.yaml

# Check status
kubectl get pods

# View logs
kubectl logs pod-name

# Scale up
kubectl scale deployment ml-api --replicas=5
```

---

### Week 3: Model Versioning & MLflow

#### 3.1 MLflow Tracking
**Track experiments, parameters, metrics**

```python
import mlflow
from sklearn.ensemble import RandomForestClassifier

# Start MLflow run
with mlflow.start_run():
    # Log parameters
    mlflow.log_param("n_estimators", 100)
    mlflow.log_param("max_depth", 10)
    
    # Train model
    model = RandomForestClassifier(n_estimators=100, max_depth=10)
    model.fit(X_train, y_train)
    
    # Log metrics
    accuracy = model.score(X_test, y_test)
    mlflow.log_metric("accuracy", accuracy)
    
    # Log model
    mlflow.sklearn.log_model(model, "model")
    
    # Log artifacts
    mlflow.log_artifact("confusion_matrix.png")
```

**View Results:**
```bash
mlflow ui
# Open: http://localhost:5000
```

#### 3.2 Model Registry
```python
# Register model
model_uri = "runs:/abc123/model"
mlflow.register_model(model_uri, "credit_risk_model")

# Transition to production
client = mlflow.tracking.MlflowClient()
client.transition_model_version_stage(
    name="credit_risk_model",
    version=1,
    stage="Production"
)

# Load production model
production_model = mlflow.pyfunc.load_model(
    "models:/credit_risk_model/production"
)
```

---

## 📊 CI/CD Pipeline Example

### GitHub Actions
```yaml
name: ML Pipeline

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: 3.10
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install pytest
      
      - name: Run tests
        run: pytest tests/
      
      - name: Build Docker image
        run: docker build -t ml-app:latest .
      
      - name: Push to registry
        run: |
          docker login -u ${{ secrets.REGISTRY_USER }} -p ${{ secrets.REGISTRY_PASS }}
          docker push ml-app:latest
```

---

## 🎯 Capstone Project: AI Deployment Platform

→ [View Full Capstone](Capstone_AIDeploymentPlatform/PROJECT.md)

**Build:** End-to-end ML deployment system with monitoring  
**Features:** Model registry, auto-retraining, dashboards  
**Skills:** MLOps architecture, production deployment  

---

**Next Phase:** [Phase 6: Agentic AI Systems](../Phase6_AgenticAI/LEARNING_GUIDE.md)
