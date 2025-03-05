import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Grid, CardContent, Typography, Box, Divider, Button } from "@mui/material";
import api from "../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AvaliacoesDetalhadas from "../avaliacao/avaliacoes";
import FotoSlider from "../utils/fotoSlider";
import Comentarios from "../avaliacao/comentarios";
import NovaAvaliacao from "../avaliacao/novaAvaliacao";
import BotaoUpload from "../utils/botaoUpload";
import EditarEstabelecimento from "./estabelecimentoEdit";
import BotoesPartilha from "../utils/botaoPartilha";
const apiUrl = process.env.REACT_APP_API_URL;
const frontendUrl = process.env.REACT_APP_FRONTEND; 

function EstabelecimentoPage() {
  const { id } = useParams();
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [utilizador, setUtilizador] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;
  const noOfPages = Math.ceil(avaliacoes.length / itemsPerPage);
  const [open, setOpen] = useState(false);

  const url = `${frontendUrl}/estabelecimentos/${id}`;
  const title = 'Achei este estabelecimento interessante!';

  useEffect(() => {
    const fetchUtilizador = async () => {
      try {
        const response = await api.get('/utilizador');
        setUtilizador(response.data);
      } catch (error) {
        console.error('Erro ao encontrar utilizador:', error);
      }
    };
    fetchUtilizador();
  }, []);

  useEffect(() => {
    const fetchEstabelecimento = async () => {
      try {
        const response = await api.get(`/estabelecimentos/${id}`);
        const estabelecimentoData = response.data.data;
        console.log("Estabelecimento data:", estabelecimentoData);
        setEstabelecimento(estabelecimentoData);
      } catch (error) {
        console.error('Error fetching estabelecimento:', error.response || error.message);
      }
    };
    fetchEstabelecimento();
  }, [id]);

  const fetchAvaliacoes = useCallback(async () => {
    try {
      const response = await api.get(`/avaliacao/estabelecimentos/${id}`);
      setAvaliacoes(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching Avaliações:', error.response || error.message);
    }
  }, [id]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const updateFotos = async () => {
    try {
      const response = await api.get(`foto/estabelecimentos/${id}`);
      const fotoPaths = response.data.data.map(foto => ({
        id: foto.id,
        url: `${process.env.REACT_APP_API_URL}/uploads/estabelecimentos/${foto.foto}`,
        carregadaPor: foto.criador ? foto.criador.nome : 'Desconhecido',
        validadaPor: foto.admin ? foto.admin.nome : 'Desconhecido',
      }));
      setFotos(fotoPaths);
    } catch (error) {
      console.error('Error fetching fotos:', error.response || error.message);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  if (!estabelecimento) {
    return <div>A carregar...</div>;
  }

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={10} md={11} lg={10} xl={10}>
        <Box sx={{ padding: 0, paddingTop: 0 }}>
          <Grid container alignItems="center" spacing={2}>
            <Grid item>
              <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 0 }}>
                {estabelecimento.nome}
              </Typography>
            </Grid>
            <Grid item>
              <BotoesPartilha url={url} title={title} />
            </Grid>
          </Grid>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: -6, marginBottom: 3 }}>
            {utilizador && (
              <>
                <BotaoUpload tipo="estabelecimentos" id={id} fotos={fotos} setFotos={setFotos} idUtilizador={utilizador.id} updateFotos={updateFotos} />
                <Button variant="contained" color="secondary" onClick={handleOpen} sx={{ backgroundColor: '#369fb8', '&:hover': { backgroundColor: '#2a7f9d' } }}>
                  Editar Estabelecimento
                </Button>
                <EditarEstabelecimento open={open} handleClose={handleClose} />
              </>
            )}
          </Box>
          <FotoSlider fotos={fotos} descricao={estabelecimento.nome} tipo="estabelecimentos" id={id} updateFotos={updateFotos} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CardContent sx={{ padding: 0, marginTop: 10 }}>
                <Typography variant="h4" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Descrição</Typography>
                <Typography variant="body1" color="text.secondary">
                  {estabelecimento.descricao}
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} sx={{ marginBottom: 4 }}>
                <Typography variant="h5" sx={{ marginTop: 3, fontWeight: 'bold', marginBottom: 2 }}>Avaliações</Typography>
                <AvaliacoesDetalhadas avaliacoes={avaliacoes} />
              </Grid>
              <Comentarios
                fetchAvaliacoes={fetchAvaliacoes}
                avaliacoes={avaliacoes}
                page={page}
                itemsPerPage={itemsPerPage}
                noOfPages={noOfPages}
                handleChange={handleChange}
                tipo="estabelecimentos"
              />
              {utilizador && (
                <NovaAvaliacao
                  handleUpdateAvaliacoes={fetchAvaliacoes}
                  id={id}
                  idUtilizador={utilizador.id}
                  avaliacoes={avaliacoes}
                  setAvaliacoes={setAvaliacoes}
                  tipo="estabelecimentos"
                />
              )}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>Informações de Contacto</Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                  {estabelecimento.morada && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Morada: {estabelecimento.morada}
                    </Typography>
                  )}
                  {estabelecimento.telemovel && (
                    <>
                      <Divider sx={{ width: '100%', my: 1 }} />
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        Telemovel: {estabelecimento.telemovel}
                      </Typography>
                    </>
                  )}
                  {estabelecimento.email && (
                    <>
                      <Divider sx={{ width: '100%', my: 1 }} />
                      <Typography variant="body2" color="text.secondary">
                        Email: {estabelecimento.email}
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default EstabelecimentoPage;
