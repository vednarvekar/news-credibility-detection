TruthLens 🔎
============

AI-Powered News Credibility Detection Platform

TruthLens analyzes online news articles and evaluates their credibility using AI (LLMs), domain reputation signals, and structured content analysis.

🌐 **Live Frontend:**[https://news-credibility-detection.lovable.app](https://news-credibility-detection.lovable.app)

🚀 Features
-----------

*   🔐 JWT Authentication (Signup / Login)
    
*   🌐 URL-Based Article Analysis
    
*   🤖 AI Credibility Scoring (0–100)
    
*   📊 Intelligent Classification
    
    *   Likely Real
        
    *   Suspicious
        
    *   Likely Fake
        
*   🏷 Domain Reputation Check
    
*   🧠 Satire & Tone Awareness
    
*   ⚡ Skeleton Loading UI (No blank screens)
    
*   🔒 Protected API Routes
    

🏗 Tech Stack
-------------

### Frontend

*   React + TypeScript
    
*   Tailwind CSS
    
*   Framer Motion
    
*   Deployed via Lovable
    

### Backend

*   Node.js + Express (TypeScript, ESM)
    
*   OpenRouter LLM API
    
*   JWT Authentication
    
*   Cheerio Web Scraping
    
*   Domain Heuristic Engine
    

📁 Project Structure
--------------------


# Backend
news-credibility-detection/

├── app/                
│   
├── src/
│   
│   
├── auth.ts
│   
│   
├── authStore.ts
│   
│   
├── scraper.ts
│   
│   
├── llm.ts
│   
│   
├── domainCheck.ts
│   
│   
└── server.ts
│
# Frontend (React UI)│
├── web/                
└── README.md

🧠 How It Works
---------------

1.  User signs up or logs in.
    
2.  User pastes a news article URL.
    
3.  Backend:
    
    *   Scrapes article content
        
    *   Evaluates domain reputation
        
    *   Sends structured input to LLM
        
4.  LLM returns:
    
    *   Credibility score
        
    *   Classification label
        
    *   Indicators
        
    *   Summary
        
5.  Frontend renders structured visual result.
    

🔐 Authentication
-----------------

*   JWT-based authentication
    
*   Token stored in localStorage
    
*   /analyze route protected via Bearer token
    

🛠 Backend Setup
----------------

### 1️⃣ Navigate to backend

`   cd app   `

### 2️⃣ Install dependencies

`   npm install   `

### 3️⃣ Create .env

`   OPENROUTER_API_KEY=your_api_keyJWT_SECRET=your_super_secret_key   `

### 4️⃣ Start server

`   npm run dev   `

Server runs on:

`   http://localhost:5000   `

🌐 API Endpoints
----------------

### Register

`POST /auth/register`

### Login

`   POST /auth/login   `

### Analyze Article

`   POST /analyzeHeaders:Authorization: Bearer Body:{  "url": "https://example.com/article"}   `

📊 Example Response
-------------------

`   {  
"score": 72,  
"classification": "Likely Real",  
"indicators": [    "Credible journalistic tone",    "Verifiable context",    "Balanced reporting"  ],  
"summary": "The article appears to present factual reporting..."}   `

⚠ Limitations
-------------

*   In-memory user storage (resets on server restart)
    
*   LLM-based evaluation (not a legal authority)
    
*   Designed for academic demonstration purposes
    

🎓 Academic Context
-------------------

Built as a full-stack AI demonstration project showcasing:

*   Secure backend architecture
    
*   JWT authentication
    
*   LLM integration
    
*   Content scraping
    
*   Hybrid heuristic + AI analysis
    
*   Modern animated UI
    

👤 Author
---------

Ved Narvekar Software Developer | AI Enthusiast
