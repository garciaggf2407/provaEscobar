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
  Avatar,
  Alert,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useQueryClient } from 'react-query';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import PixIcon from '@mui/icons-material/Pix';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';

const MotionContainer = motion(Container);

function Checkout() {
  const navigate = useNavigate();
  const location = window.location || {};
  const { cartItems, clearCart } = useCart();
  const { authInfo } = useAuth();
  const usuario = authInfo?.usuario;
  const queryClient = useQueryClient();

  // Recebe cupom/desconto do carrinho (via location.state)
  const initialCupom = (location.state && location.state.cupom) || '';
  const initialDesconto = (location.state && location.state.desconto) || 0;
  const [cupom, setCupom] = useState(initialCupom);
  const [cupomAplicado, setCupomAplicado] = useState(!!initialCupom);
  const [mensagemCupom, setMensagemCupom] = useState(initialCupom ? 'Cupom CORINTHIANS aplicado! Você ganhou 15% de desconto.' : '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [buyerName, setBuyerName] = useState('');

  const subtotal = cartItems.reduce((total, item) => total + item.preco * item.quantidade, 0);
  const desconto = cupomAplicado ? subtotal * 0.15 : 0;
  const total = subtotal - desconto;

  const handleAplicarCupom = () => {
    if (cupom.trim().toLowerCase() === 'corinthians') {
      setCupomAplicado(true);
      setMensagemCupom('Cupom CORINTHIANS aplicado! Você ganhou 15% de desconto.');
    } else {
      setCupomAplicado(false);
      setMensagemCupom('Cupom inválido.');
    }
  };

  const handleFinalizePurchase = async () => {
    if (!buyerName.trim()) {
      alert('Por favor, insira seu nome.');
      return;
    }
    if (!paymentMethod) {
      alert('Por favor, selecione uma forma de pagamento.');
      return;
    }
    setIsProcessing(true);
    setError(null);

    const vendaData = {
      nomeCliente: buyerName,
      usuario: usuario,
      data: new Date().toISOString().split('T')[0],
      produtos: cartItems.map(item => ({
        nome: item.nome,
        quantidade: item.quantidade,
        preco: item.preco,
        imagem: item.imagem,
        color: item.color, 
        size: item.size
      })),
      formaPagamento: paymentMethod,
      cupom: cupomAplicado ? 'corinthians' : '',
      desconto: cupomAplicado ? desconto : 0,
      total: total,
    };

    try {
      const response = await api.post('/app/venda', vendaData);
      if (response.status === 200) {
        clearCart();
        queryClient.invalidateQueries('products');
        queryClient.invalidateQueries('adminProducts');
        queryClient.invalidateQueries('productDetail');
        navigate('/thank-you', { state: { buyerName, vendaId: response.data._id } });
      } else {
         setError(response.data.message || response.data.error || 'Erro ao finalizar compra.');
      }
    } catch (err) {
      setError(
        err.response?.data?.error || 
        'Ocorreu um erro ao comunicar com o servidor. Tente novamente.'
      );
    } finally {
      setIsProcessing(false);
    }
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
      maxWidth="lg"
      sx={{ py: 6, minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}
    >
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 5, textAlign: 'center' }}>
        Finalizar Compra
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 5, justifyContent: 'center', alignItems: 'flex-start', width: '100%', maxWidth: 950 }}>
        <Paper sx={{ p: 4, flex: 1, minWidth: 340, borderRadius: 4, boxShadow: 6, display: 'flex', flexDirection: 'column', minHeight: 370 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Resumo do Pedido
            </Typography>
            <List dense={true}>
              {cartItems.map((item) => (
              <ListItem key={`${item._id || item.id}-${item.color}-${item.size}`}> 
                  <ListItemAvatar>
                  <Avatar src={item.imagem} variant="square" sx={{ width: 200, height: 200, mr: 2 }} />
                  </ListItemAvatar>
                  <ListItemText
                  primary={<Typography sx={{ fontWeight: 500 }}>{item.nome}</Typography>}
                    secondary={
                    <Typography variant="body2" color="text.secondary">
                        Qtd: {item.quantidade}
                        {item.color && ` | Cor: ${item.color}`}
                        {item.size && ` | Tamanho: ${item.size}`}
                    </Typography>
                    }
                  />
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  R$ {(Number(item.preco) * item.quantidade).toFixed(2)}
                  </Typography>
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 2 }} />
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1">Subtotal</Typography>
              <Typography variant="subtitle1">R$ {subtotal.toFixed(2)}</Typography>
            </Box>
          {cupomAplicado && (
             <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="subtitle1" color="success.main">Desconto (15%)</Typography>
              <Typography variant="subtitle1" color="success.main">- R$ {desconto.toFixed(2)}</Typography>
            </Box>
          )}
            <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Total</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>R$ {total.toFixed(2)}</Typography>
            </Box>
          </Paper>

        <Paper sx={{ p: 4, flex: 1, minWidth: 340, borderRadius: 4, boxShadow: 6, display: 'flex', flexDirection: 'column', minHeight: 370 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
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
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>
              Forma de Pagamento
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
              <Button
                variant={paymentMethod === 'credit' ? 'contained' : 'outlined'}
                color="primary"
                startIcon={<CreditCardIcon />}
                onClick={() => setPaymentMethod('credit')}
                sx={{ borderRadius: 3, minWidth: 110, fontWeight: 600, fontSize: '1rem', py: 1, boxShadow: paymentMethod === 'credit' ? 2 : 0, transition: 'all 0.2s' }}
                disabled={isProcessing}
              >
                Cartão
              </Button>
              <Button
                variant={paymentMethod === 'pix' ? 'contained' : 'outlined'}
                color="success"
                startIcon={<PixIcon />}
                onClick={() => setPaymentMethod('pix')}
                sx={{ borderRadius: 3, minWidth: 110, fontWeight: 600, fontSize: '1rem', py: 1, boxShadow: paymentMethod === 'pix' ? 2 : 0, transition: 'all 0.2s' }}
                disabled={isProcessing}
              >
                Pix
              </Button>
              <Button
                variant={paymentMethod === 'boleto' ? 'contained' : 'outlined'}
                color="secondary"
                startIcon={<ReceiptLongIcon />}
                onClick={() => setPaymentMethod('boleto')}
                sx={{ borderRadius: 3, minWidth: 110, fontWeight: 600, fontSize: '1rem', py: 1, boxShadow: paymentMethod === 'boleto' ? 2 : 0, transition: 'all 0.2s' }}
                disabled={isProcessing}
              >
                Boleto
              </Button>
            </Box>
          </Box>
            <Button
              variant="contained"
              size="large"
              fullWidth
              onClick={handleFinalizePurchase}
              disabled={isProcessing || !buyerName.trim() || cartItems.length === 0}
              startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : null}
            sx={{ borderRadius: 3, fontWeight: 'bold', fontSize: '1.1rem', py: 1.7, mt: 'auto', boxShadow: 2 }}
            >
              {isProcessing ? 'Processando...' : 'Confirmar Compra'}
            </Button>
          </Paper>
      </Box>
    </MotionContainer>
  );
}

export default Checkout; 