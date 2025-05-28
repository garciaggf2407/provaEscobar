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
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
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

function Register() {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Validação básica no frontend
    if (senha !== confirmaSenha) {
      setError('A senha e a confirmação de senha não correspondem.');
      setLoading(false);
      return;
    }

    console.log('Tentando registrar usuário com:', { usuario, senha, confirmaSenha });

    try {
      const response = await api.post('/app/registrar', {
        usuario,
        senha,
        confirma: confirmaSenha
      });

      console.log('Resposta do registro:', response);

      if (response.status === 200) { // Verificar o status code 200 para sucesso
        setSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        // Tratar outros códigos de sucesso se necessário, embora 200 seja o esperado pela documentação
        setError(response.data.message || response.data.error || 'Erro ao registrar usuário.');
      }
    } catch (err) {
      console.error('Erro na requisição de registro:', err);
      setError(
        err.response?.data?.error || 
        'Ocorreu um erro na comunicação com o servidor. Tente novamente.'
      );
      if (err.response) {
        // O request foi feito e o servidor respondeu com um status code
        // que cai fora do range de 2xx
        console.error('Dados do erro de resposta:', err.response.data);
        console.error('Status do erro de resposta:', err.response.status);
        console.error('Headers do erro de resposta:', err.response.headers);
      } else if (err.request) {
        // O request foi feito mas nenhuma resposta foi recebida
        // `err.request` é uma instância de XMLHttpRequest no navegador e uma instância de
        // http.ClientRequest no node.js
        console.error('Erro no request (sem resposta do servidor):', err.request);
      } else {
        // Alguma coisa aconteceu na configuração do request que acionou um erro
        console.error('Erro na configuração do request:', err.message);
      }
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
              Criar uma conta
            </Typography>
            
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
              Preencha os campos para se registrar
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
             {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                Usuário registrado com sucesso! Redirecionando para o login...
              </Alert>
            )}

            <StyledForm onSubmit={handleSubmit}>
              <TextField
                label="Usuário"
                variant="outlined"
                fullWidth
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={loading}
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
              />
               <TextField
                label="Confirmar Senha"
                type="password"
                variant="outlined"
                fullWidth
                value={confirmaSenha}
                onChange={(e) => setConfirmaSenha(e.target.value)}
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
                  'Registrar'
                )}
              </Button>
            </StyledForm>

            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Já tem uma conta?{' '}
              <Link component="button" variant="body2" onClick={() => navigate('/login')}>
                Faça login
              </Link>
            </Typography>
          </CardContent>
        </StyledCard>
      </MotionBox>
    </Container>
  );
}

export default Register; 