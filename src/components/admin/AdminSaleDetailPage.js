import React from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper } from '@mui/material';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import api from '../../services/api';

function AdminSaleDetailPage() {
  const { id } = useParams(); // Obter o ID da venda da URL

  // Função para buscar os detalhes da venda
  const fetchSaleDetails = async ({ queryKey }) => {
    const [, saleId] = queryKey;
    console.log('Buscando detalhes da venda com ID:', saleId);
    
    if (!saleId) return null; // Não busca se não tiver ID
    
    // Assumindo que o endpoint para buscar detalhes por ID de venda é /app/venda/{id}
    const url = `/app/venda/${saleId}`;
    console.log('Buscando detalhes da venda na URL:', url);

    try {
      const response = await api.get(url);
      console.log('Resposta completa da API (detalhes venda):', response);
      console.log('Dados dos detalhes da venda recebidos:', response.data);
      
      // A API retorna um array com um único objeto de venda, extraímos o primeiro
      const saleData = Array.isArray(response.data) && response.data.length > 0 ? response.data[0] : null;
      
      console.log('Objeto de venda extraído:', saleData);
      
      // Calcular o total no frontend se não vier da API
      if (saleData && saleData.produtos) {
        saleData.totalCalculado = saleData.produtos.reduce((sum, item) => 
          sum + (Number(item.preco) * Number(item.quantidade) || 0),
          0
        );
         console.log('Total calculado no frontend:', saleData.totalCalculado);
      }
      
      return saleData; // Retorna o objeto de venda (ou null se não houver dados válidos)
      
    } catch (error) {
      console.error('Erro ao buscar detalhes da venda:', error);
      console.error('Resposta de erro (detalhes venda):', error.response?.data);
      throw error; // Propagar o erro para useQuery
    }
  };

  // Usar useQuery para buscar os detalhes da venda
  const { data: sale, isLoading, error } = useQuery(
    ['sale', id], // Chave da query com o ID da venda
    fetchSaleDetails,
    {
      enabled: !!id, // A query só roda se o ID estiver disponível
      staleTime: 5 * 60 * 1000,
    }
  );

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography>Carregando detalhes da venda...</Typography>
      </Container>
    );
  }

  if (error) {
     const errorMessage = error.message || error.error || 'Erro desconhecido ao carregar detalhes da venda.';
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Erro ao carregar detalhes da venda: {errorMessage}</Alert>
      </Container>
    );
  }

  if (!sale && !isLoading) {
       return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="warning">Venda não encontrada.</Alert>
        </Container>
      );
  }

  // Exibir detalhes da venda se carregados com sucesso
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Detalhes da Venda #{sale._id}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Detalhes completos da venda selecionada.
        </Typography>
      </Box>

      {sale && (
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>Informações da Venda</Typography>
          <Typography variant="body1"><strong>ID da Venda:</strong> {sale._id}</Typography>
          <Typography variant="body1"><strong>Data:</strong> {new Date(sale.data).toLocaleDateString()}</Typography>
          {sale.cupom && (
            <Typography variant="body1"><strong>Cupom:</strong> {sale.cupom}</Typography>
          )}
          {sale.desconto && sale.desconto > 0 && (
            <Typography variant="body1" color="success.main"><strong>Desconto:</strong> - R$ {Number(sale.desconto).toFixed(2)}</Typography>
          )}
          <Typography variant="body1"><strong>Total:</strong> R$ {sale.total ? Number(sale.total).toFixed(2) : (sale.totalCalculado ? sale.totalCalculado.toFixed(2) : 'N/A')}</Typography>
          <Typography variant="body1"><strong>Usuário:</strong> {sale.usuario}</Typography>

          {/* Adicionar detalhes dos itens da venda aqui */}
          {sale.produtos && sale.produtos.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>Itens da Venda</Typography>
              {sale.produtos.map((item, index) => (
                <Typography variant="body2" key={index}>
                  {item.quantidade} x {item.nome} (R$ {Number(item.preco).toFixed(2)} cada)
                </Typography>
              ))}
            </Box>
          )}

        </Paper>
      )}

    </Container>
  );
}

export default AdminSaleDetailPage; 