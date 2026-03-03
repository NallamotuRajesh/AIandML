# Phase 1: Python for AI - Learning Guide

**Duration:** 2-3 weeks | **Level:** Beginner | **Prerequisites:** Basic programming knowledge

## 🎯 Phase Objectives

By the end of Phase 1, you'll be able to:

✅ Write clean, Pythonic code with OOP principles  
✅ Manipulate and clean data using Pandas  
✅ Perform numerical computations with NumPy  
✅ Create professional data visualizations  
✅ Work with Jupyter notebooks effectively  
✅ Manage project dependencies with virtual environments  
✅ **Complete capstone: Build production-ready analytics engine**  

---

## 📘 Core Concepts

### Week 1: Python Fundamentals & Setup

#### 1.1 Python Basics
- **Variables & Data Types:** int, float, str, bool, list, dict, tuple, set
- **Control Flow:** if/else, loops (for, while), comprehensions
- **Functions:** def, parameters, return values, *args, **kwargs
- **Exception Handling:** try/except/finally blocks
- **File I/O:** Reading/writing CSV, JSON, text files

**Key Learning:**
```python
# List comprehension - efficient iteration
data = [x**2 for x in range(10) if x % 2 == 0]

# Dictionary unpacking
def process(**kwargs):
    return {k: v*2 for k, v in kwargs.items()}

# Context managers for file handling
with open('data.csv', 'r') as f:
    content = f.read()
```

#### 1.2 Object-Oriented Programming (OOP)
- **Classes & Objects:** __init__, self, instance variables
- **Inheritance:** Parent/child classes, super()
- **Encapsulation:** Private variables (_var), properties
- **Polymorphism:** Method overriding, duck typing
- **Built-in Methods:** __str__, __repr__, __eq__, __len__

**Key Concept - Data Class Example:**
```python
from dataclasses import dataclass

@dataclass
class Student:
    name: str
    gpa: float
    courses: list
    
    def avg_grade(self) -> float:
        return sum(self.courses) / len(self.courses)
```

#### 1.3 Virtual Environments & Packages
- **venv:** Create isolated Python environments
- **pip:** Install/manage packages
- **requirements.txt:** Dependency management
- **pip freeze:** Export dependencies

**Setup Commands:**
```bash
python -m venv venv
source venv/bin/activate

# Create requirements.txt with pinned versions
pip freeze > requirements.txt

# Install from requirements
pip install -r requirements.txt
```

---

### Week 2: NumPy & Pandas

#### 2.1 NumPy (Numerical Python)
**Purpose:** Fast numerical computations on arrays/matrices

**Core Concepts:**
- **ndarrays:** N-dimensional arrays (foundation of data science)
- **Vectorization:** Operations on entire arrays without loops
- **Broadcasting:** Automatic shape adjustment for operations
- **Indexing/Slicing:** Efficient element access
- **Functions:** sum, mean, std, unique, sorting

**Key Operations:**
```python
import numpy as np

# Create arrays
arr = np.array([1, 2, 3, 4, 5])
matrix = np.zeros((3, 4))
range_arr = np.arange(0, 10, 2)
random_arr = np.random.randn(5, 5)

# Vectorized operations (fast!)
result = arr * 2 + 5  # Element-wise operations

# Statistical operations
mean = np.mean(arr)
std = np.std(arr)

# Matrix operations
dot_product = np.dot(matrix1, matrix2)
inverse = np.linalg.inv(matrix)
```

**Why NumPy?**
- 10-100x faster than Python lists
- Less memory overhead
- Foundation for Pandas, scikit-learn, TensorFlow

#### 2.2 Pandas (Data Manipulation)
**Purpose:** Data cleaning, transformation, and analysis

**Core Components:**
- **Series:** 1D labeled array
- **DataFrame:** 2D labeled table (most common)
- **Index:** Row/column labels
- **Data Types:** Automatic type inference

**Essential Operations:**
```python
import pandas as pd

# Load data
df = pd.read_csv('data.csv')
df = pd.read_excel('file.xlsx')
df = pd.read_json('data.json')

# Exploration
df.head()              # First 5 rows
df.info()              # Data types & missing values
df.describe()          # Statistical summary
df.shape               # (rows, columns)
df.columns             # Column names

# Data cleaning
df.dropna()            # Remove missing values
df.fillna(0)           # Fill missing with value
df.drop_duplicates()   # Remove duplicates
df[df['age'] > 30]     # Filter rows

# Transformation
df['new_col'] = df['col1'] + df['col2']
df_grouped = df.groupby('category').agg({'value': 'sum'})

# Sorting & ranking
df.sort_values('column')
df.rank()

# Merging
merged = pd.merge(df1, df2, on='key')
combined = pd.concat([df1, df2])
```

**Data Cleaning Workflow (80% of ML work!):**
```python
# 1. Load
df = pd.read_csv('raw_data.csv')

# 2. Inspect
print(df.isnull().sum())
print(df.describe())

# 3. Clean
df = df.dropna()
df = df[df['age'] > 0]
df['salary'] = pd.to_numeric(df['salary'], errors='coerce')

# 4. Transform
df['log_salary'] = np.log(df['salary'])
df['experience_group'] = pd.cut(df['experience'], bins=3)

# 5. Export
df.to_csv('cleaned_data.csv', index=False)
```

---

### Week 3: Data Visualization & Jupyter

#### 3.1 Matplotlib & Seaborn
**Purpose:** Create professional data visualizations

**Matplotlib (low-level):**
```python
import matplotlib.pyplot as plt

# Line plot
plt.figure(figsize=(10, 6))
plt.plot(x, y, label='Data')
plt.xlabel('X-axis')
plt.ylabel('Y-axis')
plt.title('Title')
plt.legend()
plt.grid(True)
plt.show()

# Histogram
plt.hist(data, bins=30, edgecolor='black')

# Scatter plot
plt.scatter(x, y, alpha=0.5, s=50)
```

**Seaborn (high-level, prettier):**
```python
import seaborn as sns
import matplotlib.pyplot as plt

# Set style
sns.set_style("darkgrid")

# Distribution plots
sns.histplot(data, kde=True)
sns.boxplot(data=df, x='category', y='value')

# Relationship plots
sns.scatterplot(data=df, x='feature1', y='feature2', hue='category')
sns.lineplot(data=df, x='time', y='value')

# Correlation heatmap
sns.heatmap(df.corr(), annot=True)
```

#### 3.2 Jupyter Notebooks
**Purpose:** Interactive development environment

**Best Practices:**
- One logical concept per cell
- Use markdown for documentation
- Keep cells small and testable
- Save frequently
- Clean up outputs before committing

**Keyboard Shortcuts:**
```
Ctrl+Enter    - Run cell
Shift+Enter   - Run cell & move to next
A/B           - Insert cell above/below
D+D           - Delete cell
M             - Convert to markdown
Y             - Convert to code
```

**Magic Commands:**
```python
%matplotlib inline    # Display plots
%time statement       # Time execution
%timeit statement     # Time average
%pwd                  # Print working directory
%load filename       # Load code from file
```

---

## 💡 Key Takeaways

1. **Python is slow alone, but NumPy is fast** - Always vectorize, never loop
2. **Pandas handles dirty data** - Real world is messy, cleaning is 70-80% of work
3. **Visualizations communicate insights** - Good plots > 1000 words of analysis
4. **Jupyter for exploration, .py for production** - Don't deploy notebooks
5. **Virtual environments are mandatory** - Keep projects isolated

---

## 🎓 Learning Resources

### Official Documentation
- [Python.org](https://python.org)
- [NumPy Docs](https://numpy.org/doc/)
- [Pandas Docs](https://pandas.pydata.org/)
- [Matplotlib Docs](https://matplotlib.org/)
- [Seaborn Docs](https://seaborn.pydata.org/)

### Interactive Tutorials
- [Real Python](https://realpython.com/) - NumPy, Pandas, Python fundamentals
- [DataCamp](https://www.datacamp.com/) - Interactive courses with datasets
- [Kaggle Learn](https://www.kaggle.com/learn) - Micro-courses (free)

### Books
- "Python for Data Analysis" by Wes McKinney
- "Fluent Python" by Luciano Ramalho
- "Real Python" courses

### Datasets for Practice
- [Kaggle Datasets](https://www.kaggle.com/datasets) - Thousands of datasets
- [UCI ML Repository](https://archive.ics.uci.edu/ml/) - Classic datasets
- [Google Dataset Search](https://datasetsearch.research.google.com/)

---

## 📖 Practice Exercises

### Exercise 1: NumPy Mastery
```python
# Create 1000x1000 random matrix
A = np.random.randn(1000, 1000)

# 1. Calculate mean per row
row_means = np.mean(A, axis=1)

# 2. Subtract mean (broadcasting)
A_centered = A - row_means[:, np.newaxis]

# 3. Calculate covariance
cov = np.cov(A_centered.T)

# 4. Find eigenvalues
eigenvalues = np.linalg.eigvals(cov)
```

### Exercise 2: Pandas Data Pipeline
```python
# Load data
df = pd.read_csv('employees.csv')

# Clean
df = df[df['salary'] > 0]
df['hire_date'] = pd.to_datetime(df['hire_date'])

# Analyze
summary = df.groupby('department').agg({
    'salary': ['mean', 'max', 'min'],
    'hire_date': 'count'
})

# Visualize
sns.barplot(data=df, x='department', y='salary')
plt.show()
```

### Exercise 3: EDA (Exploratory Data Analysis)
```python
def analyze_dataset(filepath):
    df = pd.read_csv(filepath)
    
    print("Shape:", df.shape)
    print("\nData Types:\n", df.dtypes)
    print("\nMissing Values:\n", df.isnull().sum())
    print("\nStatistical Summary:\n", df.describe())
    
    # Visualizations
    df.hist(figsize=(15, 10))
    plt.show()
    
    return df
```

---

## ✅ Phase 1 Checklist

Before moving to Phase 2:

- [ ] Can write Python code without looking up syntax
- [ ] Understand virtual environments and manage dependencies
- [ ] Comfortable with NumPy vectorized operations
- [ ] Can load, clean, and explore data with Pandas
- [ ] Create visualizations with Matplotlib/Seaborn
- [ ] Know when to use each data structure (list, dict, DataFrame)
- [ ] Understand git and can commit code
- [ ] Completed and deployed Capstone Project #1

---

## 🎯 Capstone Project: Student Performance Analytics Engine

→ [View Full Capstone Specification](Capstone_StudentAnalytics/PROJECT.md)

**What You'll Build:**
- Load student grade data from CSV
- Clean missing/invalid values
- Generate statistical insights
- Create interactive dashboards
- Export professional reports
- Optional: Deploy as REST API with FastAPI

**Skills Demonstrated:**
- Data loading & cleaning
- Statistical analysis
- Professional visualization
- Report generation
- API design (optional)

---

**Next Phase:** [Phase 2: Core Machine Learning](../Phase2_CoreML/LEARNING_GUIDE.md)
