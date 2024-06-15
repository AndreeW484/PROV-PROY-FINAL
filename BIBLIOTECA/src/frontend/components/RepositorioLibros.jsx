import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Box, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/system';
import libroIcono from './libro-abierto.png';

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
  width: '80%',
  backgroundSize: 'contain',
  margin: '20px auto',
  objectFit: 'contain',
});

const AgregarButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '1em',
}));

const VerInfoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.9em',
}));

const RepositorioLibros = ({ userId }) => {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleLibros = () => {
    axios.get('http://localhost:5000/libros/', {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(response => {
      setLibros(response.data);
    })
    .catch(error => {
      setError('Error al obtener los libros del repositorio');
      console.error('Error al obtener los libros:', error);
    });
  };

  useEffect(() => {
    handleLibros();
  }, []);

  const handleAgregarLibro = async (libro) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/usuarios/${userId}/libros`,
        {
          id_libro: libro.id,
          estado_libro: 'no leído',
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      setSnackbarMessage('Libro agregado a la biblioteca personal');
      setOpenSnackbar(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        setSnackbarMessage('El libro ya existe en la biblioteca personal');
      } else {
        setSnackbarMessage('Error al agregar el libro');
      }
      setOpenSnackbar(true);
      console.error('Error al agregar libro:', error);
    }
  };

  const handleVerInfo = (libro) => {
    setSelectedLibro(libro);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Typography variant="h4" component="h2" gutterBottom>
          REPOSITORIO DE LIBROS
        </Typography>
      </Box>
      {error && <Typography color="error">{error}</Typography>}
      <Grid container justifyContent="center">
        {libros.map((libro) => (
          <Grid item key={libro.id}>
            <LibroCard>
              <LibroMedia image={libroIcono} title="Icono del libro" />
              <CardContent>
                <Typography variant="h6" component="div">
                  {libro.titulo}
                </Typography>
                <VerInfoButton
                  variant="contained"
                  color="info"
                  onClick={() => handleVerInfo(libro)}
                >
                  Ver Información
                </VerInfoButton>
                <AgregarButton
                  variant="contained"
                  color="secondary"
                  onClick={() => handleAgregarLibro(libro)}
                >
                  Agregar a Biblioteca Personal
                </AgregarButton>
              </CardContent>
            </LibroCard>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        {selectedLibro && (
          <>
            <DialogTitle>{selectedLibro.titulo}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                <strong>Autores:</strong> {selectedLibro.autores}
              </DialogContentText>
              <DialogContentText>
                <strong>Editorial:</strong> {selectedLibro.editorial}
              </DialogContentText>
              <DialogContentText>
                <strong>Fecha de Publicación:</strong> {selectedLibro.fecha_publicacion}
              </DialogContentText>
              <DialogContentText>
                <strong>ISBN:</strong> {selectedLibro.isbn}
              </DialogContentText>
              <DialogContentText>
                <strong>Número de Páginas:</strong> {selectedLibro.numero_paginas}
              </DialogContentText>
              <DialogContentText>
                <strong>Género:</strong> {Array.isArray(selectedLibro.genero) ? selectedLibro.genero.map(genero => genero.replace(/\[|\]|'/g, '')).join(', ') : selectedLibro.genero.replace(/\[|\]|'/g, '')}
              </DialogContentText>
              <DialogContentText>
                <strong>Idioma:</strong> {selectedLibro.idioma}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarMessage.includes('Error') ? 'error' : 'success'}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RepositorioLibros;