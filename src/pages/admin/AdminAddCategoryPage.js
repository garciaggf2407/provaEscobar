import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert } from '@mui/material';
import { useMutation, useQueryClient } from 'react-query';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

function AdminAddCategoryPage() {
  const [formData, setFormData] = useState({
    nome: '',
  });
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const addCategoryMutation = useMutation(async (categoryData) => {
    const response = await api.post('/app/categorias', categoryData);
    return response.data;
  }, {
    onSuccess: () => {
      console.log('AdminAddCategoryPage: Category added successfully');
      queryClient.invalidateQueries('adminCategories');
      navigate('/admin/categories');
    },
    onError: (error) => {
      console.error('AdminAddCategoryPage: Error adding category:', error.response?.data || error);
      alert('Erro ao adicionar categoria: ' + (error.response?.data?.message || error.message || 'Desconhecido'));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCategoryMutation.mutate({ nome_categoria: formData.nome });
  };

  console.log('AdminAddCategoryPage: Current form data', formData);

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Adicionar Nova Categoria
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
          disabled={addCategoryMutation.isLoading}
        >
          {addCategoryMutation.isLoading ? <CircularProgress size={24} /> : 'Adicionar Categoria'}
        </Button>
        {addCategoryMutation.isError && <Alert severity="error">Erro ao adicionar categoria: {addCategoryMutation.error.message || 'Desconhecido'}</Alert>}
        {addCategoryMutation.isSuccess && <Alert severity="success">Categoria adicionada com sucesso!</Alert>}
      </Box>
    </Container>
  );
}

export default AdminAddCategoryPage; 