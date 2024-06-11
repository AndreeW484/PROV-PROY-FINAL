import React, { useState } from 'react';
import { Box, Container, Button, TextField, Typography } from '@mui/material';

const Login = ({ onLogin }) => {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    fetch('http://localhost:5000/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo: correo, contrasena: contrasena }),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('La respuesta del servidor es inválida!');
      }
      return response.json();
    })
    .then(data => {
      if (data.access_token) {
        onLogin(data.access_token);
      } else {
        setError(data.message);
      }
    })
    .catch(error => {
      setError('Error de inicio de sesión, revisa que el correo y la contraseña sean las correctas.');
      console.error('Error al iniciar sesión:', error);
    });
  };

  return (
    <Container maxWidth="sm">
      <Box mt={4} textAlign="center">
        <Typography variant="h4" gutterBottom>LOGIN</Typography>
        {error && <Typography variant="body1" color="black">{error}</Typography>}
        <TextField
          fullWidth
          type="text"
          label="Correo electrónico"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <TextField
          fullWidth
          type="password"
          label="Contraseña"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          variant="outlined"
          margin="normal"
        />
        <Box mt={5}> {/* Espacio adicional agregado aquí */}
          <Button variant="contained" onClick={handleLogin} color="primary">Iniciar sesión</Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;

