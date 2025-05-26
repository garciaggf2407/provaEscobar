import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper
} from '@mui/material';
import { motion } from 'framer-motion';
import { CheckCircleOutline as CheckCircleOutlineIcon } from '@mui/icons-material';

const MotionContainer = motion(Container);

function ThankYou() {
  const location = useLocation();
  const navigate = useNavigate();
  const buyerName = location.state?.buyerName || 'cliente';

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth="sm"
      sx={{
        py: 8,
        textAlign: 'center',
        minHeight: 'calc(100vh - 64px)', // Ajustar altura considerando o AppBar
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Paper elevation={3} sx={{ p: 4, borderRadius: '12px' }}>
        <CheckCircleOutlineIcon sx={{ fontSize: 80, color: 'success.main', mb: 2 }} />
        <Typography variant="h4" component="h1" gutterBottom>
          Obrigado, {buyerName}!
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Sua compra foi realizada com sucesso (simulação).
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Você receberá um e-mail de confirmação em breve.
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={() => navigate('/')}
        >
          Voltar para a Página Inicial
        </Button>
      </Paper>
    </MotionContainer>
  );
}

export default ThankYou; 