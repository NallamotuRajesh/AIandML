# Phase 6: Agentic AI Systems - Learning Guide

**Duration:** 4 weeks | **Level:** Expert | **Prerequisites:** Phase 5 complete

---

## 🎯 Phase Objectives

By the end of Phase 6, you'll master:

✅ AI agent architecture & design patterns  
✅ Multi-agent orchestration  
✅ LangChain & LangGraph frameworks  
✅ Tool/function calling integration  
✅ Memory management for agents  
✅ Agent monitoring & debugging  
✅ Production agent deployment  
✅ **Complete capstone: Multi-agent job portal AI system**  

---

## 📘 Core Concepts

### Week 1: AI Agent Fundamentals

#### 1.1 What is an Agent?
**Definition:** Autonomous system that reasons about tasks and takes actions

**Components:**
```
Perception → Reasoning → Planning → Action → Feedback Loop
  (Input)   (LLM)     (Think)   (Do)    (Learn)
```

**Example Flow:**
```
User: "Find me a data science job in NYC with $150k salary"
  ↓
Agent Thinking: "Need to search jobs database, filter by location and salary"
  ↓
Agent Actions: 
  1. Search jobs (location=NYC, role=data scientist)
  2. Filter by salary >= 150k
  3. Get details for top 5 matches
  ↓
Agent Response: "Found 3 matching jobs..."
```

#### 1.2 Agent Architecture
```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

llm = ChatOpenAI(model_name="gpt-4")

# Create agent
agent = create_openai_functions_agent(
    llm=llm,
    tools=tools,
    prompt=prompt
)

# Execute agent with ability to use tools
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,
    max_iterations=5
)

result = executor.invoke({"input": "User task here"})
```

---

### Week 2: Multi-Agent Orchestration

#### 2.1 Agent-to-Agent Communication
**Pattern:** Multiple specialized agents working together

```python
from langchain.agents import AgentExecutor

class MultiAgentSystem:
    def __init__(self):
        self.agents = {
            'searcher': self._create_search_agent(),
            'analyzer': self._create_analysis_agent(),
            'recommender': self._create_recommendation_agent()
        }
    
    def process(self, task):
        """Orchestrate multiple agents"""
        
        # Step 1: Search agent finds candidates
        search_result = self.agents['searcher'].run(task)
        
        # Step 2: Analysis agent evaluates candidates
        analysis_result = self.agents['analyzer'].run(search_result)
        
        # Step 3: Recommender suggests best matches
        recommendation = self.agents['recommender'].run(analysis_result)
        
        return recommendation
```

#### 2.2 LangGraph for Complex Workflows
**Graph-based orchestration with state management**

```python
from langgraph.graph import StateGraph, END
from langchain.schema import BaseMessage

class AgentState(BaseModel):
    messages: list[BaseMessage]
    current_agent: str
    data: dict

def create_agent_graph():
    graph = StateGraph(AgentState)
    
    # Add nodes (agents)
    graph.add_node("searcher", searcher_agent)
    graph.add_node("analyzer", analyzer_agent)
    graph.add_node("recommender", recommender_agent)
    
    # Add edges (transitions)
    graph.set_entry_point("searcher")
    graph.add_edge("searcher", "analyzer")
    graph.add_edge("analyzer", "recommender")
    graph.add_edge("recommender", END)
    
    return graph.compile()

# Execute workflow
processor = create_agent_graph()
result = processor.invoke(initial_state)
```

---

### Week 3: Tool Integration & Function Calling

