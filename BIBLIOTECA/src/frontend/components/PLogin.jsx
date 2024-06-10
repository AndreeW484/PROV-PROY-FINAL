import React, { useState } from 'react';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    fetch('http://localhost:5000/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ correo_electronico: email, contrasena: password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Inicio de sesión exitoso. Bienvenido!') {
        onLogin();
      } else {
        setError(data.message);
      }
    })
    .catch(error => {
      setError('Error al iniciar sesión. Por favor, inténtalo de nuevo más tarde.');
      console.error('Error al iniciar sesión:', error);
    });
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        placeholder="Correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
};

export default Login;