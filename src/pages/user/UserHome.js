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
  Alert,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductCard from '../../components/products/ProductCard';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';

const MotionContainer = motion(Container);

function UserHome() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [page, setPage] = useState(1);

  const { authInfo } = useAuth();
  const usuario = authInfo?.usuario;
  const isAuthenticated = !!authInfo?.token;

  const fetchProducts = async ({ queryKey }) => {
    const [, user] = queryKey;
    const url = `/app/produtos/${user || '010623042'}/`;
    console.log('Buscando produtos na Home com URL:', url);
    
    const response = await api.get(url);
    console.log('Resposta da API (lista produtos Home):', response.data);
    return response.data;
  };

  const { data: products, isLoading: isLoadingProducts, error: errorProducts } = useQuery(
    ['products', usuario],
    fetchProducts,
    {
      enabled: true,
      staleTime: 5 * 60 * 1000,
    }
  );

  const fetchCategories = async () => {
    console.log('Fetching categories...');
    const response = await api.get('/app/categorias');
    return response.data;
  };

  const { data: categories, isLoading: isLoadingCategories, error: errorCategories } = useQuery(
    'categories',
    fetchCategories,
    {
      enabled: true,
      staleTime: Infinity,
      onError: (err) => {
         console.error('Erro ao buscar categorias:', err);
      }
    }
  );

  console.log('Categories data:', categories);
  console.log('Is Authenticated:', isAuthenticated);

  const categoryList = Array.isArray(categories) ? categories : [];

  console.log('CategoryList:', categoryList);
  console.log('Produtos antes da filtragem:', products);
  console.log('Categoria selecionada:', selectedCategory);

  const filteredProducts = products?.filter(product => {
    const matchesSearch = product.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '' || product.categoria === selectedCategory;
    const hasStock = product.quantidade > 0;
    
    console.log('Produto:', product.nome, {
      categoria: product.categoria,
      selectedCategory,
      matchesCategory,
      matchesSearch,
      hasStock
    });
    
    return matchesSearch && matchesCategory && hasStock;
  }) || [];

  console.log('Produtos após filtragem:', filteredProducts);

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return Number(a.preco) - Number(b.preco);
      case 'price-desc':
        return Number(b.preco) - Number(a.preco);
      case 'rating':
        return 0;
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

  React.useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedCategory, sortBy]);

  const isLoading = isLoadingProducts || isLoadingCategories;
  const error = errorProducts || errorCategories;

  if (isLoading) {
    return (
      <MotionContainer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        maxWidth="lg"
        sx={{ py: 4 }}
      >
        <Grid container spacing={3}>
          {Array.from(new Array(8)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
          ))}
        </Grid>
      </MotionContainer>
    );
  }

  if (error) {
    const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar dados.';
    return (
      <MotionContainer
        maxWidth="lg"
        sx={{ py: 4 }}
      >
        <Alert severity="error">Erro ao carregar dados: {errorMessage}</Alert>
      </MotionContainer>
    );
  }

   const showNoProducts = !isLoading && !error && paginatedProducts.length === 0 && (products?.length === 0 || products === undefined);

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
          Coleção de Produtos
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Encontre o que você procura
        </Typography>
      </Box>

      <Box sx={{ mb: 4, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Buscar produtos..."
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
            {categoryList.map((category) => (
              <MenuItem key={category._id} value={category.nome}>
                {category.nome}
              </MenuItem>
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
          </Select>
        </FormControl>
      </Box>

      {paginatedProducts.length > 0 ? (
        <Grid container spacing={3}>
          {paginatedProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={product._id || product.id}> 
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      ) : (
        showNoProducts && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Nenhum produto encontrado com os filtros aplicados.
            </Typography>
          </Box>
        )
      )}

      {!isLoading && !error && totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary" size="large"
          />
        </Box>
      )}
    </MotionContainer>
  );
}

export default UserHome; 