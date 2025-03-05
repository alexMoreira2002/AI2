import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/api';
import logo from '../../assets/softinsa.svg';
import Swal from 'sweetalert2';
import './login.css';

function NovaPasseForm() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(false);

    // Estados para controle dos requisitos de senha
    const [minLengthValid, setMinLengthValid] = useState(false);
    const [hasNumberValid, setHasNumberValid] = useState(false);
    const [hasUppercaseValid, setHasUppercaseValid] = useState(false);
    const [hasSpecialCharValid, setHasSpecialCharValid] = useState(false);

    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const token = query.get('token');

    const navigate = useNavigate();

    const handleResetPasse = async () => {
        if (password !== confirmPassword) {
            setError(true);
            return;
        }

        setError(false);

        try {
            const response = await api.post('/reset-passe', { novaPass: password, token });
            Swal.fire({
                title: 'Sucesso!',
                text: response.data.message,
                icon: 'success',
                confirmButtonColor: '#369fb8',
                willClose: () => {
                    navigate('/login');
                    const verificationToken = localStorage.getItem('verificationToken') || sessionStorage.getItem('verificationToken');
                    if (verificationToken) {
                        localStorage.removeItem('verificationToken');
                        sessionStorage.removeItem('verificationToken');
                    }
                },
            });
        } catch (error) {
            setError(true);
            if (error.response) {
                Swal.fire({
                    title: 'Erro!',
                    text: error.response.data.error,
                    icon: 'error',
                    confirmButtonColor: '#369fb8',
                });
            }
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleResetPasse();
    };

    const validatePassword = (value) => {
        setMinLengthValid(value.length >= 6);
        setHasNumberValid(/\d/.test(value));
        setHasUppercaseValid(/[A-Z]/.test(value));
        setHasSpecialCharValid(/[!@#$%^&*]/.test(value));
    };

    return (
        <div className="login-container d-flex flex-column align-items-center justify-content-center" style={{ height: '100vh', backgroundColor: '#f0f4f8' }}>
            <header className="header mb-4">
                <img src={logo} alt="Logo" className="logo" style={{ width: '150px' }} />
            </header>
            <form onSubmit={handleSubmit} className="login-form" style={{ width: '100%', maxWidth: '400px', padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
                <h2 className="text-center mb-4" style={{ color: '#369fb8' }}>Alterar Palavra-Passe</h2>
                <div className={`form-group ${error ? 'has-error' : ''}`}>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        name="password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            validatePassword(e.target.value);
                        }}
                        placeholder="Nova Palavra-Passe"
                        style={{ backgroundColor: '#e0e0e0', border: '1px solid #b0bec5' }}
                    />
                </div>
                <div className={`form-group ${error ? 'has-error' : ''}`}>
                    <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        name="confirmPassword"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirmar Nova Palavra-Passe"
                        style={{ backgroundColor: '#e0e0e0', border: '1px solid #b0bec5' }}
                    />
                </div>
                {/* Exibição dos requisitos da palavra-passe */}
                <div className="password-requirements" style={{ marginBottom: '15px' }}>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        <li className={minLengthValid ? 'text-success' : ''}>Pelo menos 6 caracteres</li>
                        <li className={hasNumberValid ? 'text-success' : ''}>Pelo menos um número</li>
                        <li className={hasUppercaseValid ? 'text-success' : ''}>Pelo menos uma letra maiúscula</li>
                        <li className={hasSpecialCharValid ? 'text-success' : ''}>Pelo menos um caractere especial (!@#$%^&*)</li>
                    </ul>
                </div>
                {error && (
                    <div className="password-error-message" style={{ color: '#d32f2f', marginBottom: '15px' }}>
                        As palavras-passe não coincidem.
                    </div>
                )}
                <button className="btn btn-primary" id='botaoEntrar' style={{ backgroundColor: '#369fb8', border: 'none' }}>
                    Alterar Palavra-Passe
                </button>
            </form>
        </div>
    );
}

export default NovaPasseForm;
