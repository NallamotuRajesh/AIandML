# Capstone Project #6: Multi-Agent Job Portal AI

**Phase:** 6 (Agentic AI Systems) | **Duration:** 4 weeks | **Difficulty:** Expert

---

## 📋 Project Overview

Build a **sophisticated AI-powered job portal** with multiple specialized agents working together. This is 2026-level AI architecture demonstrating enterprise-grade multi-agent systems.

### 🎯 System Overview

**User:** Job seeker or recruiter  
**Agents:** 5+ specialized AI agents  
**Outcome:** Smart job matching, career guidance, salary insights, interview prep

### 💼 Features

✅ **Resume Analysis Agent** - Extract skills and experience  
✅ **Job Matching Agent** - Find best fitting opportunities  
✅ **Salary Prediction Agent** - Estimate market rates  
✅ **Interview Coach Agent** - Prepare for interviews  
✅ **Recruiter Insight Agent** - Provide hiring trends  
✅ **Orchestrator** - Coordinate agent workflow  
✅ **Memory System** - Remember user context  
✅ **Tool Integration** - Database queries, APIs  
✅ **Monitoring** - Track agent performance  
✅ **Azure Deployment** - Production ready  

---

## 📊 Project Structure

```
Capstone_MultiAgentJobPortal/
├── PROJECT.md (this file)
├── requirements.txt
├── src/
│   ├── __init__.py
│   ├── agents/
│   │   ├── __init__.py
│   │   ├── resume_analyzer.py
│   │   ├── job_matcher.py
│   │   ├── salary_predictor.py
│   │   ├── interview_coach.py
│   │   └── recruiter_insights.py
│   ├── orchestrator.py        # Multi-agent coordinator
│   ├── tools/
│   │   ├── job_search.py
│   │   ├── resume_extract.py
│   │   └── market_analysis.py
│   ├── memory/
│   │   ├── user_context.py
│   │   └── conversation.py
│   ├── database/
│   │   ├── models.py
│   │   └── queries.py
│   ├── monitoring/
│   │   ├── logging.py
│   │   └── metrics.py
│   └── api.py                 # FastAPI app
├── data/
│   ├── jobs.csv
│   ├── resumes/
│   └── market_data.csv
├── langgraph/
│   └── workflow.yaml
├── kubernetes/
│   └── deployment.yaml
├── tests/
│   └── test_agents.py
├── docker/
│   └── Dockerfile
└── README.md
```

---

## 🔧 Implementation Tasks

### Task 1: Resume Analyzer Agent (`src/agents/resume_analyzer.py`)

```python
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.tools import tool

class ResumeAnalyzerAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-4", temperature=0.1)
        self.agent = self._create_agent()
    
    def _create_agent(self):
        """Create resume analysis agent with tools"""
        
        @tool
        def extract_skills(resume_text: str) -> dict:
            """Extract technical and soft skills from resume"""
            # Use NLP/regex to identify skills
            skills = {
                'technical': ['Python', 'Machine Learning', 'TensorFlow'],
                'soft': ['Leadership', 'Communication'],
                'certifications': ['AWS Certified', 'Google Cloud']
            }
            return skills
        
        @tool
        def extract_experience(resume_text: str) -> list:
            """Extract work experience and years total"""
            experience = [
                {
                    'role': 'Data Scientist',
                    'company': 'Tech Corp',
                    'duration': '2 years',
                    'achievements': [...]
                }
            ]
            return experience
        
        @tool
        def identify_gaps(resume_text: str, target_role: str) -> dict:
            """Identify skill gaps vs target role"""
            gaps = {
                'missing_skills': ['Docker', 'Kubernetes'],
                'experience_gaps': ['No cloud deployment experience'],
                'recommendations': ['Take cloud courses', 'Deploy projects']
            }
            return gaps
        
        tools = [extract_skills, extract_experience, identify_gaps]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert career advisor analyzing resumes."),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        agent = create_openai_functions_agent(
            self.llm, tools, prompt
        )
        
        return AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    def analyze(self, resume_text: str) -> dict:
        """Analyze resume and provide insights"""
        result = self.agent.invoke({
            "input": f"Analyze this resume:\n{resume_text}"
        })
        return result['output']
```

