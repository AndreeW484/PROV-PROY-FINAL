import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container, Box, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Snackbar, Alert } from '@mui/material';
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
  width: 'auto',
  backgroundSize: 'contain',
  margin: '10px auto',
  objectFit: 'contain',
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

const VerInfoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.9em',
}));

const BibliotecaPersonal = ({ userId }) => {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openInfoDialog, setOpenInfoDialog] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

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
      setSnackbarMessage('Libro eliminado de la biblioteca personal');
      setOpenSnackbar(true);
    })
    .catch(error => {
      setError('Error al eliminar el libro de la biblioteca personal');
      console.error('Error al eliminar el libro:', error);
    });
  };

  const handleEliminarConfirm = (libro) => {
    setSelectedLibro(libro);
    setOpenDialog(true);
  };

  const handleConfirmClose = (confirmed) => {
    setOpenDialog(false);
    if (confirmed && selectedLibro) {
      handleEliminarLibro(selectedLibro);
    }
    setSelectedLibro(null);
  };

  const handleVerInfo = (libro) => {
    setSelectedLibro(libro);
    setOpenInfoDialog(true);
  };

  const handleCloseInfoDialog = () => {
    setOpenInfoDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container>
      <Box display="flex" justifyContent="center" mt={2} mb={2}>
        <Typography variant="h4" component="h2" gutterBottom>
          BIBLIOTECA PERSONAL:
        </Typography>
      </Box>
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
                <VerInfoButton
                  variant="contained"
                  color="info"
                  onClick={() => handleVerInfo(libro)}
                >
                  Ver Información
                </VerInfoButton>
                <EliminarButton
                  variant="contained"
                  color="warning"
                  onClick={() => handleEliminarConfirm(libro)}
                >
                  Eliminar de Biblioteca Personal
                </EliminarButton>
              </CardContent>
            </LibroCard>
          </Grid>
        ))}
      </Grid>
      <Dialog open={openDialog} onClose={() => handleConfirmClose(false)}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar este libro de tu biblioteca personal?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handleConfirmClose(false)}>Cancelar</Button>
          <Button onClick={() => handleConfirmClose(true)} color="primary">
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openInfoDialog} onClose={handleCloseInfoDialog}>
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
              <Button onClick={handleCloseInfoDialog}>Cerrar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default BibliotecaPersonal;