import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Menu, IconButton, Grid, Typography, InputAdornment } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import * as Icons from '@mui/icons-material';

const FormArea = () => {
  const { register, handleSubmit } = useForm();
  const [icons, setIcons] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const iconList = [
      { id: 'LocalHospitalOutlined', name: 'Saúde', component: Icons.LocalHospitalOutlined },
      { id: 'SportsSoccerOutlined', name: 'Desporto', component: Icons.SportsSoccerOutlined },
      { id: 'SchoolOutlined', name: 'Formação', component: Icons.SchoolOutlined },
      { id: 'RestaurantOutlined', name: 'Gastronomia', component: Icons.RestaurantOutlined },
      { id: 'BedOutlined', name: 'Alojamento', component: Icons.BedOutlined },
      { id: 'DirectionsCarOutlined', name: 'Transportes', component: Icons.DirectionsCarOutlined },
      { id: 'DeckOutlined', name: 'Lazer', component: Icons.DeckOutlined },
      { id: 'AccountBalanceOutlined', name: 'Financeiro', component: Icons.AccountBalanceOutlined },
      { id: 'PublicOutlined', name: 'Ambiente', component: Icons.PublicOutlined },
      { id: 'BuildOutlined', name: 'Engenharia', component: Icons.BuildOutlined },
      { id: 'ScienceOutlined', name: 'Ciência', component: Icons.ScienceOutlined },
      { id: 'PaletteOutlined', name: 'Arte', component: Icons.PaletteOutlined },
    ];
    setIcons(iconList);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleIconSelect = (icon) => {
    setSelectedIcon(icon.id);
    handleMenuClose();
  };

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      console.log('Dados enviados:', { ...data, icone: selectedIcon });

      const response = await api.post('/areas', {
        ...data,
        icone: selectedIcon,
      }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      Swal.fire({
        title: 'Sucesso',
        text: `Área criada com sucesso!`,
        icon: 'success',
        confirmButtonColor: '#369fb8',
      });

      console.log('Área criada:', response.data);
    } catch (error) {
      let errorMessage = 'Erro ao criar Área, tente mais tarde.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        title: 'Erro',
        text: errorMessage,
        icon: 'error',
        confirmButtonColor: '#369fb8',
      });

      console.error('Erro ao criar Área:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Informações da Área
      </Typography>
      <TextField
        {...register('nome')}
        label="Nome da Área"
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Escolher Ícone"
        fullWidth
        value={selectedIcon ? icons.find(icon => icon.id === selectedIcon).name : 'Nenhum ícone selecionado'}
        onClick={handleMenuOpen}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              {selectedIcon ? (
                React.createElement(icons.find(icon => icon.id === selectedIcon).component, { sx: { fontSize: 24 } })
              ) : (
                <Icons.AddCircleOutlineOutlined sx={{ fontSize: 24 }} />
              )}
            </InputAdornment>
          ),
        }}
      />
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          style: {
            maxHeight: 400,
            width: '300px',
          },
        }}
      >
        <Grid container spacing={1} sx={{ p: 1 }}>
          {icons.map(icon => (
            <Grid item xs={4} key={icon.id}>
              <IconButton
                color={selectedIcon === icon.id ? 'primary' : 'default'}
                onClick={() => handleIconSelect(icon)}
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  border: selectedIcon === icon.id ? '2px solid #369fb8' : '2px solid transparent',
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: '#369fb8',
                    backgroundColor: 'rgba(29, 50, 79, 0.1)',
                  },
                  width: '56px',
                  height: '56px',
                }}
              >
                {React.createElement(icon.component, { sx: { fontSize: 30 } })}
              </IconButton>
            </Grid>
          ))}
        </Grid>
      </Menu>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
      </Typography>
      <Button
        type="submit"
        fullWidth
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
        disabled={!selectedIcon}
      >
        Criar Área
      </Button>
    </Box>
  );
};

export default FormArea;