### Task 2: Job Matcher Agent (`src/agents/job_matcher.py`)

```python
class JobMatcherAgent:
    def __init__(self, vector_db, skills_data):
        self.llm = ChatOpenAI(model_name="gpt-4", temperature=0.1)
        self.vector_db = vector_db
        self.skills_data = skills_data
        self.agent = self._create_agent()
    
    def _create_agent(self):
        """Create job matching agent"""
        
        @tool
        def search_jobs(skills: list, location: str, salary_min: int) -> list:
            """Search jobs matching user skills"""
            # Query vector DB for similar jobs
            jobs = self.vector_db.search(skills, location, salary_min)
            return jobs
        
        @tool
        def calculate_match_score(user_skills: list, job_requirements: list) -> float:
            """Calculate how well user matches job"""
            matched = len(set(user_skills) & set(job_requirements))
            total = len(job_requirements)
            score = matched / total if total > 0 else 0
            return score
        
        @tool
        def get_skill_transfer(current_skills: list, target_role: str) -> dict:
            """Show how current skills transfer to new role"""
            transfer = {
                'directly_applicable': [],
                'transferable': [],
                'learning_curve': 'medium'
            }
            return transfer
        
        tools = [search_jobs, calculate_match_score, get_skill_transfer]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a job matching expert. Find best job fits."),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        agent = create_openai_functions_agent(self.llm, tools, prompt)
        return AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    def find_matches(self, user_profile: dict) -> list:
        """Find matching jobs for user"""
        result = self.agent.invoke({
            "input": f"Find jobs for: {json.dumps(user_profile)}"
        })
        return result['output']
```

### Task 3: Salary Prediction Agent (`src/agents/salary_predictor.py`)

```python
class SalaryPredictorAgent:
    def __init__(self, ml_model):
        self.llm = ChatOpenAI(model_name="gpt-4", temperature=0.1)
        self.model = ml_model  # Pre-trained salary prediction model
        self.agent = self._create_agent()
    
    def _create_agent(self):
        """Create salary prediction agent"""
        
        @tool
        def predict_salary(role: str, experience_years: int, 
                          skills: list, location: str) -> dict:
            """Predict salary using ML model"""
            features = self._encode_features(role, experience_years, 
                                            skills, location)
            prediction = self.model.predict(features)
            
            return {
                'estimated_salary': prediction,
                'confidence': 0.85,
                'range': {
                    'low': prediction * 0.9,
                    'high': prediction * 1.1
                }
            }
        
        @tool
        def get_market_trends(role: str, location: str) -> dict:
            """Get salary trends for role/location"""
            # Query market data
            trends = {
                'trend': 'increasing',
                'growth_rate': 5.2,
                'demand': 'high'
            }
            return trends
        
        tools = [predict_salary, get_market_trends]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are a salary expert providing market insights."),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        agent = create_openai_functions_agent(self.llm, tools, prompt)
        return AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    def estimate_compensation(self, user_profile: dict) -> dict:
        """Provide salary estimate"""
        result = self.agent.invoke({
            "input": f"Estimate salary for: {json.dumps(user_profile)}"
        })
        return result['output']
```

### Task 4: Interview Coach Agent (`src/agents/interview_coach.py`)

```python
class InterviewCoachAgent:
    def __init__(self):
        self.llm = ChatOpenAI(model_name="gpt-4", temperature=0.7)
        self.agent = self._create_agent()
    
    def _create_agent(self):
        """Create interview coaching agent"""
        
        @tool
        def get_common_questions(role: str, company: str) -> list:
            """Get typical interview questions"""
            questions = [
                "Tell me about a challenging project",
                "How do you approach problem-solving?",
                "Describe your ML/AI experience"
            ]
            return questions
        
        @tool
        def provide_answer_framework(question: str, role: str) -> str:
            """Give structured answer framework"""
            framework = """
            1. Situation: Describe the context
            2. Action: Explain what you did
            3. Result: Share the outcome
            4. Learning: Discuss insights
            """
            return framework
        
        @tool
        def evaluate_answer(answer: str, question: str) -> dict:
            """Evaluate answer quality"""
            feedback = {
                'score': 7.5,
                'strengths': ['Clear examples', 'Quantified results'],
                'improvements': ['Add more technical depth']
            }
            return feedback
        
        tools = [get_common_questions, provide_answer_framework, evaluate_answer]
        
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert interview coach. Prepare candidates."),
            ("human", "{input}"),
            ("placeholder", "{agent_scratchpad}")
        ])
        
        agent = create_openai_functions_agent(self.llm, tools, prompt)
        return AgentExecutor(agent=agent, tools=tools, verbose=True)
    
    def prepare_interview(self, role: str, company: str) -> dict:
        """Create interview preparation plan"""
        result = self.agent.invoke({
            "input": f"Prepare me for interview at {company} for {role}"
        })
        return result['output']
```

