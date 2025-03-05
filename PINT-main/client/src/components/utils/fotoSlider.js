import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Card, CardMedia, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Alert} from "@mui/material";
import api from "../api/api";
import Swal from 'sweetalert2';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

function FotoSlider({ descricao, tipo, id }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [fotosState, setFotos] = useState([]);

  useEffect(() => {
    const fetchFotos = async () => {
      try {
        const response = await api.get(`foto/${tipo}/${id}`);
        const fotoPaths = response.data.data.map(foto => ({
          id: foto.id,
          url: `${process.env.REACT_APP_API_URL}/uploads/${tipo}/${foto.foto}`,
          carregadaPor: foto.criador ? foto.criador.nome : 'Desconhecido', 
          validadaPor: foto.admin ? foto.admin.nome : 'Desconhecido', 
        }));
        setFotos(fotoPaths);
      } catch (error) {
        console.error('Error fetching fotos:', error.response || error.message);
      }
    };
    fetchFotos();
  }, [id, tipo]);

  const settings = {
    dots: true,
    infinite: true,
    arrows: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  const handleClick = (index) => {
    const clickedPhoto = fotosState[index];
    setSelectedPhoto(clickedPhoto);
  };

  const handleClose = () => {
    setSelectedPhoto(null); 
  };

  const handleDelete = async () => {
    handleClose();
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: "Deseja apagar a foto?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Não, cancelar!'
    });

    if (result.isConfirmed) {
      try {
        const response = await api.delete(`/foto/${tipo}/${selectedPhoto.id}`);
        if (response.status === 200) {
          Swal.fire(
            'Apagado!',
            'A foto foi apagada.',
            'success'
          );
          // Atualize o estado para remover a foto apagada
          setFotos(fotosState.filter(foto => foto.id !== selectedPhoto.id));
          setSelectedPhoto(null);
        } else {
          Swal.fire(
            'Erro!',
            'Não foi possível apagar a foto.',
            'error'
          );
        }
      } catch (error) {
        Swal.fire(
          'Erro!',
          'Erro ao apagar a foto.',
          'error'
        );
      }
    }
  };

  return (
    <>
    {fotosState.length === 0 && (
      <Alert severity="info">Ainda não existem fotos disponíveis.</Alert>
    )}
      {fotosState.length === 0 ? null : fotosState.length === 1 ? (
        <div onClick={() => handleClick(0)} style={{ cursor: "pointer" }}>
          <Card sx={{ boxSizing: "border-box", height: { xs: '300px', sm: '400px', md: '400px', lg: '400px', xl: '500px' } }}>
            <CardMedia
              component="img"
              image={fotosState[0].url} 
              alt={descricao}
              sx={{ width: "100%", height: { xs: '300px', sm: '400px', md: '400px', lg: '400px', xl: '500px' }, objectFit: "cover" }}
            />
          </Card>
        </div>
      ) : (
        <Slider {...settings} style={{ width: "100%" }}>
          {fotosState.map((photo, index) => (
            <div key={index} onClick={() => handleClick(index)} style={{ cursor: "pointer" }}>
              <Card sx={{ boxSizing: "border-box", height: { xs: '300px', sm: '400px', md: '400px', lg: '400px', xl: '500px' } }}>
                <CardMedia
                  component="img"
                  image={photo.url} // Utiliza a URL da foto
                  alt={descricao}
                  sx={{ width: "100%", height: { xs: '300px', sm: '400px', md: '400px', lg: '400px', xl: '500px' }, objectFit: "cover" }}
                />
              </Card>
            </div>
          ))}
        </Slider>
      )}
      <Dialog open={selectedPhoto !== null} onClose={handleClose} maxWidth='xl' fullWidth={true}>
        <DialogTitle>{descricao}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Card sx={{ height: { xs: '300px', sm: '400px', md: '400px', lg: '400px', xl: '500px' }, width: '100%', position: "relative" }}>
                <CardMedia
                  component="img"
                  image={selectedPhoto && selectedPhoto.url} // Utiliza a URL da foto selecionada
                  alt={descricao}
                  sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Box sx={{ marginLeft: { xs: '0px', sm: '70px', md: '70px', lg: '70px', xl: '70px' } }}>
                <Typography variant="subtitle1" gutterBottom>
                  Foto carregada por:
                </Typography>
                <Typography variant="body2">
                  {selectedPhoto && selectedPhoto.carregadaPor} {/* Exibe o nome do criador */}
                </Typography>
                <Typography variant="subtitle1" gutterBottom mt={2}>
                  Foto validada por:
                </Typography>
                <Typography variant="body2">
                  {selectedPhoto && selectedPhoto.validadaPor} {/* Exibe o nome do administrador que validou a foto */}
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
          <Button onClick={handleClose} color="primary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FotoSlider;
