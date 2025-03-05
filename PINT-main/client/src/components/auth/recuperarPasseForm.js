import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/softinsa.svg';
import Swal from 'sweetalert2';
import './login.css';

function RecuperarPasseForm() {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleRecuperarPasse = async () => {
        try {
            const response = await api.post('/recuperar-passe', { email });

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
                    text: error.response.data.error,
                    icon: 'error',
                    confirmButtonColor: '#369fb8',
                });
            } else {
                Swal.fire({
                    title: 'Erro!',
                    text: 'Erro ao recuperar a palavra-passe. Por favor, tente novamente.',
                    icon: 'error',
                    confirmButtonColor: '#369fb8',
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleRecuperarPasse();
    };

    return (
        <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', backgroundColor: '#f0f4f8' }}>
            <header className="header mb-4">
                <img src={logo} alt="Logo" className="logo" style={{ width: '150px' }} />
            </header>
            <form onSubmit={handleSubmit} className="login-form" style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <h2 className="text-center mb-4" style={{ color: '#369fb8' }}>Recuperar Palavra-Passe</h2>
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
                <button className="btn btn-primary w-100 mt-3" id='botaoEntrar' style={{ backgroundColor: '#369fb8', border: 'none' }}>
                    Recuperar Palavra-Passe
                </button>
                <Link to="/login" className="btn btn-outline-secondary w-100 mt-2" id='botaoCancelar' style={{ color: '#369fb8', border: '1px solid #369fb8' }}>
                    Cancelar
                </Link>
            </form>
        </div>
    );
}

export default RecuperarPasseForm;
