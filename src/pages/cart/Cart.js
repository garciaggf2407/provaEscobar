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
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

const StyledCard = styled(Card)`
  display: flex;
  margin-bottom: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
  transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
  }
`;

const CartItemImage = styled(CardMedia)`
  width: 150px;
  min-width: 150px;
  height: auto;
  background-size: cover;
  background-position: center;
  border-radius: 8px 0 0 8px;
`;

const MotionContainer = motion(Container);

function Cart() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateItemQuantity } = useCart();
  const [cupom, setCupom] = useState('');
  const [cupomAplicado, setCupomAplicado] = useState(false);
  const [mensagemCupom, setMensagemCupom] = useState('');
  const [favoritos, setFavoritos] = useState({});

  const handleQuantidadeChange = (itemId, delta, color, size) => {
    const item = cartItems.find(i => i.id === itemId && i.color === color && i.size === size);
    if (item) {
      updateItemQuantity(itemId, color, size, item.quantity + delta);
    }
  };

  const handleRemoveItem = (itemId, color, size) => {
    removeFromCart(itemId, color, size);
  };

  const handleToggleFavorito = (itemId, color, size) => {
    const key = `${itemId}-${color || ''}-${size || ''}`;
    setFavoritos((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleAplicarCupom = () => {
    if (cupom.trim().toLowerCase() === 'corinthians') {
      setCupomAplicado(true);
      setMensagemCupom('Cupom CORINTHIANS aplicado! Você ganhou 15% de desconto.');
    } else {
      setCupomAplicado(false);
      setMensagemCupom('Cupom inválido.');
    }
  };

  const subtotal = cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const desconto = cupomAplicado ? subtotal * 0.15 : 0;
  const total = subtotal - desconto;

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
              <StyledCard key={`${item.id}-${item.color}-${item.size}`} elevation={1} sx={{ alignItems: 'center', minHeight: 160, background: '#fafafa' }}>
                <CartItemImage image={item.imagem} title={item.nome} sx={{ width: 140, height: 140, minWidth: 140, borderRadius: 2, m: 2, backgroundColor: '#f5f5f5' }} />
                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', pl: 2, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 260 }}>
                      {item.nome}
                    </Typography>
                    {item.tamanhos && item.tamanhos.length > 0 && (
                      <TextField
                        select
                      size="small"
                        value={item.size || ''}
                        sx={{ width: 60, ml: 1 }}
                        SelectProps={{ native: true }}
                        disabled
                      >
                        {item.tamanhos.map((tamanho) => (
                          <option key={tamanho} value={tamanho}>{tamanho}</option>
                        ))}
                      </TextField>
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                    <IconButton size="small" onClick={() => handleRemoveItem(item.id, item.color, item.size)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" sx={{ color: 'text.secondary', cursor: 'pointer' }} onClick={() => handleRemoveItem(item.id, item.color, item.size)}>
                      Remover
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mx: 2 }}>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantidadeChange(item.id, -1, item.color, item.size)}
                    disabled={item.quantidade <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                  <Typography sx={{ minWidth: 24, textAlign: 'center' }}>{item.quantidade}</Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleQuantidadeChange(item.id, 1, item.color, item.size)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                <Box sx={{ minWidth: 120, textAlign: 'right', pr: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    R$ {(item.preco * item.quantidade).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </Typography>
                </Box>
              </StyledCard>
            ))
          )}
        </Grid>

        {/* Resumo do Pedido */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 6, bgcolor: '#fafafa' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 700, mb: 2 }}>
              Resumo do Pedido
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box>
              {cartItems.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3, p: 2, borderRadius: 2, bgcolor: '#f3f3f3', boxShadow: 1 }}>
                  <Box sx={{ minWidth: 110, minHeight: 110, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={item.imagem} alt={item.nome} style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 10, boxShadow: '0 2px 8px rgba(0,0,0,0.07)' }} />
                  </Box>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: '1rem', mb: 0.5, whiteSpace: 'normal', wordBreak: 'break-word' }}>{item.nome}</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.95rem', mb: 0.5 }}>Qtd: {item.quantidade}</Typography>
              </Box>
                  <Box sx={{ minWidth: 80, textAlign: 'right' }}>
                    <Typography sx={{ fontWeight: 700, fontSize: '1.1rem' }}>R$ {Number(item.preco).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
              </Box>
                </Box>
              ))}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 2 }}>
              <TextField
                label="Cupom de desconto"
                variant="outlined"
                size="small"
                value={cupom}
                onChange={e => setCupom(e.target.value)}
                disabled={cupomAplicado}
                sx={{ mb: 1 }}
              />
              <Button
                variant="outlined"
                color="primary"
                  size="small"
                onClick={handleAplicarCupom}
                disabled={cupomAplicado}
                sx={{ fontWeight: 600, borderRadius: 2 }}
              >
                {cupomAplicado ? 'Cupom Aplicado' : 'Aplicar Cupom'}
              </Button>
              {mensagemCupom && (
                <Typography variant="body2" color={cupomAplicado ? 'success.main' : 'error'}>
                  {mensagemCupom}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>Subtotal</Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>R$ {subtotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            {cupomAplicado && (
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>Desconto (15%)</Typography>
                <Typography variant="body1" sx={{ fontWeight: 500, color: 'success.main' }}>- R$ {desconto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
              </Box>
            )}
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>Total</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.5 }}>R$ {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Typography>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ bgcolor: '#b71c1c', color: '#fff', fontWeight: 700, fontSize: '1.1rem', py: 2, borderRadius: 2, boxShadow: 2, '&:hover': { bgcolor: '#a31515' }, mb: 2 }}
              disabled={cartItems.length === 0}
              onClick={() => navigate('/checkout', { state: { cupom: cupomAplicado ? 'corinthians' : '', desconto: cupomAplicado ? desconto : 0 } })}
            >
              CONCLUIR COMPRA
            </Button>
            <Button
              variant="outlined"
              fullWidth
              size="large"
              sx={{ mt: 1, fontWeight: 600, borderRadius: 2 }}
              onClick={() => navigate('/')}
            >
              Adicionar mais itens
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </MotionContainer>
  );
}

export default Cart; 