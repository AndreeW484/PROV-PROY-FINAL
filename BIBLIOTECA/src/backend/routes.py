from flask import request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import app
from models import get_db_connection

# Ruta para obtener todos los libros
@app.route('/libros', methods=['GET'])
def get_all_libros():
    conn = get_db_connection()
    libros = conn.execute('SELECT * FROM Libro').fetchall()
    conn.close()
    return jsonify([dict(libro) for libro in libros])

# Ruta para obtener libros de un usuario
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

# Ruta para agregar un libro a la biblioteca de un usuario
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

    return jsonify({"message": "Libro agregado a la biblioteca del usuario con ID {}".format(id_usuario)}), 201

# Ruta para eliminar un libro de la biblioteca de un usuario
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

    return jsonify({"message": "Libro eliminado de la biblioteca del usuario con ID {}".format(id_usuario)}), 200

# Ruta para iniciar sesión de usuario
@app.route('/usuarios/login', methods=['POST'])
def login_usuario():
    data = request.json
    correo = data.get('correo_electronico')
    contrasena = data.get('contrasena')

    conn = get_db_connection()
    usuario = conn.execute('''
        SELECT * FROM Usuario 
        WHERE correo_electronico = ? AND contrasena = ?
    ''', (correo, contrasena)).fetchone()

    conn.close()

    if usuario:
        access_token = create_access_token(identity=usuario['id'])
        return jsonify({"access_token": access_token}), 200
    else:
        return jsonify({"message": "Correo electrónico o contraseña incorrectos"}), 401

# Ruta para registrar un nuevo usuario
@app.route('/usuarios/registro', methods=['POST'])
def registro_usuario():
    data = request.json
    nombre = data.get('nombre')
    correo = data.get('correo_electronico')
    contrasena = data.get('contrasena')

    conn = get_db_connection()
    usuario_existente = conn.execute('SELECT * FROM Usuario WHERE correo_electronico = ?', (correo,)).fetchone()
    if usuario_existente:
        conn.close()
        return jsonify({"message": "El correo electrónico ya está registrado"}), 400

    conn.execute('INSERT INTO Usuario (nombre, correo_electronico, contrasena) VALUES (?, ?, ?)', (nombre, correo, contrasena))
    conn.commit()
    conn.close()

    return jsonify({"message": "Usuario registrado correctamente"}), 201

# Ruta para obtener detalles del usuario autenticado
@app.route('/usuarios/detalles', methods=['GET'])
@jwt_required()
def obtener_detalles_usuario():
    usuario_id = get_jwt_identity()

    conn = get_db_connection()
    usuario = conn.execute('SELECT * FROM Usuario WHERE id = ?', (usuario_id,)).fetchone()
    conn.close()

    return jsonify({"usuario": dict(usuario)}), 200

# Ruta para actualizar información del usuario
@app.route('/usuarios/detalles', methods=['PUT'])
@jwt_required()
def actualizar_usuario():
    usuario_id = get_jwt_identity()
    data = request.json
    nombre_nuevo = data.get('nombre')
    correo_nuevo = data.get('correo_electronico')

    conn = get_db_connection()
    conn.execute('UPDATE Usuario SET nombre = ?, correo_electronico = ? WHERE id = ?', (nombre_nuevo, correo_nuevo, usuario_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Información del usuario actualizada correctamente"}), 200

