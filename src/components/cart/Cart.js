import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  IconButton,
  Button,
  Divider,
  TextField,
  Paper,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useCart } from '../../contexts/CartContext';

const StyledCard = styled(Card)`
  display: flex;
  margin-bottom: 1rem;
  transition: transform 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const CartItemImage = styled(CardMedia)`
  width: 120px;
  height: 120px;
  background-size: contain;
  background-position: center;
`;

const MotionContainer = motion(Container);

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();
  const [cupom, setCupom] = useState('');

  const handleQuantidadeChange = (itemId, delta, color, size) => {
    const item = cartItems.find(i => i.id === itemId && i.color === color && i.size === size);
    if (item) {
      updateItemQuantity(itemId, color, size, item.quantity + delta);
    }
  };

  const handleRemoveItem = (itemId, color, size) => {
    removeFromCart(itemId, color, size);
  };

  const subtotal = cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const frete = subtotal > 0 ? 15.90 : 0;
  const desconto = cupom === 'NIKE10' ? subtotal * 0.1 : 0;
  const total = subtotal + frete - desconto;

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth="lg"
      sx={{ py: 4 }}
    >
      <Typography variant="h4" component="h1" gutterBottom>
        Carrinho de Compras
      </Typography>

      <Grid container spacing={4}>
        {/* Lista de Produtos */}
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <ShoppingBagIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                Seu carrinho está vazio
              </Typography>
              <Typography variant="body1" color="text.secondary" paragraph>
                Adicione produtos ao seu carrinho para continuar comprando
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate('/')}
                sx={{ mt: 2 }}
              >
                Continuar Comprando
              </Button>
            </Paper>
          ) : (
            cartItems.map((item) => (
              <StyledCard key={item.id} elevation={1}>
                <CartItemImage image={item.imageUrl} title={item.nome} />
                <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" component="h2">
                      {item.nome}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item.id, item.color, item.size)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Cor: {item.cor} | Tamanho: {item.tamanho}
                  </Typography>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 'auto' }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantidadeChange(item.id, -1, item.color, item.size)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <Typography>{item.quantidade}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantidadeChange(item.id, 1, item.color, item.size)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>

                  <Typography variant="h6" sx={{ mt: 1 }}>
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </Typography>
                </CardContent>
              </StyledCard>
            ))
          )}
        </Grid>

        {/* Resumo do Pedido */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumo do Pedido
            </Typography>

            <Box sx={{ my: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Subtotal</Typography>
                <Typography>R$ {subtotal.toFixed(2)}</Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography>Frete</Typography>
                <Typography>R$ {frete.toFixed(2)}</Typography>
              </Box>
              {desconto > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography color="success.main">Desconto</Typography>
                  <Typography color="success.main">-R$ {desconto.toFixed(2)}</Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">R$ {total.toFixed(2)}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label="Cupom de desconto"
                value={cupom}
                onChange={(e) => setCupom(e.target.value.toUpperCase())}
                size="small"
                sx={{ mb: 1 }}
              />
              {cupom === 'NIKE10' && (
                <Chip
                  label="Cupom aplicado: 10% de desconto"
                  color="success"
                  size="small"
                  sx={{ width: '100%' }}
                />
              )}
            </Box>

            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout')}
            >
              Finalizar Compra
            </Button>

            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ mt: 2 }}
              onClick={() => navigate('/')}
            >
              Continuar Comprando
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MotionContainer>
  );
}

export default Cart; 