import React, { useEffect, useState } from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';
import 'moment/locale/pt';
import { Select, MenuItem, Box } from "@mui/material";

const localizer = momentLocalizer(moment);

const Calendario = () => {
  const [eventos, setEventos] = useState([]);
  const [areas, setAreas] = useState([]);
  const [areaId, setAreaId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await api.get('/areas');
        setAreas(response.data.data);
      } catch (error) {
        console.error('Erro ao buscar áreas:', error.response || error.message);
      }
    };

    fetchAreas();
  }, []);

  useEffect(() => {
    const fetchEventos = async () => {
      const params = {};
      if (areaId) {
        params.areaId = areaId;
      }
      console.log('Sending request with params:', params);
      try {
        setEventos([]);
        const response = await api.get('/eventos', { params });
        console.log('Received response:', response);
        const eventosFormatados = response.data.data.map(evento => ({
          id: evento.id,
          title: evento.titulo,
          start: new Date(`${evento.data}T${evento.hora}`),
          end: new Date(`${evento.data}T${evento.hora}`),
          description: evento.descricao,
          areaId: evento.areaId,
        }));
        setEventos(eventosFormatados);
      } catch (error) {
        console.error('Error fetching eventos:', error.response || error.message);
      }
    };

    fetchEventos();
  }, [areaId]);

  const handleSelectEvent = (event) => {
    navigate(`/eventos/${event.id}`);
  };

  const handleAreaChange = (event) => {
    setAreaId(event.target.value);
  };

  return (
    <div>
      <Box sx={{ marginBottom: 2 }}>
        <Select
          value={areaId}
          onChange={handleAreaChange}
          displayEmpty
          sx={{ width: '200px', bgcolor: '#f5f5f5' }} 
        >
          <MenuItem value="">Todas as Áreas</MenuItem>
          {areas.map((area) => (
            <MenuItem value={area.id} key={area.id}>{area.nome}</MenuItem>
          ))}
        </Select>
      </Box>
      <div style={{ height: '75vh' }}>
        <Calendar
          localizer={localizer}
          events={eventos}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          onSelectEvent={handleSelectEvent}
          messages={{
            next: "Seguinte",
            previous: "Anterior",
            today: "Hoje",
            month: "Mês",
            week: "Semana",
            day: "Dia",
          }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: '#369fb8',
              color: '#fff',
            },
          })}
        />
      </div>
    </div>
  );
};

export default Calendario;
