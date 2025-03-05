import React from 'react';
import { Box, Typography, Rating, LinearProgress } from '@mui/material';

const AvaliacoesDetalhadas = ({ avaliacoes }) => {

  if (!avaliacoes || avaliacoes.length === 0) {
    return null;
  }

  const avgRating = avaliacoes.reduce((acc, curr) => acc + curr.classificacao, 0) / avaliacoes.length;


  const ratingsCount = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: avaliacoes.filter(avaliacao => avaliacao.classificacao === stars).length,
  }));

  const totalAvaliacoes = avaliacoes.length;
  const ratingsPercent = ratingsCount.map(rating => ({
    stars: rating.stars,
    percent: (rating.count / totalAvaliacoes) * 100,
  }));

  return (
    <Box sx={{ padding: 2, borderRadius: 2, boxShadow: 2, backgroundColor: '#ffffff' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Detalhes</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
        <Typography variant="h2" sx={{ fontWeight: 'bold', marginRight: 2 }}>{avgRating.toFixed(1)}</Typography>
        <Box>
          <Rating value={avgRating} readOnly precision={0.5} />
          <Typography variant="body2" color="text.secondary">{totalAvaliacoes} avaliações</Typography>
        </Box>
      </Box>
      <Box sx={{ marginTop: 2 }}>
        {ratingsPercent.map((rating, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="body2" sx={{ width: 20 }}>{rating.stars}</Typography>
            <LinearProgress
              variant="determinate"
              value={rating.percent}
              sx={{ flex: 1, marginLeft: 1, marginRight: 1, height: 10, borderRadius: 5, backgroundColor: '#e0e0e0', '& .MuiLinearProgress-bar': { backgroundColor: '#369fb8' } }}
            />
            <Typography variant="body2" sx={{ width: 30, textAlign: 'right' }}>{rating.percent.toFixed(0)}%</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default AvaliacoesDetalhadas;