### Task 5: Orchestrator (`src/orchestrator.py`)

```python
from langgraph.graph import StateGraph, END
from typing import TypedDict

class JobPortalState(TypedDict):
    user_id: str
    resume_text: str
    target_role: str
    location: str
    messages: list
    resume_analysis: dict
    job_matches: list
    salary_info: dict
    interview_prep: dict

class JobPortalOrchestrator:
    def __init__(self):
        self.resume_agent = ResumeAnalyzerAgent()
        self.matcher_agent = JobMatcherAgent(vector_db, skills_data)
        self.salary_agent = SalaryPredictorAgent(ml_model)
        self.interview_agent = InterviewCoachAgent()
        self.recruiter_agent = RecruiterInsightsAgent()
        
        self.workflow = self._create_workflow()
    
    def _create_workflow(self):
        """Create multi-agent workflow using LangGraph"""
        
        graph = StateGraph(JobPortalState)
        
        # Add nodes (agents)
        graph.add_node("resume_analysis", self._run_resume_agent)
        graph.add_node("job_matching", self._run_matcher_agent)
        graph.add_node("salary_analysis", self._run_salary_agent)
        graph.add_node("interview_prep", self._run_interview_agent)
        graph.add_node("recruiter_insights", self._run_recruiter_agent)
        graph.add_node("synthesis", self._synthesize_results)
        
        # Add edges (workflow)
        graph.set_entry_point("resume_analysis")
        graph.add_edge("resume_analysis", "job_matching")
        graph.add_edge("job_matching", "salary_analysis")
        graph.add_edge("salary_analysis", "interview_prep")
        graph.add_edge("interview_prep", "recruiter_insights")
        graph.add_edge("recruiter_insights", "synthesis")
        graph.add_edge("synthesis", END)
        
        return graph.compile()
    
    def _run_resume_agent(self, state):
        """Step 1: Analyze resume"""
        analysis = self.resume_agent.analyze(state["resume_text"])
        state["resume_analysis"] = analysis
        return state
    
    def _run_matcher_agent(self, state):
        """Step 2: Find matching jobs"""
        matches = self.matcher_agent.find_matches({
            'skills': state["resume_analysis"].get('skills'),
            'target_role': state["target_role"],
            'location': state["location"]
        })
        state["job_matches"] = matches
        return state
    
    def _run_salary_agent(self, state):
        """Step 3: Get salary estimates"""
        salary_info = self.salary_agent.estimate_compensation({
            'role': state["target_role"],
            'experience': state["resume_analysis"].get('years_exp'),
            'skills': state["resume_analysis"].get('skills')
        })
        state["salary_info"] = salary_info
        return state
    
    def _run_interview_agent(self, state):
        """Step 4: Prepare for interviews"""
        prep = self.interview_agent.prepare_interview(
            state["target_role"],
            state["job_matches"][0]['company'] if state["job_matches"] else ""
        )
        state["interview_prep"] = prep
        return state
    
    def _run_recruiter_agent(self, state):
        """Step 5: Get recruiter insights"""
        insights = self.recruiter_agent.get_insights(state["target_role"])
        state["recruiter_insights"] = insights
        return state
    
    def _synthesize_results(self, state):
        """Final: Synthesize all agent outputs"""
        synthesis = {
            'summary': 'Career action plan...',
            'next_steps': [
                'Apply to top 3 matching jobs',
                'Practice interview with coach',
                'Negotiate salary based on market data'
            ]
        }
        state["synthesis"] = synthesis
        return state
    
    def process_user(self, user_id: str, resume_text: str, 
                    target_role: str, location: str):
        """Execute full workflow for user"""
        
        initial_state = {
            'user_id': user_id,
            'resume_text': resume_text,
            'target_role': target_role,
            'location': location,
            'messages': []
        }
        
        result = self.workflow.invoke(initial_state)
        return result
```

### Task 6: FastAPI Application

```python
from fastapi import FastAPI, Depends, WebSocket
from pydantic import BaseModel

app = FastAPI(title="Multi-Agent Job Portal")

orchestrator = JobPortalOrchestrator()
memory = ConversationMemory()

class JobPortalRequest(BaseModel):
    resume_text: str
    target_role: str
    location: str

class CareerPlanResponse(BaseModel):
    resume_analysis: dict
    job_matches: list
    salary_insights: dict
    interview_prep: dict
    next_steps: list

@app.post("/analyze", response_model=CareerPlanResponse)
async def create_career_plan(request: JobPortalRequest):
    """Create comprehensive career plan"""
    
    result = orchestrator.process_user(
        user_id="user_123",
        resume_text=request.resume_text,
        target_role=request.target_role,
        location=request.location
    )
    
    return CareerPlanResponse(
        resume_analysis=result['resume_analysis'],
        job_matches=result['job_matches'],
        salary_insights=result['salary_info'],
        interview_prep=result['interview_prep'],
        next_steps=result['synthesis']['next_steps']
    )

@app.websocket("/chat")
async def websocket_chat(websocket: WebSocket):
    """Real-time chat with agents"""
    await websocket.accept()
    
    while True:
        message = await websocket.receive_text()
        
        # Route to appropriate agent
        response = orchestrator.router.route(message)
        
        await websocket.send_json(response)

@app.get("/health")
def health():
    return {"status": "healthy"}
```

---

## 📊 System Architecture

```
User Input
    ↓
[Orchestrator]
    ├→ Resume Analyzer Agent → Extract skills/experience
    ├→ Job Matcher Agent → Find matching opportunities
    ├→ Salary Predictor Agent → Estimate compensation
    ├→ Interview Coach Agent → Prepare for interviews
    └→ Recruiter Insights Agent → Market intelligence
    ↓
[Memory System] - Retain user context
    ↓
[Vector DB] - Store and search jobs/resumes
    ↓
[Monitoring] - Log all agent actions
    ↓
User Response (Career Plan)
```

---

## ✅ Submission Checklist

- [ ] All 5+ agents implemented and tested
- [ ] Orchestrator coordinates agent workflow
- [ ] Memory system retains context
- [ ] Tools integrated for data access
- [ ] FastAPI endpoints functional
- [ ] WebSocket chat operational
- [ ] Vector database integration working
- [ ] Monitoring & logging implemented
- [ ] Unit & integration tests passing
- [ ] Docker image builds
- [ ] Kubernetes deployment yaml ready
- [ ] Azure ready for production
- [ ] GitHub repo with full documentation
- [ ] Performance benchmarks documented

---

## 🚀 Production Deployment

```bash
# Docker
docker build -t job-portal-ai:latest .
docker push myregistry.azurecr.io/job-portal-ai:latest

# Kubernetes
kubectl apply -f kubernetes/deployment.yaml

# Monitoring
kubectl port-forward svc/job-portal-ai 8000:8000
```

---

**Time Estimate:** 30-40 hours  
**Difficulty:** ⭐⭐⭐⭐⭐ (Expert)

---

## 🏆 Congratulations!

You've completed the **AI & ML Mastery Roadmap** with 6 phases and capstone projects. You've progressed from Python fundamentals to building sophisticated multi-agent AI systems.

**What's Next:**
- Deploy projects publicly for portfolio
- Contribute to open-source AI projects
- Stay updated with latest research
- Consider AI specialization path
- Mentor others & build community

**Career Path:** AI Engineer → AI Architect → AI Research/Leadership

---

**Completion Date:** [Your Date]  
**Capstone Portfolio:** Link to your GitHub  
**Next Challenge:** Beyond the roadmap - your own innovation!
