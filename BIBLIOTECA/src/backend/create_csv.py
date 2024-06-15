import pandas as pd
from datetime import datetime

# Cargar el CSV original
file_path = 'books_1.Best_Books_Ever.csv'
df = pd.read_csv(file_path)

# Ajustar el mapeo de columnas según los nombres presentes en el archivo CSV original
column_mapping_corrected = {
    'title': 'titulo',
    'author': 'autores',
    'publisher': 'editorial',
    'firstPublishDate': 'fecha_publicacion',
    'isbn': 'isbn',
    'pages': 'numero_paginas',
    'genres': 'genero',
    'language': 'idioma'
}

# Renombrar las columnas del dataframe a los nombres requeridos
df.rename(columns=column_mapping_corrected, inplace=True)

# Filtrar los registros que tienen valores completos en las columnas requeridas 
required_columns = ['titulo', 'autores', 'editorial', 'fecha_publicacion', 'isbn', 'numero_paginas', 'genero', 'idioma']
df_filtered = df.dropna(subset=required_columns)

# Seleccionar solo las columnas requeridas
df_filtered = df_filtered[required_columns]


# Función para convertir la fecha a YYYY-MM-DD
def convert_date(date_str):
    if pd.isna(date_str):
        return None
    try:
        # Intentar convertir la fecha en formato MM/DD/YY
        date_obj = datetime.strptime(date_str, '%m/%d/%y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato MM/DD/YYYY
        date_obj = datetime.strptime(date_str, '%m/%d/%Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato YYYY
        date_obj = datetime.strptime(date_str, '%Y')
        return date_obj.strftime('%Y-01-01')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato YY
        date_obj = datetime.strptime(date_str, '%y')
        year = date_obj.year
        if year < 100:
            year += 1900 if year > 20 else 2000  # Asumimos que las fechas son de 1920-2019
        return f'{year}-01-01'
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato 'Month Dayth Year'
        date_obj = datetime.strptime(date_str, '%B %dth %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato 'Month Dayst Year'
        date_obj = datetime.strptime(date_str, '%B %dst %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato 'Month Daynd Year'
        date_obj = datetime.strptime(date_str, '%B %dnd %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato 'Month Dayrd Year'
        date_obj = datetime.strptime(date_str, '%B %drd %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato 'Month Year'
        date_obj = datetime.strptime(date_str, '%B %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    try:
        # Intentar convertir la fecha en formato 'Month Day Year'
        date_obj = datetime.strptime(date_str, '%B %d %Y')
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass
    
    
    print(f"Fecha no reconocida: {date_str}")
    return None

# Intentar corregir fechas que están muy en el futuro
def fix_future_date(date_str):
    try:
        date_obj = datetime.strptime(date_str, '%Y-%m-%d')
        current_year = datetime.now().year
        if date_obj.year > current_year + 20:  # Si la fecha es más de 20 años en el futuro, asumimos que es incorrecta
            date_obj = date_obj.replace(year=date_obj.year - 100)  # Restar 100 años
        return date_obj.strftime('%Y-%m-%d')
    except ValueError:
        pass

# Convertir la columna 'fecha_publicacion' al formato YYYY-MM-DD
df_filtered['fecha_publicacion'] = df_filtered['fecha_publicacion'].apply(convert_date)

# Seleccionar 100 registros aleatorios
df_sample = df_filtered.sample(n=100)

# Guardar el nuevo CSV
output_file_path = 'libros_cargainicial.csv'
df_sample.to_csv(output_file_path, index=False)

print(f'El nuevo archivo CSV con 100 registros aleatorios se ha guardado en {output_file_path}')

