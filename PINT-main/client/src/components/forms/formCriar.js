import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
} from '@mui/material';
import api from '../api/api';

const FormCriar = ({ open, handleClose, handleSave, idEvento}) => {
  const [campos, setCampos] = useState([]);
  const [campoAtual, setCampoAtual] = useState({ type: 'texto', label: '', options: '', title: '', helperText: '' });
  const [titulo, setTitulo] = useState('');
  const [textoAuxiliar, setTextoAuxiliar] = useState('');

  const addField = () => {
    if (!titulo || !textoAuxiliar) {
      alert('Por favor, preencha o título e o texto auxiliar antes de adicionar campos opcionais.');
      return;
    }
  
    setCampos([...campos, { ...campoAtual, id: Date.now() }]);
    setCampoAtual({ type: 'texto', label: '', options: '', title: '', helperText: '' }); 
  };
  

  const saveForm = async () => {
    try {
      if (!titulo || !textoAuxiliar) {
        alert('Por favor, preencha o título e o texto auxiliar.');
        return;
      }
  
      const formData = {
        campos,
        titulo,
        textoAuxiliar,
      };
  
      const response = await api.post(`/formulario/${idEvento}`, formData);
  
      if (response.status === 201) {
        setCampos([]);
        handleClose();
        handleSave(response.data);
      }
    } catch (error) {
      console.error('Erro ao salvar o formulário:', error.message);
    }
  };
  

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Criar Formulário</DialogTitle>
      <DialogContent>
        <TextField
          margin="normal"
          label="Título"
          fullWidth
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <TextField
          margin="normal"
          label="Texto Auxiliar"
          fullWidth
          value={textoAuxiliar}
          onChange={(e) => setTextoAuxiliar(e.target.value)}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Campo</InputLabel>
          <Select
            value={campoAtual.type}
            onChange={(e) => setCampoAtual({ ...campoAtual, type: e.target.value })}
          >
            <MenuItem value="texto">Texto</MenuItem>
            <MenuItem value="numero">Número</MenuItem>
            <MenuItem value="checkbox">Checkbox</MenuItem>
            <MenuItem value="select">Select</MenuItem>
          </Select>
        </FormControl>
        <TextField
          margin="normal"
          label="Rótulo"
          fullWidth
          value={campoAtual.label}
          onChange={(e) => setCampoAtual({ ...campoAtual, label: e.target.value })}
        />
        {campoAtual.type === 'select' && (
          <TextField
            margin="normal"
            label="Opções (separadas por vírgulas)"
            fullWidth
            value={campoAtual.options}
            onChange={(e) => setCampoAtual({ ...campoAtual, options: e.target.value })}
          />
        )}
        <Button variant="contained" onClick={addField}>Adicionar Campo</Button>
        <div>
          {campos.map((field) => (
            <div key={field.id}>
              <Typography variant="h6">{field.title}</Typography>
              <Typography variant="body1">{field.label}</Typography>
              {field.type === 'select' ? (
                <Typography variant="body2">Opções: {field.options}</Typography>
              ) : (
                <Typography variant="body2">Tipo: {field.type}</Typography>
              )}
              <Typography variant="body2">{field.helperText}</Typography>
            </div>
          ))}
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={saveForm} variant="contained">Salvar Formulário</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FormCriar;
