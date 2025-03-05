import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/softinsa.svg';
import { Select, MenuItem, FormControl, Button, InputLabel, Typography } from '@mui/material';

function SelecionarPosto() {
  const [postos, setPostos] = useState([]);
  const [selectedPosto, setSelectedPosto] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostos = async () => {
      try {
        const response = await api.get('/postos');
        setPostos(response.data.data);
      } catch (error) {
        console.error('Erro ao procurar postos:', error);
      }
    };
    fetchPostos();
  }, []);


  const handlePostoSelection = async () => {
    try {
      const resposta = await api.get('/utilizador/completo');
      const id = resposta.data.id;
      const response = await api.post('/utilizador/associar-posto', { id: id, idPosto: selectedPosto });

      const rememberUser = localStorage.getItem('rememberUser') === 'true';
      const token = response.data.token;

      if (rememberUser) {
        localStorage.clear();
        localStorage.setItem('token', token);
      } else {
        sessionStorage.clear();
        sessionStorage.setItem('token', token);
      }

      navigate('/');
    } catch (error) {
      console.error('Erro ao associar posto:', error);
    }
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '62vh' }}>
      <header className="header mb-1">
        <img src={logo} alt="Logo" className="logo" />
      </header>
      <Typography variant="h6" component="h6" align="center" className="mb-3">
        Por favor, selecione o seu posto de moderação
      </Typography>
      <form className="login-form d-flex flex-column align-items-center" onSubmit={(e) => { e.preventDefault(); handlePostoSelection(); }}>
        <FormControl variant="outlined" fullWidth margin="normal">
          <InputLabel id="posto-select-label">Selecione um posto</InputLabel>
          <Select
            labelId="posto-select-label"
            value={selectedPosto}
            onChange={(e) => setSelectedPosto(e.target.value)}
            label="Selecione um posto"
          >
            <MenuItem value="" disabled>
              Selecione um posto
            </MenuItem>
            {postos.map((posto) => (
              <MenuItem key={posto.id} value={posto.id}>
                {posto.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button 
          type="submit"
          className="btn btn-outline-success mt-2"
          id="botaoEntrar"
          disabled={!selectedPosto}
          sx={{ padding: 1, mt: 2 }}
        >
          Confirmar
        </Button>
      </form>
    </div>
  );
}

export default SelecionarPosto;
