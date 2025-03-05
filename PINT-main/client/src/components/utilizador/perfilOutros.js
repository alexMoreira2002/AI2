import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Button, Grid, Paper, Pagination } from '@mui/material';
import api from '../api/api';
import AvatarImagem from "../utils/avatarImagem";
import ComentariosPerfil from "./comentariosPerfil";
import InscricoesUtilizador from "./utilizadorInscricoes";
import moment from 'moment';

const PerfilOutros = () => {
  const { id } = useParams();
  const [utilizador, setUtilizador] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [inscricoes, setInscricoes] = useState([]);
  const [contadorInscricoes, setContadorInscricoes] = useState(0);
  const [contador, setContador] = useState(0);
  const [page, setPage] = useState(1);
  const itemsPerPage = 3;
  const noOfPages = Math.ceil(avaliacoes.length / itemsPerPage);
  const [mostrarAvaliacoes, setMostrarAvaliacoes] = useState(true);

  const fetchUtilizador = async () => {
    try {
      const response = await api.get(`/utilizador/${id}`);
      const dadosUtilizador = response.data;
      setUtilizador(dadosUtilizador);
    } catch (error) {
      console.error('Erro ao encontrar utilizador:', error);
    }
  };

  useEffect(() => {
    fetchUtilizador();
  }, [id]);

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

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sx={{ textAlign: 'center', paddingTop: '20px' }}>
            <AvatarImagem 
              src={utilizador && (utilizador.id_google || utilizador.id_facebook) ? utilizador.foto : `${process.env.REACT_APP_API_URL}/uploads/utilizador/${utilizador ? utilizador.foto : ''}`}
              alt={utilizador?.nome} 
              sx={{ width: 150, height: 150, margin: '0 auto', mb: 2 }} 
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
              <strong>Localidade:</strong> {utilizador?.localidade || '-'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Telemóvel:</strong> {utilizador?.telemovel || '-'}
            </Typography>
            <Typography variant="body1" sx={{ marginBottom: 1 }}>
              <strong>Email:</strong> {utilizador?.email || '-'}
            </Typography>
          </Grid>
          <Grid item xs={12} md={6} sx={{ paddingLeft: { xs: 0, md: 2 }, paddingTop: { xs: 2, md: 0 } }}>
            <Typography variant="h5" sx={{ marginBottom: 2, fontWeight: '700' }}>
              Informações:
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'left' }}>
              <Box sx={{ marginBottom: 2 }}>
                <Typography variant="h7"><strong>Avaliações de {utilizador?.nome}:</strong></Typography>
                <Typography variant="body1">{contador}</Typography>
              </Box>
              <Box>
                <Typography variant="h7"><strong>Inscrições ativas:</strong></Typography>
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
    </Box>
  );
};

export default PerfilOutros;
