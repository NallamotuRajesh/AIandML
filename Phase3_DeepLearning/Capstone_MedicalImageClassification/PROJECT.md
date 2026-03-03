# Capstone Project #3: Medical Image Classification System

**Phase:** 3 (Deep Learning) | **Duration:** 4 weeks | **Difficulty:** Intermediate-Advanced

---

## 📋 Project Overview

Build a **production-ready CNN system** that automatically detects pneumonia in chest X-ray images. This is a real-world deep learning application used in healthcare.

### 🏥 Medical Context

- **Dataset:** Kaggle Pneumonia X-ray Dataset (~5,000 images)
- **Classes:** Normal vs Pneumonia (binary classification)
- **Challenge:** Achieve >95% accuracy for clinical deployment
- **Impact:** Assist radiologists in early diagnosis

### 💼 What You'll Learn

✅ CNN architecture design & implementation  
✅ Transfer learning with ResNet50/MobileNet  
✅ GPU-accelerated training  
✅ Data augmentation for medical imaging  
✅ Model evaluation for healthcare (sensitivity/specificity)  
✅ Inference API for end-to-end deployment  
✅ Medical AI best practices  

---

## 📊 Project Structure

```
Capstone_MedicalImageClassification/
├── PROJECT.md (this file)
├── requirements.txt
├── data/
│   ├── raw/
│   │   ├── train/
│   │   │   ├── NORMAL/
│   │   │   └── PNEUMONIA/
│   │   ├── val/
│   │   └── test/
│   └── processed/
├── notebooks/
│   ├── 01_data_exploration.ipynb
│   ├── 02_model_training.ipynb
│   └── 03_evaluation.ipynb
├── src/
│   ├── __init__.py
│   ├── data_loader.py      # Load & augment images
│   ├── model.py            # CNN architecture
│   ├── train.py            # Training pipeline
│   ├── evaluate.py         # Performance evaluation
│   └── inference.py        # Prediction API
├── models/
│   ├── pneumonia_classifier.h5
│   └── training_history.json
├── results/
│   ├── confusion_matrix.png
│   ├── roc_curve.png
│   └── predictions.csv
├── docker/
│   └── Dockerfile
└── README.md
```

---

## 🔧 Implementation Tasks

### Task 1: Data Loading & Augmentation (`src/data_loader.py`)

```python
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator

class MedicalImageLoader:
    def __init__(self, image_size=(224, 224)):
        self.image_size = image_size
        
    def create_train_generator(self, train_dir):
        """Load and augment training images"""
        train_aug = ImageDataGenerator(
            rescale=1/255.0,
            rotation_range=20,
            width_shift_range=0.2,
            height_shift_range=0.2,
            horizontal_flip=True,
            zoom_range=0.2,
            shear_range=0.2,
            fill_mode='nearest'
        )
        
        train_gen = train_aug.flow_from_directory(
            train_dir,
            target_size=self.image_size,
            batch_size=32,
            class_mode='binary'  # Normal vs Pneumonia
        )
        
        return train_gen
    
    def create_val_generator(self, val_dir):
        """Load validation images without augmentation"""
        val_aug = ImageDataGenerator(rescale=1/255.0)
        
        val_gen = val_aug.flow_from_directory(
            val_dir,
            target_size=self.image_size,
            batch_size=32,
            class_mode='binary'
        )
        
        return val_gen
```

**Requirements:**
- Load images from folder structure
- Normalize pixel values (0-1)
- Apply data augmentation to training set
- No augmentation for validation/test

### Task 2: Model Architecture (`src/model.py`)

```python
import tensorflow as tf
from tensorflow.keras import layers, models

def build_cnn_from_scratch():
    """Build custom CNN"""
    model = models.Sequential([
        # Block 1
        layers.Conv2D(32, (3, 3), activation='relu', 
                     input_shape=(224, 224, 3)),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Block 2
        layers.Conv2D(64, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Block 3
        layers.Conv2D(128, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Block 4
        layers.Conv2D(256, (3, 3), activation='relu'),
        layers.BatchNormalization(),
        layers.MaxPooling2D((2, 2)),
        
        # Dense layers
        layers.Flatten(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(128, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')  # Binary classification
    ])
    
    return model

def build_transfer_learning_model():
    """Build ResNet50 + custom layers"""
    from tensorflow.keras.applications import ResNet50
    
    # Load pre-trained ResNet50
    base_model = ResNet50(
        weights='imagenet',
        include_top=False,
        input_shape=(224, 224, 3)
    )
    
    # Freeze base model
    base_model.trainable = False
    
    # Add custom layers
    model = models.Sequential([
        base_model,
        layers.GlobalAveragePooling2D(),
        layers.Dense(512, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(256, activation='relu'),
        layers.Dropout(0.5),
        layers.Dense(1, activation='sigmoid')
    ])
    
    return model, base_model
```

