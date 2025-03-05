import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/api';
import { IconButton, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ValidacaoFotoEstabelecimento = () => {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [open, setOpen] = useState(false); // Estado para controlar a abertura do diálogo
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null); // Estado para armazenar o estabelecimento selecionado

  useEffect(() => {
    fetchEstabelecimentos();
  }, []);

  const fetchEstabelecimentos = async () => {
    try {
      const response = await api.get('/estatistica/foto-estabelecimento');
      if (response.data.success && Array.isArray(response.data.data)) {
        setEstabelecimentos(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao procurar estabelecimentos de validação de foto:', error);
    }
  };

  const handleClickOpen = (row) => {
    setEstabelecimentoSelecionado(row); // Armazena o estabelecimento selecionado
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
      text: 'Deseja realmente validar esta foto do estabelecimento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8', 
      cancelButtonColor: '#6c757d', 
      confirmButtonText: 'Sim, validar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = estabelecimentoSelecionado.id;
          await api.put(`/estatistica/foto-estabelecimento/${id}`);
          handleClose();
          fetchEstabelecimentos(); 
          Swal.fire({
            title: 'Validado!',
            text: 'A foto do estabelecimento foi validada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao validar a foto do estabelecimento:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao validar a foto do estabelecimento. Por favor, tente novamente.',
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
      text: 'Deseja realmente recusar esta foto do estabelecimento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, Recusar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = estabelecimentoSelecionado.id; 
          await api.delete(`/estatistica/foto-estabelecimento/${id}`);
          handleClose();
          fetchEstabelecimentos();
          Swal.fire({
            title: 'Recusado!',
            text: 'A foto do estabelecimento foi recusada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao recusar a foto do estabelecimento:', error);
          Swal.fire('Erro', 'Erro ao recusar a foto do estabelecimento. Por favor, tente novamente.', 'error');
        }
      }
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'estabelecimento',
      headerName: 'Estabelecimento',
      width: 200,
      renderCell: (params) => (
        <Link to={`/estabelecimentos/${params.row.idEstabelecimento}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {params.value}
        </Link>
      ),
    },
    {
      field: 'foto',
      headerName: 'Foto',
      width: 200,
      renderCell: (params) => (
        <a href={`${process.env.REACT_APP_API_URL}/uploads/estabelecimentos/${params.value}`} target="_blank" rel="noopener noreferrer">
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

  const rows = estabelecimentos.map((estabelecimento) => ({
    ...estabelecimento,
    id: estabelecimento.id,
    estabelecimento: estabelecimento.estabelecimento?.nome,
    foto: estabelecimento.foto,
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
        <DialogTitle>Validar Foto do Estabelecimento</DialogTitle>
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

export default ValidacaoFotoEstabelecimento;
