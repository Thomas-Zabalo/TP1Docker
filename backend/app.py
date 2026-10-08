import sys
import signal
from flask import Flask, jsonify

app = Flask(__name__)

def signal_handler():
    print('Arrêt propre du serveur...')
    sys.exit(0)

signal.signal(signal.SIGTERM, signal_handler)

@app.get("/api/hello")
def hello():
    return jsonify(message="Hello World depuis le back !")

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)