**Model Options:**
- Custom CNN from scratch (educational)
- Transfer learning (better accuracy, faster)
- Ensemble of both

### Task 3: Training Pipeline (`src/train.py`)

```python
import tensorflow as tf
import json

class ModelTrainer:
    def __init__(self, model):
        self.model = model
        self.history = None
        
    def compile_model(self, learning_rate=1e-4):
        """Compile with optimizer, loss, metrics"""
        optimizer = tf.keras.optimizers.Adam(learning_rate=learning_rate)
        
        self.model.compile(
            optimizer=optimizer,
            loss='binary_crossentropy',  # For binary classification
            metrics=[
                tf.keras.metrics.BinaryAccuracy(),
                tf.keras.metrics.Precision(),
                tf.keras.metrics.Recall(),
                tf.keras.metrics.AUC()
            ]
        )
    
    def train(self, train_gen, val_gen, epochs=20):
        """Train model with callbacks"""
        
        callbacks = [
            tf.keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=5,
                restore_best_weights=True,
                verbose=1
            ),
            tf.keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=3,
                min_lr=1e-7,
                verbose=1
            ),
            tf.keras.callbacks.ModelCheckpoint(
                'best_model.h5',
                monitor='val_auc',
                save_best_only=True,
                verbose=1
            ),
            tf.keras.callbacks.TensorBoard(
                log_dir='./logs'
            )
        ]
        
        self.history = self.model.fit(
            train_gen,
            validation_data=val_gen,
            epochs=epochs,
            callbacks=callbacks,
            verbose=1
        )
        
        return self.history
    
    def save_model(self, filepath):
        """Save trained model"""
        self.model.save(filepath)
        
        # Save training history
        history_dict = {
            k: [float(v) for v in vals] 
            for k, vals in self.history.history.items()
        }
        with open('training_history.json', 'w') as f:
            json.dump(history_dict, f)
```

### Task 4: Model Evaluation (`src/evaluate.py`)

```python
from sklearn.metrics import (
    confusion_matrix, classification_report, roc_curve, auc
)
import matplotlib.pyplot as plt
import numpy as np

class ModelEvaluator:
    def __init__(self, model):
        self.model = model
    
    def evaluate_on_test_set(self, test_gen):
        """Evaluate on test data"""
        results = self.model.evaluate(test_gen)
        metrics = {
            'loss': results[0],
            'accuracy': results[1],
            'precision': results[2],
            'recall': results[3],
            'auc': results[4]
        }
        return metrics
    
    def get_predictions(self, test_gen):
        """Get predictions on test set"""
        y_true = []
        y_pred_proba = []
        
        for images, labels in test_gen:
            y_true.extend(labels)
            y_pred_proba.extend(self.model.predict(images))
        
        y_true = np.array(y_true)
        y_pred_proba = np.array(y_pred_proba).flatten()
        y_pred = (y_pred_proba > 0.5).astype(int)
        
        return y_true, y_pred, y_pred_proba
    
    def plot_confusion_matrix(self, y_true, y_pred):
        """Plot confusion matrix"""
        cm = confusion_matrix(y_true, y_pred)
        
        plt.figure(figsize=(8, 6))
        plt.imshow(cm, cmap='Blues')
        plt.colorbar()
        plt.xlabel('Predicted')
        plt.ylabel('Actual')
        
        # Add text
        for i in range(2):
            for j in range(2):
                plt.text(j, i, str(cm[i, j]), ha='center', va='center')
        
        plt.title('Confusion Matrix')
        plt.xticks([0, 1], ['Normal', 'Pneumonia'])
        plt.yticks([0, 1], ['Normal', 'Pneumonia'])
        plt.tight_layout()
        plt.savefig('confusion_matrix.png')
        plt.show()
    
    def plot_roc_curve(self, y_true, y_pred_proba):
        """Plot ROC curve"""
        fpr, tpr, _ = roc_curve(y_true, y_pred_proba)
        roc_auc = auc(fpr, tpr)
        
        plt.figure(figsize=(8, 6))
        plt.plot(fpr, tpr, label=f'ROC (AUC={roc_auc:.3f})')
        plt.plot([0, 1], [0, 1], 'k--', label='Random')
        plt.xlabel('False Positive Rate')
        plt.ylabel('True Positive Rate')
        plt.legend()
        plt.title('ROC Curve')
        plt.tight_layout()
        plt.savefig('roc_curve.png')
        plt.show()
```

