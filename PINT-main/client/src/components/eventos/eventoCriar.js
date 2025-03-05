import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

const schema = yup.object().shape({
  titulo: yup.string().required('Nome do Evento é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória'),
  data: yup.date().min(new Date(new Date().setHours(0, 0, 0, 0)), 'A data deve ser hoje ou no futuro').required('Data é obrigatória'),
  hora: yup.string().required('Hora é obrigatória').test(
    'is-time-past',
    'A hora já passou',
    function(value) {
      const { data } = this.parent;
      const selectedDate = new Date(data);
      const currentDate = new Date();
      const selectedTime = value.split(':');
      selectedDate.setHours(selectedTime[0], selectedTime[1], 0);

      return !(selectedDate.toDateString() === currentDate.toDateString() && selectedDate < currentDate);
    }
  ),
  morada: yup.string().required('Morada é obrigatória'),
  area: yup.string().required('Tipo de Evento é obrigatório'),
  subarea: yup.string().required('Subtipo é obrigatório'),
});

function CriarEvento({ open, handleClose }) {
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const selectedArea = watch('area');

  useEffect(() => {
    const getAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data);
      } catch (error) {
        console.error('Erro ao procurar áreas:', error);
      }
    };

    getAreas();
  }, []);

  useEffect(() => {
    const getSubareas = async () => {
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

    getSubareas();
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

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) {
        throw new Error('Token de autenticação não encontrado.');
      }

      const userResponse = await api.get('/utilizador', {
        headers: {
          'Authorization': `Bearer ${token}`
        },
      });

      formData.append('idCriador', userResponse.data.id);

      const response = await api.post('/eventos', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      Swal.fire({
        title: "Sucesso",
        text: "Evento criado com sucesso!",
        icon: "success",
        confirmButtonColor: '#369fb8',
      });

      console.log('Evento criado:', response.data);
      handleClose();
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Erro ao criar evento, tente mais tarde.",
        icon: "error",
        confirmButtonColor: '#369fb8',
      });

      console.error('Erro ao criar evento:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Criar Evento</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <TextField 
            {...register('titulo')} 
            label="Nome do Evento" 
            fullWidth 
            sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1.5 }} 
            error={!!errors.titulo}
            helperText={errors.titulo ? errors.titulo.message : ''}
          />
          <TextField 
            {...register('descricao')} 
            label="Descrição" 
            fullWidth 
            multiline
            rows={4}
            sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1.5 }} 
            error={!!errors.descricao}
            helperText={errors.descricao ? errors.descricao.message : ''}
          />
          <Box display="flex" justifyContent="space-between" sx={{ mb: 3 }}>
            <TextField 
              {...register('data')} 
              type="date" 
              label="Data" 
              InputLabelProps={{ shrink: true }} 
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1.5, width: '48%' }} 
              error={!!errors.data}
              helperText={errors.data ? errors.data.message : ''}
            />
            <TextField 
              {...register('hora')} 
              type="time" 
              label="Hora" 
              InputLabelProps={{ shrink: true }} 
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1.5, width: '48%' }} 
              error={!!errors.hora}
              helperText={errors.hora ? errors.hora.message : ''}
            />
          </Box>
          <TextField 
            {...register('morada')} 
            label="Morada" 
            fullWidth 
            sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1.5 }} 
            error={!!errors.morada}
            helperText={errors.morada ? errors.morada.message : ''}
          />
          <TextField 
            {...register('telemovel')} 
            label="Telemovel" 
            fullWidth 
            sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1.5 }} 
          />
          <TextField 
            {...register('email')} 
            label="Email" 
            fullWidth 
            sx={{ mb: 3, backgroundColor: '#f9f9f9', borderRadius: 1.5 }} 
          />
          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.area}>
            <InputLabel id="area-label">Tipo de Evento</InputLabel>
            <Select 
              {...register('area')} 
              labelId="area-label" 
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1.5 }}
            >
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.area && <p style={{ color: 'red' }}>{errors.area.message}</p>}
          </FormControl>
          <FormControl fullWidth sx={{ mb: 3 }} error={!!errors.subarea}>
            <InputLabel id="subarea-label">Subtipo</InputLabel>
            <Select 
              {...register('subarea')} 
              labelId="subarea-label" 
              sx={{ backgroundColor: '#f9f9f9', borderRadius: 1.5 }}
            >
              {subareas.map((subarea) => (
                <MenuItem key={subarea.id} value={subarea.id}>
                  {subarea.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.subarea && <p style={{ color: 'red' }}>{errors.subarea.message}</p>}
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
                  mb: 3, 
                  backgroundColor: '#369fb8', 
                  color: '#ffffff',
                  borderRadius: 1.5,
                  '&:hover': {
                    backgroundColor: '#0b1a2d',
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
          {errors.foto && <p style={{ color: 'red' }}>{errors.foto.message}</p>}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} sx={{ color: '#369fb8' }}>
          Cancelar
        </Button>
        <Button 
          type="submit" 
          sx={{ 
            backgroundColor: '#369fb8', 
            color: '#ffffff',
            '&:hover': {
              backgroundColor: '#0b1a2d',
            }
          }} 
          onClick={handleSubmit(onSubmit)}
        >
          Criar Evento
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CriarEvento;
