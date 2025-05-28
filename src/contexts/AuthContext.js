import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [authInfo, setAuthInfo] = useState({ token: null, role: null, usuario: null });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRole = localStorage.getItem('userRole');
    const storedUsuario = localStorage.getItem('usuario');
    console.log('AuthContext: Loading from localStorage', { storedToken, storedRole, storedUsuario });
    if (storedToken) {
      setAuthInfo({ token: storedToken, role: storedRole, usuario: storedUsuario });
    }
    setLoading(false);
  }, []);

  const login = (token, role, usuario) => {
    localStorage.setItem('token', token);
    localStorage.setItem('userRole', role);
    localStorage.setItem('usuario', usuario);
    console.log('AuthContext: Logging in', { token, role, usuario });
    setAuthInfo({ token, role, usuario });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('usuario');
    setAuthInfo({ token: null, role: null, usuario: null });
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  return (
    <AuthContext.Provider value={{ authInfo, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}; 