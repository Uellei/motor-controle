import dotenv
from flask import Flask
from flask_cors import CORS
from flask_restx import Api
from flask_socketio import SocketIO

dotenv.load_dotenv()

from routes import setup_routes
from utils.config import Config

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)
socketio = SocketIO(app)

# Configuração da API
api = Api(
    app,
    version="1.0",
    title="Motor Monitoring API",
    description="API for monitoring motors in real-time",
)
setup_routes(api)

if __name__ == "__main__":
    socketio.run(app, debug=True)
