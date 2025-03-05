import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  Checkbox,
  Divider,
  Alert,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../api/api';
import moment from 'moment';

export default function Notificacoes() {
  const [notificacoes, setNotificacoes] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [idsSelecionados, setIdsSelecionados] = useState([]);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const fetchNotificacoes = async () => {
      try {
        const response = await api.get('/notificacao');
        if (response.data.status === 'success') {
          setNotificacoes(response.data.data.notificacoes);
        } else {
          console.error('Erro ao obter notificações:', response.data.message);
        }
      } catch (error) {
        console.error('Erro ao encontrar notificações:', error);
      }
    };

    fetchNotificacoes();
  }, []);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleToggle = (notificacaoId) => {
    if (idsSelecionados.includes(notificacaoId)) {
      setIdsSelecionados(idsSelecionados.filter((id) => id !== notificacaoId));
    } else {
      setIdsSelecionados([...idsSelecionados, notificacaoId]);
    }
  };

  const handleMarkSelectedRead = async () => {
    try {
      await api.put('/notificacao/lido', { ids: idsSelecionados });
      const updatedNotificacoes = notificacoes.map((notificacao) => ({
        ...notificacao,
        estado: idsSelecionados.includes(notificacao.id) ? true : notificacao.estado,
      }));
      setNotificacoes(updatedNotificacoes);
      setIdsSelecionados([]);
      handleClose();
    } catch (error) {
      console.error('Erro ao marcar selecionadas como lidas:', error);
    }
  };

  const handleDeleteSelected = async () => {
    try {
      await api.delete(`/notificacao`, { data: { ids: idsSelecionados } });
      const updatedNotificacoes = notificacoes.filter((notificacao) => !idsSelecionados.includes(notificacao.id));
      setNotificacoes(updatedNotificacoes);
      setIdsSelecionados([]);
      handleClose();
    } catch (error) {
      console.error('Erro ao apagar selecionadas:', error);
    }
  };

  const isRead = (notificacao) => {
    return notificacao.estado;
  };

  const isSelected = (notificacaoId) => {
    return idsSelecionados.includes(notificacaoId);
  };

  return (
    <Box p={1}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={-2}>
            <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold' }}>Notificações</Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={handleClick}
              disabled={idsSelecionados.length === 0}
              startIcon={<MoreVertIcon />}
              sx={{ marginTop: -1 }}
            >
              Opções
            </Button>
            <Menu
              id="long-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              componentsProps={{
                paper: {
                  sx: {
                    width: 200,
                    marginTop: 6,
                    marginRight: 15,
                  },
                },
              }}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
            >
              <MenuItem onClick={handleMarkSelectedRead}>Marcar selecionadas como lidas</MenuItem>
              <MenuItem onClick={handleDeleteSelected}>Apagar selecionadas</MenuItem>
            </Menu>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Não Lidas
            </Typography>
            {notificacoes.filter((n) => !n.estado).length === 0 ? (
              <Alert severity="info">Não há notificações não lidas.</Alert>
            ) : (
              <List>
                {notificacoes.filter((n) => !n.estado).map((notificacao) => (
                  <React.Fragment key={notificacao.id}>
                    <ListItem
                      button
                      onClick={() => handleToggle(notificacao.id)}
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: isSelected(notificacao.id) ? '#f0f0f0' : '#ffffff',
                      }}
                    >
                      <Checkbox
                        edge="start"
                        checked={isSelected(notificacao.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': notificacao.id }}
                      />
                      <ListItemText
                        primary={<Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>{notificacao.titulo}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                              {notificacao.descricao}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {moment(notificacao.data).fromNow()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper elevation={0}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              Lidas
            </Typography>
            {notificacoes.filter((n) => n.estado).length === 0 ? (
              <Alert severity="info">Não há notificações lidas.</Alert>
            ) : (
              <List>
                {notificacoes.filter((n) => n.estado).map((notificacao) => (
                  <React.Fragment key={notificacao.id}>
                    <ListItem
                      button
                      onClick={() => handleToggle(notificacao.id)}
                      sx={{
                        borderBottom: '1px solid #e0e0e0',
                        backgroundColor: isSelected(notificacao.id) ? '#f0f0f0' : '#ffffff',
                      }}
                    >
                      <Checkbox
                        edge="start"
                        checked={isSelected(notificacao.id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': notificacao.id }}
                      />
                      <ListItemText
                        primary={<Typography variant="body1" fontWeight="bold" sx={{ fontSize: '1.2rem' }}>{notificacao.titulo}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" color="textSecondary" sx={{ fontSize: '1rem' }}>
                              {notificacao.descricao}
                            </Typography>
                            <Typography variant="caption" color="textSecondary">
                              {moment(notificacao.data).fromNow()}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
