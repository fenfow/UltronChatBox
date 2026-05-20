# UltronChat  
## 🤖 U.L.T.R.O.N — AI Conversational Interface

Live Demo:  
https://iamultron.netlify.app/

---

# Overview

UltronChat is a full-stack AI web application inspired by the Marvel character Ultron. The project combines a cinematic frontend experience with a production-style backend architecture, persistent cloud databases, user authentication, and AI-powered conversations.

The goal of the project was not simply to create another chatbot, but to design an AI interface with a strong identity, immersive interaction design, and scalable deployment practices similar to real-world software systems.

The application features:

- AI-powered conversations
- Persistent conversation history
- User authentication system
- Cloud-hosted PostgreSQL database
- Responsive futuristic UI
- Animated terminal-style responses
- Production deployment pipeline
- Secure environment variable handling

---

# 🚀 Live Project

Frontend (Netlify):  
https://iamultron.netlify.app/

Backend API (Render):  
Hosted separately using Render Web Services.

---

# 🧠 Features

## AI Conversation System
- Users can interact with an Ultron-inspired AI assistant
- Responses are generated dynamically using LLM APIs
- Streaming-style typing animation simulates terminal output

## Persistent Conversation History
- Every conversation is stored permanently in a PostgreSQL database
- Users can reopen previous chats from the sidebar
- Messages are linked relationally using conversation IDs

## Authentication System
- User registration and login
- Password hashing for security
- Session persistence using local storage

## File Upload Support
- Upload support for:
  - PDF
  - DOCX
  - TXT
- Backend file analysis endpoint integration

## Animated Frontend Experience
- Custom CSS animations
- Glitch effects
- Dynamic UI transitions
- Terminal-inspired typography
- Responsive sidebar behavior

---

# 🛠️ Tech Stack

## Frontend
- HTML5
- CSS3
- Vanilla JavaScript
- Bootstrap 5

## Backend
- Python
- Flask
- Flask-CORS
- psycopg2

## Database
- PostgreSQL
- Neon Serverless PostgreSQL

## Deployment
- Netlify (Frontend)
- Render (Backend API)

## AI Integration
- OpenAI-compatible API endpoint
- Environment variable secured API keys

---

# 🗄️ Why PostgreSQL + Neon?

Originally, the application was built using local storage concepts and temporary memory persistence. As the project evolved, conversation history and authentication required a true relational database architecture.

PostgreSQL was selected because:
- Industry-standard relational database
- Strong scalability
- Excellent support for structured relational data
- Reliable foreign key relationships
- Widely used in production software systems

The application stores:
- Users
- Conversations
- Individual messages

using relational links between tables.

---

## Why Neon?

Neon was chosen as the PostgreSQL provider because:

- Free serverless PostgreSQL hosting
- Modern cloud-native architecture
- Easy integration with Flask applications
- Production-grade SQL environment
- Automatic scaling
- Clean developer experience

Using Neon also introduced real-world backend engineering concepts such as:
- environment variables
- external database URLs
- cloud database connections
- production deployment debugging

This moved the project beyond a simple local prototype into a true deployed application architecture.

---

# ☁️ Deployment Architecture

## Frontend Deployment — Netlify

Netlify was used to host the frontend because:
- Extremely fast static hosting
- Automatic GitHub deployments
- CDN optimization
- Easy custom domain support
- Excellent frontend developer workflow

The frontend automatically redeploys whenever changes are pushed to GitHub.

---

## Backend Deployment — Render

Render was used for the Flask backend because:
- Native Python/Flask support
- Free deployment tier
- Built-in environment variable management
- Easy integration with PostgreSQL services

The backend exposes REST API endpoints used by the frontend application.

---

# 🔐 Security Improvements

During development, API keys were initially hardcoded locally for testing purposes. Before deployment, the project was refactored to use environment variables.

Security improvements included:
- `.env` configuration
- `.gitignore` protection
- hidden API keys
- separated production credentials
- secure backend-only API requests

This mirrors industry deployment standards and prevents sensitive credentials from being exposed publicly on GitHub.

---

# 🧩 Database Structure

## Users Table
Stores:
- username
- email
- hashed passwords

## Conversations Table
Stores:
- conversation ownership
- timestamps
- titles/previews

## Messages Table
Stores:
- sender role
- message content
- timestamps
- relational conversation IDs

This relational design allows scalable multi-user support and persistent conversation retrieval.

---

# 🎨 UI/UX Design Philosophy

A major focus of this project was creating a recognizable visual identity.

Instead of building a generic chatbot UI, the interface was designed around:
- intimidation
- machine aesthetics
- terminal interfaces
- cinematic AI behavior
- reactive animations

The UI includes:
- animated rotating SVG elements
- glitch overlays
- dynamic signal bars
- terminal-style typing cursor
- custom sidebar transitions
- red monochromatic cybernetic theme

The objective was to make the AI feel alive rather than simply functional.

---

# 📚 What I Learned

This project became significantly larger than initially expected and taught me practical software engineering concepts far beyond frontend design.

Key things I learned include:

## Full-Stack Architecture
- Connecting frontend interfaces to backend APIs
- Managing asynchronous fetch requests
- Handling client/server communication

## Cloud Deployment
- Deploying production applications
- Configuring Netlify + Render
- Managing environment variables
- Debugging deployment failures

## Database Engineering
- Designing relational SQL schemas
- PostgreSQL table relationships
- Persistent cloud-hosted databases
- SQL debugging and migrations

## Production Debugging
- Reading deployment logs
- Fixing CORS issues
- Solving backend/frontend communication failures
- Debugging database schema mismatches

## Security Practices
- Protecting API keys
- Using `.env` files properly
- Preventing credential exposure in GitHub repositories

## UI/UX Engineering
- Building immersive interfaces
- Managing complex CSS animation systems
- Designing responsive layouts
- Creating cinematic interaction feedback

Most importantly, this project taught me how much iteration real software development requires. Many issues only appeared after deployment, which forced deeper understanding of production systems, debugging workflows, and scalable architecture decisions.

---

# ⚙️ Future Improvements

Planned upgrades include:
- AI memory persistence
- Streaming token responses
- Voice synthesis
- User profile customization
- Conversation deletion/editing
- Better mobile optimization
- WebSocket-based real-time responses
- Docker containerization
- CI/CD workflows
- Redis caching layer

---

# 📂 Project Structure

```txt
frontend/
 ├── index.html
 ├── style.css
 └── main.js

app.py
requirements.txt
runtime.txt
README.md
```

---

# 👩‍💻 Author

Andrea Pereira  
Computer Engineering — Queen’s University

Live Demo:  
https://iamultron.netlify.app/