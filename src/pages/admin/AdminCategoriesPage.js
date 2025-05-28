import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

function AdminCategoriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);

  const fetchCategories = async () => {
    const response = await api.get('/app/categorias');
    return response.data;
  };

  const { data: categories, isLoading, error } = useQuery(
    'adminCategories',
    fetchCategories,
    {
      staleTime: 5 * 60 * 1000,
    }
  );

  const deleteCategoryMutation = useMutation(async (categoryId) => {
    const response = await api.delete(`/app/categorias`, { data: { id: categoryId } });
    return response.data;
  }, {
    onSuccess: () => {
      queryClient.invalidateQueries('adminCategories');
    },
    onError: (error) => {
      console.error('Erro ao excluir categoria:', error);
      alert('Erro ao excluir categoria: ' + (error.response?.data?.message || error.message || 'Desconhecido'));
    }
  });

  const handleDeleteClick = (categoryId) => {
    handleOpenDeleteDialog(categoryId);
  };

  const handleOpenDeleteDialog = (categoryId) => {
    setCategoryIdToDelete(categoryId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setCategoryIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (categoryIdToDelete) {
      deleteCategoryMutation.mutate(categoryIdToDelete);
      handleCloseDeleteDialog();
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando categorias...</Typography>
      </Container>
    );
  }

  if (error) {
    const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar categorias.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar categorias: {errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciar Categorias
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie as categorias da loja aqui.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin/categories/add')}
        >
          Adicionar Nova Categoria
        </Button>
      </Box>

      {categories && categories.length > 0 ? (
        <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de categorias">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Nome</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow
                  key={category._id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f9f9f9' },
                  }}
                >
                  <TableCell component="th" scope="row" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    {category.nome}
                  </TableCell>
                  <TableCell align="center" sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{ mr: 1 }}
                      onClick={() => navigate(`/admin/categories/edit/${category._id}`)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      onClick={() => handleDeleteClick(category._id)}
                      disabled={deleteCategoryMutation.isLoading}
                    >
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !isLoading && !error && <Typography variant="body1">Nenhuma categoria encontrada.</Typography>
      )}

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirmar Exclusão"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza que deseja excluir esta categoria? Esta ação não poderá ser desfeita.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancelar</Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Excluir
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default AdminCategoriesPage; 