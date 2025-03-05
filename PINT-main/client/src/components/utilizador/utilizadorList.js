import React, { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, IconButton, Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
import api from '../api/api';
import moment from 'moment';
import 'moment/locale/pt';

const ListaUtilizadores = () => {
  const [utilizadores, setUtilizadores] = useState([]);
  const [open, setOpen] = useState(false);
  const [postos, setPostos] = useState([]);
  const [form, setForm] = useState({ nome: '', email: '', estado: false, isAdmin: false, idPosto: '' });
  const [isEdit, setIsEdit] = useState(false);

  moment.locale('pt');

  useEffect(() => {
    fetchIdPostoAndUtilizadores();
    fetchPostos();
  }, []);
  
  
  const fetchIdPostoAndUtilizadores = async () => {
    try {
      const response = await api.get('/utilizador');
      const idPosto = response.data.idPosto;
      console.log('idPosto:', idPosto);
      fetchUtilizadores(idPosto);
    } catch (error) {
      console.error('Erro ao encontrar idPosto:', error);
    }
  };
  
  const fetchUtilizadores = async () => {
    try {
      const responsePosto = await api.get('/utilizador');
      const idPosto = responsePosto.data.idPosto;
      const response = await api.get('/utilizador/todos');
      const utilizadores = response.data.filter(user => user.idPosto === idPosto || user.idPosto === undefined || user.idPosto === null);
      setUtilizadores(utilizadores);
    } catch (error) {
      console.error('Erro ao encontrar utilizadores:', error);
    }
  };

  const fetchPostos = async () => {
    try {
      const response = await api.get('/postos');
      setPostos(response.data.data);
    } catch (error) {
      console.error('Erro ao encontrar postos:', error);
    }
  };

  const handleAddOrEdit = async () => {
    try {
      if (isEdit) {
        await api.put(`/utilizador/${form.id}`, form);
      } else {
        await api.post('/utilizador', form);
      }
      fetchUtilizadores();
      setOpen(false);
    } catch (error) {
      console.error('Erro ao adicionar/editar utilizador:', error);
    }
  };

  const handleClickOpen = (user = null) => {
    if (user) {
      setForm(user);
      setIsEdit(true);
    } else {
      setForm({ nome: '', email: '', estado: false, isAdmin: false, idPosto: '' });
      setIsEdit(false);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getPostoNome = (idPosto) => {
    const posto = postos.find((p) => p.id === idPosto);
    return posto ? posto.nome : '';
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 100 },
    { field: 'nome', headerName: 'Nome', width: 200 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'estado', headerName: 'Estado', width: 100, type: 'boolean' },
    { field: 'isAdmin', headerName: 'Admin', width: 100, type: 'boolean' },
    { field: 'postoNome', headerName: 'Posto', width: 200 },
    {
      field: 'actions',
      headerName: 'Ações',
      renderCell: (params) => (
        <>
          <IconButton color="primary" onClick={() => handleClickOpen(params.row)}>
            <EditIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = utilizadores.map((user) => ({
    ...user,
    postoNome: getPostoNome(user.idPosto),
  }));

  return (
    <Grid container spacing={3} style={{ margin: '0', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '0vh' }}>
      <Grid item xs={11} md={10} xl={10}>   
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#369fb8', marginBottom: 4, fontWeight: 'bold' }}>
        Gerir Utilizadores
      </Typography>
      
      <DataGrid
        rows={rows}
        columns={columns}
        rowsPerPageOptions={[]}
        pageSize={5}
        disableSelectionOnClick
        sx={{
          maxHeight: '100vh',
          minHeight: '630px',
          '.MuiTablePagination-selectRoot': {
            display: 'none',
          },
        }}
        disableColumnSelector
        localeText={{
          footerRowSelected: (count) => `${count} linha(s) selecionada(s)`,
          rowsPerPage: 'Linhas por página:',
          noRowsLabel: 'Nenhuma linha',
          paginationFirstPage: 'Primeira página',
          paginationLastPage: 'Última página',
          paginationNextPage: 'Próxima página',
          paginationPreviousPage: 'Página anterior',
          paginationRangeLabel: (params) => `${params.from}-${params.to} de ${params.count !== -1 ? params.count : `mais de ${params.to}`}`,
        }}
      />
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{isEdit ? 'Editar Utilizador' : 'Adicionar Utilizador'}</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            label="Nome"
            type="text"
            fullWidth
            value={form.nome}
            style={{ marginBottom: '20px' }}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            type="email"
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Estado</InputLabel>
            <Select
              value={form.estado}
              onChange={(e) => setForm({ ...form, estado: e.target.value })}
            >
              <MenuItem value={true}>Ativo</MenuItem>
              <MenuItem value={false}>Inativo</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Admin</InputLabel>
            <Select
              value={form.isAdmin}
              onChange={(e) => setForm({ ...form, isAdmin: e.target.value })}
            >
              <MenuItem value={true}>Sim</MenuItem>
              <MenuItem value={false}>Não</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth margin="dense">
            <InputLabel>Posto</InputLabel>
            <Select
              value={form.idPosto}
              onChange={(e) => setForm({ ...form, idPosto: e.target.value })}
            >
              {postos.map((posto) => (
                <MenuItem key={posto.id} value={posto.id}>{posto.nome}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleAddOrEdit} color="primary">
            {isEdit ? 'Guardar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
      </Grid>
  </Grid>
  );
};

export default ListaUtilizadores;
