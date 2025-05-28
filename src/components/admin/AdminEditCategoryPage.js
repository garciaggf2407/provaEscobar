import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../config/api';

function AdminEditCategoryPage() {
  const { id } = useParams(); // Obter o ID da categoria da URL
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nome: '',
  });

  // Query para buscar os dados da categoria existente
  const { data: category, isLoading, error } = useQuery(
    ['category', id], // Chave da query com o ID da categoria
    async ({ queryKey }) => {
      const [_key, categoryId] = queryKey;
      if (!categoryId) return null; // Não busca se não tiver ID
      // Assumindo que o endpoint para buscar detalhes por ID de categoria é /app/categorias/{id}
      const response = await api.get(`/app/categorias/${categoryId}`); 
      return response.data;
    },
    {
      enabled: !!id, // A query só roda se o ID estiver disponível
      staleTime: 5 * 60 * 1000,
    }
  );

  // Atualizar o formulário quando os dados da categoria forem carregados
  useEffect(() => {
    if (category) {
      setFormData({
        nome: category.nome || '',
      });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Mutação para atualizar a categoria (PUT /app/categorias/{id})
  const updateCategoryMutation = useMutation(async (categoryData) => {
    const response = await api.put(`/app/categorias/${id}`, categoryData);
    return response.data;
  }, {
    onSuccess: () => {
      // Invalida o cache da query de categorias (lista) e da query desta categoria específica
      queryClient.invalidateQueries('adminCategories');
      queryClient.invalidateQueries(['category', id]);
      navigate('/admin/categories'); // Redirecionar para a lista
    },
    onError: (error) => {
      console.error('Erro ao atualizar categoria:', error);
      alert('Erro ao atualizar categoria: ' + (error.response?.data?.message || error.message || 'Desconhecido'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    updateCategoryMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando dados da categoria...</Typography>
      </Container>
    );
  }

  if (error) {
     const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar categoria.';
    return (
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar categoria: {errorMessage}</Alert>
      </Container>
    );
  }

  if (!category && !isLoading) {
       return (
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Alert severity="warning">Categoria não encontrada.</Alert>
        </Container>
      );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Editar Categoria
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="nome"
          label="Nome da Categoria"
          name="nome"
          autoFocus
          value={formData.nome}
          onChange={handleChange}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={updateCategoryMutation.isLoading}
        >
          {updateCategoryMutation.isLoading ? <CircularProgress size={24} /> : 'Atualizar Categoria'}
        </Button>
         {updateCategoryMutation.isError && <Alert severity="error">Erro ao atualizar categoria: {updateCategoryMutation.error.message || 'Desconhecido'}</Alert>}
         {updateCategoryMutation.isSuccess && <Alert severity="success">Categoria atualizada com sucesso!</Alert>}
      </Box>
    </Container>
  );
}

export default AdminEditCategoryPage; 