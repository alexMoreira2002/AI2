import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import api from '../api/api';
import { IconButton, Dialog, DialogActions, DialogTitle, Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Swal from 'sweetalert2';
import { Link } from 'react-router-dom';

const ValidacaoFotoAlbum = () => {
  const [fotos, setFotos] = useState([]);
  const [open, setOpen] = useState(false);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);
  const [albuns, setAlbuns] = useState([]);

  useEffect(() => {
    fetchFotos();
    fetchAlbuns(); // Certifique-se de que os álbuns também são carregados
  }, []);

  const fetchFotos = async () => {
    try {
      const response = await api.get('/album/validar/fotos');
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log('Fotos recebidas:', response.data.data);
        setFotos(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao buscar fotos:', error);
    }
  };

  const fetchAlbuns = async () => {
    try {
      const response = await api.get('/album');
      if (response.data.success && Array.isArray(response.data.data)) {
        console.log('Álbuns recebidos:', response.data.data);
        setAlbuns(response.data.data);
      } else {
        console.error('Erro: a resposta da API não é um array');
      }
    } catch (error) {
      console.error('Erro ao buscar álbuns:', error);
    }
  };

  const handleClickOpen = (row) => {
    setFotoSelecionada(row);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleValidar = async () => {
    handleClose();
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente validar esta foto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, validar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = fotoSelecionada.id;
          await api.put(`/album/validar/fotos/${id}`);
          fetchFotos();
          Swal.fire({
            title: 'Validado!',
            text: 'A foto foi validada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao validar a foto:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao validar a foto. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonColor: '#369fb8',
          });
        }
      }
    });
  };

  const handleRecusar = async () => {
    handleClose();
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja realmente recusar esta foto?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#369fb8',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, recusar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const id = fotoSelecionada.id;
          await api.delete(`/album/${id}/fotos`);
          fetchFotos();
          Swal.fire({
            title: 'Recusado!',
            text: 'A foto foi recusada com sucesso.',
            icon: 'success',
            confirmButtonColor: '#369fb8',
          });
        } catch (error) {
          console.error('Erro ao recusar a foto:', error);
          Swal.fire({
            title: 'Erro',
            text: 'Erro ao recusar a foto. Por favor, tente novamente.',
            icon: 'error',
            confirmButtonColor: '#369fb8',
          });
        }
      }
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    {
      field: 'albumTitulo',
      headerName: 'Álbum',
      width: 200,
      renderCell: (params) => (
        <Link to={`/albuns/${params.row.idAlbum}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {params.row.album ? params.row.album.nome : 'Título não disponível'}
        </Link>
      ),
    },
    {
      field: 'foto',
      headerName: 'Foto',
      width: 200,
      renderCell: (params) => (
        <a href={`${process.env.REACT_APP_API_URL}/uploads/albuns/${params.row.foto}`} target="_blank" rel="noopener noreferrer">
          <img src={`${process.env.REACT_APP_API_URL}/uploads/albuns/${params.row.foto}`} alt="Foto" style={{ width: 100, height: 100, objectFit: 'cover' }} />
        </a>
      ),
    },
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

  const rows = fotos.map((foto) => ({
    id: foto.id,
    idAlbum: foto.idAlbum,
    album: foto.Album, // Certifique-se de que o nome do campo corresponde ao dado da resposta da API
    foto: foto.foto,
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
        <DialogTitle>Validar Foto</DialogTitle>
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

export default ValidacaoFotoAlbum;
