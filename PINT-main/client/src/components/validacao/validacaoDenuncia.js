import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/api';
import { IconButton, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

const ValidacaoDenuncias = () => {
  const [denuncias, setDenuncias] = useState([]);
  const [open, setOpen] = useState(false);
  const [denunciaSelecionada, setDenunciaSelecionada] = useState(null);

  useEffect(() => {
    fetchDenuncias();
  }, []);

  const fetchDenuncias = async () => {
    try {
      const response = await api.get('/denuncia');
      if (response.data.success && Array.isArray(response.data.data)) {
        setDenuncias(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao procurar denúncias:', error);
    }
  };

  const handleClickOpen = (row) => {
    setDenunciaSelecionada(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidar = () => {
    handleClose();
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente validar esta denúncia?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, validar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = denunciaSelecionada.id;
          await api.put(`/denuncia/validar/${id}`);
          handleClose();
          fetchDenuncias();
          Swal.fire({
            title: 'Validado!',
            text: 'A denúncia foi validada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao validar a denúncia:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao validar a denúncia. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonColor: '#369fb8',
          });
        }
      }
    });
  };

  const handleRecusar = () => {
    handleClose();
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente recusar esta denúncia?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, Recusar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = denunciaSelecionada.id;
          await api.delete(`/denuncia/${id}`);
          handleClose();
          fetchDenuncias();
          Swal.fire({
            title: 'Recusado!',
            text: 'A denúncia foi recusada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8'
          });
        } catch (error) {
          console.error('Erro ao recusar a denúncia:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao recusar a denúncia. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonColor: '#369fb8'
          });
        }
      }
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'criador', headerName: 'Criador da Denúncia', width: 200 },
    {
      field: 'comentario',
      headerName: 'Comentário',
      width: 400,
      renderCell: (params) => {
        const basePath = params.row.avaliacaoEvento ? '/eventos' : '/estabelecimentos';
        const idAvaliacao = params.row.avaliacaoEvento ? params.row.avaliacaoEvento.idEvento : params.row.avaliacaoEstabelecimento.idEstabelecimento;
        return (
          <Link to={`${basePath}/${idAvaliacao}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            {params.value}
          </Link>
        );
      },
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

  const rows = denuncias.map((denuncia) => ({
    ...denuncia,
    criador: denuncia.criador.nome,
    comentario: denuncia.avaliacaoEvento?.comentario || denuncia.avaliacaoEstabelecimento?.comentario || 'Sem comentário',
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
        <DialogTitle>Validar Denúncia</DialogTitle>
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

export default ValidacaoDenuncias;
