# Phase 4: NLP & LLMs - Learning Guide

**Duration:** 4 weeks | **Level:** Advanced | **Prerequisites:** Phase 3 complete

---

## 🎯 Phase Objectives

By the end of Phase 4, you'll master:

✅ Natural language processing (NLP) fundamentals  
✅ Transformer architecture & attention mechanisms  
✅ Working with Large Language Models (LLMs)  
✅ Embeddings & vector databases  
✅ RAG (Retrieval Augmented Generation)  
✅ LangChain framework  
✅ Building enterprise chatbots  
✅ **Complete capstone: Production RAG chatbot system**  

---

## 📘 Core Concepts

### Week 1: NLP Fundamentals & Transformers

#### 1.1 Transformer Architecture
**The Game-Changer:** "Attention Is All You Need" (2017)

```
Input Sequence → Embeddings → Attention → Feed-Forward → Output
                     ↓
                [Self-Attention: score how relevant each word is to every other word]
```

**Key Innovation: Attention Mechanism**
```python
# Query: "What are we looking for?"
# Key: "Which words are relevant?"
# Value: "What's the actual information?"

Attention(Q, K, V) = softmax(QK^T / √d_k) V
```

#### 1.2 Pre-trained Models with HuggingFace
```python
from transformers import AutoTokenizer, AutoModel

# Load pre-trained BERT
tokenizer = AutoTokenizer.from_pretrained("bert-base-uncased")
model = AutoModel.from_pretrained("bert-base-uncased")

# Tokenize text
tokens = tokenizer("Hello, how are you?", return_tensors="pt")

# Get embeddings
outputs = model(**tokens)
embeddings = outputs.last_hidden_state
```

**Popular Models:**
- **BERT:** Bidirectional context (understanding)
- **GPT-3/4:** Generative (text generation)
- **T5:** Text-to-Text (any NLP task)
- **LLaMA:** Open-source large model

---

### Week 2: Embeddings & Vector Databases

#### 2.1 Text Embeddings
**Convert text → numbers → use for AI**

```python
from sentence_transformers import SentenceTransformer

# Load sentence embedding model
model = SentenceTransformer('all-MiniLM-L6-v2')

# Convert text to vectors
sentences = [
    "This is a sample sentence",
    "This is another sentence"
]

embeddings = model.encode(sentences)
# Output: array of shape (2, 384) - numerical vectors
```

**Why Embeddings?**
- Semantic similarity: Similar meaning → similar vectors
- Dimensionality reduction: 10,000 words → 384 numbers
- Enables vector search

#### 2.2 Vector Databases
**Store and search embeddings efficiently**

**FAISS (Facebook AI Similarity Search):**
```python
import faiss
import numpy as np

# Create index
d = 384  # Embedding dimension
index = faiss.IndexFlatL2(d)  # L2 distance

# Add embeddings to index
embeddings = np.random.randn(1000, 384).astype('float32')
index.add(embeddings)

# Search for similar vectors
query = np.random.randn(1, 384).astype('float32')
distances, indices = index.search(query, k=5)
# Get 5 most similar
```

**Pinecone (Managed Vector DB):**
```python
from pinecone import Pinecone

pc = Pinecone(api_key="YOUR_API_KEY")
index = pc.Index("documents")

# Upsert (insert/update) vectors
index.upsert(
    vectors=[
        ("doc1", embedding1, {"text": "..."})
    ]
)

# Query
results = index.query(query_embedding, top_k=5)
```

**When to Use:**
- FAISS: Local development, cost-effective
- Pinecone: Production, managed, scalable

---

### Week 3: RAG (Retrieval Augmented Generation)

**Problem:** LLMs hallucinate (make up facts)  
**Solution:** RAG - Retrieve relevant documents, then generate

**Flow:**
```
User Query → Search Vector DB → Retrieve Documents → 
Send to LLM with Context → LLM Generates Answer
```

```python
from langchain.vectorstores import FAISS
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.chat_models import ChatOpenAI
from langchain.chains import RetrievalQA

# 1. Create embeddings
embeddings = HuggingFaceEmbeddings()

# 2. Create vector store
vector_store = FAISS.from_documents(documents, embeddings)

# 3. Create retrieval chain
llm = ChatOpenAI(model_name="gpt-4")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vector_store.as_retriever(),
    return_source_documents=True
)

# 4. Query
result = qa_chain({"query": "What is machine learning?"})
print(result["result"])  # LLM answer with retrieved context
```

---

### Week 4: LangChain & Advanced Applications

#### 4.1 LangChain Framework
**Modular LLM application framework**

```python
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain

# Define model
llm = ChatOpenAI(temperature=0.7, model_name="gpt-4")

# Define prompt template
prompt = ChatPromptTemplate.from_template(
    "Summarize this text: {text}"
)

# Create chain
chain = LLMChain(llm=llm, prompt=prompt)

# Execute
result = chain.run(text="Your text here...")
```

#### 4.2 Memory & Conversation History
```python
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# Create memory
memory = ConversationBufferMemory()

# Create conversation chain
conversation = ConversationChain(
    llm=llm,
    memory=memory,
    verbose=True
)

# Multi-turn conversation
conversation.predict(input="Hi, what's your name?")
conversation.predict(input="What did I just ask you?")
# Model remembers previous message
```

#### 4.3 Tool Calling (Function Calling)
```python
from langchain.agents import initialize_agent, Tool
from langchain.agents import AgentType

# Define tools
def get_weather(location):
    return f"Weather in {location}: Sunny, 72°F"

def search_web(query):
    return f"Search results for {query}..."

tools = [
    Tool(name="Weather", func=get_weather, description="Get weather"),
    Tool(name="Search", func=search_web, description="Search web")
]

# Create agent
agent = initialize_agent(
    tools,
    llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Agent decides which tools to use
agent.run("What's the weather and latest AI news?")
```

---

## 💡 Key NLP/LLM Principles

1. **Context is key:** More relevant context → better answers
2. **Chunk strategically:** Document size matters (typically 200-500 tokens)
3. **Use embeddings for semantic search:** Not keyword matching
4. **Manage token limits:** GPT-4 = 8K-128K tokens
5. **Cost optimization:** Larger models = higher costs

---

## ✅ Phase 4 Checklist

- [ ] Understand transformer architecture
- [ ] Work with HuggingFace models
- [ ] Generate text embeddings
- [ ] Build vector database (FAISS/Pinecone)
- [ ] Implement RAG system
- [ ] Use LangChain for chaining
- [ ] Implement conversation memory
- [ ] Handle tool calling/function calling
- [ ] Optimize prompts for clarity
- [ ] Monitor token usage & costs
- [ ] Completed Phase 4 Capstone Project

---

## 🎯 Capstone Project: Enterprise RAG Chatbot

→ [View Full Capstone](Capstone_EnterpriseRAGChatbot/PROJECT.md)

**Build:** Production RAG chatbot with Azure integration  
**Features:** PDF ingestion, semantic search, tool integration  
**Skills:** Enterprise LLM applications, RAG architecture  

---

**Next Phase:** [Phase 5: MLOps & Production AI](../Phase5_MLOps/LEARNING_GUIDE.md)
