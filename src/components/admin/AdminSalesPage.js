import React from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useQuery } from 'react-query';
import api from '../../config/api';
import { useNavigate } from 'react-router-dom';

function AdminSalesPage() {
  const navigate = useNavigate();

  // Função para buscar as vendas
  const fetchSales = async () => {
    const response = await api.get('/app/venda'); // Endpoint para listar vendas
    // Assumindo que a API retorna um array de vendas
    return response.data;
  };

  // Usar useQuery para buscar as vendas
  const { data: sales, isLoading, error } = useQuery(
    'adminSales', // Chave da query
    fetchSales,
    {
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
                <TableCell>Total</TableCell>
                <TableCell>Usuário</TableCell>
                <TableCell>Status</TableCell>
                {/* Detalhes dos itens da venda podem ser adicionados aqui ou em outra página */}
              </TableRow>
            </TableHead>
            <TableBody>
              {sales.map((sale) => (
                <TableRow
                  key={sale._id} // Usar _id como key
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell 
                    component="th" 
                    scope="row" 
                    onClick={() => navigate(`/admin/sales/${sale._id}`)}
                    sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {sale._id}
                  </TableCell>
                  <TableCell>{new Date(sale.data).toLocaleDateString()}</TableCell> {/* Formatar data */}
                  <TableCell>R$ {Number(sale.total).toFixed(2)}</TableCell> {/* Formatar total */}
                  <TableCell>{sale.usuario}</TableCell>
                   <TableCell>{sale.status}</TableCell>
                </TableRow>
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