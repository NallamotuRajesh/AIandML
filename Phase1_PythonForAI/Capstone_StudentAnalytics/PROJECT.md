# Capstone Project #1: Student Performance Analytics Engine

**Phase:** 1 (Python for AI) | **Duration:** 2-3 weeks | **Difficulty:** Beginner

---

## 📋 Project Overview

Build a **complete data analytics system** that processes student performance data, identifies patterns, and generates actionable insights through visualizations and reports.

### 🎯 What You'll Learn

✅ Load & clean real dataset  
✅ Statistical analysis & aggregation  
✅ Professional data visualization  
✅ Report generation  
✅ Project structure & best practices  
✅ Optional: Convert analytics to REST API  
✅ Optional: Containerize with Docker  

### 💼 Business Context

A school needs to understand student performance patterns to:
- Identify struggling students early
- Allocate tutoring resources
- Track department performance trends
- Generate parent reports

---

## 📊 Project Structure

```
Capstone_StudentAnalytics/
├── PROJECT.md (this file)
├── requirements.txt
├── data/
│   ├── raw/
│   │   └── student_grades.csv
│   └── processed/
│       └── cleaned_grades.csv
├── notebooks/
│   └── 01_exploration.ipynb
│   └── 02_analysis.ipynb
├── src/
│   ├── __init__.py
│   ├── loader.py         # Data loading
│   ├── cleaner.py        # Data cleaning
│   ├── analyzer.py       # Statistical analysis
│   ├── visualizer.py     # Create plots
│   └── reporter.py       # Generate reports
├── reports/
│   ├── performance_summary.html
│   └── student_report.pdf
├── tests/
│   └── test_cleaner.py
├── docker/
│   └── Dockerfile
│   └── docker-compose.yml
└── README.md
```

---

## 🎬 Getting Started

### 1. Setup

```bash
# Navigate to capstone directory
cd /workspaces/AIandML/Phase1_PythonForAI/Capstone_StudentAnalytics

# Create virtual environment (if not already done)
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Create Dependencies File

Create `requirements.txt`:
```
pandas==2.1.0
numpy==1.24.3
matplotlib==3.7.2
seaborn==0.12.2
jupyter==1.0.0
pytest==7.4.0
scipy==1.11.2
openpyxl==3.1.0
```

### 3. Create Sample Data

Create `data/raw/student_grades.csv`:
```csv
student_id,name,department,math,science,english,history,gpa
1001,Alice Johnson,Engineering,92,88,85,80,3.88
1002,Bob Smith,Engineering,78,82,75,72,3.02
1003,Carol White,Business,88,85,92,95,4.0
1004,David Brown,Business,92,90,91,93,3.92
1005,Eve Davis,Engineering,45,50,48,42,1.96
1006,Frank Miller,Science,95,94,88,91,4.0
1007,Grace Lee,Business,NA,88,92,90,NA
1008,Henry Wilson,Science,87,89,NA,86,3.54
```

---

## 📝 Implementation Tasks

### Task 1: Data Loading (`src/loader.py`)

```python
def load_data(filepath):
    """Load CSV and return DataFrame"""
    # TODO: Implement
    pass

def validate_dataframe(df):
    """Check required columns exist"""
    # TODO: Implement
    pass
```

**Requirements:**
- Load CSV file using Pandas
- Validate required columns exist
- Return DataFrame or raise error

---

### Task 2: Data Cleaning (`src/cleaner.py`)

```python
def clean_grades(df):
    """Clean and standardize grade data"""
    # Replace 'NA' string with numpy NaN
    # Ensure numeric columns are proper types
    # TODO: Implement full cleaning
    pass

def handle_missing_values(df, strategy='mean'):
    """Handle missing values in grade columns"""
    # Options: 'drop', 'mean', 'forward_fill'
    # TODO: Implement
    pass

def outlier_detection(df, column, zscore_threshold=3):
    """Identify possible data entry errors"""
    # Grades should be 0-100
    # TODO: Implement
    pass
```

**Cleaning Rules:**
- Convert 'NA' strings to NaN
- Flag grades outside 0-100 range
- Remove students with >50% missing grades
- Fill moderate missing values with department average
- Document all cleaning steps

---

### Task 3: Statistical Analysis (`src/analyzer.py`)

```python
def calculate_summary_stats(df):
    """Calculate mean, median, std for each subject"""
    # TODO: Implement
    pass

def department_performance(df):
    """Compare departments by average GPA"""
    # TODO: Implement
    return stats_by_dept

def identify_at_risk_students(df, gpa_threshold=2.0):
    """Find students below threshold GPA"""
    # TODO: Implement
    pass

def correlation_analysis(df):
    """Calculate correlations between subjects"""
    # TODO: Implement
    pass

def percentile_ranking(df):
    """Rank students within their department"""
    # TODO: Implement
    pass
