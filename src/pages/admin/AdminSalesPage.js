import React from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Avatar } from '@mui/material';
import { useQuery } from 'react-query';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function AdminSalesPage() {
  const navigate = useNavigate();
  const { authInfo } = useAuth(); // Obter informações do usuário autenticado
  const token = authInfo?.token; // Obter o token do contexto de autenticação

  // Função para buscar as vendas
  const fetchSales = async () => {
    // Verificar se há um token disponível antes de fazer a requisição
    if (!token) {
      console.log('Token de autenticação não disponível para buscar vendas.');
      // Poderia redirecionar para login ou mostrar uma mensagem
      return [];
    }

    // Buscando vendas no endpoint /app/venda com token de autorização
    const url = `/app/venda`;
    console.log('Buscando vendas na URL:', url, 'com token.');
    
    try {
      const response = await api.get(url, { // Adicionar cabeçalho de autorização
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log('Resposta completa da API (vendas):', response);
      console.log('Dados das vendas recebidos:', response.data);
    // Assumindo que a API retorna um array de vendas
    return response.data;
    } catch (error) {
      console.error('Erro ao buscar vendas com token:', error);
      console.error('Resposta de erro (vendas):', error.response?.data);
      throw error; // Propagar o erro para useQuery
    }
  };

  // Usar useQuery para buscar as vendas, dependendo do token
  const { data: sales, isLoading, error } = useQuery(
    ['adminSales', token], // Chave da query depende do token
    fetchSales,
    {
      enabled: !!token, // A query só roda se houver um token
      staleTime: 5 * 60 * 1000, // Cache por 5 minutos
    }
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando vendas...</Typography>
      </Container>
    );
  }

  if (error) {
    const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar vendas.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar vendas: {errorMessage}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gerenciar Vendas
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Visualize as vendas realizadas na loja.
        </Typography>
      </Box>

      {sales && sales.length > 0 ? (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="tabela de vendas">
            <TableHead>
              <TableRow>
                <TableCell>ID da Venda</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Nome do Comprador</TableCell>
                <TableCell>Nome do Produto</TableCell>
                <TableCell>Quantidade Comprada</TableCell>
                <TableCell>Preço Unitário</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {[...sales].reverse().map((sale) => (
                sale.produtos && sale.produtos.length > 0 ? (
                  sale.produtos.map((prod, index) => (
                <TableRow
                      key={`${sale._id}-${index}`}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell 
                    component="th" 
                    scope="row" 
                    onClick={() => navigate(`/admin/sales/${sale._id}`)}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                      >{sale._id}</TableCell>
                      <TableCell>{new Date(sale.data).toLocaleDateString()}</TableCell>
                      <TableCell>{sale.nomeCliente || 'N/A'}</TableCell>
                      <TableCell>{prod.nome}</TableCell>
                      <TableCell>{prod.quantidade}</TableCell>
                      <TableCell>{prod.preco ? 'R$ ' + Number(prod.preco).toFixed(2) : 'N/A'}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow key={sale._id}>
                    <TableCell component="th" scope="row" >{sale._id}</TableCell>
                    <TableCell>{new Date(sale.data).toLocaleDateString()}</TableCell>
                    <TableCell>{sale.nomeCliente || 'N/A'}</TableCell>
                    <TableCell colSpan={3}>Nenhum produto nesta venda.</TableCell>
                </TableRow>
                )
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !isLoading && !error && <Typography variant="body1">Nenhuma venda encontrada.</Typography>
      )}

    </Container>
  );
}

export default AdminSalesPage; 