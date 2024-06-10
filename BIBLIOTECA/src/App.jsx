import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './frontend/components/PLogin';
import RepositorioLibros from './frontend/components/RepositorioLibros';
import BibliotecaPersonal from './frontend/components/BibliotecaPersonal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Añadido para manejar el ID del usuario
  const [librosRepositorio, setLibrosRepositorio] = useState([]);
  const [librosBiblioteca, setLibrosBiblioteca] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      // Cargar libros del repositorio solo si el usuario está autenticado
      fetch('http://localhost:5000/libros')
        .then(response => response.json())
        .then(data => setLibrosRepositorio(data))
        .catch(error => console.error('Error al obtener los libros:', error));
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    // Aquí puedes hacer una solicitud para obtener los libros de la biblioteca personal del usuario
    // Sustituye `userId` por el ID real del usuario autenticado
    fetch(`http://localhost:5000/usuarios/${userId}/libros`)
      .then(response => response.json())
      .then(data => setLibrosBiblioteca(data))
      .catch(error => console.error('Error al obtener los libros de la biblioteca personal:', error));
  };

  const handleAgregarLibro = (libro) => {
    // Aquí puedes enviar una solicitud al backend para agregar el libro a la biblioteca personal
    setLibrosBiblioteca([...librosBiblioteca, libro]);
  };

  const handleMarcarLeido = (libro) => {
    // Aquí puedes enviar una solicitud al backend para marcar el libro como leído en la biblioteca personal
    // Actualiza el estado en consecuencia
    setLibrosBiblioteca(librosBiblioteca.map(l => l.id === libro.id ? { ...l, leido: true } : l));
  };

  const handleEliminarLibro = (libro) => {
    // Aquí puedes enviar una solicitud al backend para eliminar el libro de la biblioteca personal
    setLibrosBiblioteca(librosBiblioteca.filter(l => l.id !== libro.id));
  };

  return (
    <div className="App">
      {!isLoggedIn ? (
        <Login onLogin={handleLogin} />
      ) : (
        <>
          <button onClick={() => setIsLoggedIn(false)}>Cerrar sesión</button>
          <RepositorioLibros libros={librosRepositorio} onAgregarLibro={handleAgregarLibro} />
          <BibliotecaPersonal libros={librosBiblioteca} onMarcarLeido={handleMarcarLeido} onEliminarLibro={handleEliminarLibro} />
        </>
      )}
    </div>
  );
}
export default App;

