import React, { useState } from 'react';
import { Select, MenuItem, FormControl, InputLabel, Typography } from '@mui/material';
import ValidacaoEventos from './validacaoEvento';
import ValidacaoEstabelecimentos from './validacaoEstabelecimento';
import ValidacaoFotoEvento from './validacaoFotoEvento';
import ValidacaoFotoEstabelecimento from './validacaoFotoEstabelecimento';
import ValidacaoDenuncias from './validacaoDenuncia';
import ValidacaoAlbum from './validacaoAlbum';
import ValidacaoFotoAlbum from './validacaoFotoAlbum';

const Validacao = () => {
  const [opcaoSelecionada, setOpcaoSelecionada] = useState('');

  const handleChange = (event) => {
    setOpcaoSelecionada(event.target.value);
  };

  const renderGrelha = () => {
    switch (opcaoSelecionada) {
      case 'eventos':
        return <ValidacaoEventos />;
      case 'estabelecimentos':
        return <ValidacaoEstabelecimentos />;
      case 'foto-evento':
        return <ValidacaoFotoEvento />;
      case 'foto-estabelecimento':
        return <ValidacaoFotoEstabelecimento />;
      case 'denuncias':
        return <ValidacaoDenuncias />;
      case 'album':
        return <ValidacaoAlbum />;
      case 'foto-album':
        return <ValidacaoFotoAlbum />;
      default:
        return <Typography variant="h6">Selecione uma opção para moderação</Typography>;
    }
  };

  return (
    <div style={{ width: '80%', margin: '0 auto' }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#369fb8', marginBottom: 4, fontWeight: 'bold' }}>
        Moderação
      </Typography>
      <FormControl fullWidth margin="dense">
        <InputLabel>Selecione a validação</InputLabel>
        <Select value={opcaoSelecionada} onChange={handleChange}>
          <MenuItem value="eventos">Eventos</MenuItem>
          <MenuItem value="estabelecimentos">Estabelecimentos</MenuItem>
          <MenuItem value="foto-evento">Foto dos Eventos</MenuItem>
          <MenuItem value="foto-estabelecimento">Foto dos Estabelecimentos</MenuItem>
          <MenuItem value="denuncias">Denúncias</MenuItem>
          <MenuItem value="album">Álbuns</MenuItem>
          <MenuItem value="foto-album">Foto dos Álbuns</MenuItem>
        </Select>
      </FormControl>
      {renderGrelha()}
    </div>
  );
};

export default Validacao;
