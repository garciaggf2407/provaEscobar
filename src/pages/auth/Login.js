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
import api from '../../services/api';

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
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      console.log('Tentando fazer login com:', { usuario });
      
      const { data } = await api.post('/app/login', { 
        usuario,
        senha
      });
      
      console.log('Resposta do servidor:', data);

      if (data.token) {
        login(data.token, 'user', usuario);
        console.log('Login bem-sucedido:', { token: data.token, usuario });
        navigate('/');
      } else {
        setError('Token não recebido do servidor');
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setError(err.response?.data?.error || 'Erro ao conectar com o servidor. Tente novamente.');
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
                label="Usuário (RA)"
                variant="outlined"
                fullWidth
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={loading}
                placeholder="Digite seu RA"
              />

              <TextField
                label="Senha"
                type="password"
                variant="outlined"
                fullWidth
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={loading}
                placeholder="Digite sua senha"
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
              Não tem uma conta?{' '}
              <Button color="primary" sx={{ textTransform: 'none' }} onClick={() => navigate('/register')}>
                Registre-se
              </Button>
            </Typography>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Button variant="text" onClick={() => navigate('/')}>
                Continuar como visitante
              </Button>
            </Box>
          </CardContent>
        </StyledCard>
      </MotionBox>
    </Container>
  );
}

export default Login; 