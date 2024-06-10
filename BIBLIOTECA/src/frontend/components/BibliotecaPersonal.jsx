import React from 'react';

const BibliotecaPersonal = ({ libros, onMarcarLeido, onEliminarLibro }) => {
  return (
    <div>
      <h2>Biblioteca Personal</h2>
      {libros.map((libro) => (
        <div key={libro.id}>
          <img src={libro.icono} alt="Icono del libro" />
          <span>{libro.titulo}</span>
          <button onClick={() => onMarcarLeido(libro)}>Marcar como Leído</button>
          <button onClick={() => onEliminarLibro(libro)}>Eliminar de Biblioteca Personal</button>
        </div>
      ))}
    </div>
  );
};

export default BibliotecaPersonal;