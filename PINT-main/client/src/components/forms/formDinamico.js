import React, { useState, useEffect } from 'react';
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    Button,
    FormControl,
    InputLabel,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api/api';
import EditarForm from './formEditar';

const FormDinamico = ({ formulario, onAlteracao }) => {
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [editData, setEditData] = useState({ campos: [], titulo: '', textoAuxiliar: '' });
    const [selectedFormIndex, setSelectedFormIndex] = useState(null);
    const [openRespostasDialog, setOpenRespostasDialog] = useState(false);
    const [respostas, setRespostas] = useState([]);
    const [fieldLabelMap, setFieldLabelMap] = useState({});

    useEffect(() => {
        if (formulario && formulario.length > 0) {
            const fieldMap = {};
            formulario.forEach(form => {
                form.campos.forEach(field => {
                    fieldMap[field.id] = field.label;
                });
            });
            setFieldLabelMap(fieldMap);
        }
        setLoading(false);
    }, [formulario]);

    const handleChange = (id, value) => {
        setFormData(prevFormData => ({
            ...prevFormData,
            respostas: {
                ...prevFormData.respostas,
                [id]: value
            }
        }));
    };

    const handleSubmit = (e, idFormulario) => {
        e.preventDefault();
        handleEnviarRespostas(idFormulario);
    };

    const handleOpenEditDialog = (index) => {
        setEditData(formulario[index]);
        setSelectedFormIndex(index);
        setOpenEditDialog(true);
    };

    const handleCloseEditDialog = () => {
        setOpenEditDialog(false);
        setSelectedFormIndex(null);
        onAlteracao();
    };

    const handleOpenRespostasDialog = async (idFormulario) => {
        try {
            const response = await api.get(`/formulario/respostas/${idFormulario}`);
            if (response.status === 200) {
                setRespostas(response.data.respostas);
                setOpenRespostasDialog(true);
            } else {
                console.error('Erro ao buscar respostas:', response.statusText);
            }
        } catch (error) {
            console.error('Erro ao buscar respostas:', error.message);
        }
    };

    const handleCloseRespostasDialog = () => {
        setOpenRespostasDialog(false);
        setRespostas([]);
    };

    const formatValue = (value) => {
        if (typeof value === 'boolean') {
            return value ? 'Sim' : 'Não';
        }
        return value;
    };

    const handleEnviarRespostas = async (idFormulario) => {
        try {
            const response = await api.post(`/formulario/responder/${idFormulario}`, formData);
            if (response.status === 201) {
                console.log('Respostas enviadas com sucesso!');
                resetForm();
                toast.success('Respostas enviadas com sucesso!');
            } else {
                console.error('Erro ao enviar respostas:', response.statusText);
                toast.error('Erro ao enviar respostas!');
            }
        } catch (error) {
            console.error('Erro ao enviar respostas:', error.message);
            toast.error('Erro ao enviar respostas!');
        }
    };

    const resetForm = () => {
        setFormData({});
        onAlteracao();
    };

    return (
        <form>
            <ToastContainer />
            {!loading && formulario && formulario.length > 0 ? (
                formulario.map((form, index) => (
                    <div key={form.id}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                            <Typography variant="h4" style={{ fontWeight: '700', flexGrow: 1 }}>{form.titulo}</Typography>
                            <IconButton onClick={() => handleOpenEditDialog(index)} color="primary" aria-label="Editar formulário">
                                <Edit />
                            </IconButton>
                        </div>
                        <Typography variant="body1">{form.textoAuxiliar}</Typography>
                        {form.campos && form.campos.length > 0 ? (
                            form.campos.map((field) => (
                                <div key={field.id}>
                                    {field.type === 'texto' && (
                                        <TextField
                                            label={field.label}
                                            fullWidth
                                            margin="normal"
                                            helperText={field.helperText}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            disabled={!form.estado}
                                            value={formData.respostas?.[field.id] || ''}
                                        />
                                    )}
                                    {field.type === 'numero' && (
                                        <TextField
                                            label={field.label}
                                            type="number"
                                            fullWidth
                                            margin="normal"
                                            helperText={field.helperText}
                                            onChange={(e) => handleChange(field.id, e.target.value)}
                                            disabled={!form.estado}
                                            value={formData.respostas?.[field.id] || ''}
                                        />
                                    )}
                                    {field.type === 'checkbox' && (
                                        <FormControlLabel
                                            control={<Checkbox checked={!!formData.respostas?.[field.id]} onChange={(e) => handleChange(field.id, e.target.checked)} />}
                                            label={field.label}
                                            disabled={!form.estado}
                                        />
                                    )}
                                    {field.type === 'select' && (
                                        <FormControl fullWidth margin="normal">
                                            <InputLabel>{field.label}</InputLabel>
                                            <Select
                                                onChange={(e) => handleChange(field.id, e.target.value)}
                                                disabled={!form.estado}
                                                value={formData.respostas?.[field.id] || ''}
                                            >
                                                {field.options.split(',').map((option, index) => (
                                                    <MenuItem key={index} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                </div>
                            ))
                        ) : (
                            <Typography variant="body1">Nenhum campo encontrado.</Typography>
                        )}
                        <Button
                            type="submit"
                            variant="contained"
                            sx={{ ml: 0, minWidth: '10%' }}
                            disabled={!form.estado}
                            onClick={(e) => handleSubmit(e, form.id)}
                        >
                            {form.estado ? 'Enviar' : 'O formulário já não se encontra disponível no momento'}
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            sx={{ ml: 2, minWidth: '10%' }}
                            onClick={() => handleOpenRespostasDialog(form.id)}
                        >
                            Ver Respostas
                        </Button>
                    </div>
                ))
            ) : (
                <Typography variant="body1">Carregando campos do formulário...</Typography>
            )}

            {selectedFormIndex !== null && (
                <EditarForm
                    open={openEditDialog}
                    handleClose={handleCloseEditDialog}
                    formulario={editData}
                    onAlteracao={onAlteracao}
                />
            )}

            <Dialog open={openRespostasDialog} onClose={handleCloseRespostasDialog} fullWidth maxWidth="md">
                <DialogTitle>Respostas do Formulário</DialogTitle>
                <DialogContent>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Formulário</TableCell>
                                <TableCell>Respostas</TableCell>
                                <TableCell>Utilizador</TableCell>
                                <TableCell>Data</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {respostas.map((resposta) => (
                                <TableRow key={resposta.id}>
                                    <TableCell>{resposta.id}</TableCell>
                                    <TableCell>{resposta?.Formulario?.titulo}</TableCell>
                                    <TableCell>
                                        {Object.entries(resposta.respostas).map(([fieldId, value]) => (
                                            <div key={fieldId}>
                                                <strong>{fieldLabelMap[fieldId]}:</strong> {formatValue(value)}
                                            </div>
                                        ))}
                                    </TableCell>
                                    <TableCell>{resposta?.Utilizador?.nome}</TableCell>
                                    <TableCell>{new Date(resposta.data).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRespostasDialog} color="primary">
                        Fechar
                    </Button>
                </DialogActions>
            </Dialog>
        </form>
    );
};

export default FormDinamico;
