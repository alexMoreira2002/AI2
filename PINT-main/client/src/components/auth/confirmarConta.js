import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import logo from '../../assets/softinsa.svg';
import api from '../api/api';

const ContaConfirmada = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get('token');

  useEffect(() => {
    const verificarToken = async () => {
      try {
        const response = await api.post('/verificar-conta', { token });
        alert(response.data.message);
      } catch (error) {
        console.error('Erro ao verificar email:', error);
        alert('Erro ao verificar email. Por favor, tente novamente.');
      }
    };

    if (token) verificarToken();
  }, [token]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5', // Light grey background
      padding: '20px'
    }}>
      <header style={{ marginBottom: '20px' }}>
        <img src={logo} alt="Logo" style={{ width: '120px', height: 'auto' }} />
      </header>
      <div style={{ textAlign: 'center' }}>
        <h2 style={{ color: '#333', fontSize: '24px' }}>A verificar a sua conta...</h2>
        <p style={{ color: '#666', fontSize: '18px' }}>Aguarde enquanto verificamos a sua conta...</p>
        <Link to="/login" style={{
          display: 'inline-block',
          padding: '10px 20px',
          fontSize: '16px',
          color: '#fff',
          backgroundColor: '#007bff', // Blue button color
          borderRadius: '5px',
          textDecoration: 'none',
          marginTop: '20px',
          transition: 'background-color 0.3s ease'
        }}>
          IR PARA O LOGIN
        </Link>
      </div>
    </div>
  );
};

export default ContaConfirmada;