### Task 5: Inference API (`src/inference.py`)

```python
from fastapi import FastAPI, File, UploadFile
from PIL import Image
import numpy as np
import tensorflow as tf

app = FastAPI(title="Pneumonia Detection API")

# Load trained model
model = tf.keras.models.load_model('models/pneumonia_classifier.h5')

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    """Predict if X-ray shows pneumonia"""
    
    # Read image
    image = Image.open(file.file).resize((224, 224))
    image_array = np.array(image) / 255.0
    image_array = np.expand_dims(image_array, axis=0)
    
    # Predict
    prediction = model.predict(image_array)[0][0]
    
    diagnosis = "Pneumonia" if prediction > 0.5 else "Normal"
    confidence = prediction if prediction > 0.5 else (1 - prediction)
    
    return {
        "diagnosis": diagnosis,
        "confidence": float(confidence),
        "probability_pneumonia": float(prediction)
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

---

## 📊 Expected Performance

### Target Metrics:
- **Accuracy:** >95%
- **Sensitivity (Recall):** >96% (critical for disease detection)
- **Specificity:** >93% (avoid false alarms)
- **AUC-ROC:** >0.98

### Sample Results:
```
Confusion Matrix:
               Predicted Normal  Predicted Pneumonia
Actual Normal       [347]              [3]
Actual Pneumonia    [5]                [395]

Accuracy:   98.5%
Sensitivity: 98.8% (catches pneumonia cases)
Specificity: 99.1% (avoids false alarms)
```

---

## 🧪 Testing

```python
import unittest

class TestMedicalModel(unittest.TestCase):
    def test_model_output_shape(self):
        """Test model output shape"""
        X = np.random.randn(10, 224, 224, 3)
        predictions = model.predict(X)
        self.assertEqual(predictions.shape, (10, 1))
    
    def test_predictions_in_range(self):
        """Test predictions are between 0 and 1"""
        X = np.random.randn(10, 224, 224, 3)
        predictions = model.predict(X)
        self.assertTrue(np.all(predictions >= 0))
        self.assertTrue(np.all(predictions <= 1))
```

---

## 🚀 Extensions

### Extension 1: Grad-CAM Visualization
```python
import tensorflow as tf

def visualize_activation(model, image, predicted_class):
    """Show which regions model focused on"""
    # Implementation of Grad-CAM
    pass
```

### Extension 2: Multi-Class Classification
```python
# Extend to multiple diseases: Normal, Pneumonia, COVID, TB
layers.Dense(4, activation='softmax')  # 4 classes
```

### Extension 3: Uncertainty Quantification
```python
# Use dropout at inference for uncertainty
def predict_with_uncertainty(image, n_iterations=20):
    predictions = [model(image, training=True) for _ in range(n_iterations)]
    mean = np.mean(predictions)
    std = np.std(predictions)
    return mean, std
```

---

## ✅ Submission Checklist

- [ ] Dataset downloaded and organized
- [ ] Data augmentation pipeline working
- [ ] CNN model implemented and training
- [ ] Transfer learning model trained
- [ ] Evaluation metrics calculated
- [ ] Confusion matrix and ROC plotted
- [ ] Inference API implemented
- [ ] Model saved successfully
- [ ] Tests passing
- [ ] Docker image builds
- [ ] Performance meets clinical standards
- [ ] GitHub repo public with documentation

---

**Time Estimate:** 20-30 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Advanced)

**Next:** [Phase 4 Capstone: Enterprise RAG Chatbot](../../Phase4_NLP_LLMs/Capstone_EnterpriseRAGChatbot/PROJECT.md)
