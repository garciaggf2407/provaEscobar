import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { QueryClient, QueryClientProvider } from 'react-query';
import { theme } from './theme/theme';

// Componentes
import Layout from './components/Layout';
import Login from './components/auth/Login';
import UserHome from './components/user/UserHome';
import ProductDetail from './components/products/ProductDetail';
import Cart from './components/cart/Cart';
import Checkout from './components/checkout/Checkout';
import ThankYou from './components/checkout/ThankYou';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Criando o cliente do React Query
const queryClient = new QueryClient();

// Componente de rota protegida
const ProtectedRoute = ({ children, requiredRole }) => {
  const { authInfo } = useAuth();
  
  if (!authInfo.token) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && authInfo.role !== requiredRole) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <CartProvider>
            <Router>
              <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }>
                  <Route index element={
                    <ProtectedRoute>
                      <UserHome />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="product/:id" element={
                    <ProtectedRoute>
                      <ProductDetail />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="cart" element={
                    <ProtectedRoute>
                      <Cart />
                    </ProtectedRoute>
                  } />

                  <Route path="checkout" element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } />
                  
                  <Route path="thank-you" element={
                    <ProtectedRoute>
                      <ThankYou />
                    </ProtectedRoute>
                  } />
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
