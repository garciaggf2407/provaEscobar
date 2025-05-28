import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';

function AdminEditCategoryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({ nome: '' });

  const { data: category, isLoading, error } = useQuery(
    ['category', id],
    async ({ queryKey }) => {
      const [, categoryId] = queryKey;
      if (!categoryId) return null;
      const response = await api.get(`/app/categorias/${categoryId}`);
      return response.data;
    },
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );

  useEffect(() => {
    if (category) {
      setFormData({ nome: category.nome || '' });
    }
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updateCategoryMutation = useMutation(async (categoryData) => {
    const response = await api.put(`/app/categorias`, { id: id, nome_categoria: categoryData.nome });
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminCategories');
      queryClient.invalidateQueries(['category', id]);
      navigate('/admin/categories');
    },
    onError: (error) => {
      console.error('Erro ao atualizar categoria:', error);
      alert('Erro ao atualizar categoria: ' + (error.message || 'Desconhecido'));
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