import React, { useState } from 'react';
import Login from './frontend/components/PLogin';
import RepositorioLibros from './frontend/components/RepositorioLibros';
import BibliotecaPersonal from './frontend/components/BibliotecaPersonal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [librosBiblioteca, setLibrosBiblioteca] = useState([]);
  const [paginaActual, setPaginaActual] = useState('login');

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleNavigate = (pagina) => {
    setPaginaActual(pagina);
  };

  return (
    <div className="App">
      {paginaActual === 'login' && !isLoggedIn && (
        <Login onLogin={handleLogin} />
      )}
      {paginaActual !== 'login' && isLoggedIn && (
        <>
          <button onClick={() => setIsLoggedIn(false)}>Cerrar sesión</button>
          {paginaActual === 'repositorio' && (
            <RepositorioLibros onNavigate={handleNavigate} />
          )}
          {paginaActual === 'biblioteca' && (
            <BibliotecaPersonal libros={librosBiblioteca} onNavigate={handleNavigate} />
          )}
        </>
      )}
      {isLoggedIn && (
        <>
          <button onClick={() => handleNavigate('repositorio')}>Ver Repositorio de Libros</button>
          <button onClick={() => handleNavigate('biblioteca')}>Ver Biblioteca Personal</button>
        </>
      )}
    </div>
  );
}

export default App;