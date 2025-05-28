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
      <Paper elevation={6} sx={{ p: { xs: 3, sm: 6 }, borderRadius: '18px', bgcolor: '#f8f8f8', boxShadow: '0 8px 32px rgba(0,0,0,0.10)' }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
            <CheckCircleOutlineIcon sx={{ fontSize: 110, color: 'success.main', mb: 1 }} />
          </motion.div>
          <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: 800, mb: 1 }}>
            Obrigado, {buyerName}!
          </Typography>
          <Typography variant="h6" color="text.secondary" paragraph sx={{ mb: 2 }}>
            Sua compra foi realizada com sucesso.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Você receberá um e-mail de confirmação em breve.
          </Typography>
          <Button
            variant="contained"
            sx={{ mt: 2, bgcolor: '#b71c1c', color: '#fff', fontWeight: 700, fontSize: '1.1rem', px: 5, py: 1.5, borderRadius: 3, boxShadow: 2, '&:hover': { bgcolor: '#a31515' } }}
            onClick={() => navigate('/')}
          >
            Voltar para a Página Inicial
          </Button>
        </Box>
      </Paper>
    </MotionContainer>
  );
}

export default ThankYou; 