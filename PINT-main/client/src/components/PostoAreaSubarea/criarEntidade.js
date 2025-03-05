import React, { useState } from 'react';
import { Container, Typography, Box, FormControl, InputLabel, Select, MenuItem, Divider } from '@mui/material';
import FormPosto from './criarPosto';
import FormArea from './criarArea';
import FormSubarea from './criarSubarea';

function CriarEntidade() {
  const [entityType, setEntityType] = useState('');

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Criar Posto, Área ou Subárea
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="entity-type-label">Tipo de Entidade</InputLabel>
          <Select
            labelId="entity-type-label"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            label="Tipo de Entidade"
          >
            <MenuItem value="Posto">Posto</MenuItem>
            <MenuItem value="Area">Área</MenuItem>
            <MenuItem value="Subarea">Subárea</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      {entityType === 'Posto' && <FormPosto />}
      {entityType === 'Area' && <FormArea />}
      {entityType === 'Subarea' && <FormSubarea />}
    </Container>
  );
}

export default CriarEntidade;
