import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './theme/theme';

// Componentes
import Layout from './components/Layout';
// Páginas
import Login from './pages/auth/Login';
import UserHome from './pages/user/UserHome';
import ProductDetail from './pages/products/ProductDetail';
import Cart from './pages/cart/Cart';
import Checkout from './pages/checkout/Checkout';
import ThankYou from './pages/checkout/ThankYou';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsPage from './pages/admin/AdminProductsPage';
import AdminAddProductPage from './pages/admin/AdminAddProductPage';
import AdminEditProductPage from './pages/admin/AdminEditProductPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminAddCategoryPage from './pages/admin/AdminAddCategoryPage';
import AdminEditCategoryPage from './pages/admin/AdminEditCategoryPage';
import AdminSalesPage from './pages/admin/AdminSalesPage';
import AdminSaleDetailPage from './components/admin/AdminSaleDetailPage';

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Criando o cliente do React Query
const queryClient = new QueryClient();

// Componente para rotas que requerem autenticação
const RequireAuth = ({ children }) => {
  const { authInfo } = useAuth();
  if (!authInfo.token) {
    return <Navigate to="/app/login" replace />;
  }
  return children;
};

// Componente para rotas que requerem role específica (ex: admin)
// const RequireRole = ({ children, requiredRole }) => {
//   const { authInfo } = useAuth();
//   if (requiredRole && authInfo.role !== requiredRole) {
//     return <Navigate to="/" replace />;
//   }
//   return children;
// };

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                {/* Rotas Abertas */}
                <Route path="/app/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                {/* Layout Principal */}
                <Route path="/" element={<Layout />}>
                  {/* Rota Index */}
                  <Route index element={<UserHome />} />

                  {/* Detalhes do Produto */}
                  <Route path="product/:id" element={<ProductDetail />} />

                  {/* Rotas de Compra */}
                  <Route path="cart" element={<Cart />} />
                  <Route path="checkout" element={<Checkout />} />
                  <Route path="thank-you" element={<ThankYou />} />

                  {/* Rotas que Requerem Autenticação */}
                  <Route element={<RequireAuth><Outlet /></RequireAuth>}>
                    {/* Área Administrativa */}
                    <Route path="admin" element={<AdminDashboard />} />
                    <Route path="admin/products" element={<AdminProductsPage />} />
                    <Route path="admin/products/add" element={<AdminAddProductPage />} />
                    <Route path="admin/products/edit/:id" element={<AdminEditProductPage />} />
                    <Route path="admin/categories" element={<AdminCategoriesPage />} />
                    <Route path="admin/categories/add" element={<AdminAddCategoryPage />} />
                    <Route path="admin/categories/edit/:id" element={<AdminEditCategoryPage />} />
                    <Route path="admin/sales" element={<AdminSalesPage />} />
                    <Route path="admin/sales/:id" element={<AdminSaleDetailPage />} />
                  </Route>
                </Route>
              </Routes>
            </Router>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
