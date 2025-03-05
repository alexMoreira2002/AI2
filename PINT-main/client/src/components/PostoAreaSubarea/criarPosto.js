import React from 'react';
import { useForm } from 'react-hook-form';
import { TextField, Button, Box, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Definindo o esquema de validação
const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
});

function FormPosto() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const response = await api.post('/postos', data, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      Swal.fire({
        title: "Sucesso",
        text: `Posto criado com sucesso!`,
        icon: "success",
        confirmButtonColor: '#369fb8',
      });

      console.log('Posto criado:', response.data);
    } catch (error) {
      let errorMessage = 'Erro ao criar Posto, tente mais tarde.';
      if (error.response && error.response.data && error.response.data.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        title: "Erro",
        text: errorMessage,
        icon: "error",
        confirmButtonColor: '#369fb8',
      });

      console.error('Erro ao criar Posto:', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ p: 2, backgroundColor: '#f9f9f9', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" component="h2" gutterBottom>
        Informações do Posto
      </Typography>
      <TextField
        {...register('nome')}
        label="Nome do Posto"
        fullWidth
        sx={{ mb: 2 }}
        error={!!errors.nome}
        helperText={errors.nome ? errors.nome.message : ''}
      />
      <Button type="submit" fullWidth variant="contained" color="primary" sx={{ mt: 2 }}>
        Criar Posto
      </Button>
    </Box>
  );
}

export default FormPosto;
