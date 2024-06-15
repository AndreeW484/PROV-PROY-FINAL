import sqlite3
from werkzeug.security import generate_password_hash

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn

def insert_initial_user():
    conn = get_db_connection()

    # Inserción del usuario inicial
    usuario = {
        'nombre': 'Admin',
        'correo': 'admin@upana.com',
        'contrasena': generate_password_hash('password'),  # Encripta la contraseña
    }

    conn.execute('''
        INSERT INTO Usuario (nombre, correo, contrasena)
        VALUES (?, ?, ?)
    ''', (usuario['nombre'], usuario['correo'], usuario['contrasena']))

    conn.commit()
    conn.close()

if __name__ == '__main__':
    insert_initial_user()
    print('Usuario inicial insertado exitosamente.')