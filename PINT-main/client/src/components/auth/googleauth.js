import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import api from '../api/api';
import Swal from 'sweetalert2';

const GoogleAuth = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState(null);
  const rememberUser = localStorage.getItem('rememberUser') === 'true';

  const handleSuccess = async (response) => {
    const token = response.credential;
    try {
      const res = await api.post('/login/google', { token });
      if (rememberUser) {
        localStorage.setItem('token', res.data.token);
      } else {
        sessionStorage.setItem('token', res.data.token);
      }
      window.dispatchEvent(new Event('storage'));

      setErrorMessage(null);

      Swal.fire({
        title: 'Sucesso!',
        text: 'Login com a conta Google realizado com sucesso',
        icon: 'success',
        confirmButtonColor: '#369fb8',
      }).then(async (result) => {
        if (result.isConfirmed) {
          const respostaUser = await api.get('/utilizador/completo');
          console.log(respostaUser);
          if (respostaUser && respostaUser.data) {
            // Check user permissions
            if (!respostaUser.data.isAdmin) {
              Swal.fire({
                title: 'Sem permissões',
                text: 'Não tem permissões para aceder a esta página',
                icon: 'error',
                confirmButtonColor: '#369fb8',
              }).then(() => {
                navigate('/login');
              });
            } else {
              const { idPosto } = respostaUser.data;
              navigate(idPosto === null || idPosto === undefined ? '/posto' : '/');
            }
          } else {
            console.error('Invalid user response:', respostaUser);
          }
        }
      }).catch((err) => {
        console.error('Server error:', err);
        setErrorMessage('Server error. Please try again later.');
      });
    } catch (error) {
      console.error('Error logging in with Google:', error.response || error.message);
      setErrorMessage('Error logging in with Google. Please try again.');
    }
  };

  const handleError = () => {
    console.error('Google login failed');
    setErrorMessage('Google login failed. Please try again.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f0f0f0', padding: '20px' }}>
      <GoogleOAuthProvider clientId="104348306910-f5tbgkc3udd9jphc4i44vgdsv7jing48.apps.googleusercontent.com">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          style={{ marginBottom: '20px' }} // Add some margin for spacing
        />
        {errorMessage && (
          <p style={{ color: '#d32f2f', fontWeight: 'bold' }}>{errorMessage}</p>
        )}
      </GoogleOAuthProvider>
    </div>
  );
};

export default GoogleAuth;
