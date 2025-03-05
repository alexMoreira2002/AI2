import React, { useState } from "react";
import { TextField, Button, Rating, Typography, Box } from "@mui/material";
import Swal from "sweetalert2";
import api from "../api/api";

function NovaAvaliacao({ tipo, id, idUtilizador, handleUpdateAvaliacoes }) {
  const [rating, setRating] = useState(1);
  const [comentario, setComentario] = useState('');

  const handleSubmitAvaliacao = async () => {
    const result = await Swal.fire({
      title: 'Pretende enviar o comentário?',
      showDenyButton: true,
      confirmButtonText: 'Sim',
      denyButtonText: 'Não',
      confirmButtonColor: '#369fb8',
      denyButtonColor: '#6c757d',
    });

    if (result.isConfirmed) {
      if (!idUtilizador) {
        Swal.fire({
          text: "Utilizador não encontrado, por favor tente mais tarde.",
          icon: "warning",
          confirmButtonColor: "#369fb8"
        });
        return;
      }

      if (!rating && !comentario) {
        Swal.fire({
          text: "Por favor, forneça uma classificação ou comentário.",
          icon: "warning",
          confirmButtonColor: "#369fb8"
        });
        return;
      }

      try {
        const resposta = await api.post(`/avaliacao/${tipo}/criar/${id}`, {
          idUtilizador: idUtilizador,
          classificacao: rating,
          comentario: comentario
        });

        if (resposta.data.success) {
          handleUpdateAvaliacoes(); 
          setRating(1);
          setComentario('');

          Swal.fire({
            icon: 'success',
            title: 'Operação concluída',
            text: 'O comentário foi enviado com sucesso.',
            confirmButtonColor: '#369fb8',
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Erro ao enviar avaliação',
            text: 'Ocorreu um erro ao enviar a avaliação.',
            confirmButtonColor: '#369fb8',
          });
        }
      } catch (error) {
        console.error('Error submitting review:', error);

        Swal.fire({
          icon: 'error',
          title: 'Erro ao enviar avaliação',
          text: 'Ocorreu um erro ao enviar a avaliação.',
          confirmButtonColor: '#369fb8',
        });
      }
    } else if (result.isDenied) {
      Swal.fire({
        title: 'Operação Cancelada',
        icon: 'info',
        confirmButtonColor: '#6c757d',
      });
    }
  };

  return (
    <Box sx={{ marginTop: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: 2 }}>Adicionar Avaliação</Typography>
      <Rating
        name="rating"
        value={rating}
        onChange={(event, newValue) => {
          setRating(Math.max(1, newValue)); 
        }}
        sx={{ color: '#369fb8' }} 
      />
      <TextField
        label="Comentário"
        multiline
        rows={4}
        variant="outlined"
        fullWidth
        value={comentario}
        onChange={(event) => setComentario(event.target.value)}
        sx={{ marginTop: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmitAvaliacao}
        sx={{ marginTop: 2, padding: 1, backgroundColor: '#369fb8', '&:hover': { backgroundColor: '#369fb8' } }}
      >
        Enviar Avaliação
      </Button>
    </Box>
  );
}

export default NovaAvaliacao;
