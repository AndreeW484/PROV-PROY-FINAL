import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container } from '@mui/material';
import { styled } from '@mui/system';
import libroIcono from './libro-abierto.png';
import libroIcono2 from './libro-cerrado.png';

const LibroCard = styled(Card)(({ theme }) => ({
  maxWidth: 200,
  margin: theme.spacing(2),
  textAlign: 'center',
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'scale(1.05)',
  },
}));

const LibroMedia = styled(CardMedia)({
  height: 140,
  width: 'auto', // Ensure the image keeps its aspect ratio
  backgroundSize: 'contain',
  margin: '10px auto', // Add margin to create space around the image
  objectFit: 'contain', // Ensure the image fits within the container without being cropped
});

const MarcarLeidoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '1em',
}));

const EliminarButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '1em',
  backgroundColor: 'red',
}));

const BibliotecaPersonal = ({ userId }) => {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');

  const fetchLibros = () => {
    axios.get(`http://localhost:5000/usuarios/${userId}/libros`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setLibros(response.data);
    })
    .catch(error => {
      setError('Error al obtener los libros de la biblioteca personal');
      console.error('Error al obtener los libros:', error);
    });
  };

  useEffect(() => {
    fetchLibros();
  }, [userId]);

  const handleMarcarLeido = (libro) => {
    axios.put(`http://localhost:5000/usuarios/${userId}/libros/${libro.id}`, {
      estado_libro: 'leído'
    }, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setLibros(libros.map(l => l.id === libro.id ? { ...l, estado_libro: 'leído' } : l));
    })
    .catch(error => {
      setError('Error al marcar el libro como leído');
      console.error('Error al marcar el libro como leído:', error);
    });
  };

  const handleEliminarLibro = (libro) => {
    axios.delete(`http://localhost:5000/usuarios/${userId}/libros/${libro.id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setLibros(libros.filter(l => l.id !== libro.id));
    })
    .catch(error => {
      setError('Error al eliminar el libro de la biblioteca personal');
      console.error('Error al eliminar el libro:', error);
    });
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" gutterBottom>
        BIBLIOTECA PERSONAL
      </Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container justifyContent="center">
        {libros.map((libro) => (
          <Grid item key={libro.id}>
            <LibroCard>
              <LibroMedia
                component="img"
                src={libro.estado_libro === 'leído' ? libroIcono2 : libroIcono}
                title="Icono del libro"
              />
              <CardContent>
                <Typography variant="h6" component="div">
                  {libro.titulo}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                  Estado: {libro.estado_libro}
                </Typography>
                <MarcarLeidoButton
                  variant="contained"
                  color="success"
                  onClick={() => handleMarcarLeido(libro)}
                >
                  Marcar como Leído
                </MarcarLeidoButton>
                <EliminarButton
                  variant="contained"
                  color="warning"
                  onClick={() => handleEliminarLibro(libro)}
                >
                  Eliminar de Biblioteca Personal
                </EliminarButton>
              </CardContent>
            </LibroCard>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default BibliotecaPersonal;