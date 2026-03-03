# Phase 3: Deep Learning - Learning Guide

**Duration:** 4 weeks | **Level:** Intermediate-Advanced | **Prerequisites:** Phase 2 complete

---

## 🎯 Phase Objectives

By the end of Phase 3, you'll master:

✅ Neural network fundamentals & backpropagation  
✅ TensorFlow & PyTorch frameworks  
✅ Convolutional Neural Networks (CNNs) for image tasks  
✅ Recurrent Neural Networks (RNNs) for sequences  
✅ LSTMs & GRUs for time series  
✅ Transfer learning & fine-tuning  
✅ GPU optimization & performance tuning  
✅ **Complete capstone: Medical image classification system**  

---

## 📘 Core Concepts

### Week 1: Neural Networks Fundamentals

#### 1.1 What is a Neural Network?
```
Input Layer → Hidden Layer 1 → Hidden Layer 2 → Output Layer
     (features)    (learning)        (learning)    (predictions)
```

**Backpropagation:** Automatic gradient computation to update weights

```python
import tensorflow as tf
from tensorflow import keras

# Simple neural network
model = keras.Sequential([
    keras.layers.Dense(128, activation='relu', input_shape=(784,)),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(64, activation='relu'),
    keras.layers.Dropout(0.2),
    keras.layers.Dense(10, activation='softmax')
])

# Compile (define optimizer, loss, metrics)
model.compile(
    optimizer='adam',
    loss='categorical_crossentropy',
    metrics=['accuracy']
)

# Train
history = model.fit(X_train, y_train, epochs=10, validation_split=0.2)
```

**Key Concepts:**
- **Activation Functions:** ReLU (hidden), Softmax (classification)
- **Loss Functions:** MSE (regression), Cross-entropy (classification)
- **Optimizers:** Adam, SGD, RMSprop
- **Epochs/Batch Size:** Training iterations

#### 1.2 TensorFlow vs PyTorch

**TensorFlow (Keras):**
- Higher-level API
- Easier for beginners
- Production-ready
```python
import tensorflow as tf
model = tf.keras.Sequential([...])
```

**PyTorch:**
- Lower-level control
- Research-friendly
- Dynamic computation graphs
```python
import torch
class MyNN(torch.nn.Module):
    def __init__(self):
        super().__init__()
        self.fc1 = torch.nn.Linear(784, 128)
    
    def forward(self, x):
        x = torch.relu(self.fc1(x))
        return x
```

---

### Week 2: Convolutional Neural Networks (CNNs)

**Use Case:** Image classification, object detection, medical imaging

**Architecture:**
```
Input → Conv → ReLU → Pool → Conv → ReLU → Pool → Flatten → Dense → Output
```

```python
import tensorflow as tf

# CNN for image classification
cnn = tf.keras.Sequential([
    # First convolutional block
    tf.keras.layers.Conv2D(32, (3, 3), activation='relu', 
                          input_shape=(28, 28, 1)),
    tf.keras.layers.MaxPooling2D((2, 2)),
    
    # Second convolutional block
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    tf.keras.layers.MaxPooling2D((2, 2)),
    
    # Third convolutional block
    tf.keras.layers.Conv2D(64, (3, 3), activation='relu'),
    
    # Flatten & dense layers
    tf.keras.layers.Flatten(),
    tf.keras.layers.Dense(64, activation='relu'),
    tf.keras.layers.Dropout(0.5),
    tf.keras.layers.Dense(10, activation='softmax')
])

# Compile & train
cnn.compile(
    optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy']
)

history = cnn.fit(X_train, y_train, epochs=10, validation_data=(X_val, y_val))
```

**Key CNN Components:**
- **Conv2D:** Extracts local spatial features
- **MaxPooling:** Reduces dimensions, keeps important features
- **Dropout:** Prevents overfitting
- **Flatten:** Converts 2D to 1D for dense layers

---

### Week 3: Advanced Architectures (RNN, LSTM, GRU)

**RNN (Recurrent Neural Network):**
```
Input ← → Hidden ← → Output
  ↑         ↑
  └─────────┘ (recurrent connection)
```

Use for: Sequences, time series, text

```python
# Simple RNN
rnn = tf.keras.Sequential([
    tf.keras.layers.Embedding(vocab_size, 64),
    tf.keras.layers.SimpleRNN(32, return_sequences=True),
    tf.keras.layers.SimpleRNN(32),
    tf.keras.layers.Dense(1, activation='sigmoid')
])
```

**LSTM (Long Short-Term Memory):**
```
Input → [Forget Gate] → [Input Gate] → [Output Gate] → Output
        (what to forget)  (what to add)  (what to output)
```

Solves vanishing gradient problem

```python
# LSTM for time series
lstm = tf.keras.Sequential([
    tf.keras.layers.LSTM(50, input_shape=(timesteps, features), 
                        return_sequences=True),
    tf.keras.layers.LSTM(50),
    tf.keras.layers.Dense(1)
])

# For bidirectional context
lstm = tf.keras.Sequential([
    tf.keras.layers.Bidirectional(
        tf.keras.layers.LSTM(50, return_sequences=True)
    ),
    tf.keras.layers.LSTM(50),
    tf.keras.layers.Dense(1)
])
```

---

### Week 4: Transfer Learning & Optimization

#### 4.1 Transfer Learning
**Concept:** Use pre-trained models, fine-tune for your data

```python
from tensorflow.keras.applications import ResNet50, preprocess_input
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D

# Load pre-trained ResNet50
base_model = ResNet50(
    weights='imagenet',
    include_top=False,
    input_shape=(224, 224, 3)
)

# Freeze base model weights
base_model.trainable = False

# Add custom layers
model = tf.keras.Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(256, activation='relu'),
    Dense(num_classes, activation='softmax')
])

# Train only new layers
model.fit(X_train, y_train, epochs=5)

# Fine-tune: unfreeze some base layers
for layer in base_model.layers[-20:]:
    layer.trainable = True

model.fit(X_train, y_train, epochs=10, learning_rate=1e-5)
```

**Why Transfer Learning?**
- Pre-trained on millions of images
- Fast training (fewer epochs)
- Better performance with small datasets
- Lower computational cost

#### 4.2 GPU Acceleration
```python
# Check GPU availability
print("GPU Available:", tf.test.is_built_with_cuda())
print("GPUs:", tf.config.list_physical_devices('GPU'))

# Automatic GPU usage
with tf.device('/GPU:0'):
    model.fit(X_train, y_train)  # Runs on GPU
```

#### 4.3 Data Augmentation
```python
from tensorflow.keras.preprocessing.image import ImageDataGenerator

augmenter = ImageDataGenerator(
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    horizontal_flip=True,
    zoom_range=0.2,
    fill_mode='nearest'
)

# Train with augmented data
augmenter.fit(X_train)
model.fit(augmenter.flow(X_train, y_train, batch_size=32), epochs=10)
```

---

## 💡 Key Deep Learning Principles

1. **Start simple:** Use pre-trained models before building from scratch
2. **Data quality > Model complexity:** 10K clean images > 1M noisy images
3. **Validation set is critical:** Monitor for overfitting
4. **Learning rate matters:** Too high = divergence, too low = slow
5. **Use callbacks:** Early stopping, reduced LR, checkpoints

```python
# Essential callbacks
callbacks = [
    tf.keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=3,
        restore_best_weights=True
    ),
    tf.keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=2,
        min_lr=1e-7
    ),
    tf.keras.callbacks.ModelCheckpoint(
        'best_model.h5',
        save_best_only=True
    )
]

model.fit(X_train, y_train, callbacks=callbacks)
```

---

## ✅ Phase 3 Checklist

- [ ] Built feedforward neural networks
- [ ] Trained models with TensorFlow/Keras
- [ ] Implemented CNNs for image tasks
- [ ] Used transfer learning with pre-trained models
- [ ] Built RNNs/LSTMs for sequences
- [ ] Applied data augmentation
- [ ] Used GPU for training
- [ ] Implemented early stopping
- [ ] Evaluated models with appropriate metrics
- [ ] Saved/loaded trained models
- [ ] Completed Phase 3 Capstone Project

---

## 🎯 Capstone Project: Medical Image Classification

→ [View Full Capstone](Capstone_MedicalImageClassification/PROJECT.md)

**Build:** CNN-based pneumonia detection from X-ray images  
**Features:** GPU training, transfer learning, inference API  
**Skills:** Deep learning workflow, medical AI applications  

---

**Next Phase:** [Phase 4: NLP & LLMs](../Phase4_NLP_LLMs/LEARNING_GUIDE.md)
