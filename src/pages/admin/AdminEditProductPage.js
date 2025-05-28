import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function AdminEditProductPage() {
  const { id } = useParams(); // Obter o ID do produto da URL
  console.log('ID do produto da URL:', id);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { authInfo } = useAuth(); // Obter info do usuário logado
  const usuarioLogado = authInfo?.usuario; // ID do usuário logado

  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    preco: '',
    categoria: '',
    descricao: '',
    imagem: '',
  });

  // Estado para armazenar a lista de categorias
  const [categories, setCategories] = useState([]);

  // Buscar categorias ao carregar o componente
  const { isLoading: isLoadingCategories, error: errorCategories } = useQuery(
    'categories', // Nome da query
    async () => {
      const response = await api.get('/app/categorias');
      console.log('Categorias obtidas para edição:', response.data);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setCategories(Array.isArray(data) ? data : []); // Garantir que é um array
      },
      onError: (err) => {
        console.error('Erro ao buscar categorias para edição:', err);
      }
    }
  );

  console.log('Estado inicial do formData:', formData);

  // Query para buscar os dados do produto existente
  const { data: product, isLoading, error } = useQuery(
    ['product', id, usuarioLogado], // Adicionar usuarioLogado na query key
    async ({ queryKey }) => {
      const [, productId, user] = queryKey; // Extrair productId e user
      console.log('Buscando produto com ID:', productId, 'para usuário:', user);
      
      if (!productId || !user) {
        console.log('ID do produto ou usuário não disponível, não buscando detalhes.');
        return null; // Não busca se não tiver ID ou usuário
      }
      
      try {
        // Buscar a lista de produtos para o usuário logado
        const listUrl = `/app/produtos/${user}/`;
        console.log('Buscando lista de produtos para encontrar o detalhe com URL:', listUrl);
        const response = await api.get(listUrl);
        
        console.log('Resposta da API (lista de produtos Admin):', response.data);
        
        // Procurar o produto específico na lista pelo ID
        const productList = Array.isArray(response.data) ? response.data : [];
        const foundProduct = productList.find(p => p._id === productId);
        
        console.log('Produto encontrado na lista para edição:', foundProduct);
        
        return foundProduct; // Retorna o produto encontrado (ou undefined se não encontrar)
        
      } catch (fetchError) {
        console.error('Erro ao buscar lista de produtos para edição:', fetchError.response?.data || fetchError);
        throw fetchError; // Propagar o erro para useQuery
      }
    },
    {
      enabled: !!id && !!usuarioLogado, // A query só roda se o ID e o usuário estiverem disponíveis
      staleTime: 5 * 60 * 1000,
      onError: (queryError) => {
        console.error('Erro na query de detalhes do produto:', queryError);
      }
    }
  );

  // Atualizar o formulário quando os dados do produto forem carregados
  useEffect(() => {
    console.log('useEffect disparado. Dados do produto recebidos:', product);
    if (product) {
      setFormData({
        nome: product.nome || '',
        quantidade: product.quantidade || '',
        preco: product.preco || '',
        categoria: product.categoria || '',
        descricao: product.descricao || '',
        imagem: product.imagem || '',
      });
      console.log('formData atualizado:', { nome: product.nome || '', quantidade: product.quantidade || '', preco: product.preco || '', categoria: product.categoria || '', descricao: product.descricao || '', imagem: product.imagem || '' });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Mutação para atualizar o produto (PUT /app/produtos/{id})
  const updateProductMutation = useMutation(async (productData) => {
    // Enviando o ID e os dados atualizados no corpo para /app/produtos
    const dataToSend = { ...productData, id: id };
    const response = await api.put('/app/produtos', dataToSend);
    return response.data;
  }, {
    onSuccess: () => {
      // Invalida o cache da query de produtos (lista) e da query deste produto específico
      queryClient.invalidateQueries('adminProducts');
      queryClient.invalidateQueries(['product', id]);
      navigate('/admin/products'); // Redirecionar para a lista
    },
    onError: (error) => {
      console.error('Erro ao atualizar produto:', error);
      alert('Erro ao atualizar produto: ' + (error.message || 'Desconhecido'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateProductMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando dados do produto...</Typography>
      </Container>
    );
  }

  if (error) {
     const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar produto.';
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar produto: {errorMessage}</Alert>
      </Container>
    );
  }

  if (!product && !isLoading) {
       return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Alert severity="warning">Produto não encontrado.</Alert>
        </Container>
      );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Produto
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="nome"
          label="Nome do Produto"
          name="nome"
          autoFocus
          value={formData.nome}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="quantidade"
          label="Quantidade"
          name="quantidade"
          type="number"
          value={formData.quantidade}
          onChange={handleChange}
        />
         <TextField
          margin="normal"
          required
          fullWidth
          id="preco"
          label="Preço"
          name="preco"
          type="number"
          value={formData.preco}
          onChange={handleChange}
        />
         {/* Campo de Categoria - Substituído por Select */}
        <FormControl fullWidth margin="normal" required>
          <InputLabel id="categoria-label">Categoria</InputLabel>
          <Select
            labelId="categoria-label"
          id="categoria"
          name="categoria"
          value={formData.categoria}
            label="Categoria"
          onChange={handleChange}
             // Desabilitar enquanto carrega ou se houver erro
            disabled={isLoadingCategories || !!errorCategories || isLoading} // Desabilitar também enquanto carrega o produto
          >
             {isLoadingCategories && <MenuItem disabled>Carregando categorias...</MenuItem>}
            {errorCategories && <MenuItem disabled>Erro ao carregar categorias</MenuItem>}
             {!isLoadingCategories && !errorCategories && categories.length === 0 && (
               <MenuItem disabled>Nenhuma categoria disponível</MenuItem>
            )}
            {categories.map((category) => (
              <MenuItem key={category._id} value={category.nome}>
                {category.nome}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
         <TextField
          margin="normal"
          fullWidth
          id="descricao"
          label="Descrição"
          name="descricao"
          multiline
          rows={4}
          value={formData.descricao}
          onChange={handleChange}
        />
        <TextField
          margin="normal"
          fullWidth
          id="imagem"
          label="URL da Imagem"
          name="imagem"
          value={formData.imagem}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={updateProductMutation.isLoading}
        >
          {updateProductMutation.isLoading ? <CircularProgress size={24} /> : 'Atualizar Produto'}
        </Button>
         {updateProductMutation.isError && <Alert severity="error">Erro ao atualizar produto: {updateProductMutation.error.message || 'Desconhecido'}</Alert>}
         {updateProductMutation.isSuccess && <Alert severity="success">Produto atualizado com sucesso!</Alert>}
      </Box>
    </Container>
  );
}

export default AdminEditProductPage; 