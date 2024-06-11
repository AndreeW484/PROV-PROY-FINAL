import React, { useState, useEffect } from 'react';
import Login from './frontend/components/PLogin';
import RepositorioLibros from './frontend/components/RepositorioLibros';
import BibliotecaPersonal from './frontend/components/BibliotecaPersonal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); 
  const [librosRepositorio, setLibrosRepositorio] = useState([]);
  const [librosBiblioteca, setLibrosBiblioteca] = useState([]);

  useEffect(() => {
    if (isLoggedIn) {
      
      fetch('http://localhost:5000/libros')
        .then(response => response.json())
        .then(data => setLibrosRepositorio(data))
        .catch(error => console.error('Error al obtener los libros:', error));
    }
  }, [isLoggedIn]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    
    fetch(`http://localhost:5000/usuarios/${userId}/libros`)
      .then(response => response.json())
      .then(data => setLibrosBiblioteca(data))
      .catch(error => console.error('Error al obtener los libros de la biblioteca personal:', error));
  };

  const handleAgregarLibro = (libro) => {
    
    setLibrosBiblioteca([...librosBiblioteca, libro]);
  };

  const handleMarcarLeido = (libro) => {
    
    setLibrosBiblioteca(librosBiblioteca.map(l => l.id === libro.id ? { ...l, leido: true } : l));
  };

  const handleEliminarLibro = (libro) => {
    
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

