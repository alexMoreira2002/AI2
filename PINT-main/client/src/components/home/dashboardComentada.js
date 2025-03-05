import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';

const BoxContainer = styled(Card)({
  height: '100%', // Garantindo a mesma altura do Vista
  display: 'flex',
  alignItems: 'center',
  padding: '20px',
  backgroundColor: '#fff', // Cor de fundo consistente
  borderRadius: 10,
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  cursor: 'pointer',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.2)',
  },
});

// Estilo para o ícone
const Icon = styled('div')({
  fontSize: 50,
  color: '#369fb8',
  marginRight: 16,
});

const DashboardComentadas = () => {
  const navigate = useNavigate();
  const [maisAvaliados, setMaisAvaliados] = useState({
    estabelecimento: null,
    evento: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/estatistica/mais-avaliados');
        const { estabelecimentoMaisAvaliado, eventoMaisAvaliado } = response.data;
        setMaisAvaliados({
          estabelecimento: estabelecimentoMaisAvaliado,
          evento: eventoMaisAvaliado,
        });
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    };

    fetchData();
  }, []);

  const handleNavigation = (type, id) => {
    if (type === 'estabelecimento') {
      navigate(`/estabelecimentos/${id}`);
    } else if (type === 'evento') {
      navigate(`/eventos/${id}`);
    }
  };

  return (
    <Grid container spacing={2} sx={{ height: '100%' }}>
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <BoxContainer onClick={() => handleNavigation('estabelecimento', maisAvaliados.estabelecimento?.idEstabelecimento)}>
          <Icon><StoreIcon /></Icon>
          <div>
            <Typography variant="subtitle2">
              Estabelecimento mais avaliado
            </Typography>
            <Typography variant="h5" sx={{ color: '#369fb8', fontWeight: 'bold' }}>
              {maisAvaliados.estabelecimento?.nome || 'Nenhum estabelecimento encontrado'}
            </Typography>
            {maisAvaliados.estabelecimento && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {maisAvaliados.estabelecimento.totalAvaliacoes} avaliações
              </Typography>
            )}
          </div>
        </BoxContainer>
      </Grid>
      <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        <BoxContainer onClick={() => handleNavigation('evento', maisAvaliados.evento?.idEvento)}>
          <Icon><EventIcon /></Icon>
          <div>
            <Typography variant="subtitle2">
              Evento mais avaliado
            </Typography>
            <Typography variant="h5" sx={{ color: '#369fb8', fontWeight: 'bold' }}>
              {maisAvaliados.evento?.nome || 'Nenhum evento encontrado'}
            </Typography>
            {maisAvaliados.evento && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {maisAvaliados.evento.totalAvaliacoes} avaliações
              </Typography>
            )}
          </div>
        </BoxContainer>
      </Grid>
    </Grid>
  );
};

export default DashboardComentadas;