#### 3.1 Tools/Functions for Agents
```python
from langchain.tools import tool, Tool
from functools import lru_cache

@tool
def search_jobs(location: str, role: str, salary_min: int) -> str:
    """
    Search for jobs in database.
    
    Args:
        location: City name
        role: Job title
        salary_min: Minimum salary
    
    Returns:
        List of matching jobs
    """
    # Query database
    results = db.query_jobs(location, role, salary_min)
    return str(results)

@tool
def get_company_info(company_id: int) -> str:
    """Get detailed company information"""
    company = db.get_company(company_id)
    return json.dumps(company.to_dict())

@tool
def analyze_resume(resume_text: str) -> dict:
    """Analyze resume for skills and experience"""
    # Use NLP/ML to extract skills
    skills = extract_skills(resume_text)
    experience = extract_experience(resume_text)
    return {"skills": skills, "experience": experience}

# Register tools
tools = [search_jobs, get_company_info, analyze_resume]

# Agent automatically learns to use these
agent = create_agent(llm, tools)
```

#### 3.2 Tool Calling Best Practices
```python
# Clear tool descriptions
@tool
def get_salary_estimate(role: str, experience_years: int) -> str:
    """
    Calculate market salary for a role.
    
    Use this when users ask about salary expectations,
    salary negotiation, or compensation packages.
    
    Args:
        role: Job title (e.g., "Machine Learning Engineer")
        experience_years: Years of professional experience
    
    Returns:
        Salary range and market insights
    """
    pass

# Structured output
def search_results_formatter(results: list) -> str:
    """Format search results consistently"""
    formatted = []
    for result in results:
        formatted.append(f"- {result['title']} @ {result['company']}")
    return "\n".join(formatted)
```

---

### Week 4: Memory & Persistence

#### 4.1 Agent Memory
```python
from langchain.memory import ConversationBufferMemory, VectorStoreMemory

# Simple conversation memory
memory = ConversationBufferMemory(memory_key="history")

# Agent with memory
agent = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory,
    verbose=True
)

# Agent remembers previous interactions
agent.run("My name is Alice")  # Agent learns
agent.run("What's my name?")   # Agent recalls
```

#### 4.2 Vector Memory (Semantic Search in Conversation)
```python
# Remember important facts using vector search
from langchain.memory import VectorStoreMemory
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import FAISS

embedding = OpenAIEmbeddings()
vector_memory = VectorStoreMemory(
    vectorstore=FAISS(...),
    embedding_key="input",
    memory_variables=["history"]
)

agent = create_agent_with_memory(
    llm, tools, vector_memory
)
```

---

## 💡 Agent Best Practices

1. **Clear Tool Definitions:** Agents need precise tool descriptions
2. **Reduce Token Usage:** Keep prompts concise, summarize unneeded info
3. **Error Handling:** Gracefully handle tool failures
4. **Monitoring:** Log all agent actions for debugging
5. **Testing:** Unit test individual agents and workflows

```python
# Production agent setup
agent = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=False,  # Quiet in production
    max_iterations=10,  # Prevent infinite loops
    handle_parsing_errors=True  # Robust error handling
)

# Wrap with monitoring
from langfuse import observe

@observe()
def run_agent(task):
    return agent.run(task)
```

---

## ✅ Phase 6 Checklist

- [ ] Understand AI agent architecture
- [ ] Build single-purpose agents
- [ ] Implement multi-agent systems
- [ ] Use LangGraph for orchestration
- [ ] Integrate tools/functions
- [ ] Implement agent memory
- [ ] Deploy agents to production
- [ ] Monitor agent performance
- [ ] Handle errors gracefully
- [ ] Completed Phase 6 Capstone Project

---

## 🎯 Capstone Project: Multi-Agent Job Portal

→ [View Full Capstone](Capstone_MultiAgentJobPortal/PROJECT.md)

**Build:** Sophisticated multi-agent job search & recruitment AI  
**Features:** 5+ specialized agents, orchestration, memory, tools  
**Skills:** Advanced agentic AI, production deployment  

---

**Completion:** You are now an **AI Architect** 🏆

**Next Steps:**
- Deploy your projects publicly
- Contribute to open-source ML projects
- Stay updated with latest AI research
- Consider specialization (Audio AI, Robotics, etc.)
- Mentor others in your journey
