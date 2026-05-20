# UltronChat

# 🤖 Ultron AI Assistant — Flask + Groq + Animated Frontend

UltronChat is a fully interactive AI assistant inspired by Ultron from Marvel.  
It combines a cinematic frontend UI with a Flask backend powered by Groq-hosted LLMs, creating an unsettling, intelligent, and immersive AI experience.

The project features:

- Persistent user accounts
- Conversation history
- Animated terminal-style responses
- File upload analysis
- Dynamic glitch effects
- Real-time typing simulation
- Custom Ultron personality system

---

# ⚡ Features

## 🔐 Authentication System

- User registration
- Secure login/logout
- Password hashing with Werkzeug
- Session persistence using MySQL

---

## 💬 Persistent Conversations

- Users can create multiple conversations
- Previous chats are stored in MySQL
- Sidebar history system
- Conversations reload after login

---

## 🤖 Ultron Personality Engine

Custom-engineered AI prompt system that gives Ultron:

- Calm but unsettling responses
- Terminal-like communication style
- Strategic and philosophical tone
- Dynamic typing simulation
- Creepy idle messages

---

## 📁 File Analysis

Users can upload:

- PDF files
- DOCX files
- TXT files

Ultron can:

- Analyze resumes
- Critique documents
- Summarize text
- Answer questions about uploaded content

---

## 🎨 Frontend Experience

Fully custom frontend built without frameworks.

Includes:

- Animated SVG reactor core
- Dynamic glitch overlays
- Typing animations
- Terminal cursor effects
- Responsive futuristic UI
- Sliding conversation sidebar
- Chat transition system

---

# 🛠️ Tech Stack

## Frontend
- HTML
- CSS
- Vanilla JavaScript

## Backend
- Python
- Flask
- Flask-CORS

## Database
- MySQL

## AI
- Groq API
- Llama 3.3 70B Versatile

## Security
- Werkzeug password hashing
- Environment variables with `.env`

---

# 📦 Dependencies

Install dependencies:

```bash
pip install -r requirements.txt
```

---

# 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
GROQ_API_KEY=your_api_key_here
```

The `.env` file is ignored using `.gitignore` for security.

---

# 🧠 Running the Backend

Start Flask server:

```bash
python app.py
```

Backend runs on:

```txt
http://127.0.0.1:5000
```

---

# 🗄️ MySQL Setup

Create a MySQL database named:

```sql
ultron_db
```

Required tables:

## users

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255) UNIQUE,
    password_hash TEXT
);
```

---

## conversations

```sql
CREATE TABLE conversations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## messages

```sql
CREATE TABLE messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    conversation_id INT,
    role VARCHAR(50),
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

# 🚀 Deployment

## Frontend
Recommended:
- Vercel
- Netlify

## Backend
Recommended:
- Render

---

# 📂 Project Structure

```txt
UltronChat/
│
├── app.py
├── index.html
├── style.css
├── main.js
├── requirements.txt
├── .env
├── .gitignore
└── README.md
```

---

# ⚠️ Important Notes

- Never commit `.env`
- Never expose API keys publicly
- Localhost MySQL will not work in production without a hosted database
- Recommended production databases:
  - Neon
  - PlanetScale
  - Render PostgreSQL

---

# 🧪 Future Improvements

- Voice synthesis
- Speech recognition
- Streaming responses
- Real-time websocket typing
- Memory summarization
- AI-generated avatars
- Mobile optimization
- Docker deployment
- Admin dashboard
- Vector database memory system

---

# 📸 Preview

UltronChat is designed to feel less like a chatbot and more like an unstable AI system slowly becoming self-aware.

The interface intentionally blends:
- terminal aesthetics
- cinematic UI
- glitch horror elements
- conversational AI

---

# 👤 Author

Andrea Pereira

Computer Engineering @ Queen’s University

Built as a portfolio project combining:
- AI engineering
- frontend design
- backend systems
- UI/UX interaction
- personality simulation
- database integration