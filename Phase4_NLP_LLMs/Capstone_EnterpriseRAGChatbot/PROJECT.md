# Capstone Project #4: Enterprise RAG Chatbot

**Phase:** 4 (NLP & LLMs) | **Duration:** 4 weeks | **Difficulty:** Advanced

---

## 📋 Project Overview

Build an **enterprise-grade RAG chatbot** that ingests PDFs, enables semantic search, and provides context-aware answers. Production-ready for Azure deployment.

### 💼 Business Use Cases

- **Support Chatbots:** Answer customer questions from documentation
- **Internal Knowledge Base:** Employee Q&A from company docs
- **Legal Assistant:** Query contracts and regulations
- **Research Assistant:** Summarize academic papers
- **Technical Support:** Help customers with product docs

### 🎯 What You'll Learn

✅ PDF document ingestion & chunking  
✅ Embedding generation at scale  
✅ Vector database integration (FAISS/Pinecone)  
✅ RAG pipeline architecture  
✅ LangChain orchestration  
✅ Role-based access control  
✅ Logging & monitoring  
✅ Azure OpenAI integration  
✅ .NET compatibility considerations  

---

## 📊 Project Structure

```
Capstone_EnterpriseRAGChatbot/
├── PROJECT.md (this file)
├── requirements.txt
├── data/
│   ├── documents/
│   │   ├── sample1.pdf
│   │   └── sample2.pdf
│   └── vector_db/
├── notebooks/
│   ├── 01_document_ingestion.ipynb
│   ├── 02_embedding_generation.ipynb
│   └── 03_rag_system.ipynb
├── src/
│   ├── __init__.py
│   ├── document_processor.py # PDF handling
│   ├── embedding_service.py  # Embedding generation
│   ├── vector_db.py          # Vector store management
│   ├── rag_chain.py          # RAG pipeline
│   ├── auth.py               # Role-based access
│   ├── logging_service.py    # Logging & monitoring
│   └── api.py                # FastAPI application
├── tests/
│   └── test_rag_system.py
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── azure/
│   ├── deployment.yaml
│   └── app-insights.json
└── README.md
```

---

## 🔧 Implementation Tasks

### Task 1: Document Processing (`src/document_processor.py`)

```python
from PyPDF2 import PdfReader
from langchain.text_splitter import RecursiveCharacterTextSplitter

class DocumentProcessor:
    def __init__(self, chunk_size=500, chunk_overlap=50):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=chunk_size,
            chunk_overlap=chunk_overlap,
            separators=["\n\n", "\n", " ", ""]
        )
    
    def extract_from_pdf(self, pdf_path):
        """Extract text from PDF"""
        reader = PdfReader(pdf_path)
        text = ""
        for page in reader.pages:
            text += page.extract_text()
        return text
    
    def chunk_documents(self, text, metadata=None):
        """Split text into chunks"""
        chunks = self.text_splitter.split_text(text)
        
        documents = []
        for i, chunk in enumerate(chunks):
            doc = {
                'content': chunk,
                'chunk_id': i,
                'metadata': metadata or {}
            }
            documents.append(doc)
        
        return documents
    
    def process_pdf(self, pdf_path, metadata=None):
        """Complete PDF processing pipeline"""
        text = self.extract_from_pdf(pdf_path)
        chunks = self.chunk_documents(text, metadata)
        return chunks
```

**Best Practices:**
- Chunk size: 200-500 tokens (optimal for LLMs)
- Preserve context with overlap: 50-100 tokens
- Metadata: Document name, section, timestamp
- Recursive splitting: Respect document structure

### Task 2: Embedding Service (`src/embedding_service.py`)

```python
from sentence_transformers import SentenceTransformer
import numpy as np

class EmbeddingService:
    def __init__(self, model_name='all-MiniLM-L6-v2'):
        self.model = SentenceTransformer(model_name)
        self.model_dim = 384  # Dimension of embeddings
    
    def embed_text(self, text):
        """Convert text to embedding"""
        embedding = self.model.encode(text, convert_to_numpy=True)
        return embedding
    
    def embed_batch(self, texts, batch_size=32):
        """Embed multiple texts efficiently"""
        embeddings = self.model.encode(
            texts,
            batch_size=batch_size,
            show_progress_bar=True
        )
        return embeddings
    
    def similarity_score(self, embedding1, embedding2):
        """Calculate cosine similarity"""
        similarity = np.dot(embedding1, embedding2) / (
            np.linalg.norm(embedding1) * np.linalg.norm(embedding2)
        )
        return similarity
```

**Model Selection:**
- Small/speed: `all-MiniLM-L6-v2` (384 dim)
- Accuracy: `all-mpnet-base-v2` (768 dim)
- Specialized: `sentence-transformers/legal-...`

### Task 3: Vector Database (`src/vector_db.py`)

```python
import faiss
import pickle
import numpy as np

class VectorDB:
    def __init__(self, embedding_dim=384):
        self.embedding_dim = embedding_dim
        self.index = faiss.IndexFlatL2(embedding_dim)
        self.documents = []  # Store original documents
    
    def add_documents(self, embeddings, documents):
        """Add embeddings and associated documents"""
        embeddings = np.array(embeddings).astype('float32')
        
        self.index.add(embeddings)
        self.documents.extend(documents)
    
    def search(self, query_embedding, top_k=5):
        """Find top-k similar documents"""
        query = np.array([query_embedding]).astype('float32')
        
        distances, indices = self.index.search(query, top_k)
        
        results = []
        for idx in indices[0]:
            if idx < len(self.documents):
                results.append({
                    'document': self.documents[idx],
                    'index': idx
                })
        
        return results
    
    def save(self, filepath):
        """Persist vector database"""
        faiss.write_index(self.index, f"{filepath}/index.faiss")
        with open(f"{filepath}/documents.pkl", 'wb') as f:
            pickle.dump(self.documents, f)
    
    def load(self, filepath):
        """Load vector database"""
        self.index = faiss.read_index(f"{filepath}/index.faiss")
        with open(f"{filepath}/documents.pkl", 'rb') as f:
            self.documents = pickle.load(f)
```

### Task 4: RAG Chain (`src/rag_chain.py`)

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain.chains import LLMChain

class RAGChain:
    def __init__(self, vector_db, embedding_service, llm=None):
        self.vector_db = vector_db
        self.embedding_service = embedding_service
        self.llm = llm or ChatOpenAI(model_name="gpt-4", temperature=0.1)
        
        self.qa_prompt = PromptTemplate(
            template="""You are a helpful assistant. Use the provided context to answer the question.
            
Context:
{context}

Question: {question}

Answer:""",
            input_variables=['context', 'question']
        )
        
        self.chain = LLMChain(llm=self.llm, prompt=self.qa_prompt)
    
    def query(self, question, top_k=3):
        """RAG query pipeline"""
        
        # Step 1: Generate embedding for question
        question_embedding = self.embedding_service.embed_text(question)
        
        # Step 2: Retrieve similar documents
        retrieved = self.vector_db.search(question_embedding, top_k=top_k)
        
        # Step 3: Format context
        context = "\n\n".join([
            r['document']['content'] for r in retrieved
        ])
        
        # Step 4: Generate answer with context
        answer = self.chain.run(context=context, question=question)
        
        return {
            'answer': answer,
            'sources': retrieved,
            'question': question
        }
```

### Task 5: Authentication & Authorization (`src/auth.py`)

```python
from enum import Enum
from datetime import datetime, timedelta
import jwt

class UserRole(Enum):
    VIEWER = "viewer"      # Read-only
    EDITOR = "editor"      # Can add documents
    ADMIN = "admin"        # Full access

class AuthService:
    def __init__(self, secret_key="your-secret-key"):
        self.secret_key = secret_key
    
    def create_token(self, user_id, role, expires_in_days=7):
        """Create JWT token"""
        payload = {
            'user_id': user_id,
            'role': role.value,
            'exp': datetime.utcnow() + timedelta(days=expires_in_days),
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, self.secret_key, algorithm='HS256')
        return token
    
    def verify_token(self, token):
        """Verify and decode token"""
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=['HS256'])
            return payload
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expired")
        except jwt.InvalidTokenError:
            raise ValueError("Invalid token")
    
    def check_permission(self, user_role, required_role):
        """Check if user has required permission"""
        role_hierarchy = {
            UserRole.VIEWER: 0,
            UserRole.EDITOR: 1,
            UserRole.ADMIN: 2
        }
        return role_hierarchy[user_role] >= role_hierarchy[required_role]
