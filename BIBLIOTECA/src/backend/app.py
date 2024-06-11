from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from models import init_db
from routes import register_routes

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_jwt_secret_key'
jwt = JWTManager(app)
CORS(app, resources={r"/*": {"origins": "*"}})

# Inicializar la base de datos
init_db()

# Registrar rutas
register_routes(app)

# Middleware para agregar encabezados CORS a las respuestas
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

if __name__ == "__main__":
    app.run(debug=True)