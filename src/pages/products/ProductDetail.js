import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  Rating,
  Chip,
  Divider,
  TextField,
  IconButton,
  Breadcrumbs,
  Link,
  Paper,
  CircularProgress,
  Alert,
  Modal,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as CartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { useQuery } from 'react-query';

// Dados mockados (removido, usaremos dados da API)
// const mockProduct = { ... };

const StyledPaper = styled(Paper)`
  padding: ${props => props.theme.spacing(3)};
  height: 100%;
`;

const ProductImage = styled('img')`
  width: 100%;
  height: auto;
  object-fit: contain;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const MotionContainer = motion(Container);

function ProductDetail() {
  const { id } = useParams();
  console.log('ID obtido de useParams:', id);
  const navigate = useNavigate();
  const [quantidade, setQuantidade] = useState(1);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [favorito, setFavorito] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const { addToCart } = useCart();
  const { authInfo } = useAuth();
  const usuario = authInfo?.usuario;

  const fetchProductDetail = async ({ queryKey }) => {
    const [, user, productId] = queryKey;
    console.log('QueryKey recebida:', queryKey);
    console.log('ProductId para buscar:', productId);
    console.log('Usuário para buscar lista:', user || '010623042');
    
    if (!productId) {
      console.log('ID do produto não disponível para buscar detalhes.');
      return null;
    }
    
    const listUrl = `/app/produtos/${user || '010623042'}/`;
    console.log('Buscando lista de produtos para encontrar o detalhe com URL:', listUrl);
    
    try {
      const response = await api.get(listUrl);
      console.log('Resposta completa da API (lista):', response);
      console.log('Dados da lista recebidos:', response.data);
      
      const productList = Array.isArray(response.data) ? response.data : [];
      const foundProduct = productList.find(p => p._id === productId);
      
      console.log('Produto encontrado na lista:', foundProduct);
      
      return foundProduct;
      
    } catch (error) {
      console.error('Erro ao buscar lista para detalhes:', error);
      console.error('Resposta de erro:', error.response?.data);
      throw error;
    }
  };

  const { data: product, isLoading, error } = useQuery(
    ['productDetail', usuario, id],
    fetchProductDetail,
    {
      enabled: typeof id === 'string' && id.length > 0,
      staleTime: 5 * 60 * 1000,
      onError: (queryError) => {
        console.error('Erro na query de detalhes do produto na Home:', queryError);
      }
    }
  );

  const handleQuantidadeChange = (delta) => {
    setQuantidade(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    if (!product) return;

    if (product.tamanhos && product.tamanhos.length > 0 && !tamanhoSelecionado) {
      alert('Por favor, selecione o tamanho.');
      return;
    }

    addToCart(product, quantidade, tamanhoSelecionado);
    setModalOpen(true);
    
    console.log('Adicionar ao carrinho:', {
      produto: product.nome,
      quantidade,
      tamanho: tamanhoSelecionado,
    });
  };

  if (isLoading) {
    return (
      <MotionContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}
      >
        <CircularProgress />
        <Typography>Carregando produto...</Typography>
      </MotionContainer>
    );
  }

  if (error) {
    return (
      <MotionContainer maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar detalhes do produto: {error.message}</Alert>
      </MotionContainer>
    );
  }

  if (!product) {
    return (
      <MotionContainer maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="warning">Produto não encontrado.</Alert>
      </MotionContainer>
    );
  }

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth="lg"
      sx={{ py: 4 }}
    >
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" onClick={() => navigate('/')} sx={{cursor: 'pointer'}}>
          Home
        </Link>
        <Typography color="text.primary">{product.nome}</Typography>
      </Breadcrumbs>

      <Grid container spacing={6}>
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <ProductImage src={product.imagem} alt={product.nome} sx={{ bgcolor: '#f5f5f5' }} />
            <IconButton
              sx={{ position: 'absolute', top: 16, right: 16 }}
              onClick={() => setFavorito(!favorito)}
            >
              {favorito ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <StyledPaper elevation={0} sx={{ padding: { xs: 2, md: 3 } }}>
            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
              {product.nome}
            </Typography>

            {product.rating !== undefined && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Rating value={product.rating || 0} precision={0.5} readOnly />
                <Typography variant="body2" color="text.secondary">
                  ({product.reviews || 0} avaliações)
                </Typography>
              </Box>
            )}

            <Box sx={{ mb: 2 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                R$ {product.preco ? Number(product.preco).toFixed(2) : 'N/A'}
              </Typography>
              {product.parcelas && product.preco && (
                <Typography variant="body1" color="text.secondary" sx={{ mt: 0 }}>
                  ou até {product.parcelas}x de R$ {(Number(product.preco) / product.parcelas).toFixed(2)} sem juros
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ mb: 3 }}>
               <Typography variant="h6" gutterBottom>
                Descrição
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {product.descricao}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {product.tamanhos && product.tamanhos.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Escolha seu Tamanho:
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {product.tamanhos.map((tamanho) => (
                    <Chip
                      key={tamanho}
                      label={tamanho}
                      onClick={() => setTamanhoSelecionado(tamanho)}
                      variant={tamanhoSelecionado === tamanho ? 'outlined' : 'outlined'}
                      color={tamanhoSelecionado === tamanho ? 'primary' : 'default'}
                      sx={{
                        borderColor: tamanhoSelecionado === tamanho ? 'primary.main' : 'text.primary',
                        color: tamanhoSelecionado === tamanho ? 'primary.main' : 'text.primary',
                        fontWeight: tamanhoSelecionado === tamanho ? 'bold' : 'normal',
                        bgcolor: tamanhoSelecionado === tamanho ? 'primary.light' : 'transparent',
                         '&:hover': {
                           bgcolor: tamanhoSelecionado === tamanho ? 'primary.light' : 'action.hover',
                         }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            )}

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantidade em Estoque: {product.quantidade}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton onClick={() => handleQuantidadeChange(-1)} disabled={quantidade <= 1}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                  type="number"
                  inputProps={{ min: 1, max: product.quantidade, style: { textAlign: 'center' } }}
                  sx={{ width: '60px' }}
                  size="small"
                />
                <IconButton onClick={() => handleQuantidadeChange(1)} disabled={quantidade >= product.quantidade}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
            <Button
              variant="contained"
              size="large"
              fullWidth
                onClick={() => { 
                  addToCart(product, 1, tamanhoSelecionado); 
                  navigate('/checkout'); 
                }}
                disabled={(product?.tamanhos?.length > 0 && !tamanhoSelecionado) || quantidade <= 0}
                sx={{ bgcolor: '#d32f2f', '&:hover': { bgcolor: '#b71c1c' } }}
              >
                COMPRAR
              </Button>
              <Button
                variant="outlined"
                size="large"
                fullWidth
              onClick={handleAddToCart}
                disabled={(product?.tamanhos?.length > 0 && !tamanhoSelecionado) || quantidade <= 0}
                sx={{ borderColor: 'text.primary', color: 'text.primary', '&:hover': { bgcolor: 'action.hover' } }}
            >
                ADICIONAR AO CARRINHO
            </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            {product.caracteristicas && product.caracteristicas.length > 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Características
                </Typography>
                <ul style={{ paddingLeft: '1.5rem' }}>
                  {product.caracteristicas.map((caracteristica, index) => (
                    <li key={index}>
                      <Typography variant="body1" color="text.secondary">
                        {caracteristica}
                      </Typography>
                    </li>
                  ))}
                </ul>
              </Box>
            )}
          </StyledPaper>
        </Grid>
      </Grid>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 400 },
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: { xs: 3, sm: 4 },
          borderRadius: '8px',
          textAlign: 'center',
          outline: 'none',
        }}>
          <Typography id="modal-title" variant="h5" component="h2" gutterBottom sx={{ fontWeight: 'bold' }}>
            Produto Adicionado!
          </Typography>
          <Typography id="modal-description" sx={{ mt: 1.5, mb: 3, color: 'text.secondary' }}>
            O produto foi adicionado ao seu carrinho de compras.
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, justifyContent: 'center' }}>
            <Button
              variant="contained"
              onClick={() => {
                setModalOpen(false);
                navigate('/cart');
              }}
              sx={{ flexGrow: 1 }}
            >
              Ver Carrinho
            </Button>
            <Button variant="outlined" onClick={() => setModalOpen(false)} sx={{ flexGrow: 1 }}>
              Continuar Comprando
            </Button>
          </Box>
        </Box>
      </Modal>
    </MotionContainer>
  );
}

export default ProductDetail; 