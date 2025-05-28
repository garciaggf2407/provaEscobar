import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useMutation, useQueryClient, useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

function AdminAddProductPage() {
  const [formData, setFormData] = useState({
    nome: '',
    quantidade: '',
    preco: '',
    categoria: '',
    descricao: '',
    imagem: '',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // const { authInfo } = useAuth();

  // Estado para armazenar a lista de categorias
  const [categories, setCategories] = useState([]);

  // Buscar categorias ao carregar o componente
  const { isLoading: isLoadingCategories, error: errorCategories } = useQuery(
    'categories', // Nome da query
    async () => {
      const response = await api.get('/app/categorias');
      console.log('Categorias obtidas:', response.data);
      // A API retorna um array de objetos categoria, cada um com _id e nome
      return response.data;
    },
    {
      onSuccess: (data) => {
        setCategories(Array.isArray(data) ? data : []); // Garantir que é um array
      },
      onError: (err) => {
        console.error('Erro ao buscar categorias:', err);
        // Opcional: exibir um alerta ou mensagem para o usuário
      }
    }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addProductMutation = useMutation(async (productData) => {
    console.log('Dados do produto antes do envio:', productData);
    
    const dataToSend = {
      nome: productData.nome,
      quantidade: parseInt(productData.quantidade),
      preco: parseFloat(productData.preco),
      categoria: productData.categoria || '',
      descricao: productData.descricao,
      imagem: productData.imagem,
    };

    console.log('Dados formatados para envio (sem usuario no body):', dataToSend);

    // Logar o token antes de enviar
    const token = localStorage.getItem('token');
    console.log('Token obtido do localStorage para envio:', token);

    try {
      // O interceptor da API deve adicionar o header Authorization
      const response = await api.post('/app/produtos', dataToSend);
      console.log('Resposta do servidor (criação produto):', response.data);
      return response.data;
    } catch (error) {
      console.error('Erro detalhado na mutação de adição de produto:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    }
  }, {
    onSuccess: (data) => {
      console.log('Produto adicionado com sucesso:', data);
      queryClient.invalidateQueries('adminProducts');
      navigate('/admin/products');
    },
    onError: (error) => {
      console.error('Erro ao adicionar produto na mutação:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      // Tentativa de extrair mensagem de erro mais específica
      const backendErrorMessage = error.response?.data?.error || error.message;
      alert('Erro ao adicionar produto: ' + (backendErrorMessage || 'Desconhecido'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addProductMutation.mutate(formData);
  };

  console.log('AdminAddProductPage: Current form data', formData);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Adicionar Novo Produto
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
            disabled={isLoadingCategories || !!errorCategories}
          >
            {isLoadingCategories && <MenuItem disabled>Carregando...</MenuItem>}
            {errorCategories && <MenuItem disabled>Erro ao carregar</MenuItem>}
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
          required
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
          required
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
          disabled={addProductMutation.isLoading}
        >
          {addProductMutation.isLoading ? <CircularProgress size={24} /> : 'Adicionar Produto'}
        </Button>

        {addProductMutation.isError && (
          <Alert severity="error">
            Erro ao adicionar produto: {addProductMutation.error.message || 'Desconhecido'}
          </Alert>
        )}
        
        {addProductMutation.isSuccess && (
          <Alert severity="success">
            Produto adicionado com sucesso!
          </Alert>
        )}
      </Box>
    </Container>
  );
}

export default AdminAddProductPage; 