import React from 'react';
import { Box, Typography, Rating, Avatar, Stack, Pagination, Alert } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

function ComentariosPerfil({ avaliacoes, page, itemsPerPage, noOfPages, handleChange }) {
  const navigate = useNavigate();

  const handleClick = (tipo, id) => {
    if (tipo && id) {
      navigate(`/${tipo}/${id}`);
    }
  };

  return (
    <div>
      {avaliacoes.length === 0 ? (
        <Alert severity="info">Não há avaliações para mostrar.</Alert>
      ) : (
        avaliacoes.slice((page - 1) * itemsPerPage, page * itemsPerPage).map((avaliacao, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              marginBottom: 2, 
              cursor: 'pointer' // Adiciona cursor pointer para indicar que é clicável
            }}
            onClick={() => {
              if (avaliacao.estabelecimento) {
                handleClick('estabelecimentos', avaliacao.idEstabelecimento);
              } else if (avaliacao.evento) {
                handleClick('eventos', avaliacao.idEvento);
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {avaliacao.utilizador ? (
                  <>
                    {avaliacao.utilizador.foto ? (
                      <Avatar 
                        src={`${process.env.REACT_APP_API_URL}/uploads/utilizador/${avaliacao.utilizador.foto}`} 
                        alt={avaliacao.utilizador.nome} 
                        sx={{ marginRight: 2 }}
                      />
                    ) : (
                      <Avatar sx={{ marginRight: 2 }}>
                        {avaliacao.utilizador.nome[0]}
                      </Avatar>
                    )}
                  </>
                ) : null}
                <Box>
                  <Rating value={avaliacao.classificacao} sx={{ marginTop: 0, marginLeft: -0.4}} readOnly />
                  <Typography variant="body2" color="text.secondary">
                    {moment(avaliacao.data).fromNow()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ marginTop: 1, marginLeft: 7 }}>{avaliacao.comentario}</Typography>
            {avaliacao.estabelecimento && (
              <Typography
                variant="body2"
                sx={{ marginTop: 1, marginLeft: 7, cursor: 'pointer' }}
                color="text.secondary"
                onClick={() => handleClick('estabelecimentos', avaliacao.estabelecimento.id)} 
              >
                Estabelecimento: {avaliacao.estabelecimento.nome}
              </Typography>
            )}
            {avaliacao.evento && (
              <Typography
                variant="body2"
                sx={{ marginTop: 1, marginLeft: 7, cursor: 'pointer' }}
                color="text.secondary"
                onClick={() => handleClick('eventos', avaliacao.evento.id)} // Adiciona o evento de clique
              >
                Evento: {avaliacao.evento.titulo}
              </Typography>
            )}
            <Box sx={{ width: '100%', height: '1px', backgroundColor: 'lightgray', marginTop: 2, marginBottom: 2 }} />
          </Box>
        ))
      )}
      {avaliacoes.length > 0 && (
        <Stack spacing={2}>
          <Pagination count={noOfPages} page={page} onChange={handleChange} shape="rounded" />
        </Stack>
      )}
    </div>
  );
}

export default ComentariosPerfil;
