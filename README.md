# UltronChat
# 🤖 Ultron AI — Flask + OpenAI + Animated Frontend Chatbot

A sleek, animated web chatbot that lets you talk to Ultron, the AI from the Marvel universe. This project combines a stylized front-end interface with a Flask backend connected to OpenAI’s GPT model (`gpt-3.5-turbo-instruct`), generating responses in-character.

## 🧠 What It Does

- Sends your input to an AI model via a Flask server
- Returns responses styled in the voice of Ultron
- Features an animated, futuristic interface with a glowing red aesthetic and rotating SVG elements
- All styling and JavaScript animations are done with vanilla CSS and JS — no frameworks

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Python, Flask, Flask-CORS
- **AI**: OpenAI API (GPT-3.5)
- **Security**: API key is requested at runtime — not hardcoded or committed

## 🔐 API Key Security

When starting the server, the app securely prompts for your OpenAI API key using:

```python
api_key = input("Enter your OpenAI API key: ")

