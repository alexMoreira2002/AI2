import React, { useState, useEffect } from 'react';
import { useForm} from 'react-hook-form'; 
import { useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import { useParams } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';


function EditarEvento({ open, handleClose }) {
  const { id } = useParams(); 
  const { register, handleSubmit, watch, setValue } = useForm();
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [selectedFile, setSelectedFile] = useState();
  
  const navigate = useNavigate(); 
  
  const selectedArea = watch('area');
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data);
      } catch (error) {
        console.error('Erro ao procurar áreas:', error);
      }
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchSubareas = async () => {
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

    fetchSubareas();
  }, [selectedArea]);

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const response = await api.get(`/eventos/${id}`);
        const evento = response.data.data;
        Object.keys(evento).forEach((key) => {
          setValue(key, evento[key]);
        });
      } catch (error) {
        console.error('Erro ao procurar evento:', error);
      }
    };

    fetchEvento();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    handleClose();
  
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Você deseja editar este evento?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, editar!',
      cancelButtonText: 'Não, cancelar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const formData = new FormData();
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
        if (selectedFile) {
          formData.append('foto', selectedFile);
        }
  
        try {
          const response = await api.put(`/eventos/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });
  
          Swal.fire({
            title: 'Sucesso',
            text: 'Evento atualizado com sucesso!',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          }).then((result) => {
            if (result.isConfirmed) {
              console.log('Evento atualizado:', response.data);
              handleClose();
              window.location.reload(); // Recarrega a página para exibir as alterações
            }
          });
        } catch (error) {
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao atualizar evento, tente mais tarde.',
            icon: 'error',
            confirmButtonColor: '#369fb8',
          });
  
          console.error('Erro ao atualizar evento:', error);
        }
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'A edição do evento foi cancelada',
          icon: 'error',
          confirmButtonColor: '#369fb8',
        });
      }
    });
  };
  

  const apagarEvento = async (id) => {
    handleClose();

    Swal.fire({
      title: 'Tem certeza?',
      text: "Você deseja apagar este evento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Não, cancelar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/eventos/${id}`);
          if (response.status === 200) {
            Swal.fire({
              title: "Sucesso",
              text: "Evento apagado com sucesso!",
              icon: "success",
              confirmButtonColor: '#369fb8',
            });
            navigate('/eventos')
          } else {
            Swal.fire({
              title: "Erro",
              text: "Erro ao apagar evento, tente mais tarde.",
              icon: "error",
              confirmButtonColor: '#369fb8',
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Erro",
            text: "Erro ao apagar evento, tente mais tarde.",
            icon: "error",
            confirmButtonColor: '#369fb8',
          });
          console.error('Erro ao apagar evento:', error);
        }
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'A operação de apagar o evento foi cancelada',
          icon: 'error',
          confirmButtonColor: '#369fb8', 
        })
      }
    });
  };
  return (
  <Dialog
    open={open}
    onClose={handleClose}
    maxWidth="md"
    fullWidth
    PaperProps={{
      style: {
        height: '100vh',
        width: '100vw',
      },
    }}
  >
    <DialogTitle>Editar Evento</DialogTitle>
    <DialogContent>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        sx={{ mt: 1 }}
      >
        <InputLabel htmlFor="titulo">Nome do Evento</InputLabel>
        <TextField
          {...register('titulo')}
          fullWidth
          sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }}
        />
        <InputLabel htmlFor="descricao">Descrição</InputLabel>
        <TextField
          {...register('descricao')}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }}
        />
        <Box display="flex" justifyContent="space-between" sx={{ mb: 2 }}>
          <TextField
            {...register('data')}
            type="date"
            label="Data"
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: '#f2f2f2', borderRadius: 1, width: '48%' }}
          />
          <TextField
            {...register('hora')}
            type="time"
            label="Hora"
            InputLabelProps={{ shrink: true }}
            sx={{ backgroundColor: '#f2f2f2', borderRadius: 1, width: '48%' }}
          />
        </Box>
        <InputLabel htmlFor="morada">Morada</InputLabel>
        <TextField
          {...register('morada')}
          fullWidth
          sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }}
        />
        <InputLabel htmlFor="telemovel">Telemóvel</InputLabel>
          <TextField 
            {...register('telemovel')} 
            label="Telemovel" 
            fullWidth 
            sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
          />
          <InputLabel htmlFor="email">Email</InputLabel>
          <TextField 
            {...register('email')} 
            label="Email" 
            fullWidth 
            sx={{ mb: 2, backgroundColor: '#f2f2f2', borderRadius: 1 }} 
          />
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="area-label">Tipo de Evento</InputLabel>
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
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="subarea-label">Subtipo</InputLabel>
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
        </FormControl>
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel id="inscricaoAberta-label">Estado da Inscrição</InputLabel>
          <Select
            {...register('inscricaoAberta')}
            labelId="inscricaoAberta-label"
            sx={{ backgroundColor: '#f2f2f2', borderRadius: 1 }}
          >
            <MenuItem value={true}>Aberta</MenuItem>
            <MenuItem value={false}>Fechada</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          component="label"
          fullWidth
          sx={{
            ml: 0,
            mb: 0,
            backgroundColor: '#369fb8',
            '&:hover': { backgroundColor: '#369fb8' },
          }}
        >
          Inserir Anexo
          <input
            type="file"
            hidden
            {...register('foto')}
            onChange={handleFileChange}
          />
        </Button>
            <Box display="flex" flexDirection="column">
            <Button
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#369fb8', color: '#ffffff', borderRadius: 1 , ml: 0, mt:2}}
                type="submit"
            >
                Editar Evento
            </Button>
            <Button
                variant="contained"
                fullWidth
                color="error"
                sx={{ backgroundColor: '#DC3545', '&:hover': { backgroundColor: '#C82333' }, color: '#ffffff', borderRadius: 1 , ml: 0,  mt:1}}
                startIcon={<DeleteIcon />}
                onClick={() => apagarEvento(id)}
            >
                Apagar Evento
            </Button>
            </Box>
          <Button
            variant="outlined"
            onClick={handleClose}
            fullWidth
            sx={{ mt: 1, borderRadius: 1, color: '#369fb8', borderColor: '#369fb8', ml: 0,}}
          >
            Cancelar
          </Button>
        </Box>
    </DialogContent>
  </Dialog>
);
}

export default EditarEvento;
