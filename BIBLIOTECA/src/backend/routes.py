from flask import request, jsonify
from app import app
from models import get_db_connection

# Biblioteca General de Libros

# Obtener todos los libros
@app.route('/libros', methods=['GET'])
def get_all_libros():
    conn = get_db_connection()
    libros = conn.execute('SELECT * FROM Libro').fetchall()
    conn.close()
    return jsonify([dict(libro) for libro in libros])

# Biblioteca Personal de Usuario

# Obtener libros del usuario
@app.route('/usuarios/<int:id_usuario>/libros', methods=['GET'])
def get_libros_usuario(id_usuario):
    conn = get_db_connection()
    libros_usuario = conn.execute('''
        SELECT Libro.*
        FROM Libro
        INNER JOIN Usuario_Libro ON Libro.id = Usuario_Libro.id_libro
        WHERE Usuario_Libro.id_usuario = ?
    ''', (id_usuario,)).fetchall()
    conn.close()
    return jsonify([dict(libro) for libro in libros_usuario])

# Agregar libro a la biblioteca del usuario
@app.route('/usuarios/<int:id_usuario>/libros', methods=['POST'])
def agregar_libro_usuario(id_usuario):
    data = request.json
    id_libro = data.get('id_libro')

    conn = get_db_connection()
    libro_existente = conn.execute('''
        SELECT * FROM Usuario_Libro 
        WHERE id_usuario = ? AND id_libro = ?
    ''', (id_usuario, id_libro)).fetchone()

    if libro_existente:
        conn.close()
        return jsonify({"message": "El libro ya está en la biblioteca del usuario"}), 400

    conn.execute('''
        INSERT INTO Usuario_Libro (id_usuario, id_libro) 
        VALUES (?, ?)
    ''', (id_usuario, id_libro))
    conn.commit()
    conn.close()

    return jsonify({"message": "Libro agregado a la biblioteca del usuario con ID {}".format(id_usuario)})

# Eliminar libro de la biblioteca del usuario
@app.route('/usuarios/<int:id_usuario>/libros/<int:id_libro>', methods=['DELETE'])
def eliminar_libro_usuario(id_usuario, id_libro):
    conn = get_db_connection()
    libro_existente = conn.execute('''
        SELECT * FROM Usuario_Libro 
        WHERE id_usuario = ? AND id_libro = ?
    ''', (id_usuario, id_libro)).fetchone()

    if not libro_existente:
        conn.close()
        return jsonify({"message": "El libro no está en la biblioteca del usuario"}), 404

    conn.execute('''
        DELETE FROM Usuario_Libro 
        WHERE id_usuario = ? AND id_libro = ?
    ''', (id_usuario, id_libro))
    conn.commit()
    conn.close()

    return jsonify({"message": "Libro eliminado de la biblioteca del usuario con ID {}".format(id_usuario)})

# Inicio de Sesión de Usuario

# Iniciar sesión de usuario
@app.route('/usuarios/login', methods=['GET', 'POST'])
def login_usuario():
    if request.method == 'POST':
        # Lógica para iniciar sesión
        return jsonify({"message": "Inicio de sesión exitoso. Bienvenido!"})
    else:
        return jsonify({"message": "Para iniciar sesión, envía una solicitud POST con tus credenciales"})
