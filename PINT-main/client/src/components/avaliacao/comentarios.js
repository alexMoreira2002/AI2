import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Rating, Avatar, Stack, Pagination,
  Menu, MenuItem, Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Button, IconButton, Divider
} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import ThumbDownAltIcon from '@mui/icons-material/ThumbDownAlt';
import api from '../api/api';
import Swal from 'sweetalert2';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';

function Comentarios({ avaliacoes, page, itemsPerPage, noOfPages, handleChange, fetchAvaliacoes, tipo }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);
  const [respostas, setRespostas] = useState({});
  const [newReply, setNewReply] = useState('');
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [currentParentId, setCurrentParentId] = useState(null);
  const [rating, setRating] = useState(1); 
  const open = Boolean(anchorEl);
  const [utilizador, setUtilizador] = useState(null);

  useEffect(() => {
    const initializeRespostas = async () => {
      const respostasPromises = avaliacoes.map(avaliacao =>
        api.get(`/avaliacao/${tipo}/respostas/${avaliacao.id}`)
      );
      const respostasResults = await Promise.all(respostasPromises);
      const newRespostas = {};
      for (const [index, response] of respostasResults.entries()) {
        const { data: respostasData } = response.data;
        const avaliacaoId = avaliacoes[index].id;
        newRespostas[avaliacaoId] = {
          dados: respostasData,
          quantidade: respostasData.length,
          visivel: false,
        };

        // Carrega respostas das sub-respostas
        for (const subResposta of respostasData) {
          const subRespostaId = subResposta.id;
          const subRespostasResponse = await api.get(`/avaliacao/${tipo}/respostas/${subRespostaId}`);
          const { data: subRespostasData } = subRespostasResponse.data;
          newRespostas[subRespostaId] = {
            dados: subRespostasData,
            quantidade: subRespostasData.length,
            visivel: false,
          };
        }
      }
      setRespostas(newRespostas);
    };

    initializeRespostas();
  }, [avaliacoes, tipo]);

  const fetchUtilizador = async () => {
    try {
      const response = await api.get('/utilizador/completo');
      const dadosUtilizador = response.data;
      setUtilizador(dadosUtilizador.id);
    } catch (error) {
      console.error('Erro ao encontrar utilizador:', error);
    }
  };

  useEffect(() => {
    fetchUtilizador();
  }, []);

  const handleClick = (event, avaliacao) => {
    setAnchorEl(event.currentTarget);
    setSelectedAvaliacao(avaliacao);
  };

  const handleClose = () => {
    setAnchorEl(null);  
  };

  const handleEdit = () => {
    setOpenDialog(true);
    handleClose();
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleSave = async () => {
    try {
      await api.put(`/avaliacao/${tipo}/${selectedAvaliacao.id}`, selectedAvaliacao);
      setOpenDialog(false);
      await fetchAvaliacoes(); 
    } catch (error) {
      console.error('Error updating comment:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedAvaliacao) {
      console.error('Nenhuma avaliação selecionada para excluir');
      return;
    }

    const result = await Swal.fire({
      title: 'Pretende apagar o comentário?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      confirmButtonColor: '#369fb8',
      denyButtonColor: '#6c757d',
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/avaliacao/${tipo}/${selectedAvaliacao.id}`);
        handleClose();
        await fetchAvaliacoes();

        Swal.fire({
          icon: 'success',
          title: 'Operação concluída',
          text: 'O comentário foi apagado com sucesso.',
          confirmButtonColor: '#369fb8',
        });
      } catch (error) {
        console.error('Error deleting comment:', error);

        Swal.fire({
          icon: 'error',
          title: 'Operação Cancelada',
          text: 'Ocorreu um erro ao apagar o comentário.',
          confirmButtonColor: '#369fb8',
        });
      }
    } else if (result.isDenied) {
      Swal.fire({
        title: 'Operação Cancelada',
        icon: 'info',
        confirmButtonColor: '#6c757d',
      });
    }
  };

  const handleUpvote = async (avaliacaoId) => {
    try {
      const dados = {
        tipoEntidade: tipo, 
        idEntidade: avaliacaoId, 
      };
      await api.post(`/avaliacao/${avaliacaoId}/upvote`, dados);
      await fetchAvaliacoes();
    } catch (error) {
      console.error('Error upvoting comment:', error);
    }
  };

  const handleDownvote = async (avaliacaoId) => {
    try {
      const dados = {
        tipoEntidade: tipo, 
        idEntidade: avaliacaoId, 
      };
      await api.post(`/avaliacao/${avaliacaoId}/downvote`, dados);
      await fetchAvaliacoes();
    } catch (error) {
      console.error('Error downvoting comment:', error);
    }
  };

  const handleReplyDialogOpen = (avaliacaoId) => {
    setCurrentParentId(avaliacaoId);
    setReplyDialogOpen(true);
  };

  const handleReplyDialogClose = () => {
    setReplyDialogOpen(false);
    setNewReply('');
    setRating(1); // Reseta a classificação para 1 ao fechar o diálogo
  };

  const handleReplySubmit = async () => {
    try {
      const respostaData = {
        comentario: newReply,
        classificacao: rating, // Inclui a classificação na resposta
      };
      await api.post(`/avaliacao/${tipo}/responder/${currentParentId}`, respostaData);
      handleReplyDialogClose();
      await fetchAvaliacoes();
      loadReplies(currentParentId);
    } catch (error) {
      console.error('Error replying to comment:', error);
    }
  };

  const loadReplies = async (avaliacaoId) => {
    try {
      const response = await api.get(`/avaliacao/${tipo}/respostas/${avaliacaoId}`);
      const { data: respostasData } = response.data;
  
      // Atualiza o estado para exibir as respostas da avaliação principal
      setRespostas((prevRespostas) => ({
        ...prevRespostas,
        [avaliacaoId]: {
          dados: respostasData,
          quantidade: respostasData.length,
          visivel: true,
        }
      }));
  
      // Recursivamente carrega respostas das sub-respostas
      for (const subResposta of respostasData) {
        await loadReplies(subResposta.id);
      }
    } catch (error) {
      console.error('Error loading replies:', error);
    }
  };
  

  const toggleReplies = async (avaliacaoId) => {
    if (respostas[avaliacaoId]) {
      setRespostas((prevRespostas) => {
        const newRespostas = { ...prevRespostas };
        newRespostas[avaliacaoId] = {
          ...newRespostas[avaliacaoId],
          visivel: !newRespostas[avaliacaoId].visivel,
        };
        return newRespostas;
      });
    } else {
      await loadReplies(avaliacaoId);
    }
  };

  const navigate = useNavigate();

  const renderComment = (avaliacao, isReply = false) => (
    <Box key={avaliacao.id} sx={{ display: 'flex', flexDirection: 'column', marginBottom: 2, marginLeft: isReply ? 4 : 0 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {avaliacao.utilizador ? (
            <>
              {avaliacao.utilizador.foto ? (
                <Avatar 
                  src={(avaliacao.utilizador.id_google || avaliacao.utilizador.id_facebook) != null ? avaliacao.utilizador.foto : `${process.env.REACT_APP_API_URL}/uploads/utilizador/${avaliacao.utilizador.foto}`}
                  alt={avaliacao.utilizador.nome} 
                  sx={{ marginRight: 2 }}
                />
              ) : (
                <Avatar sx={{ marginRight: 2 }} onClick={() => {
                  if (avaliacao.idUtilizador === utilizador) {
                    navigate('/perfil');  
                  } else {
                    navigate(`/perfil/${avaliacao.idUtilizador}`);
                  }
                }}>
                  {avaliacao.utilizador.nome[0]}
                </Avatar>
              )}
            </>
          ) : null}
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {avaliacao.utilizador ? avaliacao.utilizador.nome : 'Anónimo'}
            </Typography>
            <Rating value={avaliacao.classificacao} readOnly sx={{ marginTop: 0, marginLeft: -0.4}} />
            <Typography variant="body2" color="text.secondary" sx={{ marginLeft: 0.5 }}>
              {moment(avaliacao.data).fromNow()}
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton onClick={() => handleUpvote(avaliacao.id)}>
            <ThumbUpAltIcon />
          </IconButton>
          <Typography>{avaliacao.upvotes}</Typography>
          <IconButton onClick={() => handleDownvote(avaliacao.id)}>
            <ThumbDownAltIcon />
          </IconButton>
          <Typography>{avaliacao.downvotes}</Typography>
          <IconButton onClick={(event) => handleClick(event, avaliacao)}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleEdit}>Editar Comentário</MenuItem>
            <MenuItem onClick={handleDelete}>Apagar Comentário</MenuItem>
          </Menu>
        </Box>
      </Box>
      <Box sx={{ marginLeft: isReply ? 7 : 7 }}>
        <Typography variant="body1" sx={{ marginTop: 1 }}>
          {avaliacao.comentario}
        </Typography>
      </Box>
      <Box sx={{ marginTop: 0.5, display: 'flex', alignItems: 'center', marginLeft: 5 }}>
        <Button onClick={() => handleReplyDialogOpen(avaliacao.id)}>
          Responder
        </Button>
        <Button onClick={() => toggleReplies(avaliacao.id)}>
          {respostas[avaliacao.id]?.visivel ? 'Ocultar respostas' : `Ver respostas (${respostas[avaliacao.id]?.quantidade || 0})`}
        </Button>
      </Box>
      {respostas[avaliacao.id]?.visivel && (
        <Box sx={{ marginTop: 2 }}>
          {respostas[avaliacao.id]?.dados.map((resposta) => renderComment(resposta, true))}
        </Box>
      )}
    </Box>
  );
  return (
    <Box>
      {avaliacoes.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((avaliacao, index) => (
        <React.Fragment key={avaliacao.id}>
          {index > 0 && <Divider sx={{ margin: '20px 0' }} />}
          {renderComment(avaliacao)}
        </React.Fragment>
      ))}
      <Stack spacing={2} sx={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
        <Pagination
          count={noOfPages}
          page={page}
          onChange={handleChange}
          color="primary"
          sx={{
            '& .MuiPaginationItem-root': {
              borderRadius: '4px',
              backgroundColor: '#369fb8',
              color: 'white',
              '&:hover': {
                backgroundColor: '#369fb8',
              },
            },
          }}
        />
      </Stack>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Editar Comentário</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentário"
            type="text"
            fullWidth
            value={selectedAvaliacao ? selectedAvaliacao.comentario : ''}
            onChange={(e) =>
              setSelectedAvaliacao({
                ...selectedAvaliacao,
                comentario: e.target.value,
              })
            }
          />
          <Rating
            name="classificacao"
            value={selectedAvaliacao ? selectedAvaliacao.classificacao : 1}
            onChange={(event, newValue) => {
              setSelectedAvaliacao({
                ...selectedAvaliacao,
                classificacao: newValue,
              });
            }}
            sx={{ color: '#369fb8' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={replyDialogOpen} onClose={handleReplyDialogClose}>
        <DialogTitle>Responder Comentário</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Comentário"
            type="text"
            fullWidth
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
          />
          <Rating
            name="classificacao"
            value={rating} 
            onChange={(event, newValue) => setRating(newValue >= 1 ? newValue : 1)} 
            sx={{ color: '#369fb8' }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReplyDialogClose}>Cancelar</Button>
          <Button onClick={handleReplySubmit}>Responder</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Comentarios;
