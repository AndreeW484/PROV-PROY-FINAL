import React, { useState } from 'react';
import Login from './frontend/components/PLogin'; 
import RepositorioLibros from './frontend/components/RepositorioLibros';
import BibliotecaPersonal from './frontend/components/BibliotecaPersonal';
import { Container, Box, Button, AppBar, Toolbar, Typography } from '@mui/material';

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
      <AppBar position="static">
        <Toolbar>
          {isLoggedIn && (
            <Box display="flex" justifyContent="center" width="100%">
              <Button color="inherit" onClick={() => handleNavigate('repositorio')}>Repositorio de Libros</Button>
              <Button color="inherit" onClick={() => handleNavigate('biblioteca')}>Biblioteca Personal</Button>
              <Button color="inherit" onClick={handleLogout}>Cerrar sesión</Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container>
        {paginaActual === 'login' && !isLoggedIn && (
          <Login onLogin={handleLogin} />
        )}
        {paginaActual !== 'login' && isLoggedIn && (
          <>
            {paginaActual === 'repositorio' && (
              <RepositorioLibros userId={userId} onNavigate={handleNavigate} />
            )}
            {paginaActual === 'biblioteca' && (
              <BibliotecaPersonal userId={userId} libros={librosBiblioteca} onNavigate={handleNavigate} />
            )}
          </>
        )}
      </Container>
    </div>
  );
}

export default App;