import * as React from 'react';
import Badge from '@mui/material/Badge';
import { FaBell } from 'react-icons/fa';
import api from '../api/api';

export default function ContadorNotificacoes({ className }) {
    const [notificacoes, setNotificacoes] = React.useState(0);

    React.useEffect(() => {
        const fetchNotificacoes = async () => {
            try {
                const response = await api.get('/notificacao/contador');
                if (response.data.status === 'success') {
                    setNotificacoes(response.data.data.contador);
                } else {
                    console.error('Erro ao obter notificações:', response.data.message);
                }
            } catch (error) {
                console.error('Erro ao encontrar notificações:', error);
            }
        };

        fetchNotificacoes();
    }, []);

    return (
        <Badge 
            badgeContent={notificacoes} 
            color="error"
            anchorOrigin={{
                vertical: 'top', 
                horizontal: 'right',
            }}
            sx={{
                '& .MuiBadge-badge': {
                    right: 12, // Move a badge 15px para a direita
                    top: 4, // Move a badge para o topo
                },
            }}
        >
            <FaBell className={className} color="action" />
        </Badge>
    );
}