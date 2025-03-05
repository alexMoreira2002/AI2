import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/api';
import { IconButton, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ValidacaoEventos = () => {
  const [eventos, setEventos] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar a abertura do diálogo
  const [eventoSelecionado, setEventoSelecionado] = useState(null); // Estado para armazenar o evento selecionado

  useEffect(() => {
    fetchEventos();
  }, []);

  const fetchEventos = async () => {
    try {
      const response = await api.get('/eventos/validar');
      if (response.data.success && Array.isArray(response.data.data)) {
        setEventos(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao procurar eventos:', error);
    }
  };

  const handleClickOpen = (row) => {
    setEventoSelecionado(row); // Armazena o evento selecionado
    setOpen(true); // Abre o diálogo
  };

  const handleClose = () => {
    setOpen(false); // Fecha o diálogo
  };

  const handlevalidar = () => {
    handleClose(); // fecha o diálogo para vermos o alerta
    // Exibe um diálogo de confirmação
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente validar este evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8', 
      cancelButtonColor: '#6c757d', 
      confirmButtonText: 'Sim, validar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = eventoSelecionado.id; 
          await api.put(`/eventos/validar/${id}`);
          handleClose();
          fetchEventos(); // Atualiza a lista de eventos após a alteração
            Swal.fire({
            title: 'Validado!',
            text: 'O evento foi validado com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
            });
          } catch (error) {
            console.error('Erro ao validar o evento:', error);
            Swal.fire({
            title: 'Erro',
            text: 'Erro ao validar o evento. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonColor: '#369fb8',
            });
        }
      }
    });
  };

  const handleRecusar = () => {
    handleClose(); // fecha o diálogo para vermos o alerta
    // Exibe um diálogo de confirmação
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente recusar este evento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, Recusar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Lógica para recusar o evento (DELETE /eventos/:id)
          const id = eventoSelecionado.id; // Supondo que o eventoSelecionado tenha um ID
          await api.delete(`/eventos/${id}`);
          handleClose();
          fetchEventos();
          Swal.fire({
            title: 'Recusado!',
            text: 'O evento foi recusado com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8'
          });
        } catch (error) {
          console.error('Erro ao recusar o evento:', error);
          Swal.fire('Erro', 'Erro ao recusar o evento. Por favor, tente novamente.', 'error');
        }
      }
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'titulo',
      headerName: 'Título',
      width: 200,
      renderCell: (params) => (
        <Link to={`/eventos/${params.row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {params.value}
        </Link>
      ),
    },
    { field: 'descricao', headerName: 'Descrição', width: 250 },
    { field: 'data', headerName: 'Data', width: 150 },
    { field: 'estado', headerName: 'Estado', width: 100, type: 'boolean' },
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
    data: new Date(evento.data).toLocaleDateString('pt-PT'),
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
        <DialogTitle>Editar Evento</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleRecusar} color="error">
            Recusar
          </Button>
          <Button onClick={handlevalidar} color="primary">
            validar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ValidacaoEventos;
