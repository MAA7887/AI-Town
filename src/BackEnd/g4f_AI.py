from flask import Flask, request, jsonify
from g4f.client import Client

app = Flask(__name__)
client = Client()

def generate_response(prompt):
    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role": "user",
                "content": prompt
            }
        ],
        web_search=False
    )
    return response.choices[0].message.content  # Return the generated content

@app.route('/api/generate', methods=['POST'])
def handle_request():
    data = request.json
    prompt = data.get('prompt', '')
    
    # Generate the response using the provided prompt
    response_content = generate_response(prompt)
    
    # Return the response as JSON
    return jsonify({'response': response_content})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)  # Run on port 5000