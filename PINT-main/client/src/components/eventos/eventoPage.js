import React, { useState, useEffect, useCallback } from 'react';
import {
    Grid,
    CardContent,
    Typography,
    Box,
    Divider,
    Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import api from '../api/api';
import AvaliacoesDetalhadas from '../avaliacao/avaliacoes';
import FotoSlider from '../utils/fotoSlider';
import Comentarios from '../avaliacao/comentarios';
import NovaAvaliacao from '../avaliacao/novaAvaliacao';
import BotaoUpload from '../utils/botaoUpload';
import BotaoInscricaoEvento from '../utils/BotaoInscricao';
import EditarEvento from './eventoEdit';
import InscricoesGrelha from './eventoInscricoes';
import BotoesPartilha from '../utils/botaoPartilha';
import FormCriar from '../forms/formCriar';
import FormDinamico from '../forms/formDinamico';

const apiUrl = process.env.REACT_APP_API_URL;
const frontendUrl = process.env.REACT_APP_FRONTEND;

function EventoPage() {
    const { id } = useParams();
    const [evento, setEvento] = useState(null);
    const [fotos, setFotos] = useState([]);
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [utilizador, setUtilizador] = useState(null);
    const [inscricoes, setInscricoes] = useState([]);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;
    const noOfPages = Math.ceil(avaliacoes.length / itemsPerPage);
    const [openFormCriar, setOpenFormCriar] = useState(false);
    const [openFormDinamico, setOpenFormDinamico] = useState(false);
    const [formulario, setFormulario] = useState({});
    const [campos, setCampos] = useState([]);
    const [open, setOpen] = useState(false);
    const [formularioAtualizado, setFormularioAtualizado] = useState(false);

    const url = `${frontendUrl}/eventos/${id}`;
    const title = 'Estou interessado neste evento!';

    console.log('url de partilha:', url);   

    useEffect(() => {
        const fetchUtilizador = async () => {
            try {
                const response = await api.get('/utilizador');
                setUtilizador(response.data);
            } catch (error) {
                console.error('Erro ao encontrar utilizador:', error);
            }
        };
        fetchUtilizador();
    }, []);

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const response = await api.get(`/eventos/${id}`);
                setEvento(response.data.data);
            } catch (error) {
                console.error('Error fetching evento:', error.response || error.message);
            }
        };
        fetchEvento();
    }, [id]);

    const fetchAvaliacoes = useCallback(async () => {
        try {
            const response = await api.get(`/avaliacao/eventos/${id}`);
            setAvaliacoes(response.data.data);
        } catch (error) {
            console.error('Error fetching Avaliações:', error.response || error.message);
        }
    }, [id]);

    useEffect(() => {
        fetchAvaliacoes();
    }, [fetchAvaliacoes]);

    const fetchInscricoes = useCallback(async () => {
        try {
            const response = await api.get(`/eventos/${id}/inscricao`);
            setInscricoes(response.data.data);
        } catch (error) {
            console.error('Error fetching inscrições:', error.response || error.message);
        }
    }, [id]);

    useEffect(() => {
        fetchInscricoes();
    }, [fetchInscricoes]);

    const handleFormCriarOpen = () => {
        setOpenFormCriar(true);
    };

    const handleFormCriarClose = () => {
        setOpenFormCriar(false);
        fetchFormulario();
    };


    const handleFormSave = (campos) => {
        setCampos(campos);
        setOpenFormDinamico(true);
        fetchFormulario();
    };

    useEffect(() => {
        const fetchFormCampos = async () => {
            try {
                const response = await api.get(`/formulario/${id}`);
                if (response.status === 200) {
                    const formularioData = response.data.formulario;
                    setFormulario(formularioData);

                    const camposData = formularioData.campos;
                    setCampos(camposData);
                } else {
                    console.error('Erro ao buscar campos do formulário:', response.statusText);
                }
            } catch (error) {
                console.error('Erro ao buscar campos do formulário:', error.message);
            }
        };

        fetchFormCampos();
    }, [id]);

    const updateFotos = async () => {
        try {
            const response = await api.get(`foto/eventos/${id}`);
            const fotoPaths = response.data.data.map((foto) => ({
                id: foto.id,
                url: `${apiUrl}/uploads/eventos/${foto.foto}`,
                carregadaPor: foto.criador ? foto.criador.nome : 'Desconhecido',
                validadaPor: foto.admin ? foto.admin.nome : 'Desconhecido',
            }));
            setFotos(fotoPaths);
        } catch (error) {
            console.error('Error fetching fotos:', error.response || error.message);
        }
    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const atualizarInscricoes = async () => {
        await fetchInscricoes();
    };

    const fetchFormulario = useCallback(async () => {
        try {
            const response = await api.get(`/formulario/${id}`);
            if (response.status === 200) {
                setFormulario(response.data.formulario);
                setFormularioAtualizado(false); // Resetar o estado de atualização
            } else {
                console.error('Erro ao buscar dados do formulário:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar dados do formulário:', error.message);
        }
    }, [id]);

    useEffect(() => {
        if (formularioAtualizado) {
            fetchFormulario();
        }
    }, [fetchFormulario, formularioAtualizado]);


    useEffect(() => {
        fetchFormulario();
    }, [fetchFormulario]);

    useEffect(() => {
        fetchFormulario();
    }, [id]);


    if (!evento) {
        return <div>A carregar...</div>;
    }

    return (
        <Grid container spacing={2} justifyContent="center" alignItems="center">
            <Grid item xs={12} sm={10} md={11} lg={10} xl={10}>
                <Box sx={{ padding: 0, paddingTop: 0 }}>
                    <Grid container alignItems="center" spacing={2}>
                        <Grid item>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', marginBottom: 0 }}>
                                {evento.titulo}
                            </Typography>
                        </Grid>
                        <Grid item>
                            <BotoesPartilha url={url} title={title} />
                        </Grid>
                    </Grid>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-start', flexWrap: 'wrap', marginTop: -6, marginBottom: 3 }}>
                        {utilizador && (
                            <>
                                <BotaoUpload tipo="eventos" id={id} fotos={fotos} setFotos={setFotos} idUtilizador={utilizador.id} updateFotos={updateFotos} />
                                <Button variant="contained" color="secondary" onClick={handleOpen}>
                                    Editar evento
                                </Button>
                                <EditarEvento open={open} handleClose={handleClose} />
                                <Button variant="outlined" color="primary" onClick={handleFormCriarOpen}>
                                    Criar Formulário
                                </Button>
                                <FormCriar open={openFormCriar} handleClose={handleFormCriarClose} handleSave={handleFormSave} idEvento={id} />
                            </>
                        )}
                    </Box>
                    <FotoSlider fotos={fotos} descricao={evento.titulo} tipo="eventos" id={id} updateFotos={updateFotos} />
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <CardContent sx={{ padding: 0, marginTop: 10 }}>
                                <Typography variant="h4" sx={{ marginBottom: 1, fontWeight: 'bold' }}>Descrição</Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {evento.descricao}
                                </Typography>
                            </CardContent>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid item xs={12} sx={{ marginBottom: 4 }}>
                                <Typography variant="h5" sx={{ marginTop: 3, fontWeight: 'bold', marginBottom: 2 }}>Avaliações</Typography>
                                <AvaliacoesDetalhadas avaliacoes={avaliacoes} />
                            </Grid>
                            <Comentarios
                                fetchAvaliacoes={fetchAvaliacoes}
                                avaliacoes={avaliacoes}
                                page={page}
                                itemsPerPage={itemsPerPage}
                                noOfPages={noOfPages}
                                handleChange={handleChange}
                                tipo="eventos"
                            />
                            {utilizador && (
                                <NovaAvaliacao
                                    handleUpdateAvaliacoes={fetchAvaliacoes}
                                    id={id}
                                    idUtilizador={utilizador.id}
                                    avaliacoes={avaliacoes}
                                    setAvaliacoes={setAvaliacoes}
                                    tipo="eventos"
                                />
                            )}
                        </Grid>
                        <Grid item xs={12}>
                            <InscricoesGrelha inscricoes={inscricoes} />
                            <Grid item xs={12} sx={{ position: 'relative' }}>
                                <BotaoInscricaoEvento
                                    atualizarInscricoes={atualizarInscricoes}
                                    idEvento={id}
                                    idUtilizador={utilizador?.id}
                                    inscricaoAberta={evento.inscricaoAberta}
                                />
                            </Grid>
                            {formulario && formulario?.length > 0 && (
                                <Grid item xs={12} sx={{ mt: 2 }}>
                                    <FormDinamico idEvento={id} formulario={formulario} onAlteracao={fetchFormulario} />
                                </Grid>
                            )}

                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <Box sx={{ bgcolor: 'rgba(0, 0, 0, 0.03)', borderRadius: 2, p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', textAlign: 'center', mb: 2 }}>Informações de Contacto</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                                    {evento.morada && (
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            Morada: {evento.morada}
                                        </Typography>
                                    )}
                                    {evento.telemovel && (
                                        <>
                                            <Divider sx={{ width: '100%', my: 1 }} />
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Telemovel: {evento.telemovel}
                                            </Typography>
                                        </>
                                    )}
                                    {evento.email && (
                                        <>
                                            <Divider sx={{ width: '100%', my: 1 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                Email: {evento.email}
                                            </Typography>
                                        </>
                                    )}
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export default EventoPage;