```

**Analysis Requirements:**
- Calculate per-subject statistics (mean, median, std)
- Department-level performance comparison
- Identify at-risk students (GPA < 2.0)
- Correlation between subjects
- Subject-level percentile rankings

---

### Task 4: Visualization (`src/visualizer.py`)

```python
def plot_grade_distribution(df, subject):
    """Histogram of grades by subject"""
    # TODO: Implement
    pass

def plot_department_comparison(df):
    """Bar chart comparing department averages"""
    # TODO: Implement
    pass

def plot_correlation_heatmap(df):
    """Correlation matrix heatmap"""
    # TODO: Implement
    pass

def plot_student_performance(df, student_id):
    """Radar chart of individual student scores"""
    # TODO: Implement
    pass

def create_dashboard(df):
    """Create single figure with multiple subplots"""
    # TODO: Implement
    pass
```

**Visualization Checklist:**
- ✅ Grade distribution by subject (histogram)
- ✅ Department performance comparison (bar chart)
- ✅ Subject correlations (heatmap)
- ✅ Individual student profile (radar/bar)
- ✅ GPA distribution (histogram)
- ✅ Top 10 students (bar chart)
- ✅ All plots styled professionally

---

### Task 5: Report Generation (`src/reporter.py`)

```python
def generate_text_report(df, output_path):
    """Generate TXT report with statistics"""
    # TODO: Implement
    pass

def generate_html_report(df, visualizations, output_path):
    """Generate interactive HTML report"""
    # TODO: Implement
    pass

def generate_student_report(df, student_id, output_path):
    """Generate individual student report"""
    # TODO: Implement
    pass

def export_statistics_csv(df, output_path):
    """Export summary statistics to CSV"""
    # TODO: Implement
    pass
```

**Report Contents:**
- Executive summary
- Overall statistics
- Department breakdowns
- Top performers
- At-risk students
- Visualizations embedded
- Recommendations

---

### Task 6: Main Pipeline (`__main__.py`)

```python
def main():
    # 1. Load data
    df = load_data('data/raw/student_grades.csv')
    
    # 2. Clean
    df_clean = clean_grades(df)
    
    # 3. Analyze
    stats = calculate_summary_stats(df_clean)
    
    # 4. Visualize
    create_dashboard(df_clean)
    
    # 5. Report
    generate_html_report(df_clean, output_path='reports/')
    
    print("Analysis complete!")

if __name__ == '__main__':
    main()
```

---

## 🎨 Code Quality Standards

### Style Guide
- Follow PEP 8 conventions
- Use descriptive variable names
- Add docstrings to all functions
- Keep functions focused (single responsibility)
- Use type hints for clarity

### Example Function:
```python
def calculate_gpa(grades: list[float]) -> float:
    """
    Calculate GPA from list of grades (0-100).
    
    Args:
        grades: List of numerical grades
        
    Returns:
        GPA value (0.0-4.0)
        
    Raises:
        ValueError: If grades contain invalid values
    """
    if not grades or any(g < 0 or g > 100 for g in grades):
        raise ValueError("Grades must be 0-100")
    
    # Convert grades to GPA
    gpa = sum(grades) / len(grades) / 25
    return min(max(gpa, 0.0), 4.0)
```

---

## 📊 Sample Outputs

### Console Output:
```
=== STUDENT PERFORMANCE ANALYSIS ===

Dataset: 1000 students, 4 subjects
Missing values handled: 34 records

OVERALL STATISTICS:
  Math:     Mean=82.5, StdDev=12.3
  Science:  Mean=80.2, StdDev=14.1
  English:  Mean=84.1, StdDev=11.8
  History:  Mean=83.4, StdDev=13.2

BY DEPARTMENT:
  Engineering: Avg GPA=3.45 (245 students)
  Business:    Avg GPA=3.62 (312 students)
  Science:     Avg GPA=3.71 (198 students)

AT-RISK STUDENTS: 45 (GPA < 2.0)
TOP 10 PERFORMERS: [List of student names/IDs]

Report saved to: reports/performance_summary.html
```

---

## 🧪 Testing

Create `tests/test_cleaner.py`:
```python
import pytest
from src.cleaner import clean_grades, handle_missing_values

def test_clean_grades_removes_invalid():
    # Test that grades outside 0-100 are flagged
    pass

def test_handle_missing_values_mean():
    # Test mean imputation
    pass

def test_gpa_calculation():
    # Test GPA conversion
    pass
```

Run tests:
```bash
pytest tests/ -v
```

---

## 🚀 Extensions (Optional)

### Extension 1: FastAPI REST API
```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class StudentQuery(BaseModel):
    student_id: int

@app.post("/analyze/")
def analyze_student(query: StudentQuery):
    # Query database
    # Return student analysis
    pass

@app.get("/department/{dept}/stats")
def department_stats(dept: str):
    # Return department statistics
    pass
```

Deploy with:
```bash
pip install fastapi uvicorn
uvicorn main:app --reload
```

### Extension 2: Docker Containerization

Create `docker/Dockerfile`:
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "-m", "src.main"]
```

Build & run:
```bash
docker build -t student-analytics .
docker run student-analytics
```

### Extension 3: Database Integration
```python
import sqlite3

# Store results in SQLite
conn = sqlite3.connect('analytics.db')
df_clean.to_sql('students', conn, if_exists='replace')

# Query database
query_result = pd.read_sql(
    "SELECT * FROM students WHERE gpa > 3.5",
    conn
)
```

### Extension 4: Web Dashboard with Streamlit
```python
import streamlit as st
import pandas as pd

st.title("Student Performance Analytics")

df = pd.read_csv('data/processed/cleaned_grades.csv')

st.metric("Total Students", len(df))
st.metric("Average GPA", f"{df['gpa'].mean():.2f}")

st.altair_chart(
    alt.Chart(df).mark_bar().encode(x='department', y='gpa:Q')
)
```

Run with:
```bash
pip install streamlit
streamlit run dashboard.py
```

---

## ✅ Submission Checklist

Before completing Phase 1:

- [ ] All data loading functions work correctly
- [ ] Data cleaning removes/flags invalid values appropriately
- [ ] Statistical analysis calculates all required metrics
- [ ] Visualizations are clear and labeled
- [ ] HTML/PDF reports generate without errors
- [ ] Code follows PEP 8 style guide
- [ ] All functions have docstrings
- [ ] Tests passing (pytest)
- [ ] Git repository with clean commit history
- [ ] README.md explains how to run project
- [ ] Optional: API deployed and tested
- [ ] Optional: Docker image builds successfully

---

## 📚 Reference Code Snippets

### Loading & Initial Exploration:
```python
import pandas as pd
import numpy as np

df = pd.read_csv('data/raw/student_grades.csv')
print(df.head())
print(df.info())
print(df.describe())
print(df.isnull().sum())
```

### Data Cleaning Pattern:
```python
# Replace NA strings
df = df.replace('NA', np.nan)

# Drop rows with >50% missing
threshold = len(df.columns) * 0.5
df = df.dropna(thresh=threshold)

# Fill with department mean
for subject in ['math', 'science', 'english', 'history']:
    df[subject] = df.groupby('department')[subject].transform(
        lambda x: x.fillna(x.mean())
    )
```

### Basic Analysis:
```python
# Per-subject statistics
stats = df[['math', 'science', 'english', 'history']].describe()

# Group by department
dept_stats = df.groupby('department').agg({
    'gpa': ['mean', 'min', 'max'],
    'math': 'mean',
    'science': 'mean',
})

# Find correlations
correlation = df[['math', 'science', 'english', 'history']].corr()
```

### Visualization Template:
```python
import matplotlib.pyplot as plt
import seaborn as sns

fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Plot 1: Distribution
axes[0, 0].hist(df['gpa'], bins=30, edgecolor='black')
axes[0, 0].set_title('GPA Distribution')

# Plot 2: Department comparison
df.groupby('department')['gpa'].mean().plot(kind='bar', ax=axes[0, 1])
axes[0, 1].set_title('Avg GPA by Department')

# Plot 3: Correlation heatmap
sns.heatmap(correlation, ax=axes[1, 0], annot=True)
axes[1, 0].set_title('Subject Correlations')

# Plot 4: Scatter
axes[1, 1].scatter(df['math'], df['gpa'], alpha=0.5)
axes[1, 1].set_title('Math vs GPA')

plt.tight_layout()
plt.savefig('reports/dashboard.png', dpi=300, bbox_inches='tight')
plt.show()
```

---

## 🎓 Learning Outcomes

By completing this capstone, you'll have:

✅ Built production-ready data pipeline  
✅ Hands-on experience with NumPy, Pandas  
✅ Portfolio project for job applications  
✅ Understanding of full analytics workflow  
✅ Code that can be extended into larger systems  
✅ Optionally: Deployed application  

---

## 📖 Resources

- [Pandas Tutorial](https://pandas.pydata.org/docs/getting_started/intro_tutorials/index.html)
- [Real Python: Data Cleaning](https://realpython.com/)
- [Kaggle: EDA Tutorials](https://www.kaggle.com/learn/exploratory-data-analysis)
- [Stack Overflow: Data Science Tag](https://stackoverflow.com/questions/tagged/data-science)

---

**Status:** Ready to implement!  
**Time Estimate:** 15-20 hours  
**Difficulty:** ⭐⭐☆☆☆ (Beginner)

**Next:** [Phase 2 Capstone: Credit Risk Prediction](../../Phase2_CoreML/Capstone_CreditRisk/PROJECT.md)
