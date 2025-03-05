import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/api';
import { IconButton, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ValidacaoEstabelecimentos = () => {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [open, setOpen] = useState(false);
  const [estabelecimentoSelecionado, setEstabelecimentoSelecionado] = useState(null);

  useEffect(() => {
    fetchEstabelecimentos();
  }, []);

  const fetchEstabelecimentos = async () => {
    try {
      const response = await api.get('/estabelecimentos/validar');
      if (response.data.success && Array.isArray(response.data.data)) {
        setEstabelecimentos(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao encontrar estabelecimentos:', error);
    }
  };

  const handleClickOpen = (row) => {
    setEstabelecimentoSelecionado(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidar = () => {
    handleClose(); 
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente validar este estabelecimento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, validar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = estabelecimentoSelecionado.id; 
          await api.put(`/estabelecimentos/validar/${id}`);
          handleClose();
          fetchEstabelecimentos(); 
          Swal.fire({
            title: 'Validado!',
            text: 'O estabelecimento foi validado com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao validar o estabelecimento:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao validar o estabelecimento. Por favor, tente novamente.',
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
      text: 'Deseja realmente recusar este estabelecimento?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, Recusar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = estabelecimentoSelecionado.id; 
          await api.delete(`/estabelecimentos/${id}`);
          handleClose();
          fetchEstabelecimentos(); 
          Swal.fire('Recusado!', 'O estabelecimento foi recusado com sucesso.', 'success');
        } catch (error) {
          console.error('Erro ao recusar o estabelecimento:', error);
          Swal.fire('Erro', 'Erro ao recusar o estabelecimento. Por favor, tente novamente.', 'error');
        }
      }
    });
  };

  const columns = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'nome',
    headerName: 'Nome',
    width: 200,
    renderCell: (params) => (
      <Link to={`/estabelecimentos/${params.row.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {params.row.nome}
      </Link>
    ),
  },
  { field: 'descricao', headerName: 'Descrição', width: 250 },
  { field: 'morada', headerName: 'Morada', width: 200 },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 150,
    renderCell: (params) => (
      <IconButton color="primary" onClick={() => handleClickOpen(params.row)}>
        <EditIcon />
      </IconButton>
    ),
  },
];

  const rows = estabelecimentos.map((estabelecimento) => ({
    id: estabelecimento.id,
    nome: estabelecimento.nome,
    descricao: estabelecimento.descricao,
    morada: estabelecimento.morada,
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
        <DialogTitle>Editar Estabelecimento</DialogTitle>
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

export default ValidacaoEstabelecimentos;
