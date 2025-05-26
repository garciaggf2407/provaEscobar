import React, { useState } from 'react';
import './Login.css';

function Login({ setAuthInfo }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Lógica de autenticação hardcoded
    if (email === 'adm' && password === 'adm') {
      // Simula login de administrador
      const token = 'dummy-admin-token'; // Token simulado
      const role = 'admin';

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      setAuthInfo({ token, role });

      console.log('Login de administrador bem-sucedido!');
      console.log('Token gerado:', token);
      console.log('Papel do usuário:', role);

    } else if (email === 'usuario' && password === 'usuario') {
      // Simula login de usuário normal
      const token = 'dummy-user-token'; // Token simulado
      const role = 'user';

      localStorage.setItem('token', token);
      localStorage.setItem('userRole', role);
      setAuthInfo({ token, role });

      console.log('Login de usuário normal bem-sucedido!');
      console.log('Token gerado:', token);
      console.log('Papel do usuário:', role);

    } else {
      // Credenciais inválidas
      setError('Credenciais inválidas. Tente \'adm/adm\' para administrador ou \'usuario/usuario\' para usuário normal.');
    }

    setLoading(false);
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="email">Email/Usuário:</label>
          <input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  );
}

export default Login; 