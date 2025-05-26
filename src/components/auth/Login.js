import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const StyledCard = styled(Card)`
  max-width: 400px;
  width: 100%;
  margin: 2rem auto;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
`;

const Logo = styled(Typography)`
  font-weight: 700;
  letter-spacing: 2px;
  margin-bottom: 2rem;
  text-align: center;
`;

const StyledForm = styled('form')`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const MotionBox = motion(Box);

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Simulação de autenticação
      if (email === 'adm' && password === 'adm') {
        const token = 'dummy-admin-token';
        const role = 'admin';
        login(token, role);
        navigate('/admin');
      } else if (email === 'usuario' && password === 'usuario') {
        const token = 'dummy-user-token';
        const role = 'user';
        login(token, role);
        navigate('/');
      } else {
        setError('Credenciais inválidas. Use "adm/adm" para administrador ou "usuario/usuario" para usuário normal.');
      }
    } catch (err) {
      setError('Ocorreu um erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <MotionBox
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            <Logo variant="h4" component="h1">
              Minha Loja
            </Logo>
            
            <Typography variant="h5" component="h2" gutterBottom align="center">
              Bem-vindo de volta
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Faça login para continuar
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <StyledForm onSubmit={handleSubmit}>
              <TextField
                label="Email/Usuário"
                variant="outlined"
                fullWidth
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />

              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  backgroundColor: 'black',
                  '&:hover': {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Entrar'
                )}
              </Button>
            </StyledForm>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Esqueceu sua senha?{' '}
              <Button color="primary" sx={{ textTransform: 'none' }}>
                Clique aqui
              </Button>
            </Typography>
          </CardContent>
        </StyledCard>
      </MotionBox>
    </Container>
  );
}

export default Login; 