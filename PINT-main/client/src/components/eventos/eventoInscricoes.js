import * as React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';

const InscricoesGrelha = ({ inscricoes }) => {
  return (
    <>
      {inscricoes.length === 0 ? (
        <Alert severity="info">Não existem inscrições para mostrar.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Nome do Utilizador</TableCell> 
                <TableCell>Data</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {inscricoes.map((inscricao) => (
                <TableRow key={inscricao.id}>
                  <TableCell>{inscricao.id}</TableCell>
                  <TableCell>{inscricao.utilizador?.nome}</TableCell> 
                  <TableCell>{new Date(inscricao.data).toLocaleDateString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
};

export default InscricoesGrelha;