import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography } from '@mui/material';
import { Link } from 'react-router-dom'; 

const InscricoesUtilizador = ({ inscricoes, page, itemsPerPage }) => {
  // Calcula o índice inicial e final com base na página atual
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Obtém as inscrições para a página atual
  const inscricoesPaginadas = inscricoes.slice(startIndex, endIndex);

  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Título do Evento</TableCell>
              <TableCell>Data do Evento</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inscricoesPaginadas.map((inscricao) => (
              <TableRow key={inscricao.id}>
                <TableCell>{inscricao.id}</TableCell>
                <TableCell>
                  <Link to={`/eventos/${inscricao.idEvento}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {inscricao.evento.titulo}
                  </Link>
                </TableCell>
                <TableCell>{new Date(inscricao.evento.data).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Adicionar a paginação aqui */}
      <Typography variant="body2" sx={{ textAlign: 'center', marginTop: 2 }}>
        Página {page} de {Math.ceil(inscricoes.length / itemsPerPage)}
      </Typography>
    </>
  );
};

export default InscricoesUtilizador;
