import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Validation schema with yup
const schema = yup.object().shape({
  nome: yup.string().required('Nome é obrigatório'),
  descricao: yup.string().required('Descrição é obrigatória'),
  foto: yup.mixed().required('Foto de capa é obrigatória'),
  idArea: yup.string().required('Área é obrigatória'),
});

function CriarAlbum({ open, handleClose, handleAlbumCreated }) {
  const { register, handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const [areas, setAreas] = useState([]);

  // Fetch available areas
  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar áreas:', error);
      }
    };

    fetchAreas();
  }, []);

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => formData.append(key, data[key]));

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      if (!token) throw new Error('Token de autenticação não encontrado.');

      await api.post('/album', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      Swal.fire({
        title: "Sucesso",
        text: "Álbum criado com sucesso e enviado para validação!",
        icon: "success",
        confirmButtonColor: '#369fb8',
      });

      handleAlbumCreated();
    } catch (error) {
      Swal.fire({
        title: "Erro",
        text: "Erro ao criar álbum, tente mais tarde.",
        icon: "error",
        confirmButtonColor: '#369fb8',
      });

      console.error('Erro ao criar álbum:', error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Criar Álbum</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
          id="create-album-form"
        >
          <TextField 
            {...register('nome')} 
            label="Nome do Álbum" 
            fullWidth 
            sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
            error={!!errors.nome}
            helperText={errors.nome?.message || ''}
          />
          <TextField 
            {...register('descricao')} 
            label="Descrição" 
            fullWidth 
            multiline
            rows={4}
            sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
            error={!!errors.descricao}
            helperText={errors.descricao?.message || ''}
          />
          <FormControl fullWidth sx={{ mb: 2 }} error={!!errors.idArea}>
            <InputLabel id="area-label">Área</InputLabel>
            <Select 
              {...register('idArea')} 
              labelId="area-label" 
              sx={{ backgroundColor: '#f2f2f2', borderRadius: 1 }}
              defaultValue=""
            >
              {areas.map((area) => (
                <MenuItem key={area.id} value={area.id}>
                  {area.nome}
                </MenuItem>
              ))}
            </Select>
            {errors.idArea && <p style={{ color: 'red' }}>{errors.idArea.message}</p>}
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
                    backgroundColor: '#2d8bb4',
                  },
                }}
              >
                Inserir Foto de Capa
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
        <Button onClick={handleClose} color="primary">
          Cancelar
        </Button>
        <Button 
          type="submit" 
          color="primary"
          form="create-album-form"
        >
          Criar Álbum
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CriarAlbum;
