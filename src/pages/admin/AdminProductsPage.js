import React, { useState } from 'react';
import { Container, Typography, Box, Button, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar, Modal, Fade, Backdrop } from '@mui/material';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminProductsPage() {
  const { authInfo } = useAuth();
  const usuario = authInfo?.usuario; // Obter o usuario logado
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Inicializar useQueryClient

  const [openModal, setOpenModal] = useState(false);
  const [productIdToDelete, setProductIdToDelete] = useState(null);

  // Função para buscar os produtos para o admin
  const fetchAdminProducts = async ({ queryKey }) => {
    const [, user] = queryKey;
    if (!user) return []; // Não busca se não houver usuário
    
    // Endpoint busca por {usuario}/{nome_produto}. Assumimos que /{usuario}/ lista todos.
    const url = `/app/produtos/${user}/`;
    
    const response = await api.get(url);
    // A API retorna um array, usamos ele diretamente
    return response.data;
  };

  // Usar useQuery para buscar os produtos
  const { data: products, isLoading, error } = useQuery(
    ['adminProducts', usuario], // Chave da query
    fetchAdminProducts,
    {
      enabled: !!usuario, // A query só roda se o usuário estiver disponível
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
      refetchOnMount: true, // Adicionar esta opção para buscar sempre que o componente for montado
      onError: (error) => {
        console.error('Erro na query de produtos:', error.response?.data || error);
      }
    }
  );

  // Mutação para excluir produto
  const deleteProductMutation = useMutation(async (productId) => {
    const response = await api.delete('/app/produtos', { data: { id: productId } });
    return response.data;
  }, {
    onSuccess: () => {
      // Invalida o cache da query de produtos para buscar a lista atualizada
      queryClient.invalidateQueries('adminProducts');
      setOpenModal(false); // Fechar modal ao excluir
      setProductIdToDelete(null);
    },
    onError: (error) => {
      console.error('Erro ao excluir produto:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Erro desconhecido';
      alert('Erro ao excluir produto: ' + errorMessage);
      setOpenModal(false); // Fechar modal em caso de erro
      setProductIdToDelete(null);
    }
  });

  // Função para lidar com a exclusão
  const handleDeleteClick = (productId) => {
    setProductIdToDelete(productId);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (productIdToDelete) {
      deleteProductMutation.mutate(productIdToDelete);
    }
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando produtos...</Typography>
      </Container>
    );
  }

  if (error) {
    const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar produtos.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar produtos: {errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciar Produtos
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gerencie os produtos da loja aqui.
        </Typography>
        {/* Botão para adicionar novo produto - Lógica de navegação será adicionada depois */}
        <Button 
          variant="contained" 
          color="primary" 
          sx={{ mt: 2 }}
          onClick={() => navigate('/admin/products/add')}
        >
          Adicionar Novo Produto
        </Button>
      </Box>

      {products && products.length > 0 ? (
        <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #e0e0e0' }}>
          <Table sx={{ minWidth: 650, borderCollapse: 'collapse' }} aria-label="tabela de produtos">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Imagem</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Nome</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Quantidade</TableCell>
                <TableCell align="right" sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Preço</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Categoria</TableCell>
                <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Descrição</TableCell>
                <TableCell align="center" sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow
                  key={product._id} // Usar _id como key
                  sx={{
                    '&:last-child td, &:last-child th': { borderBottom: 0 },
                    '&:hover': { backgroundColor: '#f5f5f5' },
                    cursor: 'pointer',
                  }}
                ><TableCell component="th" scope="row" sx={{ py: 1.5, borderBottom: '1px solid #eeeeee' }}>
                    <Avatar src={product.imagem} variant="square" alt={product.nome} sx={{ width: 150, height: 150 }} />
                  </TableCell><TableCell sx={{ py: 1.5, borderBottom: '1px solid #eeeeee' }}>
                    {product.nome}
                  </TableCell><TableCell sx={{ py: 1.5, borderBottom: '1px solid #eeeeee', textAlign: 'center' }}>{product.quantidade}</TableCell><TableCell align="right" sx={{ py: 1.5, borderBottom: '1px solid #eeeeee' }}>R$ {Number(product.preco).toFixed(2)}</TableCell><TableCell sx={{ py: 1.5, borderBottom: '1px solid #eeeeee' }}>{product.categoria}</TableCell><TableCell sx={{ py: 1.5, borderBottom: '1px solid #eeeeee' }}>{product.descricao}</TableCell><TableCell align="center" sx={{ py: 1.5, borderBottom: '1px solid #eeeeee' }}>
                    {/* Botões de Ação (Editar/Excluir) */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button 
                      size="small" 
                      variant="outlined" 
                        sx={{
                           mr: 0,
                           borderRadius: '20px',
                           borderColor: 'text.primary',
                           color: 'text.primary',
                           '&:hover': {
                             bgcolor: 'action.hover',
                           }
                           }} 
                        onClick={(e) => { e.stopPropagation(); navigate(`/admin/products/edit/${product._id}`); }}
                    >
                      Editar
                    </Button>
                    <Button 
                      size="small" 
                      variant="outlined" 
                      color="error"
                        sx={{ 
                          borderRadius: '20px',
                          borderColor: 'error.main',
                          color: 'error.main',
                           '&:hover': {
                             bgcolor: 'error.light',
                           }
                          }} 
                        onClick={(e) => { e.stopPropagation(); handleDeleteClick(product._id); }}
                        disabled={deleteProductMutation.isLoading}
                    >
                      Excluir
                    </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !isLoading && !error && <Typography variant="body1">Nenhum produto encontrado.</Typography>
      )}

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={openModal}>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Confirmar Exclusão
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Tem certeza que deseja excluir este produto?
            </Typography>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button variant="outlined" onClick={handleCloseModal}>
                Cancelar
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={handleConfirmDelete}
                disabled={deleteProductMutation.isLoading}
              >
                {deleteProductMutation.isLoading ? <CircularProgress size={24} /> : 'Excluir'}
              </Button>
            </Box>
          </Box>
        </Fade>
      </Modal>

    </Container>
  );
}

export default AdminProductsPage; 