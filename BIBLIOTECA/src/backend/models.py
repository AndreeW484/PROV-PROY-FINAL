import sqlite3

def init_db():
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    # Crear tabla de libros
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Libro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            autor TEXT NOT NULL,
            editorial TEXT,
            fecha_publicacion TEXT,
            isbn TEXT,
            numero_paginas INTEGER,
            genero TEXT,
            idioma TEXT,
            estado_libro TEXT
        )
    ''')
    # Crear tabla de usuarios
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuario (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            correo_electronico TEXT NOT NULL UNIQUE,
            contrasena TEXT NOT NULL
        )
    ''')
    # Crear tabla intermedia Usuario_Libro
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuario_Libro (
            id_usuario INTEGER,
            id_libro INTEGER,
            PRIMARY KEY (id_usuario, id_libro),
            FOREIGN KEY (id_usuario) REFERENCES Usuario(id),
            FOREIGN KEY (id_libro) REFERENCES Libro(id)
        )
    ''')
    conn.commit()
    conn.close()

def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn
