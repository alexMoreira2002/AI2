import React, { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Grid, Paper, Pagination, MenuItem, styled, Select } from '@mui/material';
import api from '../api/api';
import AvatarImagem from "../utils/avatarImagem";
import ComentariosPerfil from "./comentariosPerfil";
import EditarPerfil from './utilizadorEditar'; 
import InscricoesUtilizador from "./utilizadorInscricoes";
import moment from 'moment';

const Perfil = () => {
  const [utilizador, setUtilizador] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [contadorInscricoes, setContadorInscricoes] = useState(0);
  const [contador, setContador] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const noOfPages = Math.ceil(avaliacoes.length / itemsPerPage);
  const [isDialogOpen, setIsDialogOpen] = useState(false); 
  const [idArea, setidArea] = useState("");
  const [idSubarea, setidSubarea] = useState("");
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(true); 

  const fileInputRef = useRef(null);

  const fetchUtilizador = async () => {
    try {
      const response = await api.get('/utilizador/completo');
      const dadosUtilizador = response.data;
      setUtilizador(dadosUtilizador);

      setidArea(dadosUtilizador.idArea || "");
      setidSubarea(dadosUtilizador.idSubarea || "");

      // Carrega as subáreas se uma área estiver selecionada
      if (dadosUtilizador.idArea) {
        fetchSubareas(dadosUtilizador.idArea);
      }
    } catch (error) {
      console.error('Erro ao encontrar utilizador:', error);
    }
  };

  useEffect(() => {
    fetchUtilizador();
  }, []);

  const fetchAvaliacoes = async () => {
    if (utilizador) {
      try {
        const response = await api.get(`/avaliacao/utilizador/${utilizador.id}`);
        setAvaliacoes(response.data.data);
        setContador(response.data.contadorAvaliacoes);
      } catch (error) {
        console.error('Erro ao procurar avaliações:', error);
      }
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, [utilizador]);

  const fetchInscricoes = async () => {
    if (utilizador) {
      try {
        const response = await api.get(`/utilizador/inscricao/${utilizador.id}`);
        setInscricoes(response.data.inscricoes);
        setContadorInscricoes(response.data.contador);
      } catch (error) {
        console.error('Erro ao procurar inscrições:', error);
      }
    }
  };

  useEffect(() => {
    fetchInscricoes();
  }, [utilizador]);

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

  const fetchSubareas = async (areaId) => {
    if (areaId) {
      try {
        const response = await api.get(`/areas/${areaId}`);
        setSubareas(response.data.data);
      } catch (error) {
        console.error('Erro ao procurar subáreas:', error);
      }
    } else {
      setSubareas([]);
    }
  };

  useEffect(() => {
    fetchSubareas(idArea);
  }, [idArea]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const updateFotoPerfil = async (event) => {
    const foto = event.target.files[0];
    if (foto && utilizador) {
      const formData = new FormData();
      formData.append('foto', foto); 

      try {
        const response = await api.put(`/utilizador/${utilizador.id}`, formData, { // Atualizado para corresponder ao endpoint correto
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        if (response.status === 200) {
          setUtilizador({ ...utilizador, foto: response.data.foto });
          fetchUtilizador();
        }
      } catch (error) {
        console.error('Erro ao atualizar foto do perfil:', error);
      }
    }
  };

  const handleDialogOpen = () => {
    fetchUtilizador();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    fetchUtilizador();
    setIsDialogOpen(false);
  };

  const handleUpdate = (updatedUtilizador) => {
    fetchUtilizador();
    setUtilizador(updatedUtilizador); 
  };

  const atualizarPreferencias = async (novoIdArea, novoIdSubarea) => {
    try {
      const response = await api.put(`/utilizador/${utilizador.id}/preferencias`, {
        idArea: novoIdArea,
        idSubarea: novoIdSubarea,
      });
      if (response.status === 200) {
        setUtilizador({ ...utilizador, idArea: novoIdArea, idSubarea: novoIdSubarea });
      }
    } catch (error) {
      console.error('Erro ao atualizar preferências:', error);
    }
  };

  const handleAreaChange = (event) => {
    const novoIdArea = event.target.value;
    setidArea(novoIdArea);
    setidSubarea(""); // Reset subarea when area changes
    fetchSubareas(novoIdArea); // Carrega as subáreas da nova área selecionada
    atualizarPreferencias(novoIdArea, "");
  };

  const handleSubareaChange = (event) => {
    const novoIdSubarea = event.target.value;
    setidSubarea(novoIdSubarea);
    atualizarPreferencias(idArea, novoIdSubarea);
  };

  const StyledSelectArea = styled(Select)({
    marginBottom: 20,
    marginTop: 20,
    marginLeft: 10,
    minWidth: 150,
    width: 200,
    borderRadius: 10,
    backgroundColor: '#369fb8',
    color: '#fff',
    '& .MuiSelect-icon': {
      color: '#fff',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
  });

  const StyledSelectSubarea = styled(Select)({
    marginBottom: 20,
    marginLeft: 10,
    minWidth: 200,
    width: 200,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#369fb8',
    '& .MuiSelect-icon': {
      color: '#369fb8',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
  });

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={6} sx={{ textAlign: 'left' }}>
                  </Grid>
                  <Grid item xs={2} sm={6} sx={{ textAlign: 'right' }}>
                  <Button variant="contained" color="primary" onClick={handleDialogOpen}>
                    Editar Perfil
                  </Button>
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'center', marginTop: -8 }}>
                  <AvatarImagem 
                    src={utilizador && (utilizador.id_google || utilizador.id_facebook) ? utilizador.foto : `${process.env.REACT_APP_API_URL}/uploads/utilizador/${utilizador ? utilizador.foto : ''}`}
                    alt={utilizador?.nome} 
                    sx={{ width: 150, height: 150, margin: '0 auto', mb: 2 }} 
                    onClick={() => fileInputRef.current.click()} 
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={updateFotoPerfil}
                  />
                  <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    {utilizador?.nome}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ color: 'text.secondary' }}>
                    {utilizador?.cargo}
                  </Typography>
                  {utilizador && (
                    <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
                    Última vez online: {moment(utilizador.ultimoLogin).subtract(1, 'hours').fromNow()}
                    </Typography>
                  )}
                  </Grid>
                  <Grid item xs={12} sx={{ textAlign: 'center', marginTop: -2}}>
                  <Typography style={{marginTop: 15}} variant="h6">Preferências</Typography>
                  <StyledSelectArea value={idArea} onChange={handleAreaChange} displayEmpty fullWidth>
                    <MenuItem value="">Todas</MenuItem>
                    {areas.map((area) => (
                    <MenuItem value={area.id} key={area.id}>{area?.nome}</MenuItem>
                    ))}
                  </StyledSelectArea>
                  <StyledSelectSubarea value={idSubarea} onChange={handleSubareaChange} displayEmpty fullWidth>
                    <MenuItem value="">Todas</MenuItem>
                    {subareas.map((subarea) => (
                    <MenuItem value={subarea.id} key={subarea.id}>{subarea?.nome}</MenuItem>
                    ))}
                  </StyledSelectSubarea>
                  </Grid>
                </Grid>
                </Paper>
                <Paper elevation={3} sx={{ padding: 4, marginTop: 3, marginBottom: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} md={6} sx={{ borderRight: { xs: 'none', md: '1px solid #ddd' } }}>
                  <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: '700' }}>
                    Detalhes:
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Nome:</strong> {utilizador?.nome || '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Descrição:</strong> {utilizador?.descricao || '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>NIF:</strong> {utilizador?.nif || '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Localidade:</strong> {utilizador?.localidade || '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Telemóvel:</strong> {utilizador?.telemovel || '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Email:</strong> {utilizador?.email || '-'}
                  </Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Posto:</strong> {utilizador?.Posto?.nome || '-'}
                  </Typography>
                  </Grid>
          <Grid item xs={12} md={6} sx={{ paddingLeft: { xs: 0, md: 2 }, paddingTop: { xs: 2, md: 0 } }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: '700' }}>
              Informações:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
              <Box sx={{ marginBottom: 2 }}>
                <Typography  variant="h7"> <strong>Avaliações de {utilizador?.nome}: </strong></Typography>
                <Typography variant="body1">{contador}</Typography>
              </Box>
              <Box>
                <Typography variant="h7"> <strong> Inscrições ativas: </strong> </Typography>
                <Typography variant="body1">{contadorInscricoes}</Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginBottom: 2 }}>
          <Button
            variant={mostrarAvaliacoes ? 'contained' : 'outlined'}
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={() => setMostrarAvaliacoes(true)}
          >
            Avaliações
          </Button>
          <Button
            variant={mostrarAvaliacoes ? 'outlined' : 'contained'}
            color="primary"
            onClick={() => setMostrarAvaliacoes(false)}
          >
            Inscrições
          </Button>
        </Box>
      <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
        {mostrarAvaliacoes ? (
          <>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
              Avaliações:
            </Typography>
            <ComentariosPerfil 
              fetchAvaliacoes={fetchAvaliacoes}
              avaliacoes={avaliacoes} 
              page={page} 
              itemsPerPage={itemsPerPage} 
              noOfPages={noOfPages} 
              handleChange={handleChange} 
              tipo="estabelecimentos"
            />
            {avaliacoes.length > itemsPerPage && (
              <Pagination
                count={noOfPages}
                page={page}
                onChange={handleChange}
                sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
              />
            )}
          </>
        ) : (
          <>
             <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: 'bold' }}>
          Inscrições:
        </Typography>
        <InscricoesUtilizador
          inscricoes={inscricoes}
          page={page}
          itemsPerPage={itemsPerPage}
        />
        <Pagination
          count={Math.ceil(inscricoes.length / itemsPerPage)}
          page={page}
          onChange={handleChange}
          sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}
        />
          </>
        )}
      </Paper>

      <EditarPerfil
        open={isDialogOpen}
        onClose={handleDialogClose}
        utilizador={utilizador}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default Perfil;
