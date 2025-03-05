import React, { useState } from 'react';
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Box
} from '@mui/material';
import { AddCircle, Delete, Home, Info } from '@mui/icons-material'; // Import icons used

const icons = {
  AddCircle,
  Delete,
  Home,
  Info
};

const CreateAreaForm = () => {
  const [nome, setNome] = useState('');
  const [icone, setIcone] = useState('');

  const handleCreateArea = async (event) => {
    event.preventDefault(); // Prevents default form submission behavior
    try {
      const response = await api.post('/areas', { nome, icone });
      console.log('Nova área criada:', response.data.data);
      // Optionally reset form fields
      setNome('');
      setIcone('');
    } catch (error) {
      console.error('Erro ao criar área:', error.response?.data?.error || error.message);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleCreateArea}
      sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxWidth: 500, mx: 'auto', p: 3, borderRadius: 1, boxShadow: 3 }}
    >
      <Typography variant="h6" sx={{ mb: 2 }}>Criar Nova Área</Typography>
      <TextField
        label="Nome da Área"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        fullWidth
        required
        variant="outlined"
      />
      <FormControl fullWidth required>
        <InputLabel>Ícone da Área</InputLabel>
        <Select
          value={icone}
          onChange={(e) => setIcone(e.target.value)}
          label="Ícone da Área"
          variant="outlined"
        >
          {Object.keys(icons).map((icon) => (
            <MenuItem value={icon} key={icon}>
              {React.createElement(icons[icon], { sx: { mr: 1 } })} {icon}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" color="primary">Criar Área</Button>
    </Box>
  );
};

export default CreateAreaForm;
