import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/api';
import { IconButton, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ValidacaoFotoEvento = () => {
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar a abertura do diálogo
  const [eventoSelecionado, setEventoSelecionado] = useState(null); // Estado para armazenar o evento selecionado

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await api.get('/estatistica/foto-evento');
      if (response.data.success && Array.isArray(response.data.data)) {
        setEventos(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao procurar eventos de validação de foto:', error);
    }
  };

  const handleClickOpen = (row) => {
    setEventoSelecionado(row); // Armazena o evento selecionado
    setOpen(true); // Abre o diálogo
  };

  const handleClose = () => {
    setOpen(false); // Fecha o diálogo
  };

  const handleValidar = async () => {
    handleClose(); // Fecha o diálogo para vermos o alerta
    // Exibe um diálogo de confirmação
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente validar esta foto do evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8', 
      cancelButtonColor: '#6c757d', 
      confirmButtonText: 'Sim, validar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = eventoSelecionado.id;
          await api.put(`/estatistica/foto-evento/${id}`);
          handleClose();
          fetchEventos(); 
          Swal.fire({
            title: 'Validado!',
            text: 'A foto do evento foi validada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao validar a foto do evento:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao validar a foto do evento. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonColor: '#369fb8',
          });
        }
      }
    });
  };

  const handleRecusar = () => {
    handleClose(); // Fecha o diálogo para vermos o alerta
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente recusar esta foto do evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, Recusar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = eventoSelecionado.id; 
          await api.delete(`/estatistica/foto-evento/${id}`);
          handleClose();
          fetchEventos();
          Swal.fire({
            title: 'Recusado!',
            text: 'A foto do evento foi recusada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao recusar a foto do evento:', error);
          Swal.fire('Erro', 'Erro ao recusar a foto do evento. Por favor, tente novamente.', 'error');
        }
      }
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'evento',
      headerName: 'Evento',
      width: 200,
      renderCell: (params) => (
        <Link to={`/eventos/${params.row.idEvento}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {params.value}
        </Link>
      ),
    },
    {
      field: 'foto',
      headerName: 'Foto',
      width: 200,
      renderCell: (params) => (
        <a href={`${process.env.REACT_APP_API_URL}/uploads/eventos/${params.value}`} target="_blank" rel="noopener noreferrer">
          Ver Foto
        </a>
      ),
    },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: (params) => (
        <IconButton color="primary" onClick={() => handleClickOpen(params.row)}>
          <EditIcon />
        </IconButton>
      ),
    },
  ];

  const rows = eventos.map((evento) => ({
    ...evento,
    id: evento.id,
    evento: evento?.evento?.titulo,
    foto: evento.foto,
  }));

  return (
    <div style={{ height: 600, width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 20]}
        disableSelectionOnClick
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Validar Foto do Evento</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleRecusar} color="error">
            Recusar
          </Button>
          <Button onClick={handleValidar} color="primary">
            Validar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ValidacaoFotoEvento;