import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
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

// Dados mockados (em um projeto real, isso viria de uma API)
const mockProduct = {
  id: 1,
  nome: 'Nome do Tênis',
  preco: 150.00,
  precoOriginal: 180.00,
  descricao: 'Este é um ótimo tênis para [atividade, por exemplo, corrida, casual, etc.]. Confortável e estiloso.',
  imageUrl: 'https://via.placeholder.com/592x592?text=Tenis',
  rating: 4.2,
  reviews: 75,
  desconto: 10,
  parcelas: 6,
  cores: ['Azul', 'Vermelho', 'Verde'],
  tamanhos: [39, 40, 41, 42, 43],
  caracteristicas: [
    'Material respirável',
    'Amortecimento responsivo',
    'Design moderno',
  ],
};

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
  const [quantidade, setQuantidade] = useState(1);
  const [corSelecionada, setCorSelecionada] = useState(mockProduct.cores[0]);
  const [tamanhoSelecionado, setTamanhoSelecionado] = useState(null);
  const [favorito, setFavorito] = useState(false);

  const { addToCart } = useCart();

  const handleQuantidadeChange = (delta) => {
    setQuantidade(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = () => {
    // Verificar se cor e tamanho foram selecionados
    if (!corSelecionada || !tamanhoSelecionado) {
      alert('Por favor, selecione a cor e o tamanho.');
      return;
    }
    addToCart(mockProduct, quantidade, corSelecionada, tamanhoSelecionado);
    alert('Produto adicionado ao carrinho!'); // Feedback simples
    // Implementar lógica do carrinho (agora usando o contexto)
    console.log('Adicionar ao carrinho:', {
      produto: mockProduct.nome,
      quantidade,
      cor: corSelecionada,
      tamanho: tamanhoSelecionado,
    });
  };

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth="lg"
      sx={{ py: 4 }}
    >
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link color="inherit" href="/">
          Home
        </Link>
        <Link color="inherit" href="/categoria/tenis">
          Tênis
        </Link>
        <Typography color="text.primary">{mockProduct.nome}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Imagem do Produto */}
        <Grid item xs={12} md={6}>
          <Box sx={{ position: 'relative' }}>
            <ProductImage src={mockProduct.imageUrl} alt={mockProduct.nome} />
            <IconButton
              sx={{ position: 'absolute', top: 16, right: 16 }}
              onClick={() => setFavorito(!favorito)}
            >
              {favorito ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
            </IconButton>
          </Box>
        </Grid>

        {/* Detalhes do Produto */}
        <Grid item xs={12} md={6}>
          <StyledPaper elevation={0}>
            <Typography variant="h4" component="h1" gutterBottom>
              {mockProduct.nome}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <Rating value={mockProduct.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary">
                ({mockProduct.reviews} avaliações)
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
                R$ {mockProduct.preco.toFixed(2)}
              </Typography>
              {mockProduct.precoOriginal && (
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ textDecoration: 'line-through' }}
                >
                  R$ {mockProduct.precoOriginal.toFixed(2)}
                </Typography>
              )}
              {mockProduct.desconto && (
                <Chip
                  label={`${mockProduct.desconto}% OFF`}
                  color="secondary"
                  size="small"
                  sx={{ mt: 1 }}
                />
              )}
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                em até {mockProduct.parcelas}x de R$ {(mockProduct.preco / mockProduct.parcelas).toFixed(2)}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Seleção de Cor */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Cor: {corSelecionada}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {mockProduct.cores.map((cor) => (
                  <Chip
                    key={cor}
                    label={cor}
                    onClick={() => setCorSelecionada(cor)}
                    variant={corSelecionada === cor ? 'filled' : 'outlined'}
                    color={corSelecionada === cor ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>

            {/* Seleção de Tamanho */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Tamanho
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {mockProduct.tamanhos.map((tamanho) => (
                  <Chip
                    key={tamanho}
                    label={tamanho}
                    onClick={() => setTamanhoSelecionado(tamanho)}
                    variant={tamanhoSelecionado === tamanho ? 'filled' : 'outlined'}
                    color={tamanhoSelecionado === tamanho ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>

            {/* Quantidade */}
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Quantidade
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton onClick={() => handleQuantidadeChange(-1)}>
                  <RemoveIcon />
                </IconButton>
                <TextField
                  value={quantidade}
                  onChange={(e) => setQuantidade(Math.max(1, parseInt(e.target.value) || 1))}
                  type="number"
                  inputProps={{ min: 1 }}
                  sx={{ width: '80px' }}
                />
                <IconButton onClick={() => handleQuantidadeChange(1)}>
                  <AddIcon />
                </IconButton>
              </Box>
            </Box>

            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<CartIcon />}
              onClick={handleAddToCart}
              disabled={!tamanhoSelecionado}
              sx={{ mb: 2 }}
            >
              Adicionar ao Carrinho
            </Button>

            <Divider sx={{ my: 3 }} />

            {/* Características */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Características
              </Typography>
              <ul style={{ paddingLeft: '1.5rem' }}>
                {mockProduct.caracteristicas.map((caracteristica, index) => (
                  <li key={index}>
                    <Typography variant="body1">{caracteristica}</Typography>
                  </li>
                ))}
              </ul>
            </Box>
          </StyledPaper>
        </Grid>
      </Grid>
    </MotionContainer>
  );
}

export default ProductDetail; 