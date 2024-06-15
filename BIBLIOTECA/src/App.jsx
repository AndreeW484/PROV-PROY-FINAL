import React, { useState } from 'react';
import Login from './frontend/components/PLogin'; 
import RepositorioLibros from './frontend/components/RepositorioLibros';
import BibliotecaPersonal from './frontend/components/BibliotecaPersonal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null); // Estado para almacenar el ID de usuario
  const [librosBiblioteca, setLibrosBiblioteca] = useState([]);
  const [paginaActual, setPaginaActual] = useState('login');

  const handleLogin = (accessToken, userId) => {
    setUserId(userId); // Almacenar el ID de usuario al iniciar sesión
    setIsLoggedIn(true);
    setPaginaActual('repositorio'); // Cambiar a la página de repositorio después del login
  };

  const handleNavigate = (pagina) => {
    setPaginaActual(pagina);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserId(null); // Limpiar el ID de usuario al cerrar sesión
    setPaginaActual('login'); // Cambiar a la página de login al cerrar sesión
  };

  return (
    <div className="App">
      {paginaActual === 'login' && !isLoggedIn && (
        <Login onLogin={handleLogin} />
      )}
      {paginaActual !== 'login' && isLoggedIn && (
        <>
          <button onClick={handleLogout}>Cerrar sesión</button>
          {paginaActual === 'repositorio' && (
            <RepositorioLibros userId={userId} onNavigate={handleNavigate} />
          )}
          {paginaActual === 'biblioteca' && (
            <BibliotecaPersonal userId={userId} libros={librosBiblioteca} onNavigate={handleNavigate} />
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