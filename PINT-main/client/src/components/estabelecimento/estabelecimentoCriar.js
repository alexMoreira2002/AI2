import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form'; 
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, FormHelperText } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  nome: yup.string().required('Nome do Estabelecimento é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória'),
  morada: yup.string().required('Morada é obrigatória'),
  area: yup.string().required('Área é obrigatória'),
  subarea: yup.string().required('Subárea é obrigatória'),
});

function CriarEstabelecimento({ handleClose }) {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const selectedArea = watch('area');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data);
      } catch (error) {
        console.error('Erro ao procurar áreas:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedArea) {
        try {
          const response = await api.get(`/areas/${selectedArea}`);
          setSubareas(response.data.data);
        } catch (error) {
          console.error('Erro ao procurar subáreas:', error);
        }
      } else {
        setSubareas([]);
      }
    };

    fetchData();
  }, [selectedArea]);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
      });

      formData.append('estado', false);
      formData.append('idArea', selectedArea);
      formData.append('idSubarea', data.subarea);
      formData.append('telemovel', String(data.telemovel)); 
      formData.append('email', String(data.email)); 

      const response = await api.post('/estabelecimentos', formData);

      Swal.fire({
        title: "Sucesso",
        text: "Estabelecimento criado com sucesso!",
        icon: "success",
        confirmButtonColor: '#369fb8',
      });

      console.log('Estabelecimento criado:', response.data);
      handleClose();  
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Erro ao criar estabelecimento, tente mais tarde.",
        icon: "error",
        confirmButtonColor: '#369fb8',
      });

      console.error('Erro ao criar estabelecimento:', error);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{ mt: 1 }}
    >
      <TextField 
        {...register('nome')} 
        label="Nome do Estabelecimento" 
        fullWidth 
        sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
      />
      <TextField 
        {...register('descricao')} 
        label="Descrição" 
        fullWidth 
        multiline
        rows={4}
        sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
      />
      <TextField 
        {...register('morada')} 
        label="Morada" 
        fullWidth 
        sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
      />
      <TextField 
        {...register('telemovel')} 
        label="Telemovel" 
        fullWidth 
        sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
      />
      <TextField 
        {...register('email')} 
        label="Email" 
        fullWidth 
        sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
      />
      <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.area)}>
        <InputLabel id="area-label">Área</InputLabel>
        <Select 
          {...register('area')} 
          labelId="area-label" 
          sx={{ backgroundColor: '#f2f2f2', borderRadius: 1 }}
        >
          {areas.map((area) => (
            <MenuItem key={area.id} value={area.id}>
              {area.nome}
            </MenuItem>
          ))}
        </Select>
        {errors.area && <FormHelperText>{errors.area.message}</FormHelperText>}
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }} error={Boolean(errors.subarea)}>
        <InputLabel id="subarea-label">Subárea</InputLabel>
        <Select 
          {...register('subarea')} 
          labelId="subarea-label" 
          sx={{ backgroundColor: '#f2f2f2', borderRadius: 1 }}
        >
          {subareas.map((subarea) => (
            <MenuItem key={subarea.id} value={subarea.id}>
              {subarea.nome}
            </MenuItem>
          ))}
        </Select>
        {errors.subarea && <FormHelperText>{errors.subarea.message}</FormHelperText>}
      </FormControl>
      <Controller
        name="foto"
        control={control}
        render={({ field }) => (
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ 
              mb: 2, 
              backgroundColor: '#369fb8', 
              color: '#ffffff',
              '&:hover': {
                backgroundColor: '#2a6a9e',
              },
            }}
          >
            Inserir Anexo
            <input
              type="file"
              hidden
              onChange={(e) => field.onChange(e.target.files[0])}
            />
          </Button>
        )}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Button 
          onClick={handleClose} 
          sx={{ color: '#369fb8' }}
        >
          Cancelar
        </Button>
        <Button 
          type="submit" 
          sx={{ backgroundColor: '#369fb8', color: '#ffffff', '&:hover': { backgroundColor: '#2a6a9e' } }}
        >
          Criar Estabelecimento
        </Button>
      </Box>
    </Box>
  );
}

export default CriarEstabelecimento;