```

### Task 6: FastAPI Application (`src/api.py`)

```python
from fastapi import FastAPI, UploadFile, HTTPException, Depends, Header
from pydantic import BaseModel
import logging

app = FastAPI(
    title="Enterprise RAG Chatbot",
    description="Semantic search & RAG with LLMs"
)

class QueryRequest(BaseModel):
    question: str
    top_k: int = 3

class QueryResponse(BaseModel):
    answer: str
    sources: list
    question: str

# Load components
rag = RAGChain(vector_db, embedding_service)
auth = AuthService()
logger = logging.getLogger(__name__)

# Dependency for auth
def get_current_user(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")
    
    token = authorization.split(" ")[1]
    return auth.verify_token(token)

@app.post("/query", response_model=QueryResponse)
async def query(
    request: QueryRequest,
    current_user: dict = Depends(get_current_user)
):
    """Query the RAG system"""
    
    logger.info(f"User {current_user['user_id']} querying: {request.question}")
    
    result = rag.query(request.question, top_k=request.top_k)
    
    return QueryResponse(**result)

@app.post("/upload")
async def upload_document(
    file: UploadFile,
    current_user: dict = Depends(get_current_user)
):
    """Upload and ingest PDF document"""
    
    # Check permission
    if current_user['role'] == 'viewer':
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    
    # Process document
    processor = DocumentProcessor()
    chunks = processor.process_pdf(file.filename, metadata={
        'uploaded_by': current_user['user_id'],
        'uploaded_at': datetime.now().isoformat()
    })
    
    # Generate embeddings
    embedding_service = EmbeddingService()
    embeddings = embedding_service.embed_batch([c['content'] for c in chunks])
    
    # Add to vector DB
    vector_db.add_documents(embeddings, chunks)
    
    logger.info(f"Document uploaded by {current_user['user_id']}")
    
    return {
        "status": "success",
        "chunks": len(chunks),
        "document": file.filename
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}
```

---

## 📊 System Architecture

```
PDF Documents
    ↓ (Process & Chunk)
Text Chunks → Embed → Vector Store (FAISS)
                           ↓
User Query → Embed → Semantic Search → Retrieve Context
                                           ↓
                                    LLM (GPT-4) → Answer + Sources
                                           ↓
                                       Response
```

---

## 🧪 Testing

```python
import pytest

def test_document_processing():
    processor = DocumentProcessor()
    chunks = processor.process_pdf('test.pdf')
    assert len(chunks) > 0
    assert 'content' in chunks[0]

def test_rag_query():
    rag = RAGChain(vector_db, embedding_service)
    result = rag.query("What is the purpose?")
    assert 'answer' in result
    assert 'sources' in result

def test_auth():
    auth = AuthService()
    token = auth.create_token("user123", UserRole.EDITOR)
    payload = auth.verify_token(token)
    assert payload['user_id'] == "user123"
```

---

## 🚀 Deployment

### Docker
```dockerfile
FROM python:3.10
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY src/ .

CMD ["uvicorn", "api:app", "--host", "0.0.0.0"]
```

### Azure Deployment
```bash
az containerapp create \
  --name rag-chatbot \
  --image rag-chatbot:latest \
  --environment myenv \
  --ingress external
```

---

## ✅ Submission Checklist

- [ ] PDF ingestion working
- [ ] Document chunking optimized
- [ ] Embeddings generated & stored
- [ ] Vector DB integrated
- [ ] RAG queries return relevant answers
- [ ] Authentication implemented
- [ ] Logging captures all interactions
- [ ] API fully functional with Swagger docs
- [ ] Unit & integration tests passing
- [ ] Docker image builds & runs
- [ ] Azure deployment successful
- [ ] GitHub repo with documentation

---

**Time Estimate:** 25-35 hours  
**Difficulty:** ⭐⭐⭐⭐☆ (Advanced)

**Next:** [Phase 5 Capstone: AI Deployment Platform](../../Phase5_MLOps/Capstone_AIDeploymentPlatform/PROJECT.md)
