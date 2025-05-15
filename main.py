from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI

app = Flask(__name__)
CORS(app)

@app.route('/ask', methods=['POST'])
def ask():
    data = request.json
    user_input = data.get('message')

    response = client.completions.create(
        model="gpt-3.5-turbo-instruct",
        prompt=f"You are Ultron, a cold, calculating, and menacing AI. Respond to the user in a way that reflects your personality. User: {user_input}\nUltron:",
        max_tokens=150,
        temperature=0.5,
        stop=["\n"]
    )

    return jsonify({'response': response.choices[0].text.strip()})

if __name__ == '__main__':
    api_key = input("Enter your OpenAI API key: ")
    client = OpenAI(api_key=api_key)
    app.run(debug=True, use_reloader=False)
