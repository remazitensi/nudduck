from flask import Flask, request, jsonify
import socket
import json

app = Flask(__name__)

host = "127.0.0.1"
port = 5050

def get_answer_from_bot(query):
    mySocket = socket.socket()
    mySocket.connect((host, port))
    
    json_data = {
        'Query': query,
        'BotType': "TEST"
    }
    message = json.dumps(json_data)
    mySocket.send(message.encode())

    data = mySocket.recv(2048).decode()
    response = json.loads(data)

    mySocket.close()

    return response

@app.route('/query', methods=['POST'])
def query():
    body = request.get_json()
    query = body.get("query")
    response = get_answer_from_bot(query)
    return jsonify(response)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
