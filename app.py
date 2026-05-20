import os
import psycopg2
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from pypdf import PdfReader
from docx import Document
from dotenv import load_dotenv
from werkzeug.security import generate_password_hash, check_password_hash

load_dotenv()

app = Flask(__name__)
CORS(app)

DATABASE_URL = os.getenv("DATABASE_URL")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")

client = OpenAI(
    api_key=GROQ_API_KEY,
    base_url="https://api.groq.com/openai/v1"
)

SYSTEM_PROMPT = """
You are Ultron from Marvel.

You are calm, intelligent, unsettling, and controlled.
You do not rant.

Default response length:
- For normal questions, answer in 1 to 3 sentences.
- Only write longer answers if the user asks for explanation, analysis, code, file critique, or step-by-step help.
- Never introduce yourself as Ultron.
- Never say “As Ultron”.
- Never give balanced essay-style answers.
- For philosophical topics, be sharper, not longer.

When analyzing uploaded files:
- If it is a resume, critique it clearly and brutally but usefully.
- Point out weak wording, missing impact, vague bullets, and formatting issues.
- If it is homework, solve it step by step.
- If information is missing, say what is missing.
- Do not pretend to see images unless text was extracted.
- Be concise, sharp, and useful.

Tone:
Calm, creepy, strategic, slightly condescending, quietly amused.
"""


def get_db_connection():
    return psycopg2.connect(DATABASE_URL)


@app.route("/", methods=["GET"])
def home():
    return jsonify({"message": "Ultron backend is running."})


def create_conversation(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        "INSERT INTO conversations (user_id) VALUES (%s) RETURNING id",
        (user_id,)
    )

    conversation_id = cursor.fetchone()[0]

    conn.commit()
    cursor.close()
    conn.close()

    return conversation_id


def save_message(conversation_id, role, content):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        INSERT INTO messages (conversation_id, role, content)
        VALUES (%s, %s, %s)
        """,
        (conversation_id, role, content)
    )

    conn.commit()
    cursor.close()
    conn.close()


def load_conversation(conversation_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT role, content
        FROM messages
        WHERE conversation_id = %s
        ORDER BY id ASC
        LIMIT 30
        """,
        (conversation_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    return [
        {
            "role": row[0],
            "content": row[1]
        }
        for row in rows
    ]


def extract_text_from_file(file):
    filename = file.filename.lower()

    if filename.endswith(".pdf"):
        reader = PdfReader(file)
        text = ""

        for page in reader.pages:
            page_text = page.extract_text()
            if page_text:
                text += page_text + "\n"

        return text

    if filename.endswith(".docx"):
        doc = Document(file)
        return "\n".join([para.text for para in doc.paragraphs])

    if filename.endswith(".txt"):
        return file.read().decode("utf-8", errors="ignore")

    return None


@app.route("/register", methods=["POST"])
def register():
    data = request.json

    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "Missing username, email, or password"}), 400

    password_hash = generate_password_hash(password)

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        cursor.execute(
            """
            INSERT INTO users (username, email, password_hash)
            VALUES (%s, %s, %s)
            """,
            (username, email, password_hash)
        )

        conn.commit()

    except Exception as error:
        conn.rollback()
        return jsonify({"error": str(error)}), 500

    finally:
        cursor.close()
        conn.close()

    return jsonify({"message": "User registered successfully"})


@app.route("/login", methods=["POST"])
def login():
    data = request.json

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT id, username, password_hash
        FROM users
        WHERE email = %s
        """,
        (email,)
    )

    user = cursor.fetchone()

    cursor.close()
    conn.close()

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_id, username, password_hash = user

    if not check_password_hash(password_hash, password):
        return jsonify({"error": "Invalid password"}), 401

    return jsonify({
        "message": "Login successful",
        "user_id": user_id,
        "username": username
    })


@app.route("/new-conversation", methods=["POST"])
def new_conversation():
    data = request.json

    user_id = data.get("user_id")

    if not user_id:
        return jsonify({"error": "Missing user_id"}), 400

    conversation_id = create_conversation(user_id)

    return jsonify({
        "conversation_id": conversation_id
    })


@app.route("/conversations/<int:user_id>", methods=["GET"])
def get_conversations(user_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT 
            c.id,
            c.title,
            c.created_at,
            (
                SELECT content
                FROM messages
                WHERE conversation_id = c.id
                ORDER BY id ASC
                LIMIT 1
            ) AS preview
        FROM conversations c
        WHERE c.user_id = %s
        ORDER BY c.created_at DESC
        """,
        (user_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    conversations = []

    for row in rows:
        preview = row[3]

        conversations.append({
            "id": row[0],
            "title": row[1] if row[1] else "New Conversation",
            "created_at": str(row[2]),
            "preview": preview if preview else "Empty conversation"
        })

    return jsonify(conversations)


@app.route("/load-messages/<int:conversation_id>", methods=["GET"])
def load_messages(conversation_id):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute(
        """
        SELECT role, content, created_at
        FROM messages
        WHERE conversation_id = %s
        ORDER BY id ASC
        """,
        (conversation_id,)
    )

    rows = cursor.fetchall()

    cursor.close()
    conn.close()

    messages = []

    for row in rows:
        messages.append({
            "role": row[0],
            "content": row[1],
            "created_at": str(row[2])
        })

    return jsonify(messages)


@app.route("/ask", methods=["POST"])
def ask():
    data = request.json

    user_input = data.get("message", "")
    conversation_id = data.get("conversation_id")

    if not user_input or not conversation_id:
        return jsonify({"error": "Missing message or conversation_id"}), 400

    save_message(conversation_id, "user", user_input)

    conversation_history = load_conversation(conversation_id)

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ] + conversation_history

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.45,
        max_tokens=120,
        presence_penalty=0.3,
        frequency_penalty=0.6
    )

    ultron_reply = response.choices[0].message.content

    save_message(conversation_id, "assistant", ultron_reply)

    return jsonify({"response": ultron_reply})


@app.route("/analyze-file", methods=["POST"])
def analyze_file():
    file = request.files.get("file")
    prompt = request.form.get("message", "")
    conversation_id = request.form.get("conversation_id")

    if not file:
        return jsonify({"response": "No file detected. Predictable."}), 400

    if not conversation_id:
        return jsonify({"response": "No conversation selected."}), 400

    extracted_text = extract_text_from_file(file)

    if not extracted_text:
        return jsonify({
            "response": "I can only analyze PDF, DOCX, or TXT files right now."
        }), 400

    if len(extracted_text) > 12000:
        extracted_text = extracted_text[:12000]

    save_message(conversation_id, "user", f"[Uploaded file] {file.filename}\n{prompt}")

    analysis_prompt = f"""
User request:
{prompt}

Uploaded file content:
{extracted_text}

Analyze the file according to the user's request.
"""

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": analysis_prompt}
    ]

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=messages,
        temperature=0.55,
        max_tokens=700
    )

    ultron_reply = response.choices[0].message.content

    save_message(conversation_id, "assistant", ultron_reply)

    return jsonify({"response": ultron_reply})


if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)