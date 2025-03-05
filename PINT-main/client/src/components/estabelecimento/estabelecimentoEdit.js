import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'; 
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Swal from 'sweetalert2';
import api from '../api/api';
import DeleteIcon from '@mui/icons-material/Delete';

function EditarEstabelecimento({ open, handleClose }) {
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

  // Busca das áreas disponíveis
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

  // Busca das subáreas baseadas na área selecionada
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

  // Busca dos dados do estabelecimento para pré-preenchimento do formulário
  useEffect(() => {
    const fetchEstabelecimento = async () => {
      try {
        const response = await api.get(`/estabelecimentos/${id}`);
        const estabelecimento = response.data.data;
        Object.keys(estabelecimento).forEach((key) => {
          setValue(key, estabelecimento[key]);
        });
      } catch (error) {
        console.error('Erro ao procurar estabelecimento:', error);
      }
    };

    fetchEstabelecimento();
  }, [id, setValue]);

  const onSubmit = async (data) => {
    handleClose();
    Swal.fire({
      title: 'Tem certeza?',
      text: "Você deseja editar este estabelecimento?",
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
        } else {
          delete formData['foto'];
        }

        try {
          const response = await api.put(`/estabelecimentos/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          Swal.fire({
            title: "Sucesso",
            text: "Estabelecimento atualizado com sucesso!",
            icon: "success",
            confirmButtonColor: '#369fb8',
          });

          console.log('Estabelecimento atualizado:', response.data);
          handleClose(); 
          window.location.reload(); // Recarrega a página para exibir as alterações
        } catch (error) {
          Swal.fire({
            title: "Erro",
            text: "Erro ao atualizar estabelecimento, tente mais tarde.",
            icon: "error",
            confirmButtonColor: '#369fb8',
          });

          console.error('Erro ao atualizar estabelecimento:', error);
        }
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'A edição do estabelecimento foi cancelada',
          icon: 'error',
          confirmButtonColor: '#369fb8', 
        });
      }
    });
  };

  const apagarEstabelecimento = async (id) => {
    handleClose();

    Swal.fire({
      title: 'Tem certeza?',
      text: "Você deseja apagar este estabelecimento?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, apagar!',
      cancelButtonText: 'Não, cancelar!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await api.delete(`/estabelecimentos/${id}`);
          if (response.status === 200) {
            Swal.fire({
              title: "Sucesso",
              text: "Estabelecimento apagado com sucesso!",
              icon: "success",
              confirmButtonColor: '#369fb8',
            });
            navigate('/estabelecimentos');
          } else {
            Swal.fire({
              title: "Erro",
              text: "Erro ao apagar estabelecimento, tente mais tarde.",
              icon: "error",
              confirmButtonColor: '#369fb8',
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Erro",
            text: "Erro ao apagar estabelecimento, tente mais tarde.",
            icon: "error",
            confirmButtonColor: '#369fb8',
          });
          console.error('Erro ao apagar estabelecimento:', error);
        }
      } else {
        Swal.fire({
          title: 'Cancelado',
          text: 'A operação de apagar o estabelecimento foi cancelada',
          icon: 'error',
          confirmButtonColor: '#369fb8', 
        });
      }
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth
      PaperProps={{
        style: {
          height: '100vh',
          width: '100vw',
        },
      }}
    >
      <DialogTitle>Editar Estabelecimento</DialogTitle>
      <DialogContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          sx={{ mt: 1 }}
        >
          <InputLabel htmlFor="nome">Nome do Estabelecimento</InputLabel>
          <TextField 
            {...register('nome')} 
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
          </FormControl>
          <FormControl fullWidth sx={{ mb: 2 }}>
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
          </FormControl>
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ 
              mb: 2, 
              ml: 0,
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
              onChange={handleFileChange}
            />
          </Button>
          <Button   
            type="submit" 
            variant="contained" 
            fullWidth 
            sx={{ backgroundColor: '#369fb8', color: '#ffffff', borderRadius: 1 , ml: 0 }}
          >
            Editar Estabelecimento
          </Button>
          <Button   
            onClick={() => apagarEstabelecimento(id)} 
            variant="contained" 
            color="secondary" 
            fullWidth 
            sx={{ backgroundColor: '#DC3545', '&:hover': { backgroundColor: '#C82333' }, color: '#ffffff', borderRadius: 1 , ml: 0 }}
            startIcon={<DeleteIcon />}
          >
            Eliminar Estabelecimento
          </Button>
          <Button 
            variant="outlined" 
            onClick={handleClose} 
            fullWidth 
            sx={{ mt: 2, borderRadius: 1, color: '#369fb8', borderColor: '#369fb8', ml: 0 }}
          >
            Cancelar
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
}

export default EditarEstabelecimento;
