import React from 'react';
import { Container, Typography, Box, Grid, Card, CardContent, CardActionArea } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Inventory as InventoryIcon, Category as CategoryIcon, ShoppingCart as ShoppingCartIcon } from '@mui/icons-material';

function AdminDashboard() {
  const navigate = useNavigate();

  const adminSections = [
    { text: 'Gerenciar Produtos', icon: <InventoryIcon />, path: '/admin/products' },
    { text: 'Gerenciar Categorias', icon: <CategoryIcon />, path: '/admin/categories' },
    { text: 'Ver Vendas', icon: <ShoppingCartIcon />, path: '/admin/sales' },
    // Adicionar outras seções administrativas aqui, como gerenciar usuários, etc.
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Área Administrativa
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Selecione uma opção para gerenciar o conteúdo da loja.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {adminSections.map((section) => (
          <Grid item xs={12} sm={6} md={4} key={section.text}>
            <Card elevation={3}>
              <CardActionArea onClick={() => navigate(section.path)} sx={{ height: '100%', p: 2 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ mb: 1 }}>
                    {section.icon} {/* Ícone da seção */}
                  </Box>
                  <Typography variant="h6" component="div">
                    {section.text}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Podemos adicionar um link para a funcionalidade de Limpar Dados aqui também, talvez em outro formato */}
      {/* <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button variant="outlined" color="error">Limpar Todos os Dados do Usuário</Button>
      </Box> */}

    </Container>
  );
}

export default AdminDashboard; 