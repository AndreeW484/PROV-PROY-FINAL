import sqlite3
import pandas as pd

# Nombre de tu archivo CSV y tabla SQLite
csv_file = 'libros_cargainicial.csv'
sqlite_db = 'database.db'

# Conectar a la base de datos SQLite
conn = sqlite3.connect(sqlite_db)

# Leer el CSV en un DataFrame
df = pd.read_csv(csv_file)

# Insertar cada registro del DataFrame en la tabla SQLite
df.to_sql('Libro', conn, if_exists='append', index=False)

# Cerrar la conexión
conn.close()

print('Registros insertados correctamente en la base de datos SQLite.')