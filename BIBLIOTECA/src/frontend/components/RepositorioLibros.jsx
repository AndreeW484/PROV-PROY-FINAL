import React from 'react';

const RepositorioLibros = ({ libros, onAgregarLibro }) => {
  return (
    <div>
      <h2>Repositorio de Libros</h2>
      {libros.map((libro) => (
        <div key={libro.id}>
          <img src={libro.icono} alt="Icono del libro" />
          <span>{libro.titulo}</span>
          <button onClick={() => onAgregarLibro(libro)}>Agregar a Biblioteca Personal</button>
        </div>
      ))}
    </div>
  );
};

export default RepositorioLibros;