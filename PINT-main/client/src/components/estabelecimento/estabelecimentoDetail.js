import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Grid, CardContent, Typography, Box, Button } from "@mui/material";
import api from "../api/api";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import AvaliacoesDetalhadas from "../avaliacao/avaliacoes";
import FotoSlider from "../utils/fotoSlider";
import Comentarios from "../avaliacao/comentarios";
import NovaAvaliacao from "../avaliacao/novaAvaliacao";
import BotaoUpload from "../utils/botaoUpload";

function DetailEstabelecimento() {
  const { id } = useParams();
  const [estabelecimento, setEstabelecimento] = useState(null);
  const [fotos, setFotos] = useState([]);
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [utilizador, setUtilizador] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

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
        setEstabelecimento(response.data.data);
      } catch (error) {
        console.error('Error fetching estabelecimento:', error.response || error.message);
      }
    };
    fetchEstabelecimento();
  }, [id]);

  const fetchAvaliacoes = async () => {
    try {
      const response = await api.get(`/avaliacao/estabelecimento/${id}`);
      setAvaliacoes(response.data.data);
      console.log(response.data.data);
    } catch (error) {
      console.error('Error fetching Avaliações:', error.response || error.message);
    }
  };

  useEffect(() => {
    fetchAvaliacoes();
  }, [id]);

  if (!estabelecimento) {
    return <div>A carregar...</div>;
  }

  return (
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item xs={12} sm={10} md={8} lg={10} xl={10}>
        <Box sx={{ padding: 1, paddingTop: 0 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold' }}>{estabelecimento.nome}</Typography>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginTop: 0 }}>
            <BotaoUpload tipo="estabelecimento" id={id} fotos={fotos} setFotos={setFotos} />
            <Button variant="contained" sx={{ backgroundColor: '#369fb8', color: '#ffffff', '&:hover': { backgroundColor: '#2a6a9e' } }}>Botão 2</Button>
          </Box>
          <FotoSlider fotos={fotos} descricao={estabelecimento.nome} tipo="estabelecimentos" id={id} />
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CardContent sx={{ padding: 0, marginTop: 10 }}>
                <Typography variant="h4" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Descrição</Typography>
                <Typography variant="body2" color="text.secondary">
                  {estabelecimento.descricao}
                </Typography>
              </CardContent>
            </Grid>
            <Grid item xs={12}>
              <Grid item xs={12} sx={{ marginBottom: 4 }}>
                <Typography variant="h5" sx={{ marginTop: 3, fontWeight: 'bold', marginBottom: 2 }}>Avaliações</Typography>
                <AvaliacoesDetalhadas avaliacoes={avaliacoes} onUpdate={fetchAvaliacoes} />
              </Grid>
              <Comentarios
                avaliacoes={avaliacoes}
                page={page}
                itemsPerPage={itemsPerPage}
                noOfPages={Math.ceil(avaliacoes.length / itemsPerPage)}
                handleChange={(event, value) => setPage(value)}
                tipo="estabelecimento"
              />
              <NovaAvaliacao 
                id={id}
                idUtilizador={utilizador ? utilizador.id : null} 
                handleUpdateAvaliacoes={fetchAvaliacoes} 
                tipo="estabelecimento"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)', borderRadius: '10px', padding: 3 }}>
                <Comentarios 
                  avaliacoes={avaliacoes} 
                  page={page} 
                  itemsPerPage={itemsPerPage} 
                  noOfPages={Math.ceil(avaliacoes.length / itemsPerPage)} 
                  handleChange={(event, value) => setPage(value)} 
                  tipo="estabelecimento" 
                />
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
}

export default DetailEstabelecimento;
