import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const Termos = ({ open, handleClose, onAccept, onReject }) => {
  const handleAccept = () => {
    onAccept();
    handleClose();
  };

  const handleReject = () => {
    onReject();
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} aria-labelledby="terms-dialog-title">
      <DialogTitle id="terms-dialog-title">Termos e Condições</DialogTitle>
      <DialogContent>
        <DialogContentText component="div">
          <h2>Termos e Condições de Uso</h2>
          <p>
            Estes Termos e Condições regem o uso desta aplicação. Ao aceder ou utilizar esta aplicação, concorda em cumprir estes termos. Se não concorda com qualquer parte destes termos, por favor, não utilize a aplicação.
          </p>
          <h3>Uso da Aplicação</h3>
          <p>
            <strong>Licença de Uso:</strong> Concedemos-lhe uma licença limitada, não exclusiva e intransferível para usar a aplicação para fins pessoais e não comerciais.
          </p>
          <p>
            <strong>Restrições:</strong> Concorda em não modificar, adaptar, sublicenciar, vender, distribuir ou explorar comercialmente a aplicação de nenhuma forma.
          </p>
          <h3>Conteúdo do Utilizador</h3>
          <p>
            <strong>Responsabilidade pelo Conteúdo:</strong> Ao submeter conteúdo para a aplicação, declara ter os direitos necessários sobre esse conteúdo e concorda em ser o único responsável por ele.
          </p>
          <p>
            <strong>Licença de Conteúdo:</strong> Ao submeter conteúdo para a aplicação, concede à aplicação uma licença mundial, não exclusiva, livre de royalties para usar, reproduzir, modificar, adaptar, publicar, traduzir e distribuir tal conteúdo.
          </p>
          <h3>Privacidade</h3>
          <p>
            A nossa política de privacidade descreve como as suas informações são recolhidas, usadas e partilhadas. Ao utilizar esta aplicação, concorda com a recolha e uso das suas informações de acordo com a nossa política de privacidade.
          </p>
          <h3>Limitação de Responsabilidade</h3>
          <p>
            <strong>Disponibilidade do Serviço:</strong> Não garantimos que a aplicação estará sempre disponível ou livre de erros.
          </p>
          <p>
            <strong>Uso da Aplicação:</strong> Utilize a aplicação por sua própria conta e risco. Não nos responsabilizamos por danos diretos, indiretos, incidentais, especiais ou consequenciais decorrentes do uso ou incapacidade de uso da aplicação.
          </p>
          <h3>Alterações nos Termos</h3>
          <p>
            Reservamos o direito de modificar ou substituir estes termos a qualquer momento. O seu uso contínuo da aplicação após qualquer modificação constitui aceitação dessas mudanças.
          </p>
          <h3>Lei Aplicável</h3>
          <p>
            Estes termos serão regidos e interpretados de acordo com as leis de Portugal.
          </p>
          <h3>Contacto</h3>
          <p>
            Se tiver dúvidas ou preocupações sobre estes Termos e Condições, entre em contacto connosco através dos dados fornecidos na aplicação.
          </p>
          <p>Estes termos são efetivos a partir da data da sua publicação.</p>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleReject} color="primary">
          Recusar
        </Button>
        <Button onClick={handleAccept} color="primary" autoFocus>
          Aceitar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Termos;
