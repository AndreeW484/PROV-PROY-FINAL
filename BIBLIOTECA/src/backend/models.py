import sqlite3

# Función para inicializar la base de datos
def init_db():
    # Conectar a la base de datos
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    
    # Crear tabla Usuario
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuario (
            id INTEGER PRIMARY KEY,
            nombre VARCHAR(100),  -- Nombre del usuario
            correo VARCHAR(255) UNIQUE,  -- Correo electrónico del usuario (debe ser único)
            contrasena TEXT  -- Contraseña del usuario
        )
    ''')
    
    # Crear tabla Libro
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Libro (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo VARCHAR(255),  -- Título del libro
            autores VARCHAR(255),  -- Autores del libro
            editorial VARCHAR(100),  -- Editorial del libro
            fecha_publicacion DATE,  -- Fecha de publicación del libro
            isbn TEXT,  -- ISBN del libro
            numero_paginas INTEGER,  -- Número de páginas del libro
            genero VARCHAR(50),  -- Género del libro
            idioma VARCHAR(50),  -- Idioma del libro
            estado_libro VARCHAR(20)  -- Estado actual del libro
        )
    ''')
    
    # Crear tabla de relación Usuario/Libro
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS Usuario_Libro (
            id_usuario INTEGER,  -- ID del usuario
            id_libro INTEGER,  -- ID del libro
            FOREIGN KEY(id_usuario) REFERENCES Usuario(id),  -- Clave foránea que referencia al ID del usuario
            FOREIGN KEY(id_libro) REFERENCES Libro(id),  -- Clave foránea que referencia al ID del libro
            PRIMARY KEY (id_usuario, id_libro)  -- Clave primaria compuesta por el ID del usuario y del libro
        )
    ''')
    
    # Confirmar cambios y cerrar conexión
    conn.commit()
    conn.close()

# Función para obtener una conexión a la base de datos
def get_db_connection():
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    return conn