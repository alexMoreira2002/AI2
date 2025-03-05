import React, { useState, useEffect } from 'react';
import { Button } from '@mui/material';
import api from '../api/api';

const BotaoInscricaoEvento = ({ idEvento, inscricaoAberta, atualizarInscricoes}) => {
    const [inscrito, setInscrito] = useState(false);
    const [utilizador, setUtilizador] = useState(null);

    useEffect(() => {
    const fetchVerificacao = async () => {
        try {
            const response = await api.get(`/eventos/inscricao/${idEvento}`);
            // Verifica se a resposta foi bem-sucedida e se o estado da inscrição está presente
            if (response.data.success && response.data.data && typeof response.data.data.estado !== 'undefined') {
                setInscrito(response.data.data.estado);
                console.log('Inscrição verificada:', response.data.data.estado);
            } else {
                // Se a resposta não contiver a informação esperada, considera que não está inscrito
                setInscrito(false);
                console.log('Inscrição não encontrada ou resposta inválida');
            }
        } catch (error) {
            console.error('Erro ao verificar inscrição:', error.message);
            setInscrito(false); // Considera não inscrito em caso de erro
        }
    };
    fetchVerificacao();
}, [idEvento]);

    const handleInscricao = async () => {
        if (inscrito === true) {
            try {
                await api.delete(`/eventos/desinscrever/${idEvento}`);
                console.log('Desinscrição realizada com sucesso');
                setInscrito(false);
            } catch (error) {
                console.error('Erro ao desinscrever:', error.message);
            }
        } else {
            try {
                await api.post(`/eventos/inscrever/${idEvento}`);
                console.log('Inscrição realizada com sucesso');
                setInscrito(true);
            } catch (error) {
                console.error('Erro ao inscrever:', error.message);
            }
        }
        atualizarInscricoes(); // Atualiza a lista de inscrições
    };

    return (
        <Button
            variant="contained"
            onClick={handleInscricao}
            disabled={!inscricaoAberta}
            style={{
                backgroundColor: !inscricaoAberta ? '#6c757d' : (inscrito ? '#ccc' : '#369fb8'),
                color: '#fff',
                marginLeft: 0,
                marginTop: 25,
            }}
        >
            {!inscricaoAberta ? 'Inscrições desativadas' : (inscrito ? 'Desinscrever-se do Evento' : 'Inscrever-se no Evento')}
        </Button>
    );
};

export default BotaoInscricaoEvento;