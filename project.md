### .env
```py
# Configurações do Flask
FLASK_ENV="production"
FLASK_SECRET_KEY="sua_chave_secreta"

# Configurações do MongoDB
MONGODB_URI="mongodb://localhost:27017/motor_data"
```

### pyproject.toml
```py
[project]
name = "motor_monitoring_project"
requires-python = ">=3.10"
authors = [{ name="Seu Nome", email="seu_email@example.com" }]
description = "API de monitoramento em tempo real de motor"
readme = "README.md"
license = { text = "MIT" }
classifiers = [
  "Programming Language :: Python",
  "Programming Language :: Python :: 3.10",
]
dependencies = [
  "flask>=3.0.3",
  "flask_restx>=1.3.0",
  "gunicorn>=22.0.0",
  "gevent>=24.2.1",
  "python-dotenv>=1.0.0",
  "pymongo>=3.12.0",
  "flask-socketio>=5.2.0"
]

[project.optional-dependencies]
test = ["pytest>=7.0"]
docs = ["sphinx>=8.0.2", "furo>=2024.8.6"]
```

### app.py
```py
import dotenv
from flask import Flask
from flask_restx import Api
from flask_socketio import SocketIO

# Carregar variáveis de ambiente
dotenv.load_dotenv()

from project.config import Config
from project.routes import setup_routes

# Inicializar Flask e SocketIO
app = Flask(__name__)
app.config.from_object(Config)
socketio = SocketIO(app)

# Configurar a API
api = Api(app, version="1.0", title="Motor Monitoring API", description="API para monitoramento de motor em tempo real")
setup_routes(api)

if __name__ == "__main__":
    socketio.run(app, debug=True)
```

### project/config.py
```py
import os

class Config:
    FLASK_ENV = os.getenv("FLASK_ENV")
    SECRET_KEY = os.getenv("FLASK_SECRET_KEY")
    MONGODB_URI = os.getenv("MONGODB_URI")
```

### project/routes.py
```py
from flask_restx import Namespace, Resource
from project.services.motor_service import receive_motor_data, fetch_motor_history
from project.utils.middleware import middleware

def setup_routes(api):
    motor_ns = Namespace("Motor", description="Operações de monitoramento do motor")
    
    @motor_ns.route("/data")
    class MotorData(Resource):
        @middleware()
        def post(self, user_data):
            return receive_motor_data(user_data)

    @motor_ns.route("/history")
    class MotorHistory(Resource):
        def get(self):
            return fetch_motor_history()

    api.add_namespace(motor_ns)
```

### project/services/motor_service.py
```py
from datetime import datetime
from pymongo import MongoClient
from project.config import Config

# Configurando o cliente MongoDB
client = MongoClient(Config.MONGODB_URI)
db = client["motor_database"]
motor_collection = db["motor_data"]

def receive_motor_data(data):
    \"\"\"Armazena os dados do motor enviados pelo Arduino no MongoDB.\"\"\"
    motor_data = {
        "rpm": data.get("rpm"),
        "pwm": data.get("pwm"),
        "direction": data.get("direction"),
        "timestamp": datetime.utcnow()
    }
    motor_collection.insert_one(motor_data)
    return {"message": "Dados armazenados com sucesso."}

def fetch_motor_history():
    \"\"\"Recupera histórico de dados do motor.\"\"\"
    history = list(motor_collection.find({}, {"_id": 0}))
    return {"history": history}
```

### project/utils/middleware.py
```py
import functools
import logging
import traceback
from flask import jsonify, request

def middleware():
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            try:
                user_data = request.json
                return func(user_data=user_data, *args, **kwargs)
            except Exception as exc:
                logging.error(traceback.format_exc())
                return jsonify({"error": str(exc)}), 400
        return wrapper
    return decorator
```

# Motor Monitoring API

Este projeto implementa uma API para monitorar dados em tempo real de um motor controlado por Arduino, incluindo armazenamento histórico e gráficos em tempo real.

## Configuração e Execução

1. Defina as variáveis de ambiente no arquivo `.env`.
2. Instale as dependências com `pip install -r requirements.txt`.
3. Inicie o servidor com `python app.py`.

### Estrutura de Arquivos
- `app.py`: Configura a aplicação Flask e inicializa a API.
- `project/config.py`: Define as configurações de ambiente, incluindo o URI do MongoDB.
- `project/routes.py`: Define as rotas da API para coleta de dados e histórico.
- `project/services/motor_service.py`: Serviço para manipulação de dados do motor.
- `project/utils/middleware.py`: Middleware para tratamento de erros e validação.