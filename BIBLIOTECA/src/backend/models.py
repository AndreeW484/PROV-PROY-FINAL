# Importar el módulo para trabajar con SQLite
import sqlite3

# Función para inicializar la base de datos
def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Crear tabla Usuario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuario (
            id INTEGER PRIMARY KEY,
            nombre TEXT,
            email TEXT UNIQUE,
            contraseña TEXT
        )
    ''')
    
    # Crear tabla Libro
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Libro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT,
            autores TEXT,
            editorial TEXT,
            fecha_publicacion TEXT,
            isbn TEXT,
            numero_paginas INTEGER,
            genero TEXT,
            idioma TEXT,
            estado_libro TEXT
        )
    ''')
    
    # Crear tabla de relación Usuario/Libro
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuario_Libro (
            id_usuario INTEGER,
            id_libro INTEGER,
            FOREIGN KEY(id_usuario) REFERENCES Usuario(id),
            FOREIGN KEY(id_libro) REFERENCES Libro(id),
            PRIMARY KEY (id_usuario, id_libro)
        )
    ''')
    
    conn.commit()
    conn.close()

# Función para obtener una conexión a la base de datos
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn