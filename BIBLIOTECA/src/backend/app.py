from flask import Flask
from flask_cors import CORS
from models import init_db

app = Flask(__name__)
CORS(app)

# Inicializar la base de datos
init_db()

import routes

if __name__ == "__main__":
    app.run(debug=True)