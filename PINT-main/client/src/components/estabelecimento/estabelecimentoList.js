import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Grid, Card, CardContent, Typography, MenuItem, CardMedia, Box, Dialog, DialogActions, DialogContent, DialogTitle, DialogContentText } from "@mui/material";
import { styled } from "@mui/system";
import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";
import Select from "@mui/material/Select";
import api from "../api/api";
import CriarEstabelecimento from './estabelecimentoCriar';

function EstabelecimentoList() {
  const [estabelecimentos, setEstabelecimentos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [subareas, setSubareas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const [subareaId, setSubareaId] = useState("");
  const [idPosto, setIdPosto] = useState(null);
  const [open, setOpen] = useState(false); // Estado para controlar o diálogo

  useEffect(() => {
    const getAreas = async () => {
      const response = await api.get('/areas');
      setAreas(response.data.data);
    };

    getAreas();
  }, []);

  useEffect(() => {
    const getSubareas = async () => {
      if (areaId) {
        const response = await api.get(`/areas/${areaId}`);
        setSubareas(response.data.data);
        setSubareaId(""); 
      } else {
        setSubareas([]);
      }
    };

    getSubareas();
  }, [areaId]);

  useEffect(() => {
    const getIdPosto = async () => {
      const response = await api.get('/utilizador');
      setIdPosto(response.data.idPosto);
    };
  
    getIdPosto();
  }, []);

  useEffect(() => {
    const getEstabelecimentos = async () => {
      const params = {};
      if (areaId) {
        params.areaId = areaId;
      }
      if (subareaId) {
        params.subareaId = subareaId;
      }
      if (idPosto) {
        params.idPosto = idPosto;
      }
      console.log('Sending request with params:', params);
      try {
        setEstabelecimentos([]);
        const response = await api.get(`/estabelecimentos`, { params });
        console.log('Received response:', response);
        setEstabelecimentos(response.data.data);
      } catch (error) {
        console.error('Error fetching estabelecimentos:', error.response || error.message);
      }
    };

    if (idPosto !== null) {
      getEstabelecimentos();
    }
  }, [areaId, subareaId, idPosto]);

  const handleAreaChange = (event) => {
    setAreaId(event.target.value);
    if (event.target.value === "") {
      setSubareaId("");
      setEstabelecimentos([]);
    }
  };

  const handleSubareaChange = (event) => {
    setSubareaId(event.target.value);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const StyledSelectArea = styled(Select)({
    marginBottom: 20,
    marginLeft: 10,
    minWidth: 200,
    borderRadius: 10,
    backgroundColor: '#369fb8',
    color: '#fff',
    '& .MuiSelect-icon': {
      color: '#fff',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
  });

  const StyledSelectSubarea = styled(Select)({
    marginBottom: 20,
    marginLeft: 10,
    minWidth: 200,
    borderRadius: 10,
    backgroundColor: '#fff',
    color: '#369fb8',
    '& .MuiSelect-icon': {
      color: '#369fb8',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#369fb8',
    },
  });

  const StyledCard = styled(Card)({
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    borderRadius: 4,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
  });

  const StyledCardContent = styled(CardContent)({
    flexGrow: 1,
  });

  const StyledTypography = styled(Typography)({
    marginBottom: 10,
    fontSize: 20,
    fontWeight: 600,
  });

  const StyledCardMedia = styled(CardMedia)({
    height: 200,  
    objectFit: 'cover',  
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  });

  return (
    <Box sx={{ padding: 1, paddingTop: 0 }}>
      <Typography variant="h4" sx={{ marginBottom: 2, fontWeight: 'bold'}}>Estabelecimentos</Typography>
      <Grid container spacing={1} direction={{ xs: 'column', sm: 'row' }}>
        <Grid container spacing={1} direction={{ xs: 'column', sm: 'row' }} sx={{marginBottom: 2}}>
          <Grid item xs={12} sm={2}>
            <StyledSelectArea value={areaId} onChange={handleAreaChange} displayEmpty fullWidth>
              <MenuItem value="">Todas</MenuItem>
              {areas.map((area) => (
                <MenuItem value={area.id} key={area.id}>{area.nome}</MenuItem>
              ))}
            </StyledSelectArea>
          </Grid>
          <Grid item xs={12} sm={2}>
            <StyledSelectSubarea value={subareaId} onChange={handleSubareaChange} displayEmpty disabled={!areaId} fullWidth>
              <MenuItem value="">Todas</MenuItem>
              {subareas.map((subarea) => (
                <MenuItem value={subarea.id} key={subarea.id}>{subarea.nome}</MenuItem>
              ))}
            </StyledSelectSubarea>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={3}>
        {estabelecimentos.map((estabelecimento) => (
          <Grid item xs={12} sm={6} md={4} key={estabelecimento.id}>
            <StyledCard>
              <StyledCardMedia
                component="img"
                image={`${process.env.REACT_APP_API_URL}/uploads/estabelecimentos/${estabelecimento.foto}`}
                alt={estabelecimento.nome}
              />
              <StyledCardContent>
                <StyledTypography variant="h5" component="h2">
                  <Link to={`/estabelecimentos/${estabelecimento.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                    {estabelecimento.nome}
                  </Link>
                </StyledTypography>
                <Typography variant="body2" color="text.secondary">
                  {estabelecimento.morada}
                </Typography>
              </StyledCardContent>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
      <Fab aria-label="add" onClick={handleClickOpen} style={{ position: 'fixed', bottom: 35, right: 20, backgroundColor: '#369fb8' }}>
        <AddIcon style={{ color: '#fff' }} />
      </Fab>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Criar Estabelecimento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Preencha os campos abaixo para criar um novo estabelecimento.
          </DialogContentText>
          <CriarEstabelecimento handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </Box>
  );
}

export default EstabelecimentoList;
