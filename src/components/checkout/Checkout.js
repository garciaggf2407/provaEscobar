import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar
} from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';

const MotionContainer = motion(Container);

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const [buyerName, setBuyerName] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const frete = subtotal > 0 ? 15.90 : 0;
  const total = subtotal + frete;

  const handleFinalizePurchase = () => {
    if (!buyerName.trim()) {
      alert('Por favor, insira seu nome.');
      return;
    }

    setIsProcessing(true);

    // Simulação de processamento de compra
    setTimeout(() => {
      console.log('Compra finalizada para:', buyerName);
      console.log('Itens comprados:', cartItems);
      clearCart(); // Limpa o carrinho após a simulação
      setIsProcessing(false);
      navigate('/thank-you', { state: { buyerName } });
    }, 2000); // Simula um delay de 2 segundos
  };

  if (cartItems.length === 0) {
      return (
          <MotionContainer
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              maxWidth="sm"
              sx={{ py: 4, textAlign: 'center' }}
          >
              <Typography variant="h5" gutterBottom>
                  Seu carrinho está vazio.
              </Typography>
              <Button variant="contained" onClick={() => navigate('/')}>
                  Voltar para a Loja
              </Button>
          </MotionContainer>
      );
  }

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth="md"
      sx={{ py: 4 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Finalizar Compra
      </Typography>

      <Grid container spacing={4}>
        {/* Resumo do Pedido */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido
            </Typography>
            <List dense={true}>
              {cartItems.map((item) => (
                <ListItem key={`${item.id}-${item.color}-${item.size}`}>
                  <ListItemAvatar>
                    <Avatar src={item.imageUrl} variant="square" />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.nome}
                    secondary={`Cor: ${item.color} | Tamanho: ${item.size} | Qtd: ${item.quantidade}`}
                  />
                  <Typography variant="body2">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="subtitle1">R$ {subtotal.toFixed(2)}</Typography>
            </Box>
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">Frete</Typography>
              <Typography variant="subtitle1">R$ {frete.toFixed(2)}</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">R$ {total.toFixed(2)}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* Detalhes do Comprador e Finalização */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Detalhes do Comprador
            </Typography>
            <TextField
              label="Nome Completo"
              variant="outlined"
              fullWidth
              value={buyerName}
              onChange={(e) => setBuyerName(e.target.value)}
              sx={{ mb: 3 }}
              required
              disabled={isProcessing}
            />

            {/* Adicionar mais campos de formulário aqui em um cenário real */}

            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleFinalizePurchase}
              disabled={isProcessing || !buyerName.trim() || cartItems.length === 0}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Compra'}
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MotionContainer>
  );
}

export default Checkout; 