# Requirements Files for Each Phase

## Phase 1: Python for AI
```
pandas==2.1.0
numpy==1.24.3
matplotlib==3.7.2
seaborn==0.12.2
jupyter==1.0.0
jupyter-lab==4.0.0
pytest==7.4.0
scipy==1.11.2
openpyxl==3.1.0
```

## Phase 2: Core Machine Learning
```
scikit-learn==1.3.0
xgboost==2.0.0
pandas==2.1.0
numpy==1.24.3
matplotlib==3.7.2
seaborn==0.12.2
fastapi==0.103.0
uvicorn==0.23.2
pydantic==2.4.2
sqlalchemy==2.0.23
pytest==7.4.0
```

## Phase 3: Deep Learning
```
tensorflow==2.13.0
keras==2.13.0
torch==2.0.1
torchvision==0.15.2
scikit-learn==1.3.0
pandas==2.1.0
numpy==1.24.3
matplotlib==3.7.2
jupyter==1.0.0
pytest==7.4.0
```

## Phase 4: NLP & LLMs
```
transformers==4.34.0
sentence-transformers==2.2.2
langchain==0.1.0
langchain-openai==0.0.5
pinecone-client==3.0.0
faiss-cpu==1.7.4
pydantic==2.4.2
fastapi==0.103.0
uvicorn==0.23.2
PyPDF2==3.0.1
python-dotenv==1.0.0
pytest==7.4.0
```

## Phase 5: MLOps & Production AI
```
mlflow==2.8.0
docker==6.1.0
kubernetes==28.0.0
scikit-learn==1.3.0
pandas==2.1.0
psycopg2-binary==2.9.9
sqlalchemy==2.0.23
prometheus-client==0.18.0
fastapi==0.103.0
uvicorn==0.23.2
pytest==7.4.0
```

## Phase 6: Agentic AI Systems
```
langchain==0.1.0
langgraph==0.0.1
langchain-openai==0.0.5
openai==1.3.0
transformers==4.34.0
sentence-transformers==2.2.2
fastapi==0.103.0
uvicorn==0.23.2
websockets==12.0
pydantic==2.4.2
pytest==7.4.0
```

---

**How to Use:**

For each phase, copy the appropriate requirements into a `requirements.txt` file:

```bash
cd /workspaces/AIandML/Phase1_PythonForAI
# Create requirements.txt with Phase 1 dependencies
pip install -r requirements.txt
```
