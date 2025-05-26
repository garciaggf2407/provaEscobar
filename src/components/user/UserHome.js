import React, { useState } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Pagination,
  Skeleton,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductCard from '../products/ProductCard';

// Dados mockados de produtos (com categorias)
const mockProducts = [
  {
    id: 1,
    nome: 'Tênis de Corrida Leve',
    preco: 350.00,
    precoOriginal: 400.00,
    descricao: 'Ideal para corridas diárias com máximo conforto.',
    imageUrl: 'https://via.placeholder.com/592x592?text=Tenis+Corrida',
    rating: 4.5,
    reviews: 128,
    desconto: 12,
    parcelas: 8,
    categoria: 'Corrida',
  },
  {
    id: 2,
    nome: 'Tênis Casual Urbano',
    preco: 280.00,
    descricao: 'Estilo e conforto para o dia a dia na cidade.',
    imageUrl: 'https://via.placeholder.com/592x592?text=Tenis+Casual',
    rating: 4.8,
    reviews: 256,
    parcelas: 6,
    categoria: 'Casual',
  },
  {
    id: 3,
    nome: 'Chuteira de Futebol de Campo',
    preco: 450.00,
    precoOriginal: 500.00,
    descricao: 'Desempenho e aderência para gramados naturais.',
    imageUrl: 'https://via.placeholder.com/592x592?text=Chuteira+Campo',
    rating: 4.3,
    reviews: 89,
    desconto: 10,
    parcelas: 10,
    categoria: 'Futebol',
  },
  {
    id: 4,
    nome: 'Tênis para Treinamento Cruzado',
    preco: 320.00,
    descricao: 'Estabilidade e suporte para diversos tipos de treino.',
    imageUrl: 'https://via.placeholder.com/592x592?text=Tenis+Treino',
    rating: 4.6,
    reviews: 150,
    parcelas: 7,
    categoria: 'Treinamento',
  },
   {
    id: 5,
    nome: 'Sandália Esportiva',
    preco: 150.00,
    descricao: 'Conforto pós-treino ou para momentos de lazer.',
    imageUrl: 'https://via.placeholder.com/592x592?text=Sandalia',
    rating: 4.4,
    reviews: 60,
    parcelas: 3,
    categoria: 'Casual',
  },
  {
    id: 6,
    nome: 'Tênis de Basquete Performance',
    preco: 550.00,
    descricao: 'Amortecimento e suporte para as quadras.',
    imageUrl: 'https://via.placeholder.com/592x592?text=Tenis+Basquete',
    rating: 4.7,
    reviews: 210,
    parcelas: 12,
    categoria: 'Basquete',
  }
];

const MotionContainer = motion(Container);

function UserHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Obter categorias únicas dos produtos
  const categories = ['', ...new Set(mockProducts.map(product => product.categoria))];

  // Simulação de carregamento
  React.useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [searchTerm, sortBy, selectedCategory, page]);

  const filteredProducts = mockProducts.filter(product =>
    product.nome.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || product.categoria === selectedCategory)
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.preco - b.preco;
      case 'price-desc':
        return b.preco - a.preco;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const productsPerPage = 8;
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const paginatedProducts = sortedProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  return (
    <MotionContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      maxWidth="lg"
      sx={{ py: 4 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Coleção de Tênis
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Encontre o par perfeito para cada ocasião
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar tênis..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1, minWidth: '200px' }}
        />

        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel>Categoria</InputLabel>
          <Select
            value={selectedCategory}
            label="Categoria"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="">Todas</MenuItem>
            {categories.filter(cat => cat !== '').map(cat => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: '200px' }}>
          <InputLabel>Ordenar por</InputLabel>
          <Select
            value={sortBy}
            label="Ordenar por"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="relevance">Relevância</MenuItem>
            <MenuItem value="price-asc">Menor preço</MenuItem>
            <MenuItem value="price-desc">Maior preço</MenuItem>
            <MenuItem value="rating">Melhor avaliação</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        {loading
          ? Array.from(new Array(8)).map((_, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Skeleton variant="rectangular" height={400} />
              </Grid>
            ))
          : paginatedProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
      </Grid>

      {!loading && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </MotionContainer>
  );
}

export default UserHome; 