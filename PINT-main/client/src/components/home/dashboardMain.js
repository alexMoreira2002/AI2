import React, { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import Validacoes from './dashboardValidacoes';
import Comentadas from './dashboardComentada';
import Vista from './dashboardDenuncias';
import api from '../api/api'; 
import Denuncia from './dashboardDenuncias';

const DashboardMain = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [saudacao, setSaudacao] = useState('');
  const [utilizador, setUtilizador] = useState(null);

  useEffect(() => {
    const fetchUtilizador = async () => {
      try {
        const response = await api.get('/utilizador/completo');
        setUtilizador(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Erro ao encontrar utilizador:', error);
      }
    };

    fetchUtilizador();
  }, []); 

useEffect(() => {
  if (utilizador) { 
    const currentHour = new Date().getHours();
    const currentDate = new Date();
    const lastLoginDate = new Date(utilizador.ultimoLogin);
    const diffTime = Math.abs(currentDate - lastLoginDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays >= 15) {
      setSaudacao('Seja bem-vindo novamente, ');
    } else {
      if (currentHour >= 6 && currentHour < 13) {
        setSaudacao('Bom dia, ');
      } else if (currentHour >= 13 && currentHour < 20) {
        setSaudacao('Boa tarde, ');
      } else {
        setSaudacao('Boa noite, ');
      }
    }
  }
}, [utilizador]); 

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  return (
    <Box sx={{ height: '80vh', display: 'flex', flexDirection: 'column' }}>

      {utilizador && (
          <Typography variant="h4" sx={{ marginBottom: 2 }}>
            {saudacao} <strong>{utilizador.nome}</strong>
          </Typography>
        )}

      <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={2} sx={{ height: '110%' }}>
            <Grid item xs={12} md={6} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Validacoes sx={{ flexGrow: 1 }} />
            </Grid>
            <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Comentadas sx={{ flexGrow: 1 }} />
            </Grid>
            <Grid item xs={12} md={2} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Denuncia sx={{ flexGrow: 1 }} />
            </Grid>
          </Grid>
      </Box>
    </Box>
  );
};

export default DashboardMain;