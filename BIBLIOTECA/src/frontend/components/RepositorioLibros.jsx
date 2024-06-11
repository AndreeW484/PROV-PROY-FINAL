import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, CardContent, CardMedia, Typography, Button, Grid, Container, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
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
  backgroundSize: 'contain',
  margin: 'auto',
});

const AgregarButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '1em',
}));

const VerInfoButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  fontSize: '0.9em',
}));

const RepositorioLibros = ({ onAgregarLibro }) => {
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState('');
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  const handleAgregarLibro = (libro) => {
    onAgregarLibro(libro);
  };

  const handleVerInfo = (libro) => {
    setSelectedLibro(libro);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container>
      <Typography variant="h4" component="h2" container justifyContent="center" gutterBottom>
        REPOSITORIO DE LIBROS:
      </Typography>
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
                  Ver Informacion
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
    </Container>
  );
};

export default RepositorioLibros;