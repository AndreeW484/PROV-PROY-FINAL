from flask import Flask
from flask_cors import CORS
from models import init_db
from routes import register_routes

app = Flask(__name__)
CORS(app)

# Inicializar la base de datos
init_db()

# Registrar rutas
register_routes(app)

if __name__ == "__main__":
    app.run(debug=True)
