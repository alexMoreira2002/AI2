import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Definindo o esquema de validação
const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  idArea: yup.string().required('Área é obrigatória'),
});

function FormSubarea() {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [areas, setAreas] = useState([]);

  useEffect(() => {
    const getAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data);
      } catch (error) {
        console.error('Erro ao procurar áreas:', error);
        Swal.fire({
          title: 'Erro',
          text: 'Erro ao procurar áreas. Tente novamente mais tarde.',
          icon: 'error',
          confirmButtonColor: '#369fb8',
        });
      }
    };

    getAreas();
  }, []);

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await api.post(`/areas/${data.idArea}/subareas`, { nome: data.nome }, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      Swal.fire({
        title: "Sucesso",
        text: `Subárea criada com sucesso!`,
        icon: "success",
        confirmButtonColor: '#369fb8',
      });

      console.log('Subárea criada:', response.data);
    } catch (error) {
      let errorMessage = 'Erro ao criar Subárea, tente mais tarde.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        title: "Erro",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: '#369fb8',
      });

      console.error('Erro ao criar Subárea:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Informações da Subárea
      </Typography>
      <TextField
        {...register('nome')}
        label="Nome da Subárea"
        fullWidth
        sx={{ mb: 2 }}
        error={!!errors.nome}
        helperText={errors.nome ? errors.nome.message : ''}
      />
      <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.idArea}>
        <InputLabel id="area-label">Área</InputLabel>
        <Controller
          name="idArea"
          control={control}
          render={({ field }) => (
            <Select
              {...field}
              labelId="area-label"
              sx={{ backgroundColor: '#f2f2f2', borderRadius: 1 }}
            >
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.nome}
                </MenuItem>
              ))}
            </Select>
          )}
        />
        {errors.idArea && <Typography variant="body2" color="error">{errors.idArea.message}</Typography>}
      </FormControl>
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Criar Subárea
      </Button>
    </Box>
  );
}

export default FormSubarea;
