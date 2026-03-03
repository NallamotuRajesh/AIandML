# Phase 2: Core Machine Learning - Learning Guide

**Duration:** 4 weeks | **Level:** Intermediate | **Prerequisites:** Phase 1 complete

---

## 🎯 Phase Objectives

By the end of Phase 2, you'll understand and implement:

✅ Supervised learning (regression & classification)  
✅ Unsupervised learning (clustering & dimensionality reduction)  
✅ Model evaluation metrics & cross-validation  
✅ Hyperparameter tuning & grid search  
✅ Feature scaling & preprocessing  
✅ Production model pipelines  
✅ **Complete capstone: Production credit risk classifier**  

---

## 📘 Core Concepts

### Week 1: Supervised Learning Fundamentals

#### 1.1 Linear Regression
**Use Case:** Predict continuous values (prices, salaries, temperature)

```python
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
predictions = model.predict(X_test)

# Evaluate
mse = mean_squared_error(y_test, predictions)
r2 = r2_score(y_test, predictions)

print(f"R² Score: {r2:.4f}")
print(f"RMSE: {np.sqrt(mse):.4f}")
```

**Key Concepts:**
- **Coefficients:** Feature importance weights
- **Intercept:** Baseline prediction
- **R² Score:** How well model fits (0-1)
- **Residuals:** Prediction errors

#### 1.2 Logistic Regression
**Use Case:** Binary classification (yes/no, fraud/not fraud)

```python
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score, 
    f1_score, confusion_matrix
)

# Train
model = LogisticRegression(max_iter=1000)
model.fit(X_train, y_train)

# Predict
y_pred = model.predict(X_test)

# Evaluate
print(f"Accuracy:  {accuracy_score(y_test, y_pred):.4f}")
print(f"Precision: {precision_score(y_test, y_pred):.4f}")
print(f"Recall:    {recall_score(y_test, y_pred):.4f}")
print(f"F1 Score:  {f1_score(y_test, y_pred):.4f}")

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)
# [[TN, FP],
#  [FN, TP]]
```

**Classification Metrics:**
- **Accuracy:** (TP+TN)/(Total) - Overall correctness
- **Precision:** TP/(TP+FP) - How many predicted positive are actually positive
- **Recall:** TP/(TP+FN) - How many actual positives we found
- **F1 Score:** Harmonic mean of precision & recall

---

### Week 2: Decision Trees & Ensemble Methods

#### 2.1 Decision Trees
**Concept:** Build tree-like model by recursively splitting data

```python
from sklearn.tree import DecisionTreeClassifier, plot_tree
import matplotlib.pyplot as plt

# Create decision tree
dt = DecisionTreeClassifier(max_depth=5, random_state=42)
dt.fit(X_train, y_train)

# Feature importance
importances = dt.feature_importances_
feature_names = X.columns
importance_df = pd.DataFrame({
    'feature': feature_names,
    'importance': importances
}).sort_values('importance', ascending=False)

# Visualize tree
plt.figure(figsize=(20, 10))
plot_tree(dt, feature_names=feature_names, class_names=['No', 'Yes'])
plt.show()
```

**Advantages:**
- Easy to interpret
- Handles non-linear relationships
- Requires minimal preprocessing

**Disadvantages:**
- Prone to overfitting
- Sensitive to small data changes
- Solution: Use ensemble methods!

#### 2.2 Random Forest
**Concept:** Ensemble of many decision trees (wisdom of crowds)

```python
from sklearn.ensemble import RandomForestClassifier

# Create random forest (100 trees)
rf = RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
rf.fit(X_train, y_train)

# Predictions
y_pred = rf.predict(X_test)

# Feature importance (averaged across trees)
importances = rf.feature_importances_

# More robust than single decision tree!
```

**Why Random Forest Works:**
1. **Bagging:** Each tree trains on random subset of data
2. **Random Features:** Each split considers random subset of features
3. **Ensemble:** Average predictions from all trees
4. **Result:** Much lower variance/overfitting!

#### 2.3 XGBoost
**Concept:** Gradient boosting - build trees sequentially, each correcting previous

```python
from xgboost import XGBClassifier

# Create XGBoost model
xgb = XGBClassifier(
    n_estimators=100,
    max_depth=5,
    learning_rate=0.1,
    subsample=0.8,
    colsample_bytree=0.8,
    random_state=42
)

xgb.fit(X_train, y_train)
y_pred = xgb.predict(X_test)
```

**When to Use:**
- **Linear Regression:** Simple relationships
- **Decision Trees:** Non-linear, interpretability needed
- **Random Forest:** General purpose, ensemble robustness
- **XGBoost:** Kaggle competitions, maximum accuracy needed

---

### Week 3: Model Evaluation & Validation

#### 3.1 Cross-Validation
**Problem:** Single train/test split = high variance  
**Solution:** Test on multiple random splits

```python
from sklearn.model_selection import cross_val_score, KFold

# 5-fold cross validation
kfold = KFold(n_splits=5, shuffle=True, random_state=42)
scores = cross_val_score(model, X, y, cv=kfold, scoring='roc_auc')

print(f"CV Scores: {scores}")
print(f"Mean: {scores.mean():.4f}, Std: {scores.std():.4f}")
```

#### 3.2 ROC-AUC Curve
**Use Case:** Evaluate classification across all thresholds

```python
from sklearn.metrics import roc_curve, auc
import matplotlib.pyplot as plt

# Get predicted probabilities
y_proba = model.predict_proba(X_test)[:, 1]

# Calculate ROC curve
fpr, tpr, thresholds = roc_curve(y_test, y_proba)
roc_auc = auc(fpr, tpr)

# Plot
plt.figure(figsize=(8, 6))
plt.plot(fpr, tpr, label=f'ROC (AUC={roc_auc:.3f})')
plt.plot([0, 1], [0, 1], 'k--', label='Random Classifier')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.legend()
plt.show()
```

**AUC Interpretation:**
- 0.5 = Random guessing
- 0.7 = Decent model
- 0.8 = Good model
- 0.9+ = Excellent model

#### 3.3 Confusion Matrix & ROC
```python
from sklearn.metrics import confusion_matrix
import seaborn as sns

# Confusion matrix
cm = confusion_matrix(y_test, y_pred)

# Visualize
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.title('Confusion Matrix')
plt.show()
```

---

### Week 4: Feature Engineering & Hyperparameter Tuning

#### 4.1 Feature Scaling
**Why:** Some algorithms (KNN, SVM) sensitive to feature scale

```python
from sklearn.preprocessing import StandardScaler, MinMaxScaler

# StandardScaler: mean=0, std=1
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X_train)

# Then transform test set with same scaler
X_test_scaled = scaler.transform(X_test)

# Avoid data leakage: NEVER fit on test set!
```

#### 4.2 Hyperparameter Tuning

**Grid Search:** Try all combinations
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
    scoring='roc_auc',
    n_jobs=-1  # Use all CPU cores
)

grid_search.fit(X_train, y_train)
print(f"Best params: {grid_search.best_params_}")
print(f"Best score: {grid_search.best_score_:.4f}")
```

**Random Search:** Faster for large parameter spaces
```python
from sklearn.model_selection import RandomizedSearchCV

random_search = RandomizedSearchCV(
    RandomForestClassifier(),
    param_grid,
    n_iter=20,  # Try 20 random combinations
    cv=5,
    random_state=42,
    n_jobs=-1
)
```

#### 4.3 Feature Engineering
```python
# Polynomial features
from sklearn.preprocessing import PolynomialFeatures

poly = PolynomialFeatures(degree=2)
X_poly = poly.fit_transform(X)

# Dimensionality reduction
from sklearn.decomposition import PCA

pca = PCA(n_components=10)
X_reduced = pca.fit_transform(X)

# Feature selection
from sklearn.feature_selection import SelectKBest, f_classif

selector = SelectKBest(f_classif, k=20)
X_selected = selector.fit_transform(X, y)
```

---

## 📊 Unsupervised Learning

### K-Means Clustering
```python
from sklearn.cluster import KMeans

# Find optimal k using elbow method
inertias = []
for k in range(1, 11):
    kmeans = KMeans(n_clusters=k, random_state=42)
    kmeans.fit(X)
    inertias.append(kmeans.inertia_)

plt.plot(range(1, 11), inertias, 'bo-')
plt.xlabel('Number of Clusters')
plt.ylabel('Inertia')
plt.show()

# Use optimal k
kmeans = KMeans(n_clusters=3, random_state=42)
labels = kmeans.fit_predict(X)
```

### PCA (Principal Component Analysis)
```python
from sklearn.decomposition import PCA

pca = PCA(n_components=2)
X_reduced = pca.fit_transform(X)

# Explained variance
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")
print(f"Cumulative variance: {np.cumsum(pca.explained_variance_ratio_)}")
```

---

## ✅ Phase 2 Checklist

- [ ] Trained linear & logistic regression models
- [ ] Built decision trees with visualization
- [ ] Compared Random Forest vs single tree
- [ ] Implemented XGBoost for better accuracy
- [ ] Used cross-validation for robust evaluation
- [ ] Plotted ROC curves and calculated AUC
- [ ] Scaled features appropriately
- [ ] Tuned hyperparameters with GridSearchCV
- [ ] Performed feature selection
- [ ] Clustered data with K-Means
- [ ] Completed Phase 2 Capstone Project

---

## 🎯 Capstone Project: Credit Risk Prediction System

→ [View Full Capstone](Capstone_CreditRisk/PROJECT.md)

**Build:** Production-ready loan approval classifier  
**Features:** Data pipeline, feature engineering, model comparison, API  
**Skills:** ML workflow, evaluation metrics, deployment  

---

**Next Phase:** [Phase 3: Deep Learning](../Phase3_DeepLearning/LEARNING_GUIDE.md)
