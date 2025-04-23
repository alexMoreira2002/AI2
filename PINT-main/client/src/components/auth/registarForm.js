import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/softinsa.svg';
import Swal from 'sweetalert2';
import Termos from './termos';
import './login.css';

function RegistarForm() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [termosAbertos, setTermosAbertos] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

  const navigate = useNavigate();

  const handleRegistar = async () => {
    try {
      const response = await api.post('/utilizador/registar', {
        nome,
        email
      });
  
      Swal.fire({
        title: 'Sucesso!',
        text: response.data.message,
        icon: 'success',
        confirmButtonColor: '#369fb8',
        willClose: () => {
          navigate('/login');
        },
      });
    } catch (error) {
      if (error.response) {
        Swal.fire({
          title: 'Erro!',
          text: error.response.data.error || 'Erro ao registrar',
          icon: 'error',
          confirmButtonColor: '#369fb8',
        });
      } else {
        Swal.fire({
          title: 'Erro!',
          text: 'Erro ao conectar com o servidor',
          icon: 'error',
          confirmButtonColor: '#369fb8',
        });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptTerms) {
      Swal.fire({
        title: 'Erro!',
        text: 'Você deve aceitar os termos e condições para continuar.',
        icon: 'error',
        confirmButtonColor: '#369fb8',
      });
      return;
    }

    handleRegistar();
  };

  const handleTermosOpen = () => {
    setTermosAbertos(true);
  };

  const handleTermosClose = () => {
    setTermosAbertos(false);
  };

  const handleTermosAccept = () => {
    setAcceptTerms(true);
    setTermosAbertos(false);
  };

  const handleTermosReject = () => {
    setAcceptTerms(false);
    setTermosAbertos(false);
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', backgroundColor: '#f0f4f8' }}>
      <header className="header mb-4">
        <img src={logo} alt="Logo" className="logo" style={{ width: '150px' }} />
      </header>
      <form onSubmit={handleSubmit} className="login-form" style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        <h2 className="text-center mb-4" style={{ color: '#369fb8' }}>Criar Conta</h2>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="nome"
            name="nome"
            required
            autoFocus
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            style={{ backgroundColor: '#e0e0e0', border: '1px solid #b0bec5' }}
          />
        </div>
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{ backgroundColor: '#e0e0e0', border: '1px solid #b0bec5' }}
          />
        </div>
        <div className="form-group">
          <input
            type="checkbox"
            id="acceptTerms"
            name="acceptTerms"
            checked={acceptTerms}
            readOnly
          />
          <label htmlFor="acceptTerms" style={{ marginLeft: '6px', cursor: 'pointer' }} onClick={handleTermosOpen}>
            Aceito os termos e condições
          </label>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-2" id='botaoEntrar' style={{ backgroundColor: '#369fb8', border: 'none' }}>
          Criar Conta
        </button>
        <Link to="/login" className="btn btn-outline-secondary w-100 mt-2" id='botaoCancelar' style={{ color: '#369fb8', border: '1px solid #369fb8' }}>
          Cancelar
        </Link>
      </form>
      <Termos open={termosAbertos} handleClose={handleTermosClose} onAccept={handleTermosAccept} onReject={handleTermosReject} />
    </div>
  );
}

export default RegistarForm;